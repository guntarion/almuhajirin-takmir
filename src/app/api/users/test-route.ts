// src/app/api/users/test-route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  return NextResponse.json({ message: 'Test route' });
}
