'use client';

/**
 * File: src/components/bbs/CreatePostForm.tsx
 * Description: Component for creating new posts with a simple text editor.
 * Includes form validation and preview functionality.
 */

import { useState } from 'react';
import { Button } from '../ui/button';
import { CreatePostData, PostCategory } from '../../lib/types/bbs';

interface CreatePostFormProps {
  onClose: () => void;
  onSubmit: (post: CreatePostData) => void;
}

export default function CreatePostForm({ onClose, onSubmit }: CreatePostFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory>('Pengumuman');
  const [isPreview, setIsPreview] = useState(false);

  const categories: PostCategory[] = ['Pengumuman', 'Kajian', 'Kegiatan', 'Rapat', 'Lainnya'];

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onSubmit({
      title,
      content,
      category,
    });
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto'>
        <div className='p-6 space-y-6'>
          <div className='flex justify-between items-center border-b pb-4'>
            <h2 className='text-2xl font-semibold text-gray-900'>{isPreview ? 'Preview Pengumuman' : 'Buat Pengumuman Baru'}</h2>
            <button onClick={onClose} className='text-gray-400 hover:text-gray-500' aria-label='Tutup'>
              <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>

          {isPreview ? (
            <div className='space-y-4'>
              <div className='bg-gray-50 p-4 rounded-lg'>
                <h3 className='text-xl font-semibold text-gray-900'>{title}</h3>
                <span className='inline-block mt-2 px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-full'>{category}</span>
                <div className='mt-4 prose max-w-none'>
                  {content.split('\n').map((paragraph, index) => (
                    <p key={index} className='text-gray-600'>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
              <div className='flex justify-end gap-4'>
                <Button type='button' variant='outline' onClick={() => setIsPreview(false)}>
                  Kembali Edit
                </Button>
                <Button type='button' onClick={handleSubmit}>
                  Terbitkan
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label htmlFor='title' className='block text-sm font-medium text-gray-700'>
                  Judul
                </label>
                <input
                  type='text'
                  id='title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  required
                  minLength={5}
                  maxLength={100}
                />
              </div>

              <div>
                <label htmlFor='category' className='block text-sm font-medium text-gray-700'>
                  Kategori
                </label>
                <select
                  id='category'
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PostCategory)}
                  className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor='content' className='block text-sm font-medium text-gray-700'>
                  Konten
                </label>
                <div className='mt-1 border border-gray-300 rounded-md shadow-sm'>
                  <div className='bg-gray-50 px-3 py-2 border-b border-gray-300'>
                    <div className='flex gap-2'>
                      <button
                        type='button'
                        onClick={() => setContent(content + '**Teks Tebal**')}
                        className='p-1 hover:bg-gray-200 rounded'
                        title='Teks Tebal'
                      >
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                        </svg>
                      </button>
                      {/* Add more formatting buttons as needed */}
                    </div>
                  </div>
                  <textarea
                    id='content'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    className='block w-full border-0 p-3 text-gray-900 placeholder-gray-400 focus:ring-0'
                    placeholder='Tulis konten pengumuman di sini...'
                    required
                  />
                </div>
                <p className='mt-2 text-sm text-gray-500'>Gunakan format teks sederhana untuk menyusun konten.</p>
              </div>

              <div className='flex justify-end gap-4'>
                <Button type='button' variant='outline' onClick={onClose}>
                  Batal
                </Button>
                <Button type='button' onClick={() => setIsPreview(true)}>
                  Preview
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
