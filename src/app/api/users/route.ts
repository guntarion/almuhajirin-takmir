// src/app/api/users/route.ts
import { NextResponse } from 'next/server';
import { UserRole, Prisma } from '@prisma/client';
import { prisma } from '../../../lib/prisma';
import { getAuthSession } from '../../../lib/auth';

async function checkAdminAccess() {
  const session = await getAuthSession();
  if (!session?.user || !['admin', 'takmir'].includes(session.user.role)) {
    return false;
  }
  return true;
}

export async function GET(request: Request) {
  try {
    if (!(await checkAdminAccess())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const role = searchParams.get('role') as UserRole | null;
    const search = searchParams.get('search') || '';

    const where: Prisma.UserWhereInput = {
      ...(role && { role }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { username: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          role: true,
          active: true,
          groupId: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await checkAdminAccess())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.username || !body.email || !body.password || !body.role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate orangtuawali role requirements
    if (body.role === 'orangtuawali' && !body.anakremasId) {
      return NextResponse.json({ error: 'Anak Remas ID is required for Orang Tua Wali role' }, { status: 400 });
    }

    // Check if username is already taken
    const existingUsername = await prisma.user.findUnique({
      where: { username: body.username },
    });
    if (existingUsername) {
      return NextResponse.json({ error: 'Username is already taken' }, { status: 400 });
    }

    // Check if email is already registered
    const existingEmail = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (existingEmail) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 400 });
    }

    // If orangtuawali, verify that the anakremas exists
    if (body.role === 'orangtuawali') {
      const anakremas = await prisma.user.findFirst({
        where: {
          id: body.anakremasId,
          role: 'anakremas',
        },
      });
      if (!anakremas) {
        return NextResponse.json({ error: 'Selected Anak Remas not found' }, { status: 400 });
      }
    }

    const user = await prisma.user.create({
      data: {
        name: body.name,
        username: body.username,
        email: body.email,
        password: body.password, // Note: In production, ensure password is hashed
        role: body.role,
        ...(body.role === 'orangtuawali' && { groupId: body.anakremasId }),
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        active: true,
        groupId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          {
            error: `This ${error.meta?.target as string} is already taken`,
          },
          { status: 400 }
        );
      }
    }
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await checkAdminAccess())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const id = new URL(request.url).searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get current user data
    const currentUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check username uniqueness if changed
    if (body.username && body.username !== currentUser.username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username: body.username },
      });
      if (existingUsername) {
        return NextResponse.json({ error: 'Username is already taken' }, { status: 400 });
      }
    }

    // Check email uniqueness if changed
    if (body.email && body.email !== currentUser.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: body.email },
      });
      if (existingEmail) {
        return NextResponse.json({ error: 'Email is already registered' }, { status: 400 });
      }
    }

    // If changing to orangtuawali or updating anakremasId, verify the anakremas exists
    if (body.role === 'orangtuawali' || (currentUser.role === 'orangtuawali' && body.anakremasId)) {
      const anakremas = await prisma.user.findFirst({
        where: {
          id: body.anakremasId,
          role: 'anakremas',
        },
      });
      if (!anakremas) {
        return NextResponse.json({ error: 'Selected Anak Remas not found' }, { status: 400 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.username && { username: body.username }),
        ...(body.email && { email: body.email }),
        ...(body.role && { role: body.role }),
        ...(body.role === 'orangtuawali' && { groupId: body.anakremasId }),
        // If role is changed from orangtuawali to something else, remove the groupId
        ...(body.role && body.role !== 'orangtuawali' && { groupId: null }),
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        active: true,
        groupId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          {
            error: `This ${error.meta?.target as string} is already taken`,
          },
          { status: 400 }
        );
      }
    }
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await checkAdminAccess())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = new URL(request.url).searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
