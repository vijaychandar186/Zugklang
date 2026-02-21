import { auth } from '@/lib/auth/auth';
import { initTRPC, TRPCError } from '@trpc/server';

export const createTRPCContext = async () => {
  const session = await auth();
  return { session };
};

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create();

const isAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user?.id) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      userId: ctx.session.user.id,
      user: ctx.session.user
    }
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
