import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/db';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { mode, difficulty, score, mistakes, timeLimitSeconds, maxMistakes } =
    body;

  if (!mode || !difficulty || score == null || mistakes == null) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const rushScore = await prisma.puzzleRushScore.create({
    data: {
      userId: session.user.id,
      mode: String(mode),
      difficulty: String(difficulty),
      score: Number(score),
      mistakes: Number(mistakes),
      timeLimitSeconds:
        timeLimitSeconds != null ? Number(timeLimitSeconds) : null,
      maxMistakes: maxMistakes != null ? Number(maxMistakes) : null
    }
  });

  return NextResponse.json(rushScore, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '500'), 500);

  const scores = await prisma.puzzleRushScore.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      mode: true,
      difficulty: true,
      score: true,
      mistakes: true,
      timeLimitSeconds: true,
      maxMistakes: true,
      createdAt: true
    }
  });

  return NextResponse.json(scores);
}
