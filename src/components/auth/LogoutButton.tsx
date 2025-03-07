'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const router = useRouter();
  const { status } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
  };

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <button onClick={handleLogout} className='flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors'>
      <LogOut className='w-5 h-5 mr-2 text-[#00879b]' />
      <span>Logout</span>
    </button>
  );
}
