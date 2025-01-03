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
  ],
  koordinator_anakremas: ['/koordinator', '/koordinator/dashboard', '/anakremas', '/anakremas/dashboard', '/aktivitas', '/leaderboard', '/profil'],
  anakremas: ['/anakremas', '/anakremas/dashboard', '/aktivitas', '/leaderboard', '/profil'],
  orangtuawali: ['/orangtua', '/orangtua/dashboard', '/leaderboard', '/profil'],
};

// Helper function to check if a path matches any of the allowed routes
const isPathAllowed = (path: string, allowedRoutes: string[]): boolean => {
  return allowedRoutes.some((route) => path.startsWith(route));
};

export default withAuth(
  // Simple middleware that lets NextAuth.js handle everything
  function middleware() {
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
     * Match all request paths except:
     * 1. _next/static (static files)
     * 2. _next/image (image optimization files)
     * 3. favicon.ico (favicon file)
     * 4. public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
