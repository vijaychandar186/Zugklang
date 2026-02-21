import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/db';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const {
    trainingMode,
    colorMode,
    timeLimitSeconds,
    score,
    totalAttempts,
    accuracy,
    avgResponseTimeMs
  } = body;

  if (
    !trainingMode ||
    !colorMode ||
    timeLimitSeconds == null ||
    score == null ||
    totalAttempts == null ||
    accuracy == null ||
    avgResponseTimeMs == null
  ) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const visionSession = await prisma.visionSession.create({
    data: {
      userId: session.user.id,
      trainingMode: String(trainingMode),
      colorMode: String(colorMode),
      timeLimitSeconds: Number(timeLimitSeconds),
      score: Number(score),
      totalAttempts: Number(totalAttempts),
      accuracy: Number(accuracy),
      avgResponseTimeMs: Number(avgResponseTimeMs)
    }
  });

  return NextResponse.json(visionSession, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '500'), 500);

  const sessions = await prisma.visionSession.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      trainingMode: true,
      colorMode: true,
      timeLimitSeconds: true,
      score: true,
      totalAttempts: true,
      accuracy: true,
      avgResponseTimeMs: true,
      createdAt: true
    }
  });

  return NextResponse.json(sessions);
}
