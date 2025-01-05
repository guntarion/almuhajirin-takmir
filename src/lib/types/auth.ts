// src/lib/types/auth.ts

export enum UserRole {
  ANAK_REMAS = 'ANAK_REMAS',
  ORANG_TUA = 'ORANG_TUA',
  ADMIN = 'ADMIN',
}

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
