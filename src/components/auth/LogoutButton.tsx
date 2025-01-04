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
    <button onClick={handleLogout} className='px-4 py-2 text-yellow-500 hover:bg-yellow-50 hover:text-[#2b8aa0] rounded-md transition-colors'>
      Logout
    </button>
  );
}
