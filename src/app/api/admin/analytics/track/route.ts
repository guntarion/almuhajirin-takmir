import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import { query, isQueryError } from '../../../../../lib/db';
import { ActivityRequestBody, ActivityResponse } from '../../../../../lib/types/activity';

interface InsertResult {
  affectedRows: number;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      const response: ActivityResponse = { success: false, error: 'Unauthorized' };
      return NextResponse.json(response, { status: 401 });
    }

    const body = await request.json() as ActivityRequestBody;
    const { type, metadata } = body;
    
    // Use session user ID instead of the one from the request for security
    const userId = session.user.id;

    try {
      // Insert activity record using our query utility
      const result = await query<InsertResult>(
        'INSERT INTO user_activities (id, userId, type, metadata, date) VALUES (UUID(), ?, ?, ?, NOW())',
        [userId, type, JSON.stringify(metadata)]
      );

      if (result.affectedRows === 1) {
        const response: ActivityResponse = { success: true };
        return NextResponse.json(response);
      } else {
        throw new Error('Failed to insert activity record');
      }
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
    console.error('Error tracking activity:', error instanceof Error ? error.message : error);
    const response: ActivityResponse = { success: false, error: 'Failed to track activity' };
    return NextResponse.json(response, { status: 500 });
  }
}

// Ensure NodeJS runtime for MySQL compatibility
export const runtime = 'nodejs';
