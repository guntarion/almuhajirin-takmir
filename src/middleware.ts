// src/middleware.ts

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserRole } from './lib/types/auth';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/api/auth',
  '/_next',
  '/favicon.ico',
  '/manifest.json',
  '/icons',
];

// Define role-based route access with dashboard routes
const roleAccess: Record<UserRole, string[]> = {
  [UserRole.ADMIN]: [
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
  [UserRole.TAKMIR]: [
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
  [UserRole.MARBOT]: [
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
  [UserRole.KOORDINATOR_ANAKREMAS]: [
    '/koordinator',
    '/koordinator/dashboard',
    '/anakremas',
    '/anakremas/dashboard',
    '/aktivitas',
    '/leaderboard',
    '/profil',
  ],
  [UserRole.ANAKREMAS]: ['/anakremas', '/anakremas/dashboard', '/aktivitas', '/leaderboard', '/profil'],
  [UserRole.ORANGTUAWALI]: ['/orangtua', '/orangtua/dashboard', '/leaderboard', '/profil'],
};

// Helper function to check if a path matches any of the allowed routes
const isPathAllowed = (path: string, allowedRoutes: string[]): boolean => {
  return allowedRoutes.some((route) => path.startsWith(route));
};

// Helper function to check if a path is public
const isPublicPath = (path: string): boolean => {
  return publicRoutes.some(
    (route) =>
      path === route ||
      path.startsWith('/api/auth/') ||
      path.startsWith('/_next/') ||
      path.startsWith('/favicon.ico') ||
      path.startsWith('/manifest.json') ||
      path.startsWith('/icons/')
  );
};

export default withAuth(
  function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const token = request.cookies.get('next-auth.session-token')?.value;

    // Allow public routes
    if (isPublicPath(path)) {
      return NextResponse.next();
    }

    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(loginUrl);
    }

    // Check role-based access
    const parsedToken = JSON.parse(token);
    const userRole = parsedToken.role as UserRole;
    const allowedRoutes = roleAccess[userRole];

    if (!allowedRoutes || !isPathAllowed(path, allowedRoutes)) {
      // Redirect to default route based on role
      const defaultRoute = roleAccess[userRole][0] || '/';
      return NextResponse.redirect(new URL(defaultRoute, request.url));
    }

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
