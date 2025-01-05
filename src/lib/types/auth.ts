// src/lib/types/auth.ts

export enum UserRole {
  KOORDINATOR_ANAKREMAS = 'KOORDINATOR_ANAKREMAS',
  ANAK_REMAS = 'ANAK_REMAS',
  MARBOT = 'MARBOT',
  TAKMIR = 'TAKMIR',
  ADMIN = 'ADMIN',
  ORANG_TUA = 'ORANG_TUA',
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
