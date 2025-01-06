/**
 * File: src/app/admin/aktivitas/actions.ts
 * Server actions for activity CRUD operations
 */

'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../../lib/prisma';
import type { ActivityFormData } from '../../../lib/types/activity';
import { activityFormSchema } from '../../../lib/types/activity';
import { getServerSession } from 'next-auth';
import { UserRole } from '../../../lib/constants/activity';

// Helper to check admin/takmir authorization
async function checkAuthorization() {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error('Unauthorized: Not logged in');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || (user.role !== UserRole.ADMIN && user.role !== UserRole.TAKMIR)) {
    throw new Error('Unauthorized: Insufficient permissions');
  }
}

// Get all activities
export async function getActivities() {
  await checkAuthorization();

  return prisma.activity.findMany({
    orderBy: { updatedAt: 'desc' },
  });
}

// Create new activity
export async function createActivity(data: ActivityFormData) {
  await checkAuthorization();

  const validated = activityFormSchema.parse(data);

  const activity = await prisma.activity.create({
    data: validated,
  });

  revalidatePath('/admin/aktivitas');
  return activity;
}

// Update existing activity
export async function updateActivity(id: string, data: ActivityFormData) {
  await checkAuthorization();

  const validated = activityFormSchema.parse(data);

  const activity = await prisma.activity.update({
    where: { id },
    data: validated,
  });

  revalidatePath('/admin/aktivitas');
  return activity;
}

// Soft delete activity
export async function deleteActivity(id: string) {
  await checkAuthorization();

  const activity = await prisma.activity.update({
    where: { id },
    data: { active: false },
  });

  revalidatePath('/admin/aktivitas');
  return activity;
}

// Restore soft deleted activity
export async function restoreActivity(id: string) {
  await checkAuthorization();

  const activity = await prisma.activity.update({
    where: { id },
    data: { active: true },
  });

  revalidatePath('/admin/aktivitas');
  return activity;
}
