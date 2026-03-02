# BullMQ in ws-server

BullMQ replaces raw `setTimeout`/`fetch` fire-and-forget patterns with durable, Redis-backed job queues. Jobs survive pod restarts and are retried automatically on failure.

---

## Why BullMQ?

| Old pattern | Problem | BullMQ solution |
|---|---|---|
| `fetch(ANTI_CHEAT_URL)` fire-and-forget | Silently drops data when anti-cheat service is down | Queued job with 5 attempts + exponential backoff |
| `setTimeout(ABORT_TIMEOUT_MS)` in memory | Timer lost on pod crash — game never aborts | Delayed job persisted in Redis |
| `setTimeout(ABANDON_TIMEOUT_MS)` in memory | Timer lost on pod crash — game never resolves | Delayed job persisted in Redis |
| No game history | Completed games GC'd from memory with no record | `game:record` job POSTs to Next.js API → Postgres |

---

## Architecture

Workers run **in the same Bun process** as the WebSocket server. Since ws-server is a long-lived process (not serverless), this is safe and avoids deploying an extra service for most setups.

```
server.ts
  └── startWorkers()          ← called once at boot
        ├── Worker(game:anti-cheat,  processAntiCheat)
        ├── Worker(game:record,      processGameRecord)
        ├── Worker(game:abort-check, processAbortCheck)
        └── Worker(game:abandon-check, processAbandonCheck)
```

For independent scaling (e.g. a separate worker pod), run the worker entry point standalone:

```bash
bun bullmq/worker.ts
```

SIGTERM and SIGINT trigger a graceful drain — in-flight jobs complete before the process exits.

---

## Job Registry

### `game:anti-cheat`

| Field | Value |
|---|---|
| Queue file | [`bullmq/queues.ts`](../bullmq/queues.ts) `antiCheatQueue()` |
| Processor | [`bullmq/workers/antiCheat.ts`](../bullmq/workers/antiCheat.ts) |
| Produced by | `enqueueGameEnd()` in [`handlers/game.ts`](../handlers/game.ts) |
| Attempts | 5 with exponential backoff (2 s → 4 s → 8 s → 16 s) |
| Job ID | `anti-cheat:room:{roomId}` — deduplicated per room |
| Guard | Skipped if `ANTI_CHEAT_URL` is unset or game has < 2 recorded move times |

**What it does:** POSTs the completed game's move list, move times, ratings, and result to `POST $ANTI_CHEAT_URL/game`. The anti-cheat service processes the game asynchronously and publishes its verdict to the `analysis:done` Redis pub/sub channel, which ws-server forwards to the relevant player.

---

### `game:record`

| Field | Value |
|---|---|
| Queue file | [`bullmq/queues.ts`](../bullmq/queues.ts) `gameRecordQueue()` |
| Processor | [`bullmq/workers/gameRecord.ts`](../bullmq/workers/gameRecord.ts) |
| Produced by | `enqueueGameEnd()` in [`handlers/game.ts`](../handlers/game.ts) |
| Attempts | 5 with exponential backoff |
| Job ID | `record:room:{roomId}` — deduplicated per room |
| Guard | Skipped if `GAME_RECORD_URL` is unset; never enqueued for `abort` reason |

**What it does:** POSTs the full game summary (players, moves, move times, result, reason, ratings) to `POST $GAME_RECORD_URL` with an `Authorization: Bearer $INTERNAL_API_SECRET` header. The receiving Next.js route writes the record to Postgres via Prisma.

**Payload shape** (exported as `GameRecordPayload` from [`bullmq/types.ts`](../bullmq/types.ts)):

```ts
{
  roomId, variant, timeControl,
  whiteUserId, blackUserId,
  whiteDisplayName, blackDisplayName,
  whiteRating, blackRating,
  moves, moveTimesWhiteMs, moveTimesBlackMs,
  result,   // 'white' | 'black' | 'draw'
  reason,   // 'resign' | 'timeout' | 'draw_agreement' | 'checkmate' | 'abandoned' | …
  playedAt  // ISO 8601
}
```

---

### `game:abort-check`

