import NextAuth from 'next-auth';
import authConfig from './server/auth.config';

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const session = req.auth;

  if (!session?.user) return Response.redirect(new URL('/signin', req.url));
});

export const config = {
  matcher: ['/play/:path*', '/tools/:path*', '/practice/:path*']
};
