/**
 * File: src/components/ui/select.tsx
 * Reusable select component with error handling
 */

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, children, error, ...props }, ref) => {
  return (
    <div className='w-full'>
      <select
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      {error && <p className='mt-1 text-xs text-red-500'>{error}</p>}
    </div>
  );
});
Select.displayName = 'Select';

export { Select };
