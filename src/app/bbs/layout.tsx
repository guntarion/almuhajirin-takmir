/**
 * File: src/app/bbs/layout.tsx
 * Description: Layout component for the BBS section of the application.
 * This provides a consistent layout wrapper for all BBS pages, including
 * header, navigation breadcrumbs, and main content area.
 */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Bulletin Board System - Al-Muhajirin',
  description: 'Papan pengumuman digital Masjid Al-Muhajirin',
};

export default function BBSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        {/* Navigation Breadcrumbs */}
        <nav className='mb-4 text-sm text-gray-600'>
          <ol className='flex items-center space-x-2'>
            <li>
              <Link href='/' className='hover:text-blue-600 transition-colors'>
                Beranda
              </Link>
            </li>
            <li className='flex items-center space-x-2'>
              <svg className='h-4 w-4' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
              <span>Papan Pengumuman</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Papan Pengumuman</h1>
          <p className='text-gray-600 mt-2'>
            Informasi dan pengumuman terkini Masjid Al-Muhajirin. Temukan berita, jadwal kegiatan, dan informasi penting lainnya.
          </p>
        </header>

        {/* Main Content */}
        <main className='bg-white rounded-xl shadow-sm'>{children}</main>
      </div>
    </div>
  );
}
