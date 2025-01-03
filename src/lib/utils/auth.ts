// src/lib/utils/auth.ts

import { getServerSession } from 'next-auth';
import { authOptions } from '../auth';
import { UserRole, type AuthSession } from '../types/auth';
import { redirect } from 'next/navigation';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export const ROLES_HIERARCHY = {
  admin: ['admin', 'takmir', 'marbot', 'orangtuawali', 'koordinator_anakremas', 'anakremas'],
  takmir: ['takmir', 'marbot', 'orangtuawali', 'koordinator_anakremas', 'anakremas'],
  marbot: ['marbot', 'orangtuawali', 'koordinator_anakremas', 'anakremas'],
  orangtuawali: ['orangtuawali'],
  koordinator_anakremas: ['koordinator_anakremas', 'anakremas'],
  anakremas: ['anakremas'],
};

export function canAccess(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLES_HIERARCHY[userRole]?.includes(requiredRole) ?? false;
}

export function checkAccess(session: AuthSession | null, requiredRole: UserRole) {
  if (!session) {
    redirect('/login');
  }

  const hasAccess = canAccess(session.user.role, requiredRole);
  if (!hasAccess) {
    redirect('/unauthorized');
  }
}

export const DEFAULT_REDIRECT_PATH: Record<UserRole, string> = {
  admin: '/admin/dashboard',
  takmir: '/takmir/dashboard',
  marbot: '/marbot/dashboard',
  orangtuawali: '/orangtua/dashboard',
  koordinator_anakremas: '/koordinator/dashboard',
  anakremas: '/dashboard',
};

export function getRedirectPath(role: UserRole): string {
  return DEFAULT_REDIRECT_PATH[role] ?? '/dashboard';
}

export const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password'];
