// src/lib/prisma.ts
// Database operations for BBS

import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Get posts with pagination and filters
export async function getPosts(params: {
  page: number;
  limit: number;
  category?: string;
  search?: string;
  sort: 'newest' | 'oldest' | 'most_comments' | 'most_views';
}) {
  const { page, limit, category, search, sort } = params;

  const where = {
    AND: [
      category ? { category } : {},
      search
        ? {
            OR: [{ title: { contains: search } }, { content: { contains: search } }],
          }
        : {},
    ],
  };

  const orderBy = {
    newest: { createdAt: 'desc' },
    oldest: { createdAt: 'asc' },
    most_comments: { comments: { _count: 'desc' } },
    most_views: { viewCount: 'desc' },
  }[sort];

  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where,
      orderBy,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return {
    data: posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// Create new post
export async function createPost(data: { title: string; content: string; category: string; authorId: string }) {
  return prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      category: data.category,
      authorId: data.authorId,
      status: 'published',
    },
  });
}
