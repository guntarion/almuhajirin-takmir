// src/app/test-directory/test-file-correct-path.ts
import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { authOptions } from '../../lib/auth';

export async function GET() {
  return NextResponse.json({ message: 'Test file with correct paths' });
}
