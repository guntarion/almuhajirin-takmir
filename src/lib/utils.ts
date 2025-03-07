/**
 * File: src/lib/utils.ts
 * Utility functions for the application
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge
 * This allows for dynamic class names while properly handling Tailwind CSS conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate user level based on points
 * Uses a progressive scaling formula to determine level
 */
export function getLevel(points: number): number {
  // Base points needed for level 1
  const basePoints = 50;
  // Scaling factor for level progression
  const scalingFactor = 1.1;

  let level = 1;
  let accumulatedPoints = 0;
  let pointsForNextLevel = basePoints;

  while (accumulatedPoints + pointsForNextLevel <= points) {
    accumulatedPoints += pointsForNextLevel;
    level++;
    pointsForNextLevel = Math.floor(basePoints * Math.pow(scalingFactor, level - 1));
  }

  return level;
}

/**
 * Get user rank based on level
 * Returns a military-style rank that progresses with level
 */
export function getRank(level: number): string {
  if (level < 5) return 'Rekrut';
  if (level < 15) return 'Kopral';
  if (level < 25) return 'Sersan';
  if (level < 35) return 'Letnan Dua';
  if (level < 45) return 'Brigadir Jenderal';
  if (level < 50) return 'Kolonel';
  if (level < 55) return 'Letnan Kolonel';
  if (level < 60) return 'Mayor Jenderal';
  if (level < 65) return 'Jenderal';
  if (level < 75) return 'Jenderal Besar';
  if (level < 80) return 'Marshal';
  if (level < 85) return 'Admiral Galaksi';
  if (level < 90) return 'Penjaga Kosmos';
  return 'Legenda Galaksi';
}

/**
 * Calculate progress percentage towards next level based on points
 * Returns a number between 0-100 representing percentage progress
 */
export function getProgress(points: number): number {
  // Base points needed for level 1
  const basePoints = 50;
  // Scaling factor for level progression
  const scalingFactor = 1.1;

  let accumulatedPoints = 0;
  let pointsForNextLevel = basePoints;

  while (accumulatedPoints + pointsForNextLevel <= points) {
    accumulatedPoints += pointsForNextLevel;
    pointsForNextLevel = Math.floor(basePoints * Math.pow(scalingFactor, getLevel(points) - 1));
  }

  const progressToNextLevel = points - accumulatedPoints;
  return Math.min(100, Math.floor((progressToNextLevel / pointsForNextLevel) * 100));
}
