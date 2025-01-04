// src/components/ui/input.tsx
import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className='w-full'>
      {label && <label className='block text-sm font-medium mb-1'>{label}</label>}
      <input
        {...props}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
        } ${className}`}
      />
      {error && <p className='text-sm text-red-500 mt-1'>{error}</p>}
    </div>
  );
}
