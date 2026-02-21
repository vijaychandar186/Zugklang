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

  if (category) {
    // Specific category rating (for rated timed standard games)
    const ratingRow = await prisma.rating.findUnique({
      where: { userId_category: { userId, category } },
      select: { rating: true }
    });
    return Response.json({ rating: ratingRow?.rating ?? 700 });
  }

  // No specific category — return the most-played category's rating for display
  const best = await prisma.rating.findFirst({
    where: { userId },
    orderBy: { gameCount: 'desc' },
    select: { rating: true }
  });
  return Response.json({ rating: best?.rating ?? 700 });
}
