/**
 * File: src/app/api/bbs/posts/[postId]/delete/route.ts
 * Description: API route for deleting posts.
 * Only admin roles and post authors can delete posts.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '../../../../../../lib/prisma';
import { authOptions } from '../../../../../../lib/auth-config';

// Roles that can delete any post
const ADMIN_ROLES = ['TAKMIR', 'ADMIN', 'MARBOT'];

export async function DELETE(request: NextRequest, context: { params: { postId: string } }) {
  try {
    const { postId } = await context.params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check if user has permission to delete this post
    const userRole = session.user.role as string;
    const isAdmin = ADMIN_ROLES.includes(userRole);
    const isAuthor = post.author.id === session.user.id;

    if (!isAdmin && !isAuthor) {
      return NextResponse.json({ error: 'Only admins and post authors can delete posts' }, { status: 403 });
    }

    // Delete the post and its associated comments
    await prisma.$transaction([
      // Delete all comments first
      prisma.comment.deleteMany({
        where: { postId },
      }),
      // Then delete the post
      prisma.post.delete({
        where: { id: postId },
      }),
    ]);

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
