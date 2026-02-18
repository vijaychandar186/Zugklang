import { NextAuthConfig } from 'next-auth';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './db';

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [Github, Google],
  pages: {
    signIn: '/signin'
  },
  callbacks: {
    async signIn() {
      return true;
    },
    async session({ session }) {
      return session;
    }
  }
} satisfies NextAuthConfig;

export default authConfig;
