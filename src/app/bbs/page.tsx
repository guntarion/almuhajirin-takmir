/**
 * File: src/app/bbs/page.tsx
 * Description: Main page component for the BBS section.
 * This page displays the list of posts with search, filter, and sorting capabilities.
 * Includes functionality to create new posts through a modal form for authorized users.
 */

import { Suspense } from 'react';
import { prisma } from '../../lib/prisma';
import ClientBBSPage from './client-page';
import { Post } from '../../lib/types/bbs';
import { getCurrentUser } from '../../lib/utils/auth';

// Fetch posts from database
async function getPosts(): Promise<Post[]> {
  const currentUser = await getCurrentUser();
  const isAdmin = currentUser?.role && ['TAKMIR', 'ADMIN', 'MARBOT'].includes(currentUser.role);

  const posts = await prisma.post.findMany({
    include: {
      author: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: [
      {
        isPinned: 'desc',
      },
      {
        createdAt: 'desc',
      },
    ],
    where: isAdmin
      ? {
          OR: [
            { status: 'PUBLISHED', isApproved: true },
            { status: 'DRAFT' }, // Admin can see all drafts
          ],
        }
      : {
          status: 'PUBLISHED',
          isApproved: true,
        },
  });

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || '',
    content: post.content,
    author: {
      id: post.author.id,
      name: post.author.name || 'Unknown',
      username: post.author.username || 'unknown',
      avatar: post.author.avatar || '/avatars/avatar-01.jpg',
    },
    authorId: post.authorId,
    date: post.createdAt.toISOString(),
    category: post.category,
    viewCount: post.viewCount,
    commentCount: post._count.comments,
    isPinned: post.isPinned,
    isApproved: post.isApproved,
    status: post.status,
    tags: JSON.parse(post.tags) as string[],
  }));
}

export default async function BBSPage() {
  const posts = await getPosts();

  return (
    <Suspense fallback={<div>Loading posts...</div>}>
      <ClientBBSPage initialPosts={posts} />
    </Suspense>
  );
}
