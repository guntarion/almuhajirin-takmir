'use client';

import { useState, useEffect } from 'react';
import { UserRole } from '../../../lib/types/auth';
import { UserForm, type UserFormData } from '../../../components/kelola-user/user-form';
import { useRouter } from 'next/navigation';
import { Table, TableRow, TableCell } from '../../../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select } from '../../../components/ui/select';
import { UserPlus, Search, Download, RefreshCw } from 'lucide-react';

// Base user interface from API
interface BaseUser {
  id: string;
  name: string;
  panggilan: string;
  gender: "Lelaki" | "Perempuan";
  username: string;
  email: string;
  role: UserRole;
  active: boolean;
  kategori: "mkidz" | "laz";
  groupId?: string;
  tanggalLahir?: string;
  nomerWhatsapp?: string;
  alamatRumah?: string;
  rwRumah?: "RW 6 Rewwin" | "RW 8 Rewwin" | "RW 9 Rewwin" | "other";
  rtRumah?: string;
  sekolah?: string;
  kelas?: number;
  keterangan?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  data: BaseUser[];
  pagination: {
    total: number;
    totalPages: number;
  };
  error?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Role options for select
const roleOptions = [
  { value: "", label: "All Roles" },
  { value: UserRole.KOORDINATOR_ANAKREMAS, label: "Koordinator" },
  { value: UserRole.ANAK_REMAS, label: "Anggota" },
  { value: UserRole.MARBOT, label: "Marbot" },
  { value: UserRole.TAKMIR, label: "Takmir" },
  { value: UserRole.ADMIN, label: "Admin" },
  { value: UserRole.ORANG_TUA, label: "Orang Tua/Wali" }
];

// Status options for select
const statusOptions = [
  { value: "", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" }
];

// Bulk action options
const bulkActionOptions = [
  { value: "", label: "Select Action" },
  { value: "activate", label: "Activate" },
  { value: "deactivate", label: "Deactivate" },
  { value: "delete", label: "Delete" }
];

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<BaseUser[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<BaseUser | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<'active' | 'inactive' | ''>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [bulkAction, setBulkAction] = useState<'activate' | 'deactivate' | 'delete' | ''>('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Table headers
  const tableHeaders = [
    "",
    "Name",
    "Username",
    "Email",
    "Role",
    "Status",
    "Created At",
    "Actions"
  ];

  // Convert date string to Date object
  const convertToDate = (dateString?: string): Date | undefined => {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  };

  // Fetch users with pagination, search, and filters
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedRole && { role: selectedRole }),
        ...(selectedStatus && { active: selectedStatus === 'active' ? 'true' : 'false' }),
      });

      const response = await fetch(`/api/users?${params}`);
      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login?callbackUrl=/admin/users');
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
  }, [pagination.page, searchTerm, selectedRole, selectedStatus]);

  // Handle user creation
  const handleCreateUser = async (userData: UserFormData) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login?callbackUrl=/admin/users');
          return;
        }
        throw new Error(result.error || 'Failed to create user');
      }

      setShowForm(false);
      setError(null);
      fetchUsers();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create user');
    }
  };

  // Handle user update
  const handleUpdateUser = async (userData: UserFormData) => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/users?id=${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login?callbackUrl=/admin/users');
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
          router.push('/auth/login?callbackUrl=/admin/users');
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

  // Handle bulk actions
  const handleBulkAction = async () => {
    if (!bulkAction || selectedUsers.length === 0) return;

    try {
      let endpoint = '';
      let method = 'POST';
      
      switch (bulkAction) {
        case 'activate':
          endpoint = '/api/users/bulk-activate';
          break;
        case 'deactivate':
          endpoint = '/api/users/bulk-deactivate';
          break;
        case 'delete':
          endpoint = '/api/users/bulk-delete';
          method = 'DELETE';
          break;
      }

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds: selectedUsers }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login?callbackUrl=/admin/users');
          return;
        }
        throw new Error(result.error || `Failed to ${bulkAction} users`);
      }

      setBulkAction('');
      setSelectedUsers([]);
      setSelectAll(false);
      setError(null);
      fetchUsers();
    } catch (error) {
      setError(error instanceof Error ? error.message : `Failed to ${bulkAction} users`);
    }
  };

  // Export users as CSV
  const exportUsers = async () => {
    try {
      const response = await fetch('/api/users/export');
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to export users');
    }
  };

  // Handle select all checkbox
  useEffect(() => {
    if (selectAll) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  }, [selectAll, users]);

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8 flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold'>User Management</h1>
          <p className='text-gray-500 mt-1'>Manage all users in the system</p>
        </div>
        <Button onClick={() => { setSelectedUser(null); setShowForm(true); }}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <p className="text-sm text-gray-500">Filter users by various criteria</p>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1'>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type='text'
                  placeholder='Search users...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-9'
                />
              </div>
            </div>
            
            <Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole | '')}
              options={roleOptions}
              className="w-[180px]"
            />
            
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as 'active' | 'inactive' | '')}
              options={statusOptions}
              className="w-[180px]"
            />
            
            <Button variant="outline" onClick={() => fetchUsers()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            <Button variant="outline" onClick={exportUsers}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="mb-4 p-4 bg-gray-100 rounded-md flex items-center justify-between">
          <div>
            <span className="font-medium">{selectedUsers.length} users selected</span>
          </div>
          <div className="flex gap-2">
            <Select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value as 'activate' | 'deactivate' | 'delete' | '')}
              options={bulkActionOptions}
              className="w-[180px]"
            />
            <Button 
              variant="default" 
              onClick={handleBulkAction}
              disabled={!bulkAction || selectedUsers.length === 0}
            >
              Apply
            </Button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : (
          <Table headers={tableHeaders}>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, user.id]);
                      } else {
                        setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setUserToDelete(user.id);
                        setShowDeleteConfirm(true);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-500">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
          </span>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
            disabled={pagination.page === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Create/Edit User Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">
              {selectedUser ? 'Edit User' : 'Create User'}
            </h2>
            <UserForm
              onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
              initialData={selectedUser ? {
                ...selectedUser,
                tanggalLahir: convertToDate(selectedUser.tanggalLahir)
              } : undefined}
              onCancel={() => {
                setShowForm(false);
                setSelectedUser(null);
              }}
              isEditing={!!selectedUser}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this user?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteUser}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
