// src/app/api/auth/[...nextauth]/route.ts

import { compare } from 'bcryptjs';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '../../../../lib/prisma';
import { UserRole } from '../../../../lib/types/auth';

declare module 'next-auth' {
  interface User {
    role: UserRole;
    groupId?: string;
  }

  interface Session {
    user: User & {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      groupId?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    groupId?: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        emailOrUsername: { label: 'Email/Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.emailOrUsername || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: credentials.emailOrUsername }, { username: credentials.emailOrUsername }],
          },
        });

        if (!user || !user.active) {
          throw new Error('Invalid credentials');
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as UserRole,
          groupId: user.groupId || undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          groupId: user.groupId,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          groupId: token.groupId,
        },
      };
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);

export const {
  handlers: { GET, POST },
} = NextAuth(authOptions);
