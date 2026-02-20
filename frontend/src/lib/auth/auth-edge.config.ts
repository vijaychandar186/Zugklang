import { NextAuthConfig } from 'next-auth';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

export const authEdgeConfig = {
  providers: [Github, Google],
  pages: {
    signIn: '/signin'
  }
} satisfies NextAuthConfig;

export default authEdgeConfig;
