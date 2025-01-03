// src/lib/types/auth.ts

export enum UserRole {
  ADMIN = 'admin',
  TAKMIR = 'takmir',
  MARBOT = 'marbot',
  KOORDINATOR_ANAKREMAS = 'koordinator_anakremas',
  ANAKREMAS = 'anakremas',
  ORANGTUAWALI = 'orangtua_wali',
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
