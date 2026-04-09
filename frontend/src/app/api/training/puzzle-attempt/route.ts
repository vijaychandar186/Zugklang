import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/db';
import { updatePuzzleRating, type GlickoPlayer } from '@/lib/ratings/glicko2';
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const { puzzleId, difficulty, rating, solved, usedHint } = body;
  if (!puzzleId || !difficulty || rating == null || solved == null) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const userId = session.user.id;
  const puzzleRating = Number(rating);
  const didSolve = Boolean(solved);
  const existingPuzzleRating = await prisma.puzzleRating.upsert({
    where: { userId },
    update: {},
    create: { userId }
  });
  const player: GlickoPlayer = {
    rating: existingPuzzleRating.rating,
    rd: existingPuzzleRating.rd,
    sigma: existingPuzzleRating.sigma
  };
  const { updated, delta } = updatePuzzleRating(player, puzzleRating, didSolve);
  const [attempt] = await prisma.$transaction([
    prisma.puzzleAttempt.create({
      data: {
        userId,
        puzzleId: String(puzzleId),
        difficulty: String(difficulty),
        rating: puzzleRating,
        solved: didSolve,
        usedHint: Boolean(usedHint ?? false)
      }
    }),
    prisma.puzzleRating.update({
      where: { userId },
      data: {
        rating: updated.rating,
        rd: updated.rd,
        sigma: updated.sigma,
        gameCount: { increment: 1 }
      }
    })
  ]);
  return NextResponse.json(
    { ...attempt, puzzleRatingDelta: delta },
    { status: 201 }
  );
}
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '500'), 500);
  const attempts = await prisma.puzzleAttempt.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      puzzleId: true,
      difficulty: true,
      rating: true,
      solved: true,
      usedHint: true,
      createdAt: true
    }
  });
  return NextResponse.json(attempts);
}
