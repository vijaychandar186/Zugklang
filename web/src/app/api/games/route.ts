import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/db';
import { updateRatings, type GlickoPlayer } from '@/lib/ratings/glicko2';
import { getTimeCategory } from '@/lib/ratings/timeCategory';

interface SaveGameBody {
  roomId?: string;
  moves: string[];
  variant: string;
  gameType: 'multiplayer' | 'computer' | 'local';
  result: string; // human-readable result string from WS or game store
  resultReason: string;
  myColor: 'white' | 'black';
  opponentUserId?: string | null;
  timeControl: { mode: string; minutes: number; increment: number };
  startingFen: string;
}

/** Map a human-readable result string to a PGN result code */
function toPgnResult(
  result: string,
  reason: string
): '1-0' | '0-1' | '1/2-1/2' | '*' {
  if (reason === 'abort') return '*';

  const lower = result.toLowerCase();
  if (
    lower.includes('white wins') ||
    lower.includes('white win') ||
    lower.startsWith('1-0')
  )
    return '1-0';
  if (
    lower.includes('black wins') ||
    lower.includes('black win') ||
    lower.startsWith('0-1')
  )
    return '0-1';
  if (lower.includes('draw') || lower.includes('1/2') || lower.startsWith('½'))
    return '1/2-1/2';

  return '*';
}

/** Get or create a Rating record for a user+category */
async function getOrCreateRating(
  userId: string,
  category: string
): Promise<GlickoPlayer & { id: string }> {
  const record = await prisma.rating.upsert({
    where: { userId_category: { userId, category } },
    update: {},
    create: { userId, category }
  });
  return {
    id: record.id,
    rating: record.rating,
    rd: record.rd,
    sigma: record.sigma
  };
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  let body: SaveGameBody;
  try {
    body = (await req.json()) as SaveGameBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const {
    roomId,
    moves,
    variant,
    gameType,
    result,
    resultReason,
    myColor,
    opponentUserId,
    timeControl,
    startingFen
  } = body;

  const whiteUserId = myColor === 'white' ? userId : (opponentUserId ?? null);
  const blackUserId = myColor === 'black' ? userId : (opponentUserId ?? null);

  const pgnResult = toPgnResult(result, resultReason);

  // Only standard chess with timed games gets rated; other variants are unrated
  const category =
    variant === 'standard' && timeControl.mode === 'timed'
      ? getTimeCategory(timeControl.minutes, timeControl.increment)
      : null;

  const isRated =
    category !== null &&
    pgnResult !== '*' &&
    moves.length >= 2 &&
    gameType === 'multiplayer' &&
    whiteUserId &&
    blackUserId;

  let whitePregameRating: number | null = null;
  let blackPregameRating: number | null = null;
  let whiteRatingDelta: number | null = null;
  let blackRatingDelta: number | null = null;

  if (isRated && category) {
    // Fetch/create ratings for both players
    const [whiteRating, blackRating] = await Promise.all([
      getOrCreateRating(whiteUserId!, category),
      getOrCreateRating(blackUserId!, category)
    ]);

    whitePregameRating = whiteRating.rating;
    blackPregameRating = blackRating.rating;

    let outcome: 1 | 0 | 0.5;
    if (pgnResult === '1-0') outcome = 1;
    else if (pgnResult === '0-1') outcome = 0;
    else outcome = 0.5;

    const updated = updateRatings(whiteRating, blackRating, outcome);
    whiteRatingDelta = updated.whiteDelta;
    blackRatingDelta = updated.blackDelta;

    // Update rating records in a transaction
    await prisma.$transaction([
      prisma.rating.update({
        where: { userId_category: { userId: whiteUserId!, category } },
        data: {
          rating: updated.white.rating,
          rd: updated.white.rd,
          sigma: updated.white.sigma,
          gameCount: { increment: 1 }
        }
      }),
      prisma.rating.update({
        where: { userId_category: { userId: blackUserId!, category } },
        data: {
          rating: updated.black.rating,
          rd: updated.black.rd,
          sigma: updated.black.sigma,
          gameCount: { increment: 1 }
        }
      })
    ]);
  }

  try {
    const game = await prisma.game.create({
      data: {
        roomId: roomId ?? null,
        whiteUserId,
        blackUserId,
        variant,
        gameType,
        result: pgnResult,
        resultReason,
        moves,
        startingFen,
        timeControl,
        whitePregameRating,
        blackPregameRating,
        whiteRatingDelta,
        blackRatingDelta,
        moveCount: moves.length
      }
    });

    return NextResponse.json({ gameId: game.id, whiteRatingDelta, blackRatingDelta });
  } catch (err: unknown) {
    // Unique constraint on roomId means this game was already saved by the opponent
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: string }).code === 'P2002'
    ) {
      return NextResponse.json({ duplicate: true });
    }
    console.error('Failed to save game:', err);
    return NextResponse.json({ error: 'Failed to save game' }, { status: 500 });
  }
}
