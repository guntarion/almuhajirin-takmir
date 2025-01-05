// src/app/api/users/route.ts
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

import { prisma } from '../../../lib/prisma';
import { getSession } from '../../../lib/utils/auth';
import { UserRole } from '../../../lib/types/auth';

async function checkAdminAccess() {
  const session = await getSession();
  if (!session?.user || session.user.role !== UserRole.ADMIN) {
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
        OR: [{ name: { contains: search } }, { username: { contains: search } }, { email: { contains: search } }],
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
          panggilan: true,
          gender: true,
          username: true,
          email: true,
          role: true,
          active: true,
          kategori: true,
          groupId: true,
          tanggalLahir: true,
          nomerWhatsapp: true,
          alamatRumah: true,
          rwRumah: true,
          rtRumah: true,
          sekolah: true,
          kelas: true,
          keterangan: true,
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
    if (!body.name || !body.username || !body.email || !body.password || !body.role || !body.gender || !body.panggilan || !body.kategori) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate ORANG_TUA role requirements
    if (body.role === UserRole.ORANG_TUA && !body.anakremasId) {
      return NextResponse.json({ error: 'Anak Remas ID is required for Orang Tua role' }, { status: 400 });
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

    // If ORANG_TUA, verify that the anakremas exists
    if (body.role === UserRole.ORANG_TUA) {
      const anakremas = await prisma.user.findFirst({
        where: {
          id: body.anakremasId,
          role: UserRole.ANAK_REMAS,
        },
      });
      if (!anakremas) {
        return NextResponse.json({ error: 'Selected Anak Remas not found' }, { status: 400 });
      }
    }

    const user = await prisma.user.create({
      data: {
        name: body.name,
        panggilan: body.panggilan,
        gender: body.gender,
        username: body.username,
        email: body.email,
        password: body.password, // Note: In production, ensure password is hashed
        role: body.role,
        active: body.active ?? true,
        kategori: body.kategori,
        tanggalLahir: body.tanggalLahir ? new Date(body.tanggalLahir) : null,
        nomerWhatsapp: body.nomerWhatsapp,
        alamatRumah: body.alamatRumah,
        rwRumah: body.rwRumah,
        rtRumah: body.rtRumah,
        sekolah: body.sekolah,
        kelas: body.kelas ? parseInt(body.kelas) : null,
        keterangan: body.keterangan,
        ...(body.role === UserRole.ORANG_TUA && { groupId: body.anakremasId }),
      },
      select: {
        id: true,
        name: true,
        panggilan: true,
        gender: true,
        username: true,
        email: true,
        role: true,
        active: true,
        kategori: true,
        groupId: true,
        tanggalLahir: true,
        nomerWhatsapp: true,
        alamatRumah: true,
        rwRumah: true,
        rtRumah: true,
        sekolah: true,
        kelas: true,
        keterangan: true,
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

    // If changing to ORANG_TUA or updating anakremasId, verify the anakremas exists
    if (body.role === UserRole.ORANG_TUA || (currentUser.role === UserRole.ORANG_TUA && body.anakremasId)) {
      const anakremas = await prisma.user.findFirst({
        where: {
          id: body.anakremasId,
          role: UserRole.ANAK_REMAS,
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
        ...(body.panggilan && { panggilan: body.panggilan }),
        ...(body.gender && { gender: body.gender }),
        ...(body.username && { username: body.username }),
        ...(body.email && { email: body.email }),
        ...(body.role && { role: body.role }),
        ...(typeof body.active === 'boolean' && { active: body.active }),
        ...(body.kategori && { kategori: body.kategori }),
        ...(body.tanggalLahir && { tanggalLahir: new Date(body.tanggalLahir) }),
        ...(body.nomerWhatsapp && { nomerWhatsapp: body.nomerWhatsapp }),
        ...(body.alamatRumah && { alamatRumah: body.alamatRumah }),
        ...(body.rwRumah && { rwRumah: body.rwRumah }),
        ...(body.rtRumah && { rtRumah: body.rtRumah }),
        ...(body.sekolah && { sekolah: body.sekolah }),
        ...(body.kelas && { kelas: parseInt(body.kelas) }),
        ...(body.keterangan && { keterangan: body.keterangan }),
        ...(body.role === UserRole.ORANG_TUA && { groupId: body.anakremasId }),
        // If role is changed from ORANG_TUA to something else, remove the groupId
        ...(body.role && body.role !== UserRole.ORANG_TUA && { groupId: null }),
      },
      select: {
        id: true,
        name: true,
        panggilan: true,
        gender: true,
        username: true,
        email: true,
        role: true,
        active: true,
        kategori: true,
        groupId: true,
        tanggalLahir: true,
        nomerWhatsapp: true,
        alamatRumah: true,
        rwRumah: true,
        rtRumah: true,
        sekolah: true,
        kelas: true,
        keterangan: true,
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
