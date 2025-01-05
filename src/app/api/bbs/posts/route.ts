// src/app/api/bbs/posts/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth-config';
import { prisma } from '../../../../lib/prisma';
import { Prisma } from '@prisma/client';

// GET /api/bbs/posts - Get all posts
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const status = searchParams.get('status') || undefined;
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const sort = searchParams.get('sort') || 'newest';

  const where: Prisma.PostWhereInput = {
    ...(status && { status }),
    ...(category && { category }),
    ...(search && {
      OR: [{ title: { contains: search } }, { content: { contains: search } }, { tags: { contains: search } }],
    }),
  };

  const orderBy: Prisma.PostOrderByWithRelationInput = (() => {
    switch (sort) {
      case 'newest':
        return { createdAt: 'desc' };
      case 'oldest':
        return { createdAt: 'asc' };
      case 'most_views':
        return { viewCount: 'desc' };
      case 'most_comments':
        return { comments: { _count: 'desc' } };
      default:
        return { createdAt: 'desc' };
    }
  })();

  try {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      data: posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// Authorized roles that can create posts
const AUTHORIZED_ROLES = ['TAKMIR', 'ADMIN', 'MARBOT', 'KOORDINATOR_ANAKREMAS', 'ANAK_REMAS'];

// POST /api/bbs/posts - Create new post
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user has permission to create posts
  if (!AUTHORIZED_ROLES.includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions to create posts' }, { status: 403 });
  }

  try {
    const { title, content, excerpt, category, tags, status } = await request.json();

    // Parse the content to get plain text for excerpt if not provided
    let finalExcerpt = excerpt;
    if (!finalExcerpt) {
      try {
        const contentObj = JSON.parse(content);
        if (contentObj.blocks && Array.isArray(contentObj.blocks)) {
          finalExcerpt = contentObj.blocks[0].text.slice(0, 200);
        }
      } catch {
        // If parsing fails, use raw content
        finalExcerpt = content.slice(0, 200);
      }
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        excerpt: finalExcerpt,
        category,
        tags: JSON.stringify(tags || []),
        status: status || 'DRAFT',
        authorId: session.user.id,
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
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    // Format the response to match the expected Post type
    const formattedPost = {
      ...post,
      date: post.createdAt.toISOString(),
      commentCount: post._count.comments,
      author: {
        id: post.author.id,
        name: post.author.name || 'Unknown',
        username: post.author.username || 'unknown',
        avatar: post.author.avatar || '/avatars/avatar-01.jpg', // Default avatar
      },
    };

    return NextResponse.json(formattedPost, { status: 201 });
  } catch (error) {
    console.error('Failed to create post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
