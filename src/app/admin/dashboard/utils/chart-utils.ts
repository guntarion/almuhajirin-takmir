// src/app/admin/dashboard/utils/chart-utils.ts
import { ActivityStats, ActivityType } from '@/lib/types/activity';

// Color configurations for different activity types
export const ACTIVITY_COLORS: Record<ActivityType, string> = {
  'PAGE_VIEW': '#4ade80',
  'LOGIN': '#3b82f6', 
  'POST_CREATE': '#f59e0b',
  'COMMENT_CREATE': '#ec4899',
};

// Chart data types
// Transform activity stats into bar chart data
export function prepareBarChartData(stats: ActivityStats): Array<Record<string, string | number>> {
  return [
    { label: 'Total', value: stats.total },
    { label: 'Today', value: stats.today }
  ];
}

// Transform activity stats into pie chart data
export function preparePieChartData(stats: ActivityStats): Array<{ name: string; value: number }> {
  return Object.entries(stats.byType).map(([type, value]) => ({
    name: type,
    value: value
  }));
}

// Safe metadata parsing with type checking
interface ActivityMetadata {
  url: string;
  method?: string;
  userAgent?: string | null;
  timestamp?: string;
  [key: string]: string | null | undefined;
}

export function parseActivityMetadata(metadataStr: string): ActivityMetadata {
  try {
    const parsed = JSON.parse(metadataStr);
    if (typeof parsed === 'object' && parsed !== null && typeof parsed.url === 'string') {
      return parsed as ActivityMetadata;
    }
    return { url: 'Invalid URL' };
  } catch (error) {
    console.error('Error parsing activity metadata:', error);
    return { url: 'Invalid URL' };
  }
}
