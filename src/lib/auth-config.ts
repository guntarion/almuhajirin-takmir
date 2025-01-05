// src/lib/auth-config.ts
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcrypt';

declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
  }

  interface Session {
    user: User & {
      id: string;
      role: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        emailOrUsername: { label: 'Email/Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: credentials?.emailOrUsername }, { username: credentials?.emailOrUsername }],
          },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials?.password || '', user.password);

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
