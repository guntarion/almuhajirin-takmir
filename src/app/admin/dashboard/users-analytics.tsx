import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { ActivityType } from '@/lib/types/activity';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';

interface ActivityStats {
  total: number;
  today: number;
  byType: Record<ActivityType, number>;
  recentActivities: Array<{
    id: string;
    type: ActivityType;
    metadata: string;
    date: string;
    userName: string;
  }>;
}

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
          </CardHeader>
          <CardContent>Loading...</CardContent>
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
          <CardContent>Error: {error instanceof Error ? error.message : 'Failed to load data'}</CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const typeColors: Record<ActivityType, string> = {
    'PAGE_VIEW': '#4ade80',
    'LOGIN': '#3b82f6',
    'POST_CREATE': '#f59e0b',
    'COMMENT_CREATE': '#ec4899',
  };

  // Prepare data for charts
  const barChartData = {
    labels: ['Total', 'Today'],
    datasets: [{
      data: [data.total, data.today],
      backgroundColor: ['#3b82f6', '#4ade80'],
    }]
  };

  const pieChartData = {
    labels: Object.keys(data.byType),
    datasets: [{
      data: Object.values(data.byType),
      backgroundColor: Object.keys(data.byType).map(type => typeColors[type as ActivityType]),
    }]
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Total vs Today&apos;s Activity</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <BarChart data={barChartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Types</CardTitle>
            <CardDescription>Distribution by activity type</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <PieChart data={pieChartData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Last 10 user activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentActivities.map((activity) => {
              const metadata = JSON.parse(activity.metadata);
              return (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{activity.userName}</p>
                    <p className="text-sm text-gray-500">{metadata.url}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(activity.date).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-1 text-xs font-medium rounded-full"
                      style={{ backgroundColor: typeColors[activity.type] + '20', color: typeColors[activity.type] }}
                    >
                      {activity.type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
