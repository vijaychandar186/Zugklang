import { router } from '@/trpc/trpc';
import { userRouter } from '@/trpc/routers/user';
import { gamesRouter } from '@/trpc/routers/games';

export const appRouter = router({
  user: userRouter,
  games: gamesRouter
});

export type AppRouter = typeof appRouter;
