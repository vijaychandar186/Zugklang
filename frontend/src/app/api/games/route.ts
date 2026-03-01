import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/db';
import { updateRatings, type GlickoPlayer } from '@/lib/ratings/glicko2';
import { getTimeCategory } from '@/lib/ratings/timeCategory';
import { normalizeFlagCode } from '@/features/settings/flags';
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
): Promise<
  GlickoPlayer & {
    id: string;
  }
> {
  const record = await prisma.rating.upsert({
    where: { userId_variant_category: { userId, variant, category } },
    update: {},
    create: { userId, variant, category }
  });
  return {
    id: record.id,
    rating: record.rating,
    rd: record.rd,
    sigma: record.sigma
  };
}
export async function POST(req: NextRequest) {
  try {
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
      startingFen,
      rated = true
    } = body;
    if (isAbortedGame(result, resultReason, moves.length)) {
      return NextResponse.json({ skipped: true, reason: 'abort' });
    }
    let resolvedOpponentUserId = opponentUserId ?? null;
    if (resolvedOpponentUserId) {
      const opponentExists = await prisma.user.findUnique({
        where: { id: resolvedOpponentUserId },
        select: { id: true }
      });
      if (!opponentExists) resolvedOpponentUserId = null;
    }
    const candidateWhiteUserId =
      myColor === 'white' ? userId : resolvedOpponentUserId;
    const candidateBlackUserId =
      myColor === 'black' ? userId : resolvedOpponentUserId;
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
            whiteRatingDelta = updated.whiteDelta;
            blackRatingDelta = updated.blackDelta;
            await prisma.$transaction([
              prisma.rating.update({
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
              prisma.rating.update({
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
              }),
              prisma.game.update({
                where: { id: existing.id },
                data: {
                  whitePregameRating: whiteRating.rating,
                  blackPregameRating: blackRating.rating,
                  whiteRatingDelta,
                  blackRatingDelta
                }
              })
            ]);
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
        rated: rated !== false,
        whitePregameRating: null,
        blackPregameRating: null,
        whiteRatingDelta: null,
        blackRatingDelta: null,
        moveCount: moves.length,
        playedAt: new Date()
      }
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
    let whitePregameRating: number | null = null;
    let blackPregameRating: number | null = null;
    let whiteRatingDelta: number | null = null;
    let blackRatingDelta: number | null = null;
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
        await prisma.$transaction([
          prisma.rating.update({
            where: {
              userId_variant_category: {
                userId: whiteUserId!,
                variant,
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
          prisma.rating.update({
            where: {
              userId_variant_category: {
                userId: blackUserId!,
                variant,
                category
              }
            },
            data: {
              rating: updated.black.rating,
              rd: updated.black.rd,
              sigma: updated.black.sigma,
              gameCount: { increment: 1 }
            }
          }),
          prisma.game.update({
            where: { id: game.id },
            data: {
              whitePregameRating,
              blackPregameRating,
              whiteRatingDelta,
              blackRatingDelta
            }
          })
        ]);
      } catch (ratingErr) {
        console.error('Failed to update ratings for saved game:', ratingErr);
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
      return NextResponse.json({ duplicate: true });
    }
    console.error('Failed to save game:', err);
    return NextResponse.json({ error: 'Failed to save game' }, { status: 500 });
  }
}
