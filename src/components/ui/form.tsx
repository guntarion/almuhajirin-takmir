// src/components/ui/form.tsx
import * as React from 'react';
import { useForm, FormProvider, FieldValues, UseFormProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface FormProps<T extends FieldValues> {
  children: React.ReactNode;
  schema?: z.ZodSchema<T>;
  defaultValues?: UseFormProps<T>['defaultValues'];
  onSubmit: (data: T) => void;
}

export function Form<T extends FieldValues>({ children, schema, defaultValues, onSubmit }: FormProps<T>) {
  const methods = useForm<T>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
}
