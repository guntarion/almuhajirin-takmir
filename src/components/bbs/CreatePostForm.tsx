'use client';

/**
 * File: src/components/bbs/CreatePostForm.tsx
 * Description: Component for creating new posts with a simple text editor.
 * Includes form validation and preview functionality.
 */

// File: src/components/CreatePostForm.tsx

import React, { useState } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { Button } from '../../components/ui/button';

// Define TypeScript interfaces
interface CreatePostFormProps {
  onSubmit: (data: PostData) => void;
  onClose: () => void;
}

interface PostData {
  title: string;
  content: string;
  category: PostCategory;
}

type PostCategory = 'Pengumuman' | 'Kajian' | 'Kegiatan' | 'Rapat' | 'Lainnya';

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onSubmit, onClose }) => {
  // State management
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PostCategory>('Pengumuman');
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [isPreview, setIsPreview] = useState(false);

  // Available categories
  const categories: PostCategory[] = ['Pengumuman', 'Kajian', 'Kegiatan', 'Rapat', 'Lainnya'];

  // Handle form submission
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    onSubmit({
      title,
      content: JSON.stringify(rawContent),
      category,
    });
  };

  // Handle keyboard commands
  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  // Toggle inline styles (bold, italic, underline)
  const toggleInlineStyle = (style: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  // Toggle block types (H1, lists)
  const toggleBlockType = (type: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, type));
  };

  // Custom function to render preview content
  const renderPreviewContent = () => {
    const contentState = editorState.getCurrentContent();
    return contentState.getPlainText();
  };

  // Custom style map for the editor
  const styleMap = {
    BOLD: { fontWeight: 'bold' },
    ITALIC: { fontStyle: 'italic' },
    UNDERLINE: { textDecoration: 'underline' },
  };

  // Custom block style function
  const getBlockStyle = (block: Draft.ContentBlock) => {
    switch (block.getType()) {
      case 'header-one':
        return 'text-2xl font-bold my-4';
      case 'unordered-list-item':
        return 'list-disc ml-4';
      default:
        return '';
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='max-w-4xl w-full mx-4 bg-white rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto'>
        {isPreview ? (
          <div className='space-y-4'>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='text-xl font-semibold text-gray-900'>{title}</h3>
              <span className='inline-block mt-2 px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-full'>{category}</span>
              <div className='mt-4 prose max-w-none'>{renderPreviewContent()}</div>
            </div>
            <div className='flex justify-end gap-4'>
              <Button type='button' variant='outline' onClick={() => setIsPreview(false)}>
                Kembali Edit
              </Button>
              <Button type='button' variant='outline' onClick={onClose}>
                Batal
              </Button>
              <Button type='button' onClick={handleSubmit}>
                Terbitkan
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Title Input */}
            <div>
              <label htmlFor='title' className='block text-sm font-medium text-gray-700'>
                Judul
              </label>
              <input
                type='text'
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                required
              />
            </div>

            {/* Category Selection */}
            <div>
              <label htmlFor='category' className='block text-sm font-medium text-gray-700'>
                Kategori
              </label>
              <select
                id='category'
                value={category}
                onChange={(e) => setCategory(e.target.value as PostCategory)}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Rich Text Editor */}
            <div className='border rounded-lg'>
              {/* Editor Toolbar */}
              <div className='border-b p-2'>
                <div className='flex gap-2'>
                  <button type='button' onClick={() => toggleInlineStyle('BOLD')} className='p-1 hover:bg-gray-200 rounded font-bold'>
                    B
                  </button>
                  <button type='button' onClick={() => toggleInlineStyle('ITALIC')} className='p-1 hover:bg-gray-200 rounded italic'>
                    I
                  </button>
                  <button type='button' onClick={() => toggleInlineStyle('UNDERLINE')} className='p-1 hover:bg-gray-200 rounded underline'>
                    U
                  </button>
                  <button type='button' onClick={() => toggleBlockType('header-one')} className='p-1 hover:bg-gray-200 rounded font-bold'>
                    H1
                  </button>
                  <button type='button' onClick={() => toggleBlockType('unordered-list-item')} className='p-1 hover:bg-gray-200 rounded'>
                    •
                  </button>
                </div>
              </div>

              {/* Editor Content */}
              <div className='p-3'>
                <Editor
                  editorState={editorState}
                  onChange={setEditorState}
                  handleKeyCommand={handleKeyCommand}
                  customStyleMap={styleMap}
                  blockStyleFn={getBlockStyle}
                  placeholder='Tulis konten pengumuman di sini...'
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className='flex justify-end gap-4'>
              <Button type='button' variant='outline' onClick={() => setIsPreview(true)}>
                Preview
              </Button>
              <Button type='button' variant='outline' onClick={onClose}>
                Batal
              </Button>
              <Button type='submit'>Simpan</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreatePostForm;
