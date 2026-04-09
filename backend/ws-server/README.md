# ws-server

Real-time WebSocket server for Zugklang multiplayer chess. Built with [Bun](https://bun.sh).

---

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Running with Docker](#running-with-docker)
- [HTTP Endpoints](#http-endpoints)
  - [Accessing /admin](#accessing-admin)
- [WebSocket Protocol](#websocket-protocol)
  - [Client → Server Messages](#client--server-messages)
  - [Server → Client Messages](#server--client-messages)
- [Scripts](#scripts)
- [Testing](#testing)
- [Rate Limiting](#rate-limiting)
- [Supported Variants](#supported-variants)

---

## Overview

`ws-server` handles all real-time game logic:

- **Matchmaking** — players join queues by variant + time control and are paired automatically
- **Challenge links** — create a shareable link to play with a friend
- **Game state** — moves, draw offers, resignations, rematches, disconnection recovery
- **Custom multiplayer sync** — server relays Dice/Card turn constraints and validates room ownership
- **4-Player lobbies** — create/join/start/shuffle/assign-team flows with state sync + reconnect tokens
- **Auto-abort** — games abort if no move is made within 1 minute of starting
- **Rejoin tokens** — seamless reconnection after disconnects (30-second window)

Redis is required for all cross-pod coordination: matchmaking queues, rejoin tokens, challenge metadata, room state snapshots, and pub/sub message routing between pods. BullMQ (backed by Redis) handles durable post-game job delivery (anti-cheat, game records) and pod-crash-resilient abort/abandon timers.

See [`docs/redis.md`](docs/redis.md) and [`docs/bullmq.md`](docs/bullmq.md) for detailed usage.

---

## Project Structure

```
ws-server/
├── server.ts          # Entry point (Bun.serve)
├── config.ts          # All timing/threshold/TTL constants
├── redis.ts           # ioredis client + POD_ID / POD_URL exports
├── state.ts           # In-memory stores + Redis-backed rejoin tokens
├── types.ts           # TypeScript type definitions
├── bullmq/
│   ├── connection.ts  # BullMQ Redis connection options
│   ├── queues.ts      # Queue singletons + schedule/cancel helpers
│   ├── types.ts       # Job name constants and payload interfaces
│   ├── worker.ts      # startWorkers() — registers all 4 workers
│   └── workers/
│       ├── antiCheat.ts   # POST game data to Kaladin service
│       ├── gameRecord.ts  # POST game summary to Next.js API
│       ├── abortCheck.ts  # Auto-abort if no move made in time
│       └── abandonCheck.ts # Forfeit game if player doesn't rejoin
├── handlers/
│   ├── http.ts        # HTTP route handler (/health, /stats, /admin)
│   ├── connection.ts  # WebSocket open/close — rejoin + disconnect logic
│   ├── queue.ts       # Matchmaking logic (Redis-backed, multi-pod)
│   ├── challenge.ts   # Challenge link logic (Redis-backed)
│   ├── game.ts        # In-game action logic
│   ├── fourPlayer.ts  # 4-player lobby logic
│   └── sync.ts        # Dice/card/trid move relay
├── utils/
│   ├── auth.ts        # WS token introspection
│   ├── clock.ts       # Server-side chess clock
│   ├── routing.ts     # sendToUser — cross-pod routing via Redis pub/sub
│   ├── schemas.ts     # Zod validation schemas
│   ├── socket.ts      # WebSocket send helpers
│   ├── logger.ts      # Logging utilities
│   ├── rateLimit.ts   # Per-client rate limiter
│   ├── chess.ts       # chessops integration
│   ├── fen.ts         # FEN utilities
│   └── validate.ts    # Input validation helpers
└── docs/
    ├── redis.md       # Redis key namespaces, types, TTLs
    └── bullmq.md      # BullMQ job registry, workers, architecture
```

---

## Requirements

- [Bun](https://bun.sh) v1.x
- [Redis](https://redis.io) 6+ (required for matchmaking, rejoin tokens, pub/sub, and BullMQ job queues)

---

## Environment Variables

Create a `.env.local` file (for local dev) or `.env.production` (for production) in this directory.

| Variable               | Required | Default                   | Description                                                                 |
|------------------------|----------|---------------------------|-----------------------------------------------------------------------------|
| `PORT`                 | No       | `8080`                    | Port the server listens on                                                  |
| `ALLOWED_ORIGINS`      | No       | *(allow all)*             | Comma-separated list of allowed WebSocket origins. Leave unset for local dev |
| `NEXT_APP_URL`         | No       | `http://localhost:3000`   | Frontend base URL used for WS token introspection (`/api/ws-token`)        |
| `ADMIN_KEY`            | Yes      | —                         | Bearer token for the `/admin` endpoint. Server returns 503 if not set       |
| `REDIS_URL`            | No       | `redis://localhost:6379`  | Redis connection URL. Supports `rediss://` for TLS                          |
| `POD_ID`               | No       | *(random UUID)*           | Unique identifier for this pod/process. Set in k8s/Docker deployments       |
| `POD_URL`              | No       | —                         | Public WebSocket URL of this pod (e.g. `ws://ws-pod-1:8080`). Included in matched messages so clients can reconnect to the correct pod |
| `ANTI_CHEAT_URL`       | No       | —                         | Base URL of the Kaladin anti-cheat service. Leave unset to disable          |
| `GAME_RECORD_URL`      | No       | —                         | Absolute URL of the Next.js game-record endpoint (e.g. `https://your-app.com/api/internal/game-record`) |
| `INTERNAL_API_SECRET`  | No       | —                         | Bearer token sent to `GAME_RECORD_URL` so the Next.js route can reject external callers |
| `WORKER_CONCURRENCY`   | No       | `5`                       | Number of concurrent BullMQ job processors per HTTP-delivery queue          |

**`.env.local` example:**

```env
PORT=8080
ALLOWED_ORIGINS="http://localhost:3000"
NEXT_APP_URL="http://localhost:3000"
ADMIN_KEY="your-secret-key-here"
REDIS_URL="redis://localhost:6379"
ANTI_CHEAT_URL="http://localhost:8000"
GAME_RECORD_URL="http://localhost:3000/api/internal/game-record"
INTERNAL_API_SECRET="your-internal-secret-here"
```

**`.env.production` example:**

```env
PORT=8080
ALLOWED_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"
NEXT_APP_URL="https://yourdomain.com"
ADMIN_KEY="your-secret-key-here"
REDIS_URL="rediss://user:password@your-redis-host:6380"
POD_ID="ws-pod-1"
POD_URL="wss://ws-pod-1.yourdomain.com"
ANTI_CHEAT_URL="http://anti-cheat:8000"
GAME_RECORD_URL="https://yourdomain.com/api/internal/game-record"
INTERNAL_API_SECRET="your-internal-secret-here"
WORKER_CONCURRENCY="10"
```

Generate a secure key:

```bash
openssl rand -base64 32
```

---

## Running Locally

```bash
# Install dependencies
bun install

# Start with hot reload (development)
bun run dev

# Start without hot reload (production-like)
bun run start
```

The server will be available at:

- WebSocket: `ws://localhost:8080`
- HTTP: `http://localhost:8080`

---

## Running with Docker

**Development:**

```bash
docker build -f Dockerfile.dev --build-arg PORT=8080 -t zugklang-ws:dev .
docker run --env-file .env.local -p 8080:8080 zugklang-ws:dev
```

**Production:**

```bash
docker build -f Dockerfile.prod --build-arg PORT=8080 -t zugklang-ws:prod .
docker run --env-file .env.production -p 8080:8080 zugklang-ws:prod
```

**Via Docker Compose (full stack):**

```bash
# Development
docker-compose -f docker-compose.dev.yaml up --build

# Production
docker-compose -f docker-compose.prod.yaml up --build
```

See [docs/docker.md](../../docs/docker.md) for full Docker Compose documentation.

---

## HTTP Endpoints

| Method | Path      | Auth          | Description                             |
|--------|-----------|---------------|-----------------------------------------|
| `GET`  | `/health` | None          | Health check                            |
| `GET`  | `/admin/stats`  | Bearer token  | Server statistics                  |
| `GET`  | `/admin`  | Bearer token  | Full server state (rooms, queues, etc.) |

### `/health`

```bash
curl http://localhost:8080/health
```

```json
{ "status": "ok", "uptime": 3600 }
```

### `/admin/stats`

```bash
curl http://localhost:8080/admin/stats \
  -H "Authorization: Bearer <ADMIN_KEY>"
```

```json
{
  "activeRooms": 2,
  "endedRooms": 5,
  "challenges": 1,
  "queuedPlayers": 3,
  "reconnectingPlayers": 0
}
```

### Accessing /admin

The `/admin` endpoint returns the full internal state of the server. It requires a Bearer token matching the `ADMIN_KEY` environment variable.

```bash
curl http://localhost:8080/admin \
  -H "Authorization: Bearer <your-admin-key>"
```

Replace the token value with whatever is set in your `.env.local` or `.env.production`.

**Response:**

```json
{
  "rooms": [
    {
      "id": "uuid",
      "variant": "standard",
      "status": "active",
      "moves": 10,
      "createdAt": 1708351200000
    }
  ],
  "challenges": [
    {
      "id": "uuid",
      "variant": "standard",
      "creatorColor": "white",
      "createdAt": 1708351200000
    }
  ],
  "queues": {
    "standard:timed:3:0": 2,
    "standard:timed:5:3": 1
  }
}
```

**Error responses:**

| Status | Reason                              |
|--------|-------------------------------------|
| `401`  | Missing or invalid `Authorization` header |
| `503`  | `ADMIN_KEY` is not configured on the server |

---

## WebSocket Protocol

Connect to `ws://localhost:8080` (or `wss://` in production) with a short-lived token:

`ws://localhost:8080?token=<ws-token>`

The token is issued by the frontend endpoint `GET /api/ws-token`.

All messages are JSON strings.

### Client → Server Messages

#### Matchmaking

**Join queue:**

```json
{
  "type": "join_queue",
  "variant": "standard",
  "timeControl": { "mode": "timed", "minutes": 3, "increment": 0 }
}
```

**Leave queue:**

```json
{ "type": "leave_queue" }
```

#### Challenge Links (Play with Friend)

**Create challenge:**

```json
{
  "type": "create_challenge",
  "variant": "standard",
  "timeControl": { "mode": "unlimited" },
  "color": "white"
}
```

`color` can be `"white"`, `"black"`, or `"random"`.

**Join challenge:**

```json
{ "type": "join_challenge", "challengeId": "uuid" }
```

**Cancel challenge:**

```json
{ "type": "cancel_challenge" }
```

#### Custom Multiplayer Sync

**Sync dice result to opponent (Dice Chess):**

```json
{ "type": "sync_dice", "roomId": "uuid", "pieces": ["q", "n", "b"] }
```

**Sync card draw to opponent (Card Chess):**

```json
{ "type": "sync_card", "roomId": "uuid", "rank": "K", "suit": "H" }
```

#### Four-Player Lobby

**Create lobby:**

```json
{ "type": "create_four_player_lobby", "timeControl": { "mode": "unlimited", "minutes": 0, "increment": 0 } }
```

**Join / leave:**

```json
{ "type": "join_four_player_lobby", "lobbyId": "uuid" }
{ "type": "leave_four_player_lobby", "lobbyId": "uuid" }
```

**Leader controls:**

```json
{ "type": "start_four_player_lobby", "lobbyId": "uuid" }
{ "type": "shuffle_four_player_lobby", "lobbyId": "uuid" }
{ "type": "assign_four_player_team", "lobbyId": "uuid", "playerId": "uuid", "team": "r" }
```

**State sync + rejoin:**

```json
{ "type": "sync_four_player_state", "lobbyId": "uuid", "state": "{...json...}" }
{ "type": "rejoin_four_player_lobby", "lobbyId": "uuid", "rejoinToken": "uuid" }
```

#### In-Game Actions

**Make a move:**

```json
{ "type": "move", "from": "e2", "to": "e4", "promotion": null }
```

`promotion` is `"q"`, `"r"`, `"b"`, or `"n"` when promoting a pawn, otherwise `null`.

**Abort game:**

```json
{ "type": "abort" }
```

**Resign:**

```json
{ "type": "resign" }
```

**Draw offer:**

```json
{ "type": "offer_draw" }
{ "type": "accept_draw" }
{ "type": "decline_draw" }
```

**Notify game over** (client detected checkmate/stalemate):

```json
{ "type": "game_over_notify", "result": "White wins by checkmate", "reason": "checkmate" }
```

#### Rematch

```json
{ "type": "offer_rematch" }
{ "type": "accept_rematch" }
{ "type": "decline_rematch" }
```

#### Reconnection & Heartbeat

**Rejoin after disconnect:**

```json
{ "type": "rejoin_room", "roomId": "uuid", "rejoinToken": "uuid" }
```

**Ping:**

```json
{ "type": "ping" }
```

**Report latency:**

```json
{ "type": "latency_update", "latencyMs": 45 }
```

---

### Server → Client Messages

#### Connection

```json
{ "type": "connected", "playerId": "uuid" }
```

#### Matchmaking

```json
{ "type": "waiting" }
{ "type": "queue_left" }
{
  "type": "matched",
  "roomId": "uuid",
  "color": "white",
  "variant": "standard",
  "timeControl": { "mode": "timed", "minutes": 3, "increment": 0 },
  "startingFen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "rejoinToken": "uuid"
}
```

#### Challenges

```json
{ "type": "challenge_created", "challengeId": "uuid" }
{ "type": "challenge_not_found" }
{ "type": "challenge_joined" }
```

#### Custom Multiplayer Sync

```json
{ "type": "dice_synced", "pieces": ["q", "n", "b"] }
{ "type": "card_synced", "rank": "K", "suit": "H" }
```

#### In-Game

```json
{ "type": "opponent_move", "from": "e7", "to": "e5", "promotion": null }
{ "type": "draw_offered" }
{ "type": "draw_declined" }
{ "type": "opponent_latency", "latencyMs": 60 }
{ "type": "opponent_disconnected" }
{ "type": "opponent_reconnected" }
```

#### Game Over

```json
{
  "type": "game_over",
  "result": "White wins by resignation",
  "reason": "resign",
  "winner": "white"
}
```

#### Rematch

```json
{ "type": "rematch_offered" }
{ "type": "rematch_declined" }
```

#### Rejoin

**Success:**

```json
{
  "type": "rejoined",
  "roomId": "uuid",
  "color": "white",
  "variant": "standard",
  "timeControl": { "mode": "timed", "minutes": 3, "increment": 0 },
  "startingFen": "...",
  "moves": ["e2e4", "e7e5"],
  "rejoinToken": "uuid",
  "opponentLatencyMs": 50
}
```

**Failure:**

```json
{ "type": "rejoin_failed", "reason": "invalid_token" }
```

`reason` can be `"invalid_token"`, `"game_over"`, or `"not_in_room"`.

#### Four-Player Lobby

```json
{ "type": "four_player_lobby_created", "lobbyId": "uuid", "leaderId": "uuid", "started": false, "timeControl": { "mode": "unlimited", "minutes": 0, "increment": 0 }, "players": [] }
{ "type": "four_player_lobby_updated", "lobbyId": "uuid", "leaderId": "uuid", "started": false, "timeControl": { "mode": "unlimited", "minutes": 0, "increment": 0 }, "players": [] }
{ "type": "four_player_lobby_started", "lobbyId": "uuid", "startedAt": 1708351200000, "timeControl": { "mode": "timed", "minutes": 10, "increment": 0 }, "rejoinToken": "uuid" }
{ "type": "four_player_state_synced", "lobbyId": "uuid", "fromPlayerId": "uuid", "state": "{...json...}" }
{ "type": "four_player_lobby_rejoined", "lobbyId": "uuid", "myPlayerId": "uuid", "rejoinToken": "uuid", "leaderId": "uuid", "started": true, "timeControl": { "mode": "timed", "minutes": 10, "increment": 0 }, "players": [] }
{ "type": "four_player_player_reconnected", "playerId": "uuid" }
```

#### Other

```json
{ "type": "pong" }
{ "type": "error", "message": "..." }
```

---

## Scripts

| Script          | Command                          | Purpose                              |
|-----------------|----------------------------------|--------------------------------------|
| `dev`           | `bun --watch server.ts`          | Start with hot reload                |
| `start`         | `bun server.ts`                  | Start without hot reload             |
| `test`          | `bun test`                       | Run all unit + integration tests     |
| `test:coverage` | `./scripts/check-coverage.sh 85` | Run tests with coverage gate (85%)   |
| `lint`          | `eslint .`                       | Run ESLint                           |
| `lint:fix`      | `eslint . --fix && bun format`   | Auto-fix lint issues and format      |
| `lint:strict`   | `eslint --max-warnings=0 .`      | Strict lint (no warnings allowed)    |
| `format`        | `prettier --write .`             | Format all files                     |
| `format:check`  | `prettier --check .`             | Check formatting without writing     |

---

## Testing

All tests in this package use Bun's built-in test runner.

Run from this directory:

```bash
cd /workspaces/Zugklang/backend/ws-server
```

### Common commands

```bash
# Run all non-skipped tests
bun test

# Run a single test file
bun test tests/clock.test.ts

# Run tests matching a name
bun test -t "rejoin"

# Run lint before pushing
bun run lint
```

### End-to-end test toggle

`tests/ws.e2e.test.ts` is intentionally skipped unless explicitly enabled.

```bash
# Enable ws e2e tests for this run
RUN_WS_E2E=1 bun test tests/ws.e2e.test.ts

# Or run all suites including e2e
RUN_WS_E2E=1 bun test
```

### Coverage gate

```bash
# Fails if coverage is below 85%
bun run test:coverage
```

### What each test file covers

- `tests/auth.test.ts` — WebSocket token introspection and auth fallback behavior.
- `tests/challenge.integration.test.ts` — challenge creation, joining, and cancellation flow.
- `tests/chess.test.ts` — move application and illegal move rejection.
- `tests/clock.test.ts` — timed clock projection, settling, broadcast, and timeout behavior.
- `tests/connection.integration.test.ts` — reconnect token flow and disconnect abandonment logic.
- `tests/fen.test.ts` — starting FEN selection and Chess960 constraints.
- `tests/game.integration.test.ts` — in-game actions (draw, abort, resign, game-over, rematch).
- `tests/http.integration.test.ts` — `/health` and `/admin/stats` behavior.
- `tests/queue-game.integration.test.ts` — queue matchmaking + game flow interaction.
- `tests/rateLimit.test.ts` — per-client message rate-limit enforcement and reset.
- `tests/schemas.test.ts` — inbound WebSocket payload validation (Zod schema).
- `tests/socket.test.ts` — socket send helper and room/opponent utility behavior.
- `tests/state.test.ts` — rejoin token issuance/revocation state handling.
- `tests/sync.integration.test.ts` — dice/card sync relay rules and guardrails.
- `tests/validate.test.ts` — move square and promotion input validators.
- `tests/ws.e2e.test.ts` — full server process + websocket client end-to-end scenarios.

---

## Rate Limiting

Each WebSocket client is limited to **30 messages per 3 seconds**. Exceeding this closes the connection with code `1008 (Policy Violation)`.

---

## Supported Variants

| Variant        | Key              |
|----------------|------------------|
| Standard       | `standard`       |
| Fischer Random | `fischerRandom`  |
| Atomic         | `atomic`         |
| Antichess      | `antichess`      |
| Racing Kings   | `racingKings`    |
| Horde          | `horde`          |
| Three-Check    | `threeCheck`     |
| King of the Hill | `kingOfTheHill` |
| Crazyhouse     | `crazyhouse`     |
| Checkers       | `checkers`       |

---

## Time Control Modes

| Mode        | Description                                    |
|-------------|------------------------------------------------|
| `unlimited` | No clock                                       |
| `timed`     | Minutes + increment per move                   |
| `custom`    | Custom values (1–180 min, 0–60 sec increment)  |
