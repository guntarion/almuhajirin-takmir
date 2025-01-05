/**
 * File: src/app/bbs/[postId]/page.tsx
 * Description: Dynamic route page component for displaying a single post with its comments.
 * Includes authorization checks for draft posts and admin functionality.
 */

import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { prisma } from '../../../lib/prisma';
import PostDetail from '../../../components/bbs/PostDetail';
import CommentList from '../../../components/bbs/CommentList';
import { authOptions } from '../../../lib/auth-config';

// Roles that can view draft posts and manage post status
const ADMIN_ROLES = ['TAKMIR', 'ADMIN', 'MARBOT'];

async function getPost(postId: string, userRole?: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  if (!post) return null;

  // Only allow viewing draft/unpublished posts if user is admin or the author
  if (post.status !== 'PUBLISHED' && !ADMIN_ROLES.includes(userRole || '')) {
    return null;
  }

  // Increment view count
  await prisma.post.update({
    where: { id: postId },
    data: { viewCount: { increment: 1 } },
  });

  return {
    id: post.id,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt || '',
    author: post.author.name || 'Unknown',
    authorId: post.authorId,
    authorRole: post.author.role,
    date: post.createdAt.toISOString(),
    category: post.category,
    viewCount: post.viewCount,
    commentCount: post._count.comments,
    isPinned: post.isPinned,
    status: post.status,
  };
}

export default async function PostPage({ params }: { params: { postId: string } }) {
  // Await all async operations concurrently
  const [session, post] = await Promise.all([
    getServerSession(authOptions),
    getPost(params.postId, (await getServerSession(authOptions))?.user?.role as string),
  ]);

  const userRole = session?.user?.role as string;

  if (!post) {
    notFound();
  }

  const canManagePost = ADMIN_ROLES.includes(userRole || '') || post.authorId === session?.user?.id;

  return (
    <div className='space-y-8'>
      {/* Post Detail */}
      <PostDetail post={post} canManagePost={canManagePost} currentUserRole={userRole} />

      {/* Comments Section */}
      <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
        <h2 className='text-xl font-semibold mb-6'>Komentar ({post.commentCount})</h2>

        {/* Comment List with integrated CommentForm */}
        <CommentList postId={post.id} />
      </div>
    </div>
  );
}
