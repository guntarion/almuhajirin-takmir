import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { ActivityStats } from '@/lib/types/activity';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { ActivityList } from './components/ActivityList';
import { prepareBarChartData, preparePieChartData } from './utils/chart-utils';

async function fetchActivityStats(): Promise<ActivityStats> {
  const response = await fetch('/api/admin/analytics/users');
  if (!response.ok) {
    throw new Error('Failed to fetch activity statistics');
  }
  return response.json();
}

export function UsersAnalytics() {
  const { data, isLoading, error } = useQuery<ActivityStats>({
    queryKey: ['activityStats'],
    queryFn: fetchActivityStats,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>User Activity Analytics</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] animate-pulse bg-gray-200 rounded-lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>User Activity Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-red-500">
              Error: {error instanceof Error ? error.message : 'Failed to load data'}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Total vs Today&apos;s Activity</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <BarChart 
              data={prepareBarChartData(data)}
              xKey="label"
              yKey="value"
              aria-label="Bar chart showing total vs today's activities"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Types</CardTitle>
            <CardDescription>Distribution by activity type</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <PieChart 
              data={preparePieChartData(data)} 
              height={300}
              aria-label="Pie chart showing distribution of activity types"
            />
          </CardContent>
        </Card>
      </div>

      <ActivityList activities={data.recentActivities} />
    </div>
  );
}
