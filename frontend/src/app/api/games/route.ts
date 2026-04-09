import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/db';
import { updateRatings, type GlickoPlayer } from '@/lib/ratings/glicko2';
import { getTimeCategory } from '@/lib/ratings/timeCategory';
import { normalizeFlagCode } from '@/features/settings/flags';
import { checkRateLimit } from '@/lib/redis';

const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET ?? '';
function isInternal(req: NextRequest): boolean {
  const h = req.headers.get('authorization') ?? '';
  const tok = h.startsWith('Bearer ') ? h.slice(7) : '';
  return !!INTERNAL_SECRET && tok === INTERNAL_SECRET;
}

// Payload sent by ws-server via BullMQ game-record worker
interface InternalGameBody {
  roomId: string;
  variant: string;
  timeControl: { mode: string; minutes: number; increment: number };
  whiteUserId: string | null;
  blackUserId: string | null;
  moves: string[];
  result: 'white' | 'black' | 'draw';
  reason: string;
  playedAt: string;
}

interface SaveGameBody {
  roomId?: string;
  moves: string[];
  variant: string;
  gameType: 'multiplayer' | 'computer' | 'local';
  result: string;
  resultReason: string;
  myColor: 'white' | 'black';
  opponentUserId?: string | null;
  timeControl: {
    mode: string;
    minutes: number;
    increment: number;
  };
  startingFen: string;
  rated?: boolean;
}
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
function isAbortedGame(
  result: string,
  reason: string,
  movesCount: number
): boolean {
  const bothPlayersMovedAtLeastOnce = movesCount >= 2;
  const normalizedReason = reason.trim().toLowerCase();
  if (normalizedReason === 'abort' || normalizedReason.includes('aborted'))
    return true;
  if (normalizedReason === 'abandoned' && !bothPlayersMovedAtLeastOnce)
    return true;
  const normalizedResult = result.trim().toLowerCase();
  return normalizedResult.includes('abort');
}
async function getOrCreateRating(
  userId: string,
  variant: string,
  category: string
): Promise<GlickoPlayer & { id: string }> {
  try {
    const record = await prisma.rating.upsert({
      where: { userId_variant_category: { userId, variant, category } },
      update: {},
      create: { userId, variant, category }
    });
    return { id: record.id, rating: record.rating, rd: record.rd, sigma: record.sigma };
  } catch (e: unknown) {
    // Two concurrent requests (ws-server internal + client) can race to create
    // the same Rating row. If we lose the race, read the row the winner created.
    if (
      typeof e === 'object' && e !== null && 'code' in e &&
      (e as { code: string }).code === 'P2002'
    ) {
      const record = await prisma.rating.findUniqueOrThrow({
        where: { userId_variant_category: { userId, variant, category } }
      });
      return { id: record.id, rating: record.rating, rd: record.rd, sigma: record.sigma };
    }
    throw e;
  }
}
export async function POST(req: NextRequest) {
  let roomId: string | undefined;
  try {
    // -----------------------------------------------------------------------
    // Internal server-to-server path (ws-server → /api/games)
    // -----------------------------------------------------------------------
    if (isInternal(req)) {
      let body: InternalGameBody;
      try {
        body = (await req.json()) as InternalGameBody;
      } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
      }
      const { variant, timeControl, moves, reason, playedAt } = body;
      const whiteUserId = body.whiteUserId;
      const blackUserId = body.blackUserId;
      const pgnResult =
        body.result === 'white' ? ('1-0' as const)
        : body.result === 'black' ? ('0-1' as const)
        : ('1/2-1/2' as const);

      if (isAbortedGame(pgnResult, reason, moves.length)) {
        return NextResponse.json({ skipped: true, reason: 'abort' });
      }

      roomId = body.roomId;

      // Dedup: if already recorded return the existing row
      if (roomId) {
        const existing = await prisma.game.findUnique({
          where: { roomId },
          select: { id: true, whiteRatingDelta: true, blackRatingDelta: true }
        });
        if (existing) {
          return NextResponse.json({
            gameId: existing.id,
            whiteRatingDelta: existing.whiteRatingDelta,
            blackRatingDelta: existing.blackRatingDelta
          });
        }
      }

      const category = (() => {
        if (timeControl.mode === 'unlimited') return 'classical' as const;
        if (timeControl.mode !== 'timed') return null;
        return getTimeCategory(timeControl.minutes, timeControl.increment);
      })();

      const isRated =
        category !== null && moves.length >= 2 &&
        !!whiteUserId && !!blackUserId;

      let whitePregameRating: number | null = null;
      let blackPregameRating: number | null = null;
      let whiteRatingDelta: number | null = null;
      let blackRatingDelta: number | null = null;
      let ratingUpdate: { white: GlickoPlayer; black: GlickoPlayer } | null = null;

      if (isRated && category) {
        try {
          const [whiteRating, blackRating] = await Promise.all([
            getOrCreateRating(whiteUserId!, variant, category),
            getOrCreateRating(blackUserId!, variant, category)
          ]);
          whitePregameRating = whiteRating.rating;
          blackPregameRating = blackRating.rating;
          const outcome: 1 | 0 | 0.5 =
            pgnResult === '1-0' ? 1 : pgnResult === '0-1' ? 0 : 0.5;
          const updated = updateRatings(whiteRating, blackRating, outcome);
          whiteRatingDelta = updated.whiteDelta;
          blackRatingDelta = updated.blackDelta;
          ratingUpdate = { white: updated.white, black: updated.black };
        } catch (ratingErr) {
          console.error('Failed to calculate ratings for internal game:', ratingErr);
        }
      }

      const game = await prisma.$transaction(async (tx) => {
        const g = await tx.game.create({
          data: {
            roomId: roomId ?? null,
            whiteUserId,
            blackUserId,
            variant,
            gameType: 'multiplayer',
            result: pgnResult,
            resultReason: reason,
            moves,
            startingFen: '',
            timeControl,
            rated: true,
            whitePregameRating,
            blackPregameRating,
            whiteRatingDelta,
            blackRatingDelta,
            moveCount: moves.length,
            playedAt: new Date(playedAt)
          }
        });
        if (ratingUpdate && whiteUserId && blackUserId && category) {
          await Promise.all([
            tx.rating.update({
              where: { userId_variant_category: { userId: whiteUserId!, variant, category } },
              data: {
                rating: ratingUpdate.white.rating,
                rd: ratingUpdate.white.rd,
                sigma: ratingUpdate.white.sigma,
                gameCount: { increment: 1 }
              }
            }),
            tx.rating.update({
              where: { userId_variant_category: { userId: blackUserId!, variant, category } },
              data: {
                rating: ratingUpdate.black.rating,
                rd: ratingUpdate.black.rd,
                sigma: ratingUpdate.black.sigma,
                gameCount: { increment: 1 }
              }
            })
          ]);
        }
        return g;
      });

      return NextResponse.json({ gameId: game.id, whiteRatingDelta, blackRatingDelta });
    }

    // -----------------------------------------------------------------------
    // Client session path (user submits their own game)
    // -----------------------------------------------------------------------
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;
    const allowed = await checkRateLimit(`rl:games:post:${userId}`, 10, 60);
    if (!allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
    let body: SaveGameBody;
    try {
      body = (await req.json()) as SaveGameBody;
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    const {
      moves,
      variant,
      gameType,
      result,
      resultReason,
      myColor,
      opponentUserId,
      timeControl,
      startingFen,
      rated = true
    } = body;
    roomId = body.roomId;
    if (isAbortedGame(result, resultReason, moves.length)) {
      return NextResponse.json({ skipped: true, reason: 'abort' });
    }
    // Verify both the current user and opponent exist in the User table.
    // JWT sessions can outlive their User records (e.g. after a DB reset),
    // so we must check before using any userId as a foreign key.
    const [currentUserRecord, opponentRecord] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
      opponentUserId
        ? prisma.user.findUnique({
            where: { id: opponentUserId },
            select: { id: true }
          })
        : Promise.resolve(null)
    ]);
    const verifiedUserId: string | null = currentUserRecord ? userId : null;
    const resolvedOpponentUserId: string | null =
      opponentUserId && opponentRecord ? opponentUserId : null;
    const candidateWhiteUserId =
      myColor === 'white' ? verifiedUserId : resolvedOpponentUserId;
    const candidateBlackUserId =
      myColor === 'black' ? verifiedUserId : resolvedOpponentUserId;
    const pgnResult = toPgnResult(result, resultReason);
    const category = (() => {
      if (timeControl.mode === 'unlimited') return 'classical' as const;
      if (timeControl.mode !== 'timed') return null;
      return getTimeCategory(timeControl.minutes, timeControl.increment);
    })();
    if (roomId) {
      const existing = await prisma.game.findUnique({
        where: { roomId },
        select: {
          id: true,
          variant: true,
          gameType: true,
          result: true,
          moveCount: true,
          whiteUserId: true,
          blackUserId: true,
          whiteRatingDelta: true,
          blackRatingDelta: true,
          rated: true
        }
      });
      if (existing) {
        const whiteUserId = existing.whiteUserId ?? candidateWhiteUserId;
        const blackUserId = existing.blackUserId ?? candidateBlackUserId;
        if (
          whiteUserId !== existing.whiteUserId ||
          blackUserId !== existing.blackUserId
        ) {
          await prisma.game.update({
            where: { id: existing.id },
            data: { whiteUserId, blackUserId }
          });
        }
        let whiteRatingDelta = existing.whiteRatingDelta;
        let blackRatingDelta = existing.blackRatingDelta;
        const needsRatingBackfill =
          existing.rated !== false &&
          whiteRatingDelta == null &&
          blackRatingDelta == null &&
          category !== null &&
          existing.result !== '*' &&
          existing.moveCount >= 2 &&
          existing.gameType === 'multiplayer' &&
          whiteUserId &&
          blackUserId;
        if (needsRatingBackfill && category) {
          try {
            const [whiteRating, blackRating] = await Promise.all([
              getOrCreateRating(whiteUserId!, existing.variant, category),
              getOrCreateRating(blackUserId!, existing.variant, category)
            ]);
            let outcome: 1 | 0 | 0.5;
            if (existing.result === '1-0') outcome = 1;
            else if (existing.result === '0-1') outcome = 0;
            else outcome = 0.5;
            const updated = updateRatings(whiteRating, blackRating, outcome);
            const calcWhiteDelta = updated.whiteDelta;
            const calcBlackDelta = updated.blackDelta;
            // Use a conditional claim inside the transaction to prevent both
            // players' concurrent requests from applying the rating update twice.
            await prisma.$transaction(async (tx) => {
              const claimed = await tx.game.updateMany({
                where: { id: existing.id, whiteRatingDelta: null, blackRatingDelta: null },
                data: {
                  whitePregameRating: whiteRating.rating,
                  blackPregameRating: blackRating.rating,
                  whiteRatingDelta: calcWhiteDelta,
                  blackRatingDelta: calcBlackDelta
                }
              });
              if (claimed.count === 0) return; // Another request already processed this game
              await Promise.all([
                tx.rating.update({
                  where: {
                    userId_variant_category: {
                      userId: whiteUserId!,
                      variant: existing.variant,
                      category
                    }
                  },
                  data: {
                    rating: updated.white.rating,
                    rd: updated.white.rd,
                    sigma: updated.white.sigma,
                    gameCount: { increment: 1 }
                  }
                }),
                tx.rating.update({
                  where: {
                    userId_variant_category: {
                      userId: blackUserId!,
                      variant: existing.variant,
                      category
                    }
                  },
                  data: {
                    rating: updated.black.rating,
                    rd: updated.black.rd,
                    sigma: updated.black.sigma,
                    gameCount: { increment: 1 }
                  }
                })
              ]);
            });
            // Re-fetch the actual stored deltas (either ours or from the concurrent winner)
            const refreshed = await prisma.game.findUnique({
              where: { id: existing.id },
              select: { whiteRatingDelta: true, blackRatingDelta: true }
            });
            whiteRatingDelta = refreshed?.whiteRatingDelta ?? null;
            blackRatingDelta = refreshed?.blackRatingDelta ?? null;
          } catch (ratingErr) {
            console.error(
              'Failed to backfill ratings for existing game:',
              ratingErr
            );
          }
        }
        return NextResponse.json({
          gameId: existing.id,
          whiteRatingDelta,
          blackRatingDelta
        });
      }
    }
    const whiteUserId = candidateWhiteUserId;
    const blackUserId = candidateBlackUserId;
    const isRated =
      rated !== false &&
      category !== null &&
      pgnResult !== '*' &&
      moves.length >= 2 &&
      gameType === 'multiplayer' &&
      whiteUserId &&
      blackUserId;
    // Pre-calculate ratings before creating the game so it is stored with deltas
    // already set. This closes the race window where a second concurrent request
    // (the other player's client) would find a newly-created game with null deltas
    // and trigger a duplicate rating update via the backfill path.
    let whitePregameRating: number | null = null;
    let blackPregameRating: number | null = null;
    let whiteRatingDelta: number | null = null;
    let blackRatingDelta: number | null = null;
    let ratingUpdate: { white: GlickoPlayer; black: GlickoPlayer } | null = null;
    if (isRated && category) {
      try {
        const [whiteRating, blackRating] = await Promise.all([
          getOrCreateRating(whiteUserId!, variant, category),
          getOrCreateRating(blackUserId!, variant, category)
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
        ratingUpdate = { white: updated.white, black: updated.black };
      } catch (ratingErr) {
        console.error('Failed to calculate ratings for new game:', ratingErr);
      }
    }
    // Create the game (with deltas already populated for rated games) and apply
    // the rating updates in a single transaction so they are always consistent.
    const game = await prisma.$transaction(async (tx) => {
      const g = await tx.game.create({
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
          rated: rated !== false,
          whitePregameRating,
          blackPregameRating,
          whiteRatingDelta,
          blackRatingDelta,
          moveCount: moves.length,
          playedAt: new Date()
        }
      });
      if (ratingUpdate && whiteUserId && blackUserId && category) {
        await Promise.all([
          tx.rating.update({
            where: {
              userId_variant_category: { userId: whiteUserId!, variant, category }
            },
            data: {
              rating: ratingUpdate.white.rating,
              rd: ratingUpdate.white.rd,
              sigma: ratingUpdate.white.sigma,
              gameCount: { increment: 1 }
            }
          }),
          tx.rating.update({
            where: {
              userId_variant_category: { userId: blackUserId!, variant, category }
            },
            data: {
              rating: ratingUpdate.black.rating,
              rd: ratingUpdate.black.rd,
              sigma: ratingUpdate.black.sigma,
              gameCount: { increment: 1 }
            }
          })
        ]);
      }
      return g;
    });
    if (gameType === 'multiplayer' && whiteUserId && blackUserId) {
      try {
        const users = await prisma.user.findMany({
          where: { id: { in: [whiteUserId, blackUserId] } },
          select: { id: true, flagCode: true }
        });
        const whiteUser = users.find((u) => u.id === whiteUserId);
        const blackUser = users.find((u) => u.id === blackUserId);
        if (whiteUser && blackUser) {
          const whiteFlag = normalizeFlagCode(whiteUser.flagCode);
          const blackFlag = normalizeFlagCode(blackUser.flagCode);
          await prisma.$transaction([
            prisma.passportFlag.upsert({
              where: {
                userId_flagCode: { userId: whiteUserId, flagCode: blackFlag }
              },
              update: {},
              create: { userId: whiteUserId, flagCode: blackFlag }
            }),
            prisma.passportFlag.upsert({
              where: {
                userId_flagCode: { userId: blackUserId, flagCode: whiteFlag }
              },
              update: {},
              create: { userId: blackUserId, flagCode: whiteFlag }
            })
          ]);
        }
      } catch (passportErr) {
        console.error('Failed to update passport flags:', passportErr);
      }
    }
    return NextResponse.json({
      gameId: game.id,
      whiteRatingDelta,
      blackRatingDelta
    });
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (
        err as {
          code: string;
        }
      ).code === 'P2002'
    ) {
      // Race condition: another request created the game first. Return the existing record.
      if (roomId) {
        try {
          const existing = await prisma.game.findUnique({
            where: { roomId },
            select: { id: true, whiteRatingDelta: true, blackRatingDelta: true }
          });
          if (existing) {
            return NextResponse.json({
              gameId: existing.id,
              whiteRatingDelta: existing.whiteRatingDelta,
              blackRatingDelta: existing.blackRatingDelta
            });
          }
        } catch {
          // fall through
        }
      }
      return NextResponse.json({ duplicate: true });
    }
    console.error('Failed to save game:', err);
    return NextResponse.json({ error: 'Failed to save game' }, { status: 500 });
  }
}
