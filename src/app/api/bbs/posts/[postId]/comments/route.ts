import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../lib/auth-config';

/**
 * GET /api/bbs/posts/[postId]/comments
 * Fetches comments for a specific post
 * @param request - The incoming request object
 * @param context - Contains route parameters including postId
 * @returns NextResponse with comments data or error
 */
export async function GET(request: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const { postId } = await params;

    // Fetch comments with author information and replies
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null, // Only fetch top-level comments
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

/**
 * POST /api/bbs/posts/[postId]/comments
 * Creates a new comment for a specific post
 * @param request - The incoming request object with comment data
 * @param context - Contains route parameters including postId
 * @returns NextResponse with created comment or error
 */
export async function POST(request: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { postId } = await params;
    const { content, parentId } = await request.json();

    // Validate input
    if (!content?.trim()) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: session.user.id,
        parentId: parentId || null,
        status: 'PUBLISHED', // You can adjust this based on your moderation needs
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
