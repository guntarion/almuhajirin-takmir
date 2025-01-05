// src/components/ui/button.tsx
import { ReactNode } from 'react';

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'ghost';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: ButtonVariant;
}

export function Button({ children, onClick, className = '', type = 'button', disabled = false, variant = 'default' }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md font-medium transition-colors ${
        disabled
          ? 'bg-gray-300 cursor-not-allowed'
          : variant === 'destructive'
          ? 'bg-red-600 hover:bg-red-700 text-white'
          : variant === 'outline'
          ? 'border border-gray-300 hover:bg-gray-100'
          : variant === 'ghost'
          ? 'hover:bg-gray-100'
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      } ${className}`}
    >
      {children}
    </button>
  );
}
