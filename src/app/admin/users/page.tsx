'use client';

import { useState, useEffect } from 'react';
import { UserRole } from '../../../lib/types/auth';
import { UserForm, userFormSchema } from '../../../components/kelola-user/user-form';
import { useRouter } from 'next/navigation';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '../../../components/ui/table';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../../../components/ui/dropdown-menu';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from '../../../components/ui/dialog';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '../../../components/ui/tabs';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { 
  MoreHorizontal, UserPlus, Search, Filter, Download, Trash2, Edit, Eye, 
  UserCheck, UserX, RefreshCw 
} from 'lucide-react';
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

export default function AdminUsersPage() {
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
  const [showViewUser, setShowViewUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<'active' | 'inactive' | ''>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [bulkAction, setBulkAction] = useState<'activate' | 'deactivate' | 'delete' | ''>('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

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
      const data = await response.json();

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
          <CardDescription>Filter users by various criteria</CardDescription>
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
            
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole | '')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Roles</SelectItem>
                <SelectItem value={UserRole.KOORDINATOR_ANAKREMAS}>Koordinator</SelectItem>
                <SelectItem value={UserRole.ANAK_REMAS}>Anggota</SelectItem>
                <SelectItem value={UserRole.MARBOT}>Marbot</SelectItem>
                <SelectItem value={UserRole.TAKMIR}>Takmir</SelectItem>
                <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                <SelectItem value={UserRole.ORANG_TUA}>Orang Tua/Wali</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as 'active' | 'inactive' | '')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            
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
            <Select value={bulkAction} onValueChange={(value) => setBulkAction(value as 'activate' | 'deactivate' | 'delete' | '')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Bulk Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Select Action</SelectItem>
                <SelectItem value="activate">Activate</SelectItem>
                <SelectItem value="deactivate">Deactivate</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="default" 
              onClick={handleBulkAction}
              disabled={!bul
