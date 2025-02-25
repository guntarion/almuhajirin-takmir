import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import { query, isQueryError } from '../../../../../lib/db';
import { ActivityType } from '../../../../../lib/types/activity';

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

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      // Get total activities
      const totalResult = await query<[{ total: number }]>(
        'SELECT COUNT(*) as total FROM user_activities'
      );

      // Get today's activities
      const todayResult = await query<[{ today: number }]>(
        'SELECT COUNT(*) as today FROM user_activities WHERE DATE(date) = CURDATE()'
      );

      // Get activities by type
      const byTypeResult = await query<Array<{ type: ActivityType; count: number }>>(
        'SELECT type, COUNT(*) as count FROM user_activities GROUP BY type'
      );

      // Get recent activities with user names
      const recentResult = await query<Array<{
        id: string;
        type: ActivityType;
        metadata: string;
        date: string;
        userName: string;
      }>>(
        `SELECT 
          a.id,
          a.type,
          a.metadata,
          a.date,
          u.name as userName
        FROM user_activities a
        JOIN users u ON a.userId = u.id
        ORDER BY a.date DESC
        LIMIT 10`
      );

      // Format the response
      const stats: ActivityStats = {
        total: totalResult[0].total,
        today: todayResult[0].today,
        byType: byTypeResult.reduce((acc, { type, count }) => {
          acc[type] = count;
          return acc;
        }, {} as Record<ActivityType, number>),
        recentActivities: recentResult.map(activity => ({
          ...activity,
          date: new Date(activity.date).toISOString(),
        })),
      };

      return NextResponse.json(stats);
    } catch (dbError) {
      if (isQueryError(dbError)) {
        console.error('Database error:', {
          code: dbError.code,
          sqlState: dbError.sqlState,
          message: dbError.message
        });
      } else {
        console.error('Unknown database error:', dbError);
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Error fetching activity stats:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to fetch activity statistics' },
      { status: 500 }
    );
  }
}

// Ensure NodeJS runtime for MySQL compatibility
export const runtime = 'nodejs';
