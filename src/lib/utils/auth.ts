// src/lib/utils/auth.ts

import { getServerSession } from 'next-auth';
import { authOptions } from '../auth-config';
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
  ADMIN: ['ADMIN'],
  ORANG_TUA: ['ORANG_TUA'],
  ANAK_REMAS: ['ANAK_REMAS'],
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
  ADMIN: '/admin/home',
  ORANG_TUA: '/orangtua/home',
  ANAK_REMAS: '/home',
};

export function getRedirectPath(role: UserRole): string {
  return DEFAULT_REDIRECT_PATH[role] ?? '/home';
}

export const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password'];
