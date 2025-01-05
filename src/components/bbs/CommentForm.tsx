'use client';

/**
 * File: src/components/bbs/CommentForm.tsx
 * Description: Form component for adding new comments to a post.
 * Includes form validation, character limit, and loading state handling.
 */

import { useState, FormEvent } from 'react';
import { Button } from '../../components/ui/button';

interface CommentFormProps {
  postId: string;
  onSubmit?: (comment: string) => Promise<void>;
  onCancel?: () => void;
}

const MAX_CHARS = 1000;

export default function CommentForm({ postId, onSubmit, onCancel }: CommentFormProps) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const remainingChars = MAX_CHARS - comment.length;
  const isOverLimit = remainingChars < 0;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset error state
    setError('');

    // Validate comment
    if (!comment.trim()) {
      setError('Komentar tidak boleh kosong');
      return;
    }

    if (isOverLimit) {
      setError(`Komentar melebihi batas ${MAX_CHARS} karakter`);
      return;
    }

    try {
      setIsSubmitting(true);
      // TODO: Replace with actual API call
      console.log('Submitting comment for post:', postId);
      await onSubmit?.(comment.trim());
      setComment(''); // Clear form on success
    } catch (err) {
      setError('Gagal mengirim komentar. Silakan coba lagi.');
      console.error('Error submitting comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setComment('');
    setError('');
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='relative'>
        <textarea
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            setError(''); // Clear error when user types
          }}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 min-h-[120px] resize-y ${
            error ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
          }`}
          placeholder='Tulis komentar Anda...'
          disabled={isSubmitting}
          aria-label='Tulis komentar'
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'comment-error' : undefined}
        />

        {/* Character counter */}
        <div className={`absolute bottom-3 right-3 text-sm ${isOverLimit ? 'text-red-500' : 'text-gray-400'}`}>{remainingChars} karakter tersisa</div>
      </div>

      {/* Error message */}
      {error && (
        <p id='comment-error' className='text-sm text-red-500 mt-1'>
          {error}
        </p>
      )}

      {/* Action Buttons */}
      <div className='flex justify-end gap-3'>
        <Button type='button' variant='outline' onClick={handleCancel} disabled={isSubmitting} className='text-gray-700 hover:bg-gray-100'>
          Batal
        </Button>
        <Button
          type='submit'
          disabled={isSubmitting || isOverLimit || !comment.trim()}
          className='bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isSubmitting ? (
            <>
              <svg className='animate-spin -ml-1 mr-2 h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                />
              </svg>
              Mengirim...
            </>
          ) : (
            'Kirim Komentar'
          )}
        </Button>
      </div>

      {/* Note about moderation */}
      <p className='text-sm text-gray-500'>* Komentar akan ditampilkan setelah dimoderasi oleh admin</p>
    </form>
  );
}
