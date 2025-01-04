// src/middleware.ts

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { UserRole } from './lib/types/auth';

// Define role-based route access with dashboard routes
const roleAccess: Record<UserRole, string[]> = {
  admin: [
    '/admin',
    '/admin/dashboard',
    '/takmir',
    '/takmir/dashboard',
    '/marbot',
    '/marbot/dashboard',
    '/koordinator',
    '/koordinator/dashboard',
    '/anakremas',
    '/anakremas/dashboard',
    '/orangtua',
    '/orangtua/dashboard',
    '/aktivitas',
    '/leaderboard',
    '/profil',
    '/home',
    '/kelola-user',
    '/api/users',
  ],
  takmir: [
    '/takmir',
    '/takmir/dashboard',
    '/marbot',
    '/marbot/dashboard',
    '/koordinator',
    '/koordinator/dashboard',
    '/anakremas',
    '/anakremas/dashboard',
    '/aktivitas',
    '/leaderboard',
    '/profil',
    '/home',
    '/kelola-user',
    '/api/users',
  ],
  marbot: [
    '/marbot',
    '/marbot/dashboard',
    '/koordinator',
    '/koordinator/dashboard',
    '/anakremas',
    '/anakremas/dashboard',
    '/aktivitas',
    '/leaderboard',
    '/profil',
    '/home',
  ],
  koordinator_anakremas: [
    '/koordinator',
    '/koordinator/dashboard',
    '/anakremas',
    '/anakremas/dashboard',
    '/aktivitas',
    '/leaderboard',
    '/home',
    '/profil',
  ],
  anakremas: ['/anakremas', '/anakremas/dashboard', '/aktivitas', '/leaderboard', '/home', '/profil'],
  orangtuawali: ['/orangtua', '/orangtua/dashboard', '/leaderboard', '/home', '/profil'],
};

// Helper function to check if a path matches any of the allowed routes
const isPathAllowed = (path: string, allowedRoutes: string[]): boolean => {
  return allowedRoutes.some((route) => path.startsWith(route));
};

export default withAuth(
  // Simple middleware that lets NextAuth.js handle everything
  function middleware(req) {
    const path = req.nextUrl.pathname;

    // Skip authentication for static assets and public folder
    if (
      path.startsWith('/_next') || // Next.js internal files
      path.startsWith('/public') || // Public folder
      path.startsWith('/favicon.ico') || // Favicon
      path.startsWith('/logo-yamr.png') || // Specific image
      path.startsWith('/file.svg') || // Other static files
      path.startsWith('/manifest.json') // Web app manifest
    ) {
      return NextResponse.next();
    }

    // Continue with authentication for other routes
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (!token) return false;

        const path = req.nextUrl.pathname;
        const userRole = token.role as UserRole;

        // If role is not valid, deny access
        if (!Object.values(UserRole).includes(userRole)) {
          return false;
        }

        // Get allowed routes for user role
        const allowedRoutes = roleAccess[userRole];

        // Check if user has access to the requested path
        return isPathAllowed(path, allowedRoutes);
      },
    },
    pages: {
      signIn: '/auth/login',
      error: '/auth/error',
    },
  }
);

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match specific routes that require authentication.
     * This approach explicitly defines which routes should be protected
     * rather than trying to exclude public assets.
     */
    '/admin/:path*',
    '/takmir/:path*',
    '/marbot/:path*',
    '/koordinator/:path*',
    '/anakremas/:path*',
    '/orangtua/:path*',
    '/aktivitas/:path*',
    '/leaderboard/:path*',
    '/profil/:path*',
    '/home/:path*',
    '/kelola-user/:path*',
    '/api/users/:path*',
  ],
};
