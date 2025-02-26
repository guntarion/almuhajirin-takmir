/**
 * File: src/app/admin/aktivitas/page.tsx
 * Admin page for managing activities
 */

import { getActivities } from './actions';
import { ActivityTable } from './activity-table';
import { Button } from '../../../components/ui/button';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '../../../lib/prisma';
import { UserRole } from '../../../lib/constants/activity';
import { authOptions } from '../../../lib/auth-config';

export default async function ActivityManagementPage() {
  // Check authorization
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/auth/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || (user.role !== UserRole.ADMIN && user.role !== UserRole.TAKMIR)) {
    redirect('/');
  }

  // Fetch activities
  const activities = await getActivities();

  return (
    <div className='container mx-auto py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Kelola Aktivitas</h1>
        <Button data-modal-target='activity-modal' data-modal-action='create'>
          Tambah Aktivitas
        </Button>
      </div>

      <ActivityTable activities={activities} />
    </div>
  );
}
