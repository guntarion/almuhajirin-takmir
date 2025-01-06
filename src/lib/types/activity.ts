// src/lib/types/activity.ts
import { z } from 'zod';

export interface Activity {
  id: string;
  name: string;
  category: string;
  type: string;
  userCategories: string;
  minFrequency: number;
  maxFrequency: number;
  basePoints: number;
  description?: string;
  icon?: string;
  isNegative: boolean;
  needsProof: boolean;
  validationRoles: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export const activityFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  type: z.string().min(1, 'Type is required'),
  userCategories: z.string().min(1, 'User categories are required'),
  minFrequency: z.number().min(1, 'Minimum frequency must be at least 1'),
  maxFrequency: z.number().min(1, 'Maximum frequency must be at least 1'),
  basePoints: z.number().min(0, 'Base points must be a positive number'),
  description: z.string().optional(),
  icon: z.string().optional(),
  isNegative: z.boolean(),
  needsProof: z.boolean(),
  validationRoles: z.string().min(1, 'Validation roles are required'),
  active: z.boolean(),
});

export type ActivityFormData = z.infer<typeof activityFormSchema>;
