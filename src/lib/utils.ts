// src/lib/utils.ts
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { rankData, levelData } from '@/lib/constants/achievement';

// Existing utility function for class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to get the level based on points
export const getLevel = (points: number) => {
  const level = levelData.find((l) => points >= l.startRange && points <= l.endRange);
  return level ? level.level : 1; // Default to level 1 if no level is found
};

// Function to get the rank based on level
export const getRank = (level: number) => {
  const rank = rankData.find((r) => level >= r.startRange && level <= r.endRange);
  return rank ? rank.rank : 'Rekrut'; // Default to 'Rekrut' if no rank is found
};

// Function to calculate progress toward the next level
export const getProgress = (points: number) => {
  const level = getLevel(points);
  const currentLevel = levelData.find((l) => l.level === level);
  const nextLevel = levelData.find((l) => l.level === level + 1);

  if (!currentLevel || !nextLevel) return 0; // If no next level, progress is 0

  const progress = ((points - currentLevel.startRange) / (nextLevel.startRange - currentLevel.startRange)) * 100;
  return Math.min(progress, 100); // Cap progress at 100%
};
