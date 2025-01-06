// src/components/ui/form-components.tsx
import * as React from 'react';
import { cn } from '../../lib/utils';

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function FormItem({ className, children, ...props }: FormItemProps) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {children}
    </div>
  );
}

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export function FormLabel({ className, children, ...props }: FormLabelProps) {
  return (
    <label className={cn('block text-sm font-medium text-gray-700', className)} {...props}>
      {children}
    </label>
  );
}

interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function FormControl({ className, children, ...props }: FormControlProps) {
  return (
    <div className={cn('mt-1', className)} {...props}>
      {children}
    </div>
  );
}

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function FormMessage({ className, children, ...props }: FormMessageProps) {
  return (
    <p className={cn('text-sm text-red-600', className)} {...props}>
      {children}
    </p>
  );
}

import { Control, FieldValues, Path, UseFormRegisterReturn } from 'react-hook-form';

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  render: (props: { field: UseFormRegisterReturn<Path<T>> }) => React.ReactNode;
}

export function FormField<T extends FieldValues>({ control, name, render }: FormFieldProps<T>) {
  const field = control.register(name);
  return render({ field });
}
