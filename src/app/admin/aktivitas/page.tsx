// src/app/admin/aktivitas/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Activity, ActivityFormData } from '../../../lib/types/activity';
import { ActivityForm } from '../../../components/aktivitas/activity-form';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { Checkbox } from '../../../components/ui/checkbox';

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AktivitasPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Transform activity data to match form requirements
  const transformActivity = (activity: Activity | null) => {
    if (!activity) return undefined;
    return {
      name: activity.name,
      category: activity.category,
      type: activity.type,
      userCategories: activity.userCategories,
      minFrequency: activity.minFrequency,
      maxFrequency: activity.maxFrequency,
      basePoints: activity.basePoints,
      isNegative: activity.isNegative,
      needsProof: activity.needsProof,
      validationRoles: activity.validationRoles,
      active: activity.active,
      description: activity.description,
      icon: activity.icon,
    };
  };

  // Fetch activities with pagination
  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      const response = await fetch(`/api/activities?${params}`);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login?callbackUrl=/admin/aktivitas');
          return;
        }
        throw new Error(data.error || 'Failed to fetch activities');
      }

      setActivities(data.data);
      setPagination({
        ...pagination,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
      });
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, router]);

  useEffect(() => {
    fetchActivities();
  }, [pagination.page]);

  // Handle activity creation
  const handleCreateActivity = async (data: ActivityFormData) => {
    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login?callbackUrl=/admin/aktivitas');
          return;
        }
        throw new Error(result.error || 'Failed to create activity');
      }

      setShowForm(false);
      setError(null);
      fetchActivities();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create activity');
    }
  };

  // Handle activity update
  const handleUpdateActivity = async (data: ActivityFormData) => {
    if (!selectedActivity) return;

    try {
      const response = await fetch(`/api/activities?id=${selectedActivity.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login?callbackUrl=/admin/aktivitas');
          return;
        }
        throw new Error(result.error || 'Failed to update activity');
      }

      setShowForm(false);
      setSelectedActivity(null);
      setError(null);
      fetchActivities();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update activity');
    }
  };

  // Handle activity deletion
  const handleDeleteActivity = async (id: string) => {
    try {
      const response = await fetch(`/api/activities?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login?callbackUrl=/admin/aktivitas');
          return;
        }
        throw new Error(result.error || 'Failed to delete activity');
      }

      setError(null);
      fetchActivities();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete activity');
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8 flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Activity Management</h1>
        <Button onClick={() => setShowForm(true)}>Add New Activity</Button>
      </div>

      {/* Error Message */}
      {error && <div className='mb-4 p-4 bg-red-50 text-red-500 rounded-md'>{error}</div>}

      {/* Loading State */}
      {loading ? (
        <div className='text-center py-8'>Loading...</div>
      ) : (
        <>
          {/* Activities Table */}
          <div className='bg-white shadow rounded-lg overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Name</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Category</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Description</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Is Negative?</th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {activities.map((activity) => (
                    <tr key={activity.id}>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <button
                          onClick={() => {
                            setSelectedActivity(activity);
                            setShowForm(true);
                          }}
                          className='text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-gray-100'
                          title='Edit'
                          aria-label='Edit activity'
                        >
                          <svg className='h-5 w-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteActivity(activity.id)}
                          className='text-red-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50'
                          title='Delete'
                          aria-label='Delete activity'
                        >
                          <svg className='h-5 w-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                            />
                          </svg>
                        </button>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>{activity.name}</td>
                      <td className='px-6 py-4 whitespace-nowrap'>{activity.category}</td>
                      <td className='px-6 py-4 whitespace-nowrap'>{activity.description}</td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <Checkbox checked={activity.isNegative} disabled />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className='mt-4 flex justify-between items-center'>
            <div>
              <span className='text-sm text-gray-700'>
                Showing page {pagination.page} of {pagination.totalPages}
              </span>
            </div>
            <div className='flex gap-2'>
              <Button onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })} disabled={pagination.page === 1}>
                Previous
              </Button>
              <Button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Activity Form Modal */}
      {showForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-lg p-6 max-w-2xl w-full overflow-auto max-h-[90vh]'>
            <h2 className='text-xl font-bold mb-4'>{selectedActivity ? 'Edit Activity' : 'Create New Activity'}</h2>
            <ActivityForm
              initialData={transformActivity(selectedActivity)}
              onSubmit={selectedActivity ? handleUpdateActivity : handleCreateActivity}
              isEditing={!!selectedActivity}
            />
            <Button
              variant='ghost'
              onClick={() => {
                setShowForm(false);
                setSelectedActivity(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
