/**
 * File: src/lib/types/activity.ts
 * Types and validation schemas for activity management
 */

import { z } from 'zod';
import { ActivityCategory, ActivityType } from '../constants/activity';

// Zod schema for activity validation
export const activityFormSchema = z.object({
  id: z.string().optional(), // Optional for create, required for update
  name: z.string().min(3, 'Nama aktivitas minimal 3 karakter'),
  category: z.nativeEnum(ActivityCategory),
  type: z.nativeEnum(ActivityType),
  userCategories: z.string(), // Stored as comma-separated string
  minFrequency: z.number().min(1, 'Frekuensi minimal harus 1'),
  maxFrequency: z.number().min(1, 'Frekuensi maksimal harus lebih besar dari 0'),
  basePoints: z.number().min(1, 'Poin dasar harus lebih besar dari 0'),
  description: z.string().optional(),
  icon: z.string().optional(),
  isNegative: z.boolean().default(false),
  needsProof: z.boolean().default(false),
  validationRoles: z.string(), // Stored as comma-separated string
  active: z.boolean().default(true),
});

// Type for activity form data
export type ActivityFormData = z.infer<typeof activityFormSchema>;

// Type for activity data from database
export interface Activity extends ActivityFormData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Type for activity table display
export interface ActivityTableItem {
  id: string;
  name: string;
  category: keyof typeof ActivityCategory;
  type: keyof typeof ActivityType;
  basePoints: number;
  active: boolean;
  userCategories: string;
  createdAt: Date;
  updatedAt: Date;
}
