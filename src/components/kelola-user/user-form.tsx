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
    panggilan: z.string(),
    gender: z.enum(['Lelaki', 'Perempuan']),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
    role: z.nativeEnum(UserRole),
    active: z.boolean().default(true),
    kategori: z.enum(['mkidz', 'laz']),
    tanggalLahir: z.date().optional(),
    nomerWhatsapp: z.string().optional(),
    alamatRumah: z.string().optional(),
    rwRumah: z.enum(['RW 6 Rewwin', 'RW 8 Rewwin', 'RW 9 Rewwin', 'other']).optional(),
    rtRumah: z.string().optional(),
    sekolah: z.string().optional(),
    kelas: z.number().int().optional(),
    keterangan: z.string().optional(),
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

export type UserFormData = z.infer<typeof userFormSchema>;

interface UserFormProps {
  initialData?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export function UserForm({ initialData, onSubmit, onCancel, isEditing = false }: UserFormProps) {
  // Rest of the component implementation remains the same
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

      <div className='space-y-4 grid grid-cols-2 gap-4'>
        {/* Basic Information */}
        <div className='col-span-2 space-y-4'>
          <h3 className='font-medium text-gray-900'>Basic Information</h3>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
                Name
              </label>
              <input {...register('name')} type='text' className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2' />
              {errors.name && <p className='mt-1 text-sm text-red-500'>{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor='panggilan' className='block text-sm font-medium text-gray-700'>
                Nama Panggilan
              </label>
              <input {...register('panggilan')} type='text' className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2' />
              {errors.panggilan && <p className='mt-1 text-sm text-red-500'>{errors.panggilan.message}</p>}
            </div>

            <div>
              <label htmlFor='gender' className='block text-sm font-medium text-gray-700'>
                Gender
              </label>
              <select {...register('gender')} className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2'>
                <option value=''>Select gender</option>
                <option value='Lelaki'>Lelaki</option>
                <option value='Perempuan'>Perempuan</option>
              </select>
              {errors.gender && <p className='mt-1 text-sm text-red-500'>{errors.gender.message}</p>}
            </div>

            <div>
              <label htmlFor='kategori' className='block text-sm font-medium text-gray-700'>
                Kategori
              </label>
              <select {...register('kategori')} className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2'>
                <option value='mkidz'>MKIDZ</option>
                <option value='laz'>LAZ</option>
              </select>
              {errors.kategori && <p className='mt-1 text-sm text-red-500'>{errors.kategori.message}</p>}
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className='col-span-2 space-y-4'>
          <h3 className='font-medium text-gray-900'>Account Information</h3>
          <div className='grid grid-cols-2 gap-4'>
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
                <option value='KOORDINATOR_ANAKREMAS'>Koordinator</option>
                <option value='ANAK_REMAS'>Anggota</option>
                <option value='MARBOT'>Marbot</option>
                <option value='TAKMIR'>Takmir</option>
                <option value='ADMIN'>Admin</option>
                <option value='ORANG_TUA'>Orang Tua/Wali</option>
              </select>
              {errors.role && <p className='mt-1 text-sm text-red-500'>{errors.role.message}</p>}
            </div>

            <div>
              <label htmlFor='active' className='block text-sm font-medium text-gray-700'>
                Status
              </label>
              <select {...register('active')} className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2'>
                <option value='true'>Active</option>
                <option value='false'>Inactive</option>
              </select>
              {errors.active && <p className='mt-1 text-sm text-red-500'>{errors.active.message}</p>}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className='col-span-2 space-y-4'>
          <h3 className='font-medium text-gray-900'>Personal Information</h3>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label htmlFor='tanggalLahir' className='block text-sm font-medium text-gray-700'>
                Tanggal Lahir
              </label>
              <input {...register('tanggalLahir')} type='date' className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2' />
              {errors.tanggalLahir && <p className='mt-1 text-sm text-red-500'>{errors.tanggalLahir.message}</p>}
            </div>

            <div>
              <label htmlFor='nomerWhatsapp' className='block text-sm font-medium text-gray-700'>
                Nomer Whatsapp
              </label>
              <input {...register('nomerWhatsapp')} type='text' className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2' />
              {errors.nomerWhatsapp && <p className='mt-1 text-sm text-red-500'>{errors.nomerWhatsapp.message}</p>}
            </div>

            <div className='col-span-2'>
              <label htmlFor='alamatRumah' className='block text-sm font-medium text-gray-700'>
                Alamat Rumah
              </label>
              <input {...register('alamatRumah')} type='text' className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2' />
              {errors.alamatRumah && <p className='mt-1 text-sm text-red-500'>{errors.alamatRumah.message}</p>}
            </div>

            <div>
              <label htmlFor='rwRumah' className='block text-sm font-medium text-gray-700'>
                RW
              </label>
              <select {...register('rwRumah')} className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2'>
                <option value=''>Select RW</option>
                <option value='RW 6 Rewwin'>RW 6 Rewwin</option>
                <option value='RW 8 Rewwin'>RW 8 Rewwin</option>
                <option value='RW 9 Rewwin'>RW 9 Rewwin</option>
                <option value='other'>Lainnya</option>
              </select>
              {errors.rwRumah && <p className='mt-1 text-sm text-red-500'>{errors.rwRumah.message}</p>}
            </div>

            <div>
              <label htmlFor='rtRumah' className='block text-sm font-medium text-gray-700'>
                RT
              </label>
              <select {...register('rtRumah')} className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2'>
                <option value=''>Select RT</option>
                {Array.from({ length: 19 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1)}>
                    RT {i + 1}
                  </option>
                ))}
              </select>
              {errors.rtRumah && <p className='mt-1 text-sm text-red-500'>{errors.rtRumah.message}</p>}
            </div>

            <div>
              <label htmlFor='sekolah' className='block text-sm font-medium text-gray-700'>
                Sekolah
              </label>
              <input {...register('sekolah')} type='text' className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2' />
              {errors.sekolah && <p className='mt-1 text-sm text-red-500'>{errors.sekolah.message}</p>}
            </div>

            <div>
              <label htmlFor='kelas' className='block text-sm font-medium text-gray-700'>
                Kelas
              </label>
              <input
                {...register('kelas', { valueAsNumber: true })}
                type='number'
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2'
              />
              {errors.kelas && <p className='mt-1 text-sm text-red-500'>{errors.kelas.message}</p>}
            </div>

            <div className='col-span-2'>
              <label htmlFor='keterangan' className='block text-sm font-medium text-gray-700'>
                Keterangan
              </label>
              <textarea {...register('keterangan')} rows={3} className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2' />
              {errors.keterangan && <p className='mt-1 text-sm text-red-500'>{errors.keterangan.message}</p>}
            </div>
          </div>
        </div>

        {selectedRole === 'ORANG_TUA' && (
          <div className='col-span-2'>
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

      <div className='col-span-2 flex justify-end space-x-2'>
        <button type='button' className='px-4 py-2 text-sm border rounded-md hover:bg-gray-50' onClick={onCancel}>
          Cancel
        </button>
        <button
          type='submit'
          disabled={isLoading}
          className='px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50'
        >
          {isLoading ? 'Saving...' : isEditing ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  );
}
