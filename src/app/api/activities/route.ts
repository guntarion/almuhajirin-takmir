import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/activities
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  const activities = await prisma.activity.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.activity.count();
  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({
    data: activities,
    pagination: { page, limit, total, totalPages },
  });
}

// POST /api/activities
export async function POST(request: Request) {
  const body = await request.json();
  const activity = await prisma.activity.create({ data: body });
  return NextResponse.json(activity);
}

// PUT /api/activities
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const activity = await prisma.activity.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(activity);
}

// DELETE /api/activities
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  await prisma.activity.delete({ where: { id } });
  return NextResponse.json({ message: 'Activity deleted successfully' });
}
