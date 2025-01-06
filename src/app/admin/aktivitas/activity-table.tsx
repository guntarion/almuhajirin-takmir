/**
 * File: src/app/admin/aktivitas/activity-table.tsx
 * Table component for displaying activities
 */

'use client';

import { useState } from 'react';
import { Activity } from '../../../lib/types/activity';
import { Button } from '../../../components/ui/button';
import { deleteActivity, restoreActivity } from './actions';
import { ActivityForm } from './activity-form';
import { Modal } from '../../../components/ui/modal';
import { ActivityCategory, ActivityType } from '../../../lib/constants/activity';

interface ActivityTableProps {
  activities: Activity[];
}

export function ActivityTable({ activities: initialActivities }: ActivityTableProps) {
  const [activities, setActivities] = useState(initialActivities);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'create' | 'edit'>('create');

  // Handle modal open
  const handleModalOpen = (action: 'create' | 'edit', activity?: Activity) => {
    setModalAction(action);
    setSelectedActivity(activity || null);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  };

  // Handle form success
  const handleFormSuccess = () => {
    handleModalClose();
    // Refresh the page to get updated data
    window.location.reload();
  };

  // Handle delete/restore
  const handleStatusChange = async (id: string, active: boolean) => {
    try {
      if (active) {
        await deleteActivity(id);
      } else {
        await restoreActivity(id);
      }
      // Update local state
      setActivities(activities.map((activity) => (activity.id === id ? { ...activity, active: !active } : activity)));
    } catch (error) {
      console.error('Failed to update activity status:', error);
    }
  };

  return (
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
      <table className='w-full text-sm text-left text-gray-500'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
          <tr>
            <th scope='col' className='px-6 py-3'>
              Nama
            </th>
            <th scope='col' className='px-6 py-3'>
              Kategori
            </th>
            <th scope='col' className='px-6 py-3'>
              Tipe
            </th>
            <th scope='col' className='px-6 py-3'>
              Poin
            </th>
            <th scope='col' className='px-6 py-3'>
              Status
            </th>
            <th scope='col' className='px-6 py-3'>
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id} className='bg-white border-b hover:bg-gray-50'>
              <td className='px-6 py-4 font-medium text-gray-900'>{activity.name}</td>
              <td className='px-6 py-4'>{ActivityCategory[activity.category as keyof typeof ActivityCategory]}</td>
              <td className='px-6 py-4'>{ActivityType[activity.type as keyof typeof ActivityType]}</td>
              <td className='px-6 py-4'>{activity.basePoints}</td>
              <td className='px-6 py-4'>
                <span className={`px-2 py-1 rounded-full text-xs ${activity.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {activity.active ? 'Aktif' : 'Nonaktif'}
                </span>
              </td>
              <td className='px-6 py-4'>
                <div className='flex space-x-2'>
                  <Button variant='outline' size='sm' onClick={() => handleModalOpen('edit', activity)}>
                    Edit
                  </Button>
                  <Button
                    variant={activity.active ? 'destructive' : 'default'}
                    size='sm'
                    onClick={() => handleStatusChange(activity.id, activity.active)}
                  >
                    {activity.active ? 'Nonaktifkan' : 'Aktifkan'}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={isModalOpen} onClose={handleModalClose} title={modalAction === 'create' ? 'Tambah Aktivitas' : 'Edit Aktivitas'}>
        <ActivityForm initialData={selectedActivity || undefined} onSuccess={handleFormSuccess} onCancel={handleModalClose} />
      </Modal>
    </div>
  );
}
