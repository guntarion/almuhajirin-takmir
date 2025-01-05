'use client';

/**
 * File: src/components/bbs/EditPostForm.tsx
 * Description: Component for editing existing posts with a rich text editor.
 * Reuses functionality from CreatePostForm with modifications for editing.
 */

import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw, ContentBlock } from 'draft-js';
import React, { useState } from 'react';
import { stateToHTML } from 'draft-js-export-html';
import 'draft-js/dist/Draft.css';
import { Button } from '../ui/button';
import { toast } from 'react-hot-toast';

interface EditPostFormProps {
  postId: string;
  initialData: {
    title: string;
    content: string;
    category: PostCategory;
  };
  onClose: () => void;
  onUpdate: () => void;
}

type PostCategory = 'Pengumuman' | 'Kajian' | 'Kegiatan' | 'Rapat' | 'Lainnya';

const EditPostForm: React.FC<EditPostFormProps> = ({ postId, initialData, onClose, onUpdate }) => {
  // Initialize state with existing post data
  const [title, setTitle] = useState(initialData.title);
  const [category, setCategory] = useState<PostCategory>(initialData.category);
  const [editorState, setEditorState] = useState(() => {
    try {
      const contentState = convertFromRaw(JSON.parse(initialData.content));
      return EditorState.createWithContent(contentState);
    } catch {
      return EditorState.createEmpty();
    }
  });
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available categories
  const categories: PostCategory[] = ['Pengumuman', 'Kajian', 'Kegiatan', 'Rapat', 'Lainnya'];

  // Handle form submission
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);

    try {
      const contentState = editorState.getCurrentContent();
      const rawContent = convertToRaw(contentState);

      // Generate plain text excerpt from the first block of content
      const blocks = rawContent.blocks;
      const firstBlock = blocks[0];
      const excerptText = firstBlock.text.slice(0, 150) + (firstBlock.text.length > 150 ? '...' : '');

      const response = await fetch(`/api/bbs/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content: JSON.stringify(rawContent),
          excerpt: excerptText,
          category,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update post');
      }

      toast.success('Post berhasil diperbarui');
      onUpdate();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update post');
    } finally {
      setIsSubmitting(false);
    }
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

  // Convert Draft.js content to HTML for preview
  const renderPreviewContent = () => {
    const contentState = editorState.getCurrentContent();
    const options = {
      inlineStyles: {
        BOLD: { element: 'strong' },
        ITALIC: { element: 'em' },
        UNDERLINE: { element: 'u' },
      },
      blockStyleFn: (block: ContentBlock) => {
        const type = block.getType();
        if (type === 'header-one') {
          return {
            element: 'h1',
            attributes: {
              class: 'text-2xl font-bold my-4',
            },
          };
        }
        if (type === 'unordered-list-item') {
          return {
            element: 'li',
            wrapper: 'ul',
            attributes: {
              class: 'list-disc ml-4',
            },
          };
        }
      },
    };
    return stateToHTML(contentState, options);
  };

  // Custom style map for the editor
  const styleMap = {
    BOLD: { fontWeight: 'bold' },
    ITALIC: { fontStyle: 'italic' },
    UNDERLINE: { textDecoration: 'underline' },
  };

  // Custom block style function
  const getBlockStyle = (block: ContentBlock) => {
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
              <div className='mt-4 prose max-w-none' dangerouslySetInnerHTML={{ __html: renderPreviewContent() }} />
            </div>
            <div className='flex justify-end gap-4'>
              <Button type='button' variant='outline' onClick={() => setIsPreview(false)}>
                Kembali Edit
              </Button>
              <Button type='button' variant='outline' onClick={onClose}>
                Batal
              </Button>
              <Button type='button' onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Title Input */}
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Masukkan Judul'
              className='mt-1 block w-full px-3 py-2 text-sm
                border-2 border-gray-300 
                rounded-md 
                shadow-sm
                focus:outline-none 
                focus:border-blue-500 
                focus:ring-2 
                focus:ring-blue-500 
                focus:ring-opacity-50
                placeholder:text-gray-400'
              required
            />

            {/* Category Selection */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PostCategory)}
              className='mt-1 block w-full px-3 py-2 text-sm
                border-2 border-gray-300 
                rounded-md 
                shadow-sm
                focus:outline-none 
                focus:border-blue-500 
                focus:ring-2 
                focus:ring-blue-500 
                focus:ring-opacity-50
                bg-white'
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Rich Text Editor */}
            <div className='border-2 border-gray-300 rounded-lg overflow-hidden'>
              {/* Editor Toolbar */}
              <div className='border-b-2 border-gray-300 bg-gray-50 p-2'>
                <div className='flex gap-2'>
                  <button
                    type='button'
                    onClick={() => toggleInlineStyle('BOLD')}
                    className='p-2 hover:bg-gray-200 rounded-md font-bold min-w-[32px] 
                      border border-gray-300 hover:border-gray-400 
                      transition-colors'
                  >
                    B
                  </button>
                  <button
                    type='button'
                    onClick={() => toggleInlineStyle('ITALIC')}
                    className='p-2 hover:bg-gray-200 rounded-md italic min-w-[32px] 
                      border border-gray-300 hover:border-gray-400 
                      transition-colors'
                  >
                    I
                  </button>
                  <button
                    type='button'
                    onClick={() => toggleInlineStyle('UNDERLINE')}
                    className='p-2 hover:bg-gray-200 rounded-md underline min-w-[32px] 
                      border border-gray-300 hover:border-gray-400 
                      transition-colors'
                  >
                    U
                  </button>
                  <button
                    type='button'
                    onClick={() => toggleBlockType('header-one')}
                    className='p-2 hover:bg-gray-200 rounded-md font-bold min-w-[32px] 
                      border border-gray-300 hover:border-gray-400 
                      transition-colors'
                  >
                    H1
                  </button>
                  <button
                    type='button'
                    onClick={() => toggleBlockType('unordered-list-item')}
                    className='p-2 hover:bg-gray-200 rounded-md min-w-[32px] 
                      border border-gray-300 hover:border-gray-400 
                      transition-colors'
                  >
                    •
                  </button>
                </div>
              </div>
              {/* Editor Content */}
              <div className='p-4 min-h-[200px] bg-white'>
                <Editor
                  editorState={editorState}
                  onChange={setEditorState}
                  handleKeyCommand={handleKeyCommand}
                  customStyleMap={styleMap}
                  blockStyleFn={getBlockStyle}
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
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditPostForm;
