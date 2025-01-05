/**
 * File: src/app/api/bbs/posts/[postId]/status/route.ts
 * Description: API route for managing post status (draft/published).
 * Handles authorization and automatic publishing based on user roles.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth-config';

// Roles that can manage post status
const ADMIN_ROLES = ['TAKMIR', 'ADMIN', 'MARBOT'];
// Roles that need approval for publishing
const NEEDS_APPROVAL_ROLES = ['KOORDINATOR_ANAKREMAS', 'ANAK_REMAS'];
// Roles that can publish directly
const AUTO_PUBLISH_ROLES = ['TAKMIR', 'ADMIN', 'MARBOT'];

export async function PATCH(request: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: params.postId },
      include: {
        author: {
          select: {
            id: true,
            role: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check if user has permission to update this post
    const userRole = session.user.role as string;
    const isAdmin = ADMIN_ROLES.includes(userRole);
    const isAuthor = post.authorId === session.user.id;

    if (!isAdmin && !isAuthor) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { status } = await request.json();

    // If trying to publish
    if (status === 'PUBLISHED') {
      // If author needs approval and is not an admin
      if (NEEDS_APPROVAL_ROLES.includes(post.author.role) && !isAdmin) {
        return NextResponse.json({ error: 'Post requires admin approval to publish' }, { status: 403 });
      }

      // Auto-publish for authorized roles or admin approval
      if (AUTO_PUBLISH_ROLES.includes(post.author.role) || isAdmin) {
        const updatedPost = await prisma.post.update({
          where: { id: params.postId },
          data: { status: 'PUBLISHED' },
        });

        return NextResponse.json(updatedPost);
      }
    }

    // For other status changes (e.g., back to draft)
    if (isAdmin || isAuthor) {
      const updatedPost = await prisma.post.update({
        where: { id: params.postId },
        data: { status },
      });

      return NextResponse.json(updatedPost);
    }

    return NextResponse.json({ error: 'Unauthorized to change post status' }, { status: 403 });
  } catch (error) {
    console.error('Error updating post status:', error);
    return NextResponse.json({ error: 'Failed to update post status' }, { status: 500 });
  }
}
