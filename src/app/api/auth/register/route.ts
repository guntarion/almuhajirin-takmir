// src/app/api/auth/register/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { hash } from 'bcryptjs';
import { RegisterFormData } from '../../../../lib/types/auth';

export async function POST(request: Request) {
  try {
    const body: RegisterFormData = await request.json();

    // Check if email already exists
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (existingUserByEmail) {
      return NextResponse.json({ user: null, message: 'Email sudah terdaftar' }, { status: 409 });
    }

    // Check if username already exists
    const existingUserByUsername = await prisma.user.findUnique({
      where: { username: body.username },
    });
    if (existingUserByUsername) {
      return NextResponse.json({ user: null, message: 'Username sudah terdaftar' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await hash(body.password, 12);

    // Validate anakremas association for orangtuawali
    if (body.role === 'orangtuawali') {
      if (!body.associatedAnakremas) {
        return NextResponse.json({ user: null, message: 'Harus memilih anakremas yang diasuh' }, { status: 400 });
      }

      // Check if anakremas exists
      const anakremas = await prisma.user.findUnique({
        where: {
          username: body.associatedAnakremas,
          role: 'anakremas',
        },
      });

      if (!anakremas) {
        return NextResponse.json({ user: null, message: `Username Muhajirin Kids "${body.associatedAnakremas}" tidak ditemukan` }, { status: 404 });
      }
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name: body.name,
        username: body.username,
        email: body.email,
        password: hashedPassword,
        role: body.role,
        groupId: body.groupId,
      },
    });

    // Create relationship if orangtuawali
    if (body.role === 'orangtuawali' && body.associatedAnakremas) {
      const anakremas = await prisma.user.findUnique({
        where: { username: body.associatedAnakremas },
      });

      if (anakremas) {
        await prisma.orangTuaAnakRemas.create({
          data: {
            orangTuaId: newUser.id,
            anakRemasId: anakremas.id,
          },
        });
      }
    }

    return NextResponse.json({ user: newUser, message: 'Registrasi berhasil' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan. Silakan coba lagi.' }, { status: 500 });
  }
}
