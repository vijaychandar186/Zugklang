import { NextAuthConfig } from 'next-auth';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/db/db';
export const authConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [Github, Google],
  pages: {
    signIn: '/signin'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub!;
      return session;
    }
  }
} satisfies NextAuthConfig;
export default authConfig;
