// src/app/kelola-user/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { UserRole } from '../../../lib/types/auth';
import { UserForm, userFormSchema } from '../../../components/kelola-user/user-form';
import { useRouter } from 'next/navigation';
import type { z } from 'zod';

interface User {
  id: string;
  name: string;
  panggilan: string;
  gender: string;
  username: string;
  email: string;
  role: UserRole;
  active: boolean;
  kategori: string;
  groupId?: string;
  tanggalLahir?: string;
  nomerWhatsapp?: string;
  alamatRumah?: string;
  rwRumah?: string;
  rtRumah?: string;
  sekolah?: string;
  kelas?: number;
  keterangan?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type FormRole = z.infer<typeof userFormSchema>['role'];
type UserFormData = z.infer<typeof userFormSchema>;

const isAllowedRole = (role: UserRole): role is FormRole => {
  return [UserRole.KOORDINATOR_ANAKREMAS, UserRole.ANAK_REMAS, UserRole.MARBOT, UserRole.TAKMIR, UserRole.ADMIN, UserRole.ORANG_TUA].includes(role);
};

export default function KelolaUserPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch users with pagination, search, and role filter
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedRole && { role: selectedRole }),
      });

      const response = await fetch(`/api/users?${params}`);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login?callbackUrl=/kelola-user');
          return;
        }
        throw new Error(data.error || 'Failed to fetch users');
      }

      setUsers(data.data);
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
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, searchTerm, selectedRole]);

  // Handle user creation
  const handleCreateUser = async (data: UserFormData) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login?callbackUrl=/kelola-user');
          return;
        }
        throw new Error(result.error || 'Failed to create user');
      }

      setShowForm(false);
      setError(null);
      fetchUsers();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create user');
      throw error;
    }
  };

  // Handle user update
  const handleUpdateUser = async (data: UserFormData) => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/users?id=${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login?callbackUrl=/kelola-user');
          return;
        }
        throw new Error(result.error || 'Failed to update user');
      }

      setShowForm(false);
      setSelectedUser(null);
      setError(null);
      fetchUsers();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update user');
      throw error;
    }
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`/api/users?id=${userToDelete}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login?callbackUrl=/kelola-user');
          return;
        }
        throw new Error(result.error || 'Failed to delete user');
      }

      setShowDeleteConfirm(false);
      setUserToDelete(null);
      setError(null);
      fetchUsers();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete user');
    }
  };

  const getUserFormData = (user: User): Partial<UserFormData> | undefined => {
    if (!isAllowedRole(user.role)) return undefined;

    return {
      name: user.name,
      panggilan: user.panggilan,
      gender: user.gender as 'Lelaki' | 'Perempuan',
      username: user.username,
      email: user.email,
      role: user.role,
      active: user.active,
      kategori: user.kategori as 'mkidz' | 'laz',
      tanggalLahir: user.tanggalLahir ? new Date(user.tanggalLahir) : undefined,
      nomerWhatsapp: user.nomerWhatsapp,
      alamatRumah: user.alamatRumah,
      rwRumah: user.rwRumah as 'RW 6 Rewwin' | 'RW 8 Rewwin' | 'RW 9 Rewwin' | 'other' | undefined,
      rtRumah: user.rtRumah,
      sekolah: user.sekolah,
      kelas: user.kelas,
      keterangan: user.keterangan,
      ...(user.groupId && { anakremasId: user.groupId }),
    };
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8 flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>User Management</h1>
        <button
          onClick={() => {
            setSelectedUser(null);
            setShowForm(true);
          }}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
        >
          Add New User
        </button>
      </div>

      {/* Search and Filter */}
      <div className='mb-6 flex gap-4'>
        <input
          type='text'
          placeholder='Search users...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='px-3 py-2 border rounded-md flex-1'
        />
        <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value as UserRole | '')} className='px-3 py-2 border rounded-md'>
          <option value=''>All Roles</option>
          <option value={UserRole.KOORDINATOR_ANAKREMAS}>Koordinator</option>
          <option value={UserRole.ANAK_REMAS}>Anggota</option>
          <option value={UserRole.MARBOT}>Marbot</option>
          <option value={UserRole.TAKMIR}>Takmir</option>
          <option value={UserRole.ADMIN}>Admin</option>
          <option value={UserRole.ORANG_TUA}>Orang Tua/Wali</option>
        </select>
      </div>

      {/* Error Message */}
      {error && <div className='mb-4 p-4 bg-red-50 text-red-500 rounded-md'>{error}</div>}

      {/* Loading State */}
      {loading ? (
        <div className='text-center py-8'>Loading...</div>
      ) : (
        <>
          {/* Users Table */}
          <div className='bg-white shadow rounded-lg overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Name</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Panggilan</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Username</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Role</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Kategori</th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowForm(true);
                          }}
                          className='text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-gray-100 mr-2'
                          title='Edit'
                          aria-label='Edit user'
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
                          onClick={() => {
                            setUserToDelete(user.id);
                            setShowDeleteConfirm(true);
                          }}
                          className='text-red-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50'
                          title='Delete'
                          aria-label='Delete user'
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
                      <td className='px-6 py-4 whitespace-nowrap'>{user.name}</td>
                      <td className='px-6 py-4 whitespace-nowrap'>{user.panggilan}</td>
                      <td className='px-6 py-4 whitespace-nowrap'>{user.username}</td>
                      <td className='px-6 py-4 whitespace-nowrap'>{user.role}</td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>{user.kategori}</td>
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
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className='px-3 py-1 border rounded-md disabled:opacity-50'
              >
                Previous
              </button>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.totalPages}
                className='px-3 py-1 border rounded-md disabled:opacity-50'
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* User Form Modal */}
      {showForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-lg p-6 max-w-2xl w-full overflow-auto max-h-[90vh]'>
            <h2 className='text-xl font-bold mb-4'>{selectedUser ? 'Edit User' : 'Create New User'}</h2>
            <UserForm
              initialData={selectedUser ? getUserFormData(selectedUser) : undefined}
              onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
              isEditing={!!selectedUser}
            />
            <button
              onClick={() => {
                setShowForm(false);
                setSelectedUser(null);
                setError(null);
              }}
              className='mt-4 px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50'
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full'>
            <h2 className='text-xl font-bold mb-4'>Confirm Delete</h2>
            <p className='mb-6'>Are you sure you want to delete this user?</p>
            <div className='flex justify-end gap-4'>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setUserToDelete(null);
                }}
                className='px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50'
              >
                Cancel
              </button>
              <button onClick={handleDeleteUser} className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
