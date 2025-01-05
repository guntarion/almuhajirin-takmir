// src/middleware.ts

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { UserRole } from './lib/types/auth';

// Create a type-safe array of UserRole values
const userRoles = Object.values(UserRole) as UserRole[];

// Define role-based route access with dashboard routes
const roleAccess: Record<UserRole, string[]> = {
  ADMIN: [
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
    '/bbs',
    '/kelola-user',
    '/api/users',
  ],
  ORANG_TUA: ['/orangtua', '/orangtua/dashboard', '/leaderboard', '/home', '/bbs', '/profil'],
  ANAK_REMAS: ['/anakremas', '/anakremas/dashboard', '/aktivitas', '/leaderboard', '/home', '/bbs', '/profil'],
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
        if (!token) {
          console.log('Middleware - No token found');
          return false;
        }

        const path = req.nextUrl.pathname;
        const userRole = token.role as UserRole;

        // console.log('Middleware - Full Token:', token);
        // console.log('Middleware - User Role:', userRole);
        // console.log('Middleware - Requested Path:', path);

        // If role is not defined, redirect to login
        if (!userRole) {
          console.log('Middleware - Role not found in token');
          return false;
        }

        // If role is not valid, deny access
        if (!userRoles.includes(userRole)) {
          console.log('Middleware - Invalid role:', userRole);
          return false;
        }

        // Get allowed routes for user role
        const allowedRoutes = roleAccess[userRole];
        // console.log('Middleware - Allowed Routes:', allowedRoutes);

        // Check if user has access to the requested path
        const isAllowed = isPathAllowed(path, allowedRoutes);
        // console.log('Middleware - Access Granted:', isAllowed);
        return isAllowed;
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
    '/kelola-user',
    '/kelola-user/:path*',
    '/api/users/:path*',
  ],
};