| Field | Value |
|---|---|
| Queue file | [`bullmq/queues.ts`](../bullmq/queues.ts) — `scheduleAbortCheck` / `rescheduleAbortCheck` / `cancelAbortCheck` |
| Processor | [`bullmq/workers/abortCheck.ts`](../bullmq/workers/abortCheck.ts) |
| Produced by | `createRoom()` (expectedMinMoves=1) and `handleMove()` after move 1 (expectedMinMoves=2) |
| Delay | `ABORT_TIMEOUT_MS` (60 s) |
| Attempts | 1 (idempotent — checks live room state) |
| Job ID | `abort:{roomId}` — one pending abort per room at a time |

**What it does:** After `ABORT_TIMEOUT_MS`, checks if `room.moves.length >= expectedMinMoves`. If not, marks the game as ended (opponent abandoned) and notifies both players. Replaces the pair of `setTimeout` callbacks that previously lived in `createRoom` and `handleMove`.

**Lifecycle:**
1. Room created → `scheduleAbortCheck(roomId, 1)` (waiting for white's first move)
2. White makes move 1 → `rescheduleAbortCheck(roomId, 2)` (cancel + re-add, waiting for black)
3. Black makes move 2 → `cancelAbortCheck(roomId)`
4. Any game-ending action (resign, draw, etc.) → `cancelAbortCheck(roomId)`

---

### `game:abandon-check`

| Field | Value |
|---|---|
| Queue file | [`bullmq/queues.ts`](../bullmq/queues.ts) — `scheduleAbandonCheck` / `cancelAbandonCheck` |
| Processor | [`bullmq/workers/abandonCheck.ts`](../bullmq/workers/abandonCheck.ts) |
| Produced by | `handleDisconnect()` in [`handlers/connection.ts`](../handlers/connection.ts) |
| Delay | `ABANDON_TIMEOUT_MS` (30 s) |
| Attempts | 1 (idempotent — checks `room.whiteDisconnectedAt / blackDisconnectedAt`) |
| Job ID | `abandon:{playerId}` — one pending abandon per disconnected player |

**What it does:** After `ABANDON_TIMEOUT_MS`, checks if the player's `disconnectedAt` field is still set (i.e. they haven't rejoined). If so, ends the game in favour of the remaining player. Replaces the `setTimeout` callback in `handleDisconnect`.

**Lifecycle:**
1. Player disconnects from active game → `scheduleAbandonCheck(playerId, roomId, color)`
2. Player rejoins → `cancelAbandonCheck(playerId)` (called in `handleRejoinRoom`)

---

## Configuration

| Variable | Default | Description |
|---|---|---|
| `REDIS_URL` | `redis://localhost:6379` | Redis connection string (supports `rediss://` for TLS) |
| `ANTI_CHEAT_URL` | *(empty — disabled)* | Base URL of the Kaladin anti-cheat service |
| `GAME_RECORD_URL` | *(empty — disabled)* | Absolute URL of the Next.js game-record endpoint |
| `INTERNAL_API_SECRET` | *(empty)* | Bearer token sent with game-record POSTs |
| `WORKER_CONCURRENCY` | `5` | Max simultaneous jobs per worker |

---

## Default Job Options

```ts
// HTTP delivery jobs (anti-cheat, game-record)
{
  attempts: 5,
  backoff: { type: 'exponential', delay: 2_000 },
  removeOnComplete: { count: 500 },
  removeOnFail:     { count: 100 },
}

// Timer jobs (abort-check, abandon-check)
{
  attempts: 1,          // processor is idempotent; no value in retrying
  removeOnComplete: { count: 200 },
  removeOnFail:     { count: 50  },
}
```

---

## File Structure

```
bullmq/
├── connection.ts          # getConnectionOptions() — ConnectionOptions for BullMQ
├── types.ts               # JobName enum, payload interfaces, default options
├── queues.ts              # Lazy Queue singletons + schedule/cancel helpers
├── worker.ts              # startWorkers() + standalone entry point
└── workers/
    ├── antiCheat.ts       # POST game data to Kaladin service
    ├── gameRecord.ts      # POST game summary to Next.js API
    ├── abortCheck.ts      # Auto-abort game on missed first/second move
    └── abandonCheck.ts    # Forfeit game when disconnected player doesn't rejoin
```
