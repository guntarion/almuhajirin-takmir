'use client';

/**
 * File: src/components/bbs/CategoryFilter.tsx
 * Description: Dropdown component for filtering posts by category.
 * Uses the existing Select component from the UI library.
 */

import { Select } from '../../components/ui/select';
import { useState } from 'react';

interface CategoryFilterProps {
  onCategoryChange?: (category: string) => void;
}

export default function CategoryFilter({ onCategoryChange }: CategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Categories matching the ones used in CreatePostForm and database
  const categories = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'Pengumuman', label: 'Pengumuman' },
    { value: 'Kajian', label: 'Kajian' },
    { value: 'Kegiatan', label: 'Kegiatan' },
    { value: 'Rapat', label: 'Rapat' },
    { value: 'Lainnya', label: 'Lainnya' },
  ];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    onCategoryChange?.(newCategory);
  };

  return (
    <div className='w-48'>
      <Select value={selectedCategory} onChange={handleCategoryChange} options={categories} />
    </div>
  );
}
