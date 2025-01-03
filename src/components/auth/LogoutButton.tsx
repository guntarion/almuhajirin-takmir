'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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
    <button onClick={handleLogout} className='px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors'>
      Logout
    </button>
  );
}
