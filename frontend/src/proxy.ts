import NextAuth from 'next-auth';
import authConfig from './lib/auth/auth.config';

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const session = req.auth;

  if (!session?.user) {
    const signInUrl = new URL('/signin', req.url);
    signInUrl.searchParams.set('callbackUrl', req.url);
    return Response.redirect(signInUrl);
  }
});

export const config = {
  matcher: ['/play/:path*', '/tools/:path*', '/practice/:path*']
};