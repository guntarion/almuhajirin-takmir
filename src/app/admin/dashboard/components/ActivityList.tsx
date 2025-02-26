// src/app/admin/dashboard/components/ActivityList.tsx
import { ActivityType } from "@/lib/types/activity";
import { ACTIVITY_COLORS, parseActivityMetadata } from "../utils/chart-utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityListProps {
  activities: Array<{
    id: string;
    type: ActivityType;
    metadata: string;
    date: string;
    userName: string;
  }>;
}

export function ActivityList({ activities }: ActivityListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Last 10 user activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const metadata = parseActivityMetadata(activity.metadata);
            return (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 border rounded-lg"
                role="listitem"
                tabIndex={0}
              >
                <div>
                  <p className="font-medium" aria-label={`User: ${activity.userName}`}>
                    {activity.userName}
                  </p>
                  <p 
                    className="text-sm text-gray-500"
                    aria-label={`URL: ${metadata.url}`}
                  >
                    {metadata.url}
                  </p>
                  <p 
                    className="text-xs text-gray-400"
                    aria-label={`Date: ${new Date(activity.date).toLocaleString()}`}
                  >
                    {new Date(activity.date).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-1 text-xs font-medium rounded-full"
                    style={{
                      backgroundColor: `${ACTIVITY_COLORS[activity.type]}20`,
                      color: ACTIVITY_COLORS[activity.type]
                    }}
                    aria-label={`Activity type: ${activity.type}`}
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
  );
}
