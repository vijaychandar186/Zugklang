import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/db';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

  const variant = req.nextUrl.searchParams.get('variant') ?? 'standard';
  const userId = session.user.id;

  const [user, ratingRow] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, image: true }
    }),
    prisma.rating.findUnique({
      where: { userId_variant: { userId, variant } },
      select: { rating: true }
    })
  ]);

  return Response.json({
    name: user?.name ?? null,
    image: user?.image ?? null,
    rating: ratingRow?.rating ?? null
  });
}
