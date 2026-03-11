import { privateProcedure, router } from '@/trpc/trpc';
import { prisma } from '@/lib/db/db';
import { z } from 'zod';
const timeCategorySchema = z.enum(['bullet', 'blitz', 'rapid', 'classical']);
export const userRouter = router({
  getMyRating: privateProcedure
    .input(
      z.object({
        category: timeCategorySchema,
        variant: z.string().default('standard')
      })
    )
    .query(async ({ ctx, input }) => {
      const record = await prisma.rating.findUnique({
        where: {
          userId_variant_category: {
            userId: ctx.userId,
            variant: input.variant,
            category: input.category
          }
        },
        select: { rating: true, rd: true, gameCount: true }
      });
      return {
        rating: record?.rating ?? 700,
        rd: record?.rd ?? 350,
        gameCount: record?.gameCount ?? 0
      };
    }),
  getMyRatings: privateProcedure.query(async ({ ctx }) => {
    const records = await prisma.rating.findMany({
      where: { userId: ctx.userId },
      select: {
        variant: true,
        category: true,
        rating: true,
        rd: true,
        gameCount: true
      }
    });
    return records;
  }),
  getUserProfile: privateProcedure
    .input(
      z.object({
        userId: z.string(),
        variant: z.string().default('standard'),
        category: timeCategorySchema.optional()
      })
    )
    .query(async ({ input }) => {
      const [user, ratingRow] = await Promise.all([
        prisma.user.findUnique({
          where: { id: input.userId },
          select: { name: true, image: true }
        }),
        input.category
          ? prisma.rating.findUnique({
              where: {
                userId_variant_category: {
                  userId: input.userId,
                  variant: input.variant,
                  category: input.category
                }
              },
              select: { rating: true }
            })
          : Promise.resolve(null)
      ]);
      if (!user) return null;
      return {
        name: user.name ?? 'Unknown',
        image: user.image ?? null,
        rating: input.category ? (ratingRow?.rating ?? 700) : null
      };
    }),
  getMyPuzzleRating: privateProcedure.query(async ({ ctx }) => {
    const record = await prisma.puzzleRating.findUnique({
      where: { userId: ctx.userId },
      select: { rating: true, rd: true, gameCount: true }
    });
    return {
      rating: record?.rating ?? 1000,
      rd: record?.rd ?? 350,
      gameCount: record?.gameCount ?? 0
    };
  })
});
