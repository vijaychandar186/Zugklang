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
    mode,
    pieceCount,
    memorizeTimeSeconds,
    correctPieces,
    totalPieces,
    accuracy,
    progressiveLevel
  } = body;

  if (
    !mode ||
    pieceCount == null ||
    memorizeTimeSeconds == null ||
    correctPieces == null ||
    totalPieces == null ||
    accuracy == null
  ) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const memSession = await prisma.memorySession.create({
    data: {
      userId: session.user.id,
      mode: String(mode),
      pieceCount: Number(pieceCount),
      memorizeTimeSeconds: Number(memorizeTimeSeconds),
      correctPieces: Number(correctPieces),
      totalPieces: Number(totalPieces),
      accuracy: Number(accuracy),
      progressiveLevel: progressiveLevel != null ? Number(progressiveLevel) : null
    }
  });

  return NextResponse.json(memSession, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '500'), 500);

  const sessions = await prisma.memorySession.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      mode: true,
      pieceCount: true,
      memorizeTimeSeconds: true,
      correctPieces: true,
      totalPieces: true,
      accuracy: true,
      progressiveLevel: true,
      createdAt: true
    }
  });

  return NextResponse.json(sessions);
}
