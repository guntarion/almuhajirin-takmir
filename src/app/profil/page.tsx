/**
 * File: src/app/profil/page.tsx
 * Description: Profile page component that allows authenticated users to manage their profile information
 * and select an avatar from a predefined collection.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

// Interface for form data
interface ProfileFormData {
  name: string;
  email: string;
  whatsapp: string;
  address: string;
  rw: string;
  rt: string;
  birthDate: string;
  school: string;
  avatar: string;
  keterangan: string;
}

// Default avatar path
const DEFAULT_AVATAR = '/avatars/avatar-01.jpg';

// RW options
const RW_OPTIONS = [
  { value: 'RW 6 Rewwin', label: 'RW 6 Rewwin' },
  { value: 'RW 8 Rewwin', label: 'RW 8 Rewwin' },
  { value: 'RW 9 Rewwin', label: 'RW 9 Rewwin' },
  { value: 'other', label: 'Lainnya' },
];

// Generate RT options (1-19)
const RT_OPTIONS = Array.from({ length: 19 }, (_, i) => ({
  value: String(i + 1),
  label: `RT ${i + 1}`,
}));

// Generate avatar options (1-14)
const AVATAR_OPTIONS = Array.from({ length: 14 }, (_, i) => ({
  path: `/avatars/avatar-${String(i + 1).padStart(2, '0')}.jpg`,
  alt: `Avatar ${i + 1}`,
}));

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/login?callbackUrl=/profil');
    },
  });

  // Initial form state
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    whatsapp: '',
    address: '',
    rw: '',
    rt: '',
    birthDate: '',
    school: '',
    avatar: DEFAULT_AVATAR,
    keterangan: '',
  });

  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATAR);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/users/profile');
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();

        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          whatsapp: data.user.nomerWhatsapp || '',
          address: data.user.alamatRumah || '',
          rw: data.user.rwRumah || '',
          rt: data.user.rtRumah || '',
          birthDate: data.user.tanggalLahir ? new Date(data.user.tanggalLahir).toISOString().split('T')[0] : '',
          school: data.user.sekolah || '',
          avatar: data.user.avatar || DEFAULT_AVATAR,
          keterangan: data.user.keterangan || '',
        });
        setSelectedAvatar(data.user.avatar || DEFAULT_AVATAR);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setMessage({
          type: 'error',
          content: 'Gagal mengambil data profil',
        });
      }
    };

    if (session?.user?.email) {
      fetchProfile();
    }
  }, [session]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle avatar selection
  const handleAvatarSelect = (avatarPath: string) => {
    setSelectedAvatar(avatarPath);
    setFormData((prev) => ({ ...prev, avatar: avatarPath }));
  };

  // Handle save changes
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Save Changes button clicked - attempting to save form data');

    setIsLoading(true);
    setMessage({ type: '', content: '' });

    // Basic validation
    if (!formData.name || !formData.email || !formData.whatsapp) {
      setMessage({
        type: 'error',
        content: 'Nama Display, Email, dan Nomer WhatsApp harus diisi',
      });
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({
        type: 'error',
        content: 'Format email tidak valid',
      });
      setIsLoading(false);
      return;
    }

    // WhatsApp number validation (Indonesian format)
    const whatsappRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
    if (!whatsappRegex.test(formData.whatsapp)) {
      setMessage({
        type: 'error',
        content: 'Format nomor WhatsApp tidak valid (gunakan format Indonesia)',
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log('Making API call to:', '/api/users/profile');
      console.log('Request payload:', {
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar,
        tanggalLahir: formData.birthDate || null,
        nomerWhatsapp: formData.whatsapp,
        alamatRumah: formData.address,
        rwRumah: formData.rw,
        rtRumah: formData.rt,
        sekolah: formData.school,
        keterangan: formData.keterangan,
      });

      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          avatar: formData.avatar,
          tanggalLahir: formData.birthDate || null,
          nomerWhatsapp: formData.whatsapp,
          alamatRumah: formData.address,
          rwRumah: formData.rw,
          rtRumah: formData.rt,
          sekolah: formData.school,
          keterangan: formData.keterangan,
        }),
      });

      console.log('API response status:', response.status);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setMessage({
        type: 'success',
        content: 'Profil berhasil diperbarui',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        content: 'Gagal memperbarui profil. Silakan coba lagi.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (session?.user) {
      // Reset form data to original values
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        whatsapp: '',
        address: '',
        rw: '',
        rt: '',
        birthDate: '',
        school: '',
        avatar: DEFAULT_AVATAR,
        keterangan: '',
      });
    }
    setSelectedAvatar(DEFAULT_AVATAR);
    setIsEditing(false);
    setMessage({ type: '', content: '' });
  };

  // Show loading state while checking authentication
  if (status === 'loading' || isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-lg'>Loading...</div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <h1 className='text-2xl font-bold mb-8'>Profil Saya</h1>

      {/* Message display */}
      {message.content && (
        <div className={`p-4 mb-4 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.content}
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {/* Avatar Section */}
        <div className='space-y-4'>
          <div className='w-32 h-32 mx-auto'>
            <Image src={selectedAvatar} alt='Profile Avatar' width={128} height={128} className='rounded-lg' unoptimized />
          </div>

          {isEditing && (
            <div className='grid grid-cols-3 gap-2 mt-4'>
              {AVATAR_OPTIONS.map((avatar) => (
                <button
                  key={avatar.path}
                  onClick={() => handleAvatarSelect(avatar.path)}
                  className={`p-1 rounded-lg border-2 ${selectedAvatar === avatar.path ? 'border-blue-500' : 'border-transparent'}`}
                >
                  <div className='w-16 h-16'>
                    <Image src={avatar.path} alt={avatar.alt} width={64} height={64} className='rounded' unoptimized />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Form Section */}
        <div className='md:col-span-2'>
          {/* Edit Profile Button */}
          {!isEditing && (
            <div className='mb-4'>
              <Button
                type='button'
                onClick={() => {
                  console.log('Edit Profile button clicked - entering edit mode');
                  setIsEditing(true);
                  setMessage({ type: '', content: '' });
                }}
                className='bg-blue-500 hover:bg-blue-600 text-white'
              >
                Edit Profil
              </Button>
            </div>
          )}

          {/* Profile Fields */}
          <div className='space-y-4'>
            {/* Name and Birth Date Row */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label className='block text-sm font-medium'>Nama Display</label>
                <Input type='text' name='name' value={formData.name} onChange={handleInputChange} disabled={!isEditing} required />
              </div>
              <div className='space-y-2'>
                <label className='block text-sm font-medium'>Tanggal Lahir</label>
                <Input type='date' name='birthDate' value={formData.birthDate} onChange={handleInputChange} disabled={!isEditing} />
              </div>
            </div>

            {/* Email and WhatsApp Row */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label className='block text-sm font-medium'>Email</label>
                <Input type='email' name='email' value={formData.email} onChange={handleInputChange} disabled={!isEditing} required />
              </div>
              <div className='space-y-2'>
                <label className='block text-sm font-medium'>Nomer WhatsApp</label>
                <Input
                  type='tel'
                  name='whatsapp'
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder='Contoh: 081234567890'
                  required
                />
              </div>
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium'>Alamat</label>
              <Input type='text' name='address' value={formData.address} onChange={handleInputChange} disabled={!isEditing} />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label className='block text-sm font-medium'>RW</label>
                <Select name='rw' value={formData.rw} onChange={handleInputChange} disabled={!isEditing} options={RW_OPTIONS} />
              </div>
              <div className='space-y-2'>
                <label className='block text-sm font-medium'>RT</label>
                <Select name='rt' value={formData.rt} onChange={handleInputChange} disabled={!isEditing} options={RT_OPTIONS} />
              </div>
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium'>Sekolah</label>
              <Input type='text' name='school' value={formData.school} onChange={handleInputChange} disabled={!isEditing} />
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium'>Keterangan</label>
              <textarea
                name='keterangan'
                value={formData.keterangan}
                onChange={handleInputChange}
                disabled={!isEditing}
                className='w-full px-3 py-2 border rounded-md'
                rows={4}
              />
            </div>

            {/* Save/Cancel Form - Only shown in edit mode */}
            {isEditing && (
              <form onSubmit={handleSaveChanges}>
                <div className='flex gap-4 pt-4'>
                  <Button type='submit' className='bg-green-500 hover:bg-green-600 text-white'>
                    Simpan Perubahan
                  </Button>
                  <Button type='button' onClick={handleCancel} className='bg-gray-500 hover:bg-gray-600 text-white'>
                    Batal
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
