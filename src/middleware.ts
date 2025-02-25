import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createActivityMetadata, getActivityType } from './lib/types/activity';

export async function middleware(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('next-auth.session-token')?.value;
    
    // Only track activity if there's a session token
    if (sessionToken) {
      const url = request.nextUrl.pathname;
      const method = request.method;
      const userAgent = request.headers.get('user-agent');
      
      // Get activity type and metadata
      const type = getActivityType(url, method);
      const metadata = createActivityMetadata(url, method, userAgent);

      // Get base URL from the request
      const baseUrl = request.nextUrl.origin;

      // Don't await this to avoid blocking the request
      fetch(`${baseUrl}/api/admin/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `next-auth.session-token=${sessionToken}`,
        },
        body: JSON.stringify({
          type,
          metadata,
          userId: '', // The server will validate and get the user ID from the session
        }),
      }).catch((error: Error) => {
        console.error('Error tracking user activity:', error);
      });
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

// Configure which routes should trigger the middleware
export const config = {
  matcher: [
    // Track all API routes
    '/api/:path*',
    // Track specific pages
    '/admin/:path*',
    '/bbs/:path*',
    '/profil',
    '/leaderboard',
    '/aktivitas',
  ],
}
