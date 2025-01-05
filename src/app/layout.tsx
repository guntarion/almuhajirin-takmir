// src/app/layout.tsx
'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import Providers from '../components/auth/Providers';
import { Home, UserCog, Users, Activity, Trophy, Menu, MessageSquare } from 'lucide-react';
import { LogoutButton } from '../components/auth/LogoutButton';
import './globals.css';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <div className='flex min-h-screen'>
            {/* Mobile menu button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`fixed z-50 p-2 m-2 bg-gray-900 rounded-lg md:hidden transition-opacity duration-300 ${
                isSidebarOpen ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <Menu className='w-6 h-6 text-white' />
            </button>

            {/* Sidebar */}
            <div
              className={`fixed md:relative z-40 w-64 bg-[#00879b] text-white p-4 transform transition-all duration-300 ease-in-out ${
                isSidebarOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full md:translate-x-0'
              }`}
            >
              <div className='flex items-center justify-between mb-8'>
                <Link href='/' className='flex items-center gap-2'>
                  <Image src='/logo-yamr.png' alt='Logo' width={32} height={32} priority style={{ objectFit: 'contain' }} />
                  <h1 className='text-xl font-bold'>Al-Muhajirin</h1>
                </Link>
                <button onClick={() => setIsSidebarOpen(false)} className='p-1 md:hidden'>
                  <Menu className='w-6 h-6 rotate-45' />
                </button>
              </div>
              <nav>
                <Link href='/home' className='flex items-center p-2 rounded-lg hover:bg-gray-700'>
                  <Home className='w-5 h-5 mr-2' />
                  <span>Home</span>
                </Link>
                <Link href='/bbs' className='flex items-center p-2 rounded-lg hover:bg-gray-700'>
                  <MessageSquare className='w-5 h-5 mr-2' />
                  <span>Board</span>
                </Link>
                <Link href='/aktivitas' className='flex items-center p-2 rounded-lg hover:bg-gray-700 mt-2'>
                  <Activity className='w-5 h-5 mr-2' />
                  <span>Aktivitas</span>
                </Link>
                <Link href='/leaderboard' className='flex items-center p-2 rounded-lg hover:bg-gray-700 mt-2'>
                  <Trophy className='w-5 h-5 mr-2' />
                  <span>Leaderboard</span>
                </Link>
                <Link href='/profil' className='flex items-center p-2 rounded-lg hover:bg-gray-700'>
                  <UserCog className='w-5 h-5 mr-2' />
                  <span>Profil</span>
                </Link>
                <Link href='/kelola-user' className='flex items-center p-2 rounded-lg hover:bg-gray-700 mt-2'>
                  <Users className='w-5 h-5 mr-2' />
                  <span>Kelola User</span>
                </Link>
                <div className='mt-4 border-t border-gray-700 pt-4'>
                  <LogoutButton />
                </div>
              </nav>
            </div>

            {/* Backdrop overlay */}
            {isSidebarOpen && (
              <div
                className='fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300'
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            {/* Main content */}
            <div className='flex-1 bg-gray-100 md:ml-0 pt-14 md:pt-0'>
              {children}
              <Toaster position='top-right' />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
