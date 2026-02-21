import { privateProcedure, router } from '@/trpc/trpc';
import { prisma } from '@/lib/db/db';
import { updateRatings, type GlickoPlayer } from '@/lib/ratings/glicko2';
import { getTimeCategory } from '@/lib/ratings/timeCategory';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

const saveGameInputSchema = z.object({
  roomId: z.string().optional(),
  moves: z.array(z.string()),
  variant: z.string(),
  gameType: z.enum(['multiplayer', 'computer', 'local']),
  result: z.string(),
  resultReason: z.string(),
  myColor: z.enum(['white', 'black']),
  opponentUserId: z.string().nullable().optional(),
  timeControl: z.object({
    mode: z.string(),
    minutes: z.number(),
    increment: z.number()
  }),
  startingFen: z.string()
});

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

export const gamesRouter = router({
  /** Save a completed game and update ratings if applicable */
  saveGame: privateProcedure
    .input(saveGameInputSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
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
      } = input;

      const whiteUserId =
        myColor === 'white' ? userId : (opponentUserId ?? null);
      const blackUserId =
        myColor === 'black' ? userId : (opponentUserId ?? null);

      const pgnResult = toPgnResult(result, resultReason);

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
        return { gameId: game.id, whiteRatingDelta, blackRatingDelta };
      } catch (err: unknown) {
        // P2002 = unique constraint violation - game already saved by opponent
        if (
          typeof err === 'object' &&
          err !== null &&
          'code' in err &&
          (err as { code: string }).code === 'P2002'
        ) {
          return {
            duplicate: true,
            gameId: null,
            whiteRatingDelta: null,
            blackRatingDelta: null
          };
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to save game'
        });
      }
    }),

  /** Get the signed-in user's games with pagination */
  getMyGames: privateProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(25)
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize } = input;
      const skip = (page - 1) * pageSize;
      const userId = ctx.userId;

      const where = {
        OR: [{ whiteUserId: userId }, { blackUserId: userId }]
      } as const;

      const [games, totalCount] = await Promise.all([
        prisma.game.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: pageSize,
          select: {
            id: true,
            variant: true,
            gameType: true,
            result: true,
            resultReason: true,
            moveCount: true,
            createdAt: true,
            whiteUserId: true,
            blackUserId: true,
            whiteRatingDelta: true,
            blackRatingDelta: true,
            whitePregameRating: true,
            blackPregameRating: true,
            white: { select: { name: true } },
            black: { select: { name: true } }
          }
        }),
        prisma.game.count({ where })
      ]);

      return {
        games,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        page
      };
    })
});
