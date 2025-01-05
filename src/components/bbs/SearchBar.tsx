'use client';

/**
 * File: src/components/bbs/SearchBar.tsx
 * Description: Search component for filtering BBS posts.
 * Uses the existing Input component from the UI library.
 * Includes debouncing to prevent too many rapid searches.
 */

import { Input } from '../../components/ui/input';
import { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch?: (searchTerm: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce search term to prevent too many rapid searches
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(searchTerm);
    }, 300); // Wait 300ms after last keystroke before triggering search

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  return (
    <div className='relative'>
      <Input
        type='search'
        placeholder='Cari pengumuman...'
        className='w-full pl-10'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <svg
        className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400'
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
      </svg>
    </div>
  );
}
