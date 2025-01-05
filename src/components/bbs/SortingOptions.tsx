'use client';

/**
 * File: src/components/bbs/SortingOptions.tsx
 * Description: Dropdown component for sorting posts by different criteria.
 * Uses the existing Select component from the UI library.
 */

import { Select } from '../../components/ui/select';
import { useState } from 'react';

interface SortingOptionsProps {
  onSortChange?: (sortOption: string) => void;
}

export default function SortingOptions({ onSortChange }: SortingOptionsProps) {
  const [selectedSort, setSelectedSort] = useState('newest');

  // Sorting options
  const sortOptions = [
    { value: 'newest', label: 'Terbaru' },
    { value: 'oldest', label: 'Terlama' },
    { value: 'most_comments', label: 'Komentar Terbanyak' },
    { value: 'most_views', label: 'Dilihat Terbanyak' },
  ];

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    setSelectedSort(newSort);
    onSortChange?.(newSort);
  };

  return (
    <div className='w-48'>
      <Select value={selectedSort} onChange={handleSortChange} options={sortOptions} />
    </div>
  );
}
