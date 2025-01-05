// src/components/kelola-user/user-form.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserRole } from '../../lib/types/auth';

// Form validation schema
export const userFormSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
    role: z.nativeEnum(UserRole),
    anakremasId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === UserRole.ORANG_TUA) {
        return !!data.anakremasId;
      }
      return true;
    },
    {
      message: 'Anak Remas association is required for Orang Tua Wali',
      path: ['anakremasId'],
    }
  );

type UserFormData = z.infer<typeof userFormSchema>;

interface UserFormProps {
  initialData?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => Promise<void>;
  isEditing?: boolean;
}

export function UserForm({ initialData, onSubmit, isEditing = false }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [anakremasList, setAnakremasList] = useState<Array<{ id: string; name: string }>>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: initialData,
  });

  const selectedRole = watch('role');

  // Fetch anak remas list for orangtuawali role
  useEffect(() => {
    if (selectedRole === UserRole.ORANG_TUA) {
      const fetchAnakRemas = async () => {
        try {
          const response = await fetch(`/api/users?role=${UserRole.ANAK_REMAS}`);
          if (!response.ok) {
            if (response.status === 401) {
              window.location.href = '/auth/login?callbackUrl=' + encodeURIComponent(window.location.pathname);
              return;
            }
            throw new Error('Failed to fetch anak remas list');
          }
          const data = await response.json();
          setAnakremasList(data.data);
        } catch (error) {
          console.error('Error fetching anak remas:', error);
          setError(error instanceof Error ? error.message : 'Failed to fetch anak remas list');
        }
      };
      fetchAnakRemas();
    }
  }, [selectedRole]);

  const handleFormSubmit = async (data: UserFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await onSubmit(data);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          window.location.href = '/auth/login?callbackUrl=' + encodeURIComponent(window.location.pathname);
          return;
        }
        if (error.message.includes('unique constraint')) {
          if (error.message.includes('username')) {
            setError('Username is already taken');
          } else if (error.message.includes('email')) {
            setError('Email is already registered');
          } else {
            setError(error.message);
          }
        } else {
          setError(error.message);
        }
      } else {
        setError('Failed to save user');
      }
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
      {error && <div className='bg-red-50 text-red-500 p-3 rounded-md'>{error}</div>}

      <div className='space-y-4'>
        <div>
          <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
            Name
          </label>
          <input {...register('name')} type='text' className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2' />
          {errors.name && <p className='mt-1 text-sm text-red-500'>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor='username' className='block text-sm font-medium text-gray-700'>
            Username
          </label>
          <input {...register('username')} type='text' className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2' />
          {errors.username && <p className='mt-1 text-sm text-red-500'>{errors.username.message}</p>}
        </div>

        <div>
          <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
            Email
          </label>
          <input {...register('email')} type='email' className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2' />
          {errors.email && <p className='mt-1 text-sm text-red-500'>{errors.email.message}</p>}
        </div>

        {!isEditing && (
          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
              Password
            </label>
            <input {...register('password')} type='password' className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2' />
            {errors.password && <p className='mt-1 text-sm text-red-500'>{errors.password.message}</p>}
          </div>
        )}

        <div>
          <label htmlFor='role' className='block text-sm font-medium text-gray-700'>
            Role
          </label>
          <select {...register('role')} className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2'>
            <option value=''>Select a role</option>
            <option value={UserRole.ANAK_REMAS}>Anak Remas</option>
            <option value={UserRole.ORANG_TUA}>Orang Tua</option>
            <option value={UserRole.ADMIN}>Admin</option>
          </select>
          {errors.role && <p className='mt-1 text-sm text-red-500'>{errors.role.message}</p>}
        </div>

        {selectedRole === UserRole.ORANG_TUA && (
          <div>
            <label htmlFor='anakremasId' className='block text-sm font-medium text-gray-700'>
              Associated Anak Remas
            </label>
            <select {...register('anakremasId')} className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2'>
              <option value=''>Select an Anak Remas</option>
              {anakremasList.map((anakremas) => (
                <option key={anakremas.id} value={anakremas.id}>
                  {anakremas.name}
                </option>
              ))}
            </select>
            {errors.anakremasId && <p className='mt-1 text-sm text-red-500'>{errors.anakremasId.message}</p>}
          </div>
        )}
      </div>

      <div className='flex justify-end space-x-4'>
        <button
          type='button'
          onClick={() => window.history.back()}
          className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50'
        >
          Cancel
        </button>
        <button
          type='submit'
          disabled={isLoading}
          className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50'
        >
          {isLoading ? 'Saving...' : isEditing ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  );
}
