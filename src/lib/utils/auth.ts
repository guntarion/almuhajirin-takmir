// src/lib/utils/auth.ts

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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
  [UserRole.ADMIN]: [UserRole.ADMIN, UserRole.TAKMIR, UserRole.MARBOT, UserRole.ORANGTUAWALI, UserRole.KOORDINATOR_ANAKREMAS, UserRole.ANAKREMAS],
  [UserRole.TAKMIR]: [UserRole.TAKMIR, UserRole.MARBOT, UserRole.ORANGTUAWALI, UserRole.KOORDINATOR_ANAKREMAS, UserRole.ANAKREMAS],
  [UserRole.MARBOT]: [UserRole.MARBOT, UserRole.ORANGTUAWALI, UserRole.KOORDINATOR_ANAKREMAS, UserRole.ANAKREMAS],
  [UserRole.ORANGTUAWALI]: [UserRole.ORANGTUAWALI],
  [UserRole.KOORDINATOR_ANAKREMAS]: [UserRole.KOORDINATOR_ANAKREMAS, UserRole.ANAKREMAS],
  [UserRole.ANAKREMAS]: [UserRole.ANAKREMAS],
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
  [UserRole.ADMIN]: '/admin/dashboard',
  [UserRole.TAKMIR]: '/takmir/dashboard',
  [UserRole.MARBOT]: '/marbot/dashboard',
  [UserRole.ORANGTUAWALI]: '/orangtua/dashboard',
  [UserRole.KOORDINATOR_ANAKREMAS]: '/koordinator/dashboard',
  [UserRole.ANAKREMAS]: '/dashboard',
};

export function getRedirectPath(role: UserRole): string {
  return DEFAULT_REDIRECT_PATH[role] ?? '/dashboard';
}

export const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password'];
