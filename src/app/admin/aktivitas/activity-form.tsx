/**
 * File: src/app/admin/aktivitas/activity-form.tsx
 * Modal form component for creating and editing activities
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActivityFormData, activityFormSchema } from '../../../lib/types/activity';
import { ActivityCategory, ActivityType } from '../../../lib/constants/activity';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select } from '../../../components/ui/select';
import { createActivity, updateActivity } from './actions';
import { useState } from 'react';

interface ActivityFormProps {
  initialData?: ActivityFormData;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ActivityForm({ initialData, onSuccess, onCancel }: ActivityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: initialData || {
      userCategories: 'mkidz',
      type: 'TAMBAHAN',
      category: 'AKHLAK',
      minFrequency: 1,
      isNegative: false,
      needsProof: false,
      validationRoles: 'KOORDINATOR_ANAKREMAS',
      active: true,
    },
  });

  const onSubmit = async (data: ActivityFormData) => {
    try {
      setIsSubmitting(true);
      if (initialData?.id) {
        await updateActivity(initialData.id, data);
      } else {
        await createActivity(data);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save activity:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <label htmlFor='name' className='text-sm font-medium'>
            Nama Aktivitas
          </label>
          <Input id='name' {...register('name')} placeholder='Nama aktivitas' error={errors.name?.message} />
        </div>

        <div className='space-y-2'>
          <label htmlFor='category' className='text-sm font-medium'>
            Kategori
          </label>
          <Select id='category' {...register('category')} error={errors.category?.message}>
            {Object.entries(ActivityCategory).map(([key, value]) => (
              <option key={key} value={value}>
                {key}
              </option>
            ))}
          </Select>
        </div>

        <div className='space-y-2'>
          <label htmlFor='type' className='text-sm font-medium'>
            Tipe
          </label>
          <Select id='type' {...register('type')} error={errors.type?.message}>
            {Object.entries(ActivityType).map(([key, value]) => (
              <option key={key} value={value}>
                {key}
              </option>
            ))}
          </Select>
        </div>

        <div className='space-y-2'>
          <label htmlFor='basePoints' className='text-sm font-medium'>
            Poin Dasar
          </label>
          <Input
            id='basePoints'
            type='number'
            {...register('basePoints', { valueAsNumber: true })}
            placeholder='Poin dasar'
            error={errors.basePoints?.message}
          />
        </div>

        <div className='space-y-2'>
          <label htmlFor='minFrequency' className='text-sm font-medium'>
            Frekuensi Minimal
          </label>
          <Input
            id='minFrequency'
            type='number'
            {...register('minFrequency', { valueAsNumber: true })}
            placeholder='Frekuensi minimal'
            error={errors.minFrequency?.message}
          />
        </div>

        <div className='space-y-2'>
          <label htmlFor='maxFrequency' className='text-sm font-medium'>
            Frekuensi Maksimal
          </label>
          <Input
            id='maxFrequency'
            type='number'
            {...register('maxFrequency', { valueAsNumber: true })}
            placeholder='Frekuensi maksimal'
            error={errors.maxFrequency?.message}
          />
        </div>

        <div className='space-y-2'>
          <label htmlFor='description' className='text-sm font-medium'>
            Deskripsi
          </label>
          <Input id='description' {...register('description')} placeholder='Deskripsi aktivitas' error={errors.description?.message} />
        </div>

        <div className='space-y-2'>
          <label htmlFor='icon' className='text-sm font-medium'>
            Icon
          </label>
          <Input id='icon' {...register('icon')} placeholder='URL icon' error={errors.icon?.message} />
        </div>

        <div className='col-span-2 space-y-2'>
          <div className='flex items-center space-x-4'>
            <label className='flex items-center space-x-2'>
              <input type='checkbox' {...register('isNegative')} className='form-checkbox' />
              <span className='text-sm font-medium'>Aktivitas Negatif</span>
            </label>

            <label className='flex items-center space-x-2'>
              <input type='checkbox' {...register('needsProof')} className='form-checkbox' />
              <span className='text-sm font-medium'>Perlu Bukti</span>
            </label>

            <label className='flex items-center space-x-2'>
              <input type='checkbox' {...register('active')} className='form-checkbox' />
              <span className='text-sm font-medium'>Aktif</span>
            </label>
          </div>
        </div>
      </div>

      <div className='flex justify-end space-x-2'>
        <Button type='button' variant='outline' onClick={onCancel} disabled={isSubmitting}>
          Batal
        </Button>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Menyimpan...' : initialData ? 'Update' : 'Simpan'}
        </Button>
      </div>
    </form>
  );
}
