// src/lib/types/auth.ts

import { UserRole } from '@prisma/client';
export { UserRole };

export interface LoginFormData {
  emailOrUsername: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  name: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  groupId?: string;
  associatedAnakremas?: string;
}

export interface SessionUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  groupId?: string;
}

export interface AuthSession {
  user: SessionUser;
}
