/**
 * File: src/app/api/bbs/posts/[postId]/pin/route.ts
 * Description: API route for managing post pin status.
 * Only admin roles can pin/unpin posts.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '../../../../../../lib/prisma';
import { authOptions } from '../../../../../../lib/auth-config';

// Roles that can pin/unpin posts
const ADMIN_ROLES = ['TAKMIR', 'ADMIN', 'MARBOT'];

export async function PATCH(request: NextRequest, context: { params: { postId: string } }) {
  try {
    const { postId } = await context.params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has admin role
    const userRole = session.user.role as string;
    const isAdmin = ADMIN_ROLES.includes(userRole);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Only admins can pin/unpin posts' }, { status: 403 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Toggle pin status
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { isPinned: !post.isPinned },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating pin status:', error);
    return NextResponse.json({ error: 'Failed to update pin status' }, { status: 500 });
  }
}
