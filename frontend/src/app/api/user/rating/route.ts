import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/db';
import { NextRequest } from 'next/server';
import type { TimeCategory } from '@/lib/ratings/timeCategory';
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });
  const userId = session.user.id;
  const category = req.nextUrl.searchParams.get(
    'category'
  ) as TimeCategory | null;
  const variant = req.nextUrl.searchParams.get('variant') ?? 'standard';
  if (category) {
    const ratingRow = await prisma.rating.findUnique({
      where: { userId_variant_category: { userId, variant, category } },
      select: { rating: true }
    });
    return Response.json({ rating: ratingRow?.rating ?? 700 });
  }
  const best = await prisma.rating.findFirst({
    where: { userId, variant },
    orderBy: { gameCount: 'desc' },
    select: { rating: true }
  });
  return Response.json({ rating: best?.rating ?? 700 });
}
