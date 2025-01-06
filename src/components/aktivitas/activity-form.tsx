// src/components/aktivitas/activity-form.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';
import { ActivityFormData, activityFormSchema } from '../../lib/types/activity';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Form } from '../ui/form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form-components';

interface ActivityFormProps {
  initialData?: Partial<ActivityFormData>;
  onSubmit: (data: ActivityFormData) => void;
  isEditing?: boolean;
}

export function ActivityForm({ initialData, onSubmit, isEditing }: ActivityFormProps) {
  const form = useForm<ActivityFormData>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: initialData || {
      name: '',
      category: 'AKHLAK',
      type: 'TAMBAHAN',
      userCategories: 'mkidz',
      minFrequency: 1,
      maxFrequency: 1,
      basePoints: 10,
      description: '',
      icon: '',
      isNegative: false,
      needsProof: false,
      validationRoles: 'KOORDINATOR_ANAKREMAS,MARBOT,TAKMIR',
      active: true,
    },
  });

  return (
    <Form
      {...(form as UseFormReturn<ActivityFormData>)}
      onSubmit={(e: React.BaseSyntheticEvent) => {
        void form.handleSubmit((data) => {
          onSubmit(data as ActivityFormData);
        })(e);
      }}
    >
      <div className='space-y-6'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage>{form.formState.errors.name?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='category'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage>{form.formState.errors.category?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage>{form.formState.errors.description?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='isNegative'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Is Negative?</FormLabel>
              <FormControl>
                <Checkbox
                  {...field}
                  checked={form.watch('isNegative')}
                  onCheckedChange={(checked) => {
                    form.setValue('isNegative', checked);
                  }}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.isNegative?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='type'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage>{form.formState.errors.type?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='userCategories'
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Categories</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage>{form.formState.errors.userCategories?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='minFrequency'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Min Frequency</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  {...field}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    field.onChange({
                      target: {
                        name: field.name,
                        value: value,
                      },
                    });
                  }}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.minFrequency?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='maxFrequency'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Frequency</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  {...field}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    field.onChange({
                      target: {
                        name: field.name,
                        value: value,
                      },
                    });
                  }}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.maxFrequency?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='basePoints'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Points</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  {...field}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    field.onChange({
                      target: {
                        name: field.name,
                        value: value,
                      },
                    });
                  }}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.basePoints?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='icon'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage>{form.formState.errors.icon?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='needsProof'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Needs Proof?</FormLabel>
              <FormControl>
                <Checkbox
                  {...field}
                  checked={form.watch('needsProof')}
                  onCheckedChange={(checked) => {
                    form.setValue('needsProof', checked);
                  }}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.needsProof?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='validationRoles'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Validation Roles</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage>{form.formState.errors.validationRoles?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='active'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Active?</FormLabel>
              <FormControl>
                <Checkbox
                  {...field}
                  checked={form.watch('active')}
                  onCheckedChange={(checked) => {
                    form.setValue('active', checked);
                  }}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.active?.message}</FormMessage>
            </FormItem>
          )}
        />
        <Button type='submit'>{isEditing ? 'Update Activity' : 'Create Activity'}</Button>
      </div>
    </Form>
  );
}
