// src/app/api/users/temp-route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Prisma } from '@prisma/client';
import { prisma } from '../../../lib/prisma';
import { authOptions } from '../../../lib/auth-config';

// GET all users
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const role = searchParams.get('role') || undefined;
  const search = searchParams.get('search');

  const where: Prisma.UserWhereInput = {
    ...(role && { role }),
    ...(search && {
      OR: [{ name: { contains: search } }, { username: { contains: search } }, { email: { contains: search } }],
    }),
  };

  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({ users, total });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST create new user
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate orangtuawali role
    if (body.role === 'ORANGTUAWALI' && !body.anakremasId) {
      return NextResponse.json({ error: 'Anakremas ID is required for orangtuawali role' }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        name: body.name,
        username: body.username,
        email: body.email,
        password: body.password,
        role: body.role,
        ...(body.role === 'ORANGTUAWALI' && { groupId: body.anakremasId }),
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
