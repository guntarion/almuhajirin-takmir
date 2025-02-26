/**
 * File: src/components/ui/modal.tsx
 * Modal component for displaying dialogs
 */

'use client';

import { useEffect } from 'react';
import { Button } from './button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      {/* Backdrop */}
      <div className='fixed inset-0 bg-black bg-opacity-50 transition-opacity' onClick={onClose} />

      {/* Modal */}
      <div className='flex min-h-full items-center justify-center p-4'>
        <div className='relative w-full max-w-2xl transform rounded-lg bg-white p-6 text-left shadow-xl transition-all'>
          {/* Header */}
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>{title}</h3>
            <Button variant='ghost' onClick={onClose} className='h-8 w-8 p-0' aria-label='Close'>
              ✕
            </Button>
          </div>

          {/* Content */}
          <div className='mt-2'>{children}</div>
        </div>
      </div>
    </div>
  );
}
