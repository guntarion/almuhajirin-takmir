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

  // Sample categories - these would typically come from an API/database
  const categories = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'pengumuman', label: 'Pengumuman' },
    { value: 'kegiatan', label: 'Kegiatan' },
    { value: 'kajian', label: 'Kajian' },
    { value: 'rapat', label: 'Rapat' },
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
