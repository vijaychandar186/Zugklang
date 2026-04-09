# tRPC

Type-safe API layer using tRPC v11, react-query v5, and zod v4.

---

## File Structure

```
src/
├── trpc/
│   ├── trpc.ts              # Server init, context, auth middleware
│   ├── index.ts             # App router (combines all sub-routers)
│   └── routers/
│       ├── user.ts          # User procedures
│       └── games.ts         # Games procedures
├── app/
│   ├── _trpc/
│   │   └── client.ts        # React client (createTRPCReact)
│   └── api/trpc/[trpc]/
│       └── route.ts         # HTTP handler (GET + POST)
```

---

## Server

### Context & Auth Middleware

`trpc.ts` creates the context (calls `auth()` once per request) and exposes two procedure types:

- `publicProcedure` — no auth required
- `privateProcedure` — throws `UNAUTHORIZED` if no session; injects `ctx.userId` and `ctx.user`

```ts
import { privateProcedure, router } from '@/trpc/trpc';

export const exampleRouter = router({
  hello: privateProcedure.query(({ ctx }) => {
    return `Hello ${ctx.userId}`;
  }),
});
```

### Adding a New Router

1. Create `src/trpc/routers/example.ts`
2. Register it in `src/trpc/index.ts`:

```ts
import { exampleRouter } from '@/trpc/routers/example';

export const appRouter = router({
  user: userRouter,
  games: gamesRouter,
  example: exampleRouter, // add here
});
```

### Input Validation

Use `zod` to validate procedure inputs:

```ts
import { z } from 'zod';

myProcedure: privateProcedure
  .input(z.object({ id: z.string(), page: z.number().min(1).default(1) }))
  .query(async ({ ctx, input }) => {
    // input.id and input.page are fully typed
  }),
```

---

## Client

Import `trpc` from `@/app/_trpc/client` in any client component:

```tsx
'use client';
import { trpc } from '@/app/_trpc/client';

// Query
const { data, isLoading } = trpc.user.getMyRating.useQuery({ category: 'blitz' });

// Mutation
const { mutate, isPending } = trpc.games.saveGame.useMutation({
  onSuccess: (data) => console.log('saved:', data.gameId),
  onError: (err) => console.error(err.message),
});
```

The `trpc.Provider` and `QueryClientProvider` are already set up in `Providers.tsx` — no extra wrapping needed.

---

## Available Procedures

### `user`

| Procedure | Type | Input | Returns |
|---|---|---|---|
| `getMyRating` | query | `{ category }` | `{ rating, rd, gameCount }` |
| `getMyRatings` | query | — | `{ category, rating, rd, gameCount }[]` |
| `getUserProfile` | query | `{ userId, category? }` | `{ name, image, rating }` |
| `getMyPuzzleRating` | query | — | `{ rating, rd, gameCount }` |

### `games`

| Procedure | Type | Input | Returns |
|---|---|---|---|
| `saveGame` | mutation | game body | `{ gameId, whiteRatingDelta, blackRatingDelta }` |
| `getMyGames` | query | `{ page?, pageSize? }` | `{ games[], totalCount, totalPages, page }` |

---

## Installation

```bash
pnpm add @trpc/server @trpc/client @trpc/react-query @tanstack/react-query zod
```
