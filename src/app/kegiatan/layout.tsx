/**
 * File: src/app/kegiatan/layout.tsx
 * Description: Layout component for the Kegiatan section of the application.
 * This provides a consistent layout wrapper for all Kegiatan pages, including
 * header, navigation breadcrumbs, and main content area.
 */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Kegiatan Remaja Masjid - Al-Muhajirin',
  description: 'Kelola dan ikuti kegiatan remaja masjid Al-Muhajirin',
};

export default function KegiatanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/kegiatan" className="hover:text-blue-600 hover:underline flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Kegiatan Remaja Masjid
              </Link>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kegiatan Remaja Masjid</h1>
          <p className="text-gray-600 mt-2">
            Temukan dan ikuti kegiatan remaja masjid Al-Muhajirin. Daftar sebagai peserta atau panitia!
          </p>
        </header>

        {/* Main Content */}
        <main className="bg-white rounded-xl shadow-sm p-6">{children}</main>
      </div>
    </div>
  );
}