/**
 * File: src/app/bbs/layout.tsx
 * Description: Layout component for the BBS section of the application.
 * This provides a consistent layout wrapper for all BBS pages, including
 * header, navigation breadcrumbs, and main content area.
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bulletin Board System - Al-Muhajirin',
  description: 'Papan pengumuman digital Masjid Al-Muhajirin',
};

export default function BBSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <header className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Board Informasi</h1>
          <p className='text-gray-600 mt-2'>Temukan informasi, berita, jadwal kegiatan, dan informasi penting lainnya.</p>
        </header>

        {/* Main Content */}
        <main className='bg-white rounded-xl shadow-sm'>{children}</main>
      </div>
    </div>
  );
}
