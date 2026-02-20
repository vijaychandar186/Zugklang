import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/db';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

  const { userId } = await params;
  const variant = req.nextUrl.searchParams.get('variant') ?? 'standard';

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

  if (!user) return new Response('Not found', { status: 404 });

  return Response.json({
    name: user.name ?? 'Opponent',
    image: user.image ?? null,
    rating: ratingRow?.rating ?? null
  });
}
