# Zugklang

> Where Strategy Meets Symphony

A modern full-stack chess platform featuring Stockfish 18 engine integration, real-time online multiplayer, immersive audio feedback, game analysis, puzzles, opening explorer, anti-cheat detection, and a full observability stack.

---

## Features

- **Engine Play** — Stockfish 18 (WASM) with adjustable difficulty
- **Online Multiplayer** — Real-time WebSocket matchmaking, challenges, and game rooms
- **Game Analysis** — Move-by-move engine evaluation and best move suggestions
- **Training Tools** — Puzzles, opening explorer, vision and memory drills
- **Auth** — GitHub OAuth via Auth.js v5
- **Themes** — Multiple board/piece themes, full light/dark mode
- **Anti-Cheat** — Kaladin CNN-based behavioural engine detection with automatic banning
- **Observability** — Prometheus metrics, distributed tracing (Tempo), log aggregation (Loki), Grafana dashboards

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Zustand, Radix UI |
| WebSocket Server | Bun, TypeScript, Zod, BullMQ |
| Anti-Cheat | Python 3.12, FastAPI, TensorFlow/Keras, SHAP, Prisma (Python) |
| Chess Logic | chessops, react-chessboard, Fairy Stockfish WASM |
| Database | PostgreSQL 16 via Prisma ORM (two separate DBs) |
| Cache / Pub-Sub | Redis 8 (matchmaking, rejoin tokens, ban enforcement, cross-pod routing) |
| Job Queue | BullMQ (anti-cheat delivery, game records, abort/abandon timers) |
| Auth | Auth.js v5 + Prisma adapter |
| Observability | Prometheus, Grafana, Grafana Tempo, Grafana Loki, Promtail, OpenTelemetry Collector |
| Reverse Proxy | Nginx |
| Infrastructure | Docker, Docker Compose |

---

## Project Structure

```
Zugklang/
├── frontend/                   # Next.js application
│   ├── src/
│   │   ├── app/               # Routes and pages
│   │   │   └── api/admin/ban/ # Admin ban/unban API endpoint
│   │   ├── features/          # Chess features (engine, multiplayer, analysis, etc.)
│   │   ├── components/        # Shared UI components
│   │   └── lib/               # Utilities, Redis client, Prisma client
│   └── prisma/                # Frontend DB schema and migrations
├── backend/
│   ├── ws-server/             # Bun WebSocket server (matchmaking, game rooms, BullMQ)
│   └── anti-cheat/            # Python/FastAPI anti-cheat service (Kaladin CNN)
│       ├── src/               # FastAPI app, ML inference, queue manager
│       ├── model/             # Saved TensorFlow models (bullet/blitz, rapid/classical)
│       └── schema.prisma      # Anti-cheat DB schema (game insights, analysis queue, users)
├── monitoring/
│   ├── prometheus.yml         # Scrape configs for all services
│   ├── otel-collector.yml     # OpenTelemetry collector pipeline
│   ├── tempo.yml              # Distributed trace storage config
│   ├── loki.yml               # Log aggregation config
│   ├── promtail.yml           # Log shipper config
│   ├── postgres_exporter.yml  # PostgreSQL metrics config
│   └── grafana/
│       ├── provisioning/      # Auto-provisioned datasources (Prometheus, Tempo, Loki, PostgreSQL)
│       └── dashboards/        # Auto-provisioned dashboards (anti-cheat)
├── postgres/
│   └── init.sql               # Creates zugklang-anti-cheat DB on first postgres start
├── docker-compose.dev.yaml
└── docker-compose.prod.yaml
```

---

## Databases

Two PostgreSQL databases share a single PostgreSQL instance:

| Database | Owned by | Contains |
|---|---|---|
| `zugklang-frontend` | Next.js / Prisma JS | Users, sessions, games, ratings, puzzles, training |
| `zugklang-anti-cheat` | Anti-cheat / Prisma Python | Game insights, per-move data, analysis queue, engine flags |

---

## Anti-Cheat System

The Kaladin anti-cheat runs a CNN over per-move behavioural features (move time, blur, time variance, material, phase, piece moved) to produce a cheating probability score (0–1) for each player.

### Flow

1. When a game ends, the WS server enqueues an `AntiCheatPayload` via BullMQ.
2. The anti-cheat service ingests the game, computes per-move Kaladin fields, and stores them in PostgreSQL.
3. Both players are added to the `analysis_queue`.
4. The `QueueManager` polls the queue, runs batch ML inference, and writes prediction scores back.
5. Results are published to the `analysis:done` Redis channel and forwarded to connected clients.
6. If `pred >= BAN_THRESHOLD` (default `0.9`), the user's `banned:{userId}` key is set in Redis automatically.

### Ban Enforcement

Bans are enforced at three layers in the WS server:

| Check point | File |
|---|---|
| WebSocket connection open | `backend/ws-server/server.ts` |
| Queue join (`join_queue`) | `backend/ws-server/handlers/queue.ts` |
| Challenge create/join | `backend/ws-server/handlers/challenge.ts` |

All three check `GET banned:{userId}` in Redis. A banned user receives:
```json
{ "type": "error", "message": "Your account has been suspended for fair play violations." }
```

### Manual Ban / Unban

Use the admin API endpoint (requires `INTERNAL_API_SECRET`):

```bash
# Ban a user
curl -X POST https://your-domain/api/admin/ban \
  -H "Authorization: Bearer $INTERNAL_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"userId": "clx1234abc", "banned": true}'

# Unban a user
curl -X POST https://your-domain/api/admin/ban \
  -H "Authorization: Bearer $INTERNAL_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"userId": "clx1234abc", "banned": false}'

# Check ban status
curl "https://your-domain/api/admin/ban?userId=clx1234abc" \
  -H "Authorization: Bearer $INTERNAL_API_SECRET"
```

This writes to both the frontend `users` table (`banned`, `banned_at` columns) and Redis.

---

## Observability Stack

All services export metrics/traces/logs to a central collection pipeline.

```
Services → OpenTelemetry Collector → Prometheus (metrics)
                                   → Tempo (traces)
                                   → Loki (logs via Promtail)
                                   → Grafana (dashboards)
```

### Grafana Dashboards

| Dashboard | Source |
|---|---|
| Anti-Cheat Dashboard | Auto-provisioned from `monitoring/grafana/dashboards/anticheat.json` |

The anti-cheat dashboard shows: service health, queue depth over time, prediction score distribution, top suspects table, engine-flagged users, games ingested per day, time control split, and move analytics (blur rate, avg move time).

### Datasources (auto-provisioned)

| Name | Type | URL |
|---|---|---|
| Prometheus | Prometheus | `http://prometheus:9090` |
| Tempo | Tempo | `http://tempo:3200` |
| Loki | Loki | `http://loki:3100` |
| Anticheat PostgreSQL | PostgreSQL | `postgres:5432 / zugklang-anti-cheat` |

---

## Running Without Docker

### Prerequisites

- **Node.js** 22+, **pnpm** (`npm install -g pnpm`)
- **Bun** — [bun.sh](https://bun.sh)
- **Python** 3.12+, **uv** (`pip install uv`)
- **PostgreSQL** 16 running locally
- **Redis** 8+ running locally

### 1. Database Setup

```sql
CREATE USER admin WITH PASSWORD 'mysecretpassword';
CREATE DATABASE "zugklang-frontend" OWNER admin;
CREATE DATABASE "zugklang-anti-cheat" OWNER admin;
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local
```

Minimum `frontend/.env.local`:

```env
DATABASE_URL="postgresql://admin:mysecretpassword@localhost:5432/zugklang-frontend"
REDIS_URL="redis://localhost:6379"
AUTH_URL="http://localhost:3000"
AUTH_SECRET="any-random-secret"
AUTH_GITHUB_ID="your-github-oauth-app-id"
AUTH_GITHUB_SECRET="your-github-oauth-app-secret"
INTERNAL_API_SECRET="your-internal-secret"
```

```bash
pnpm install
pnpm exec prisma migrate dev   # or: pnpm exec prisma db push
pnpm dev                       # http://localhost:3000
```

### 3. WebSocket Server

```bash
cd backend/ws-server
cp .env.example .env.local
```

Minimum `backend/ws-server/.env.local`:

```env
PORT=8080
ALLOWED_ORIGINS=http://localhost:3000
ADMIN_KEY=any-secret-admin-key
REDIS_URL=redis://localhost:6379
ANTI_CHEAT_URL=http://localhost:8000/anti-cheat
INTERNAL_API_SECRET=your-internal-secret
```

```bash
bun install
bun dev    # ws://localhost:8080
```

### 4. Anti-Cheat Service

```bash
cd backend/anti-cheat
cp .env.example .env.local
```

Minimum `backend/anti-cheat/.env.local`:

```env
DATABASE_URL="postgresql://admin:mysecretpassword@localhost:5432/zugklang-anti-cheat"
REDIS_URL="redis://localhost:6379"
INTERNAL_API_SECRET="your-internal-secret"
BAN_THRESHOLD=0.9
```

```bash
uv sync
uv run prisma db push
./start.sh dev    # http://localhost:8000
```

---

## Running With Docker Compose

This is the recommended approach. Both dev and prod compose files wire all services on the `zugklang-net` network.

### Development

```bash
docker compose -f docker-compose.dev.yaml up --build
```

| URL | Service |
|---|---|
| http://localhost:3000 | Frontend + WebSocket (via Nginx) |
| http://localhost:5050 | pgAdmin (`admin@admin.com` / `admin`) |

### Production

```bash
docker compose -f docker-compose.prod.yaml up --build
```

| URL | Service |
|---|---|
| http://localhost | Frontend (via Nginx, port 80) |
| http://localhost/grafana | Grafana dashboards |

### Services

| Service | Description |
|---|---|
| `postgres` | PostgreSQL 16 — hosts `zugklang-frontend` and `zugklang-anti-cheat` DBs |
| `redis` | Redis 8 — matchmaking, ban keys, pub-sub, rejoin tokens |
| `ws-server` | Bun WebSocket server — matchmaking, game rooms, BullMQ workers |
| `frontend` | Next.js app — UI, REST API, Auth.js, Prisma |
| `anti-cheat` | FastAPI + TensorFlow — Kaladin ML engine detection |
| `nginx` | Reverse proxy — routes `/ws` to ws-server, `/grafana` to Grafana |
| `prometheus` | Metrics collection and storage |
| `grafana` | Dashboards (anti-cheat, infra) — auto-provisioned on startup |
| `otel-collector` | OpenTelemetry collector — receives OTLP traces/metrics, fans out |
| `tempo` | Distributed trace storage |
| `loki` | Log aggregation |
| `promtail` | Scrapes container logs and ships to Loki |
| `redis-exporter` | Redis → Prometheus metrics |
| `postgres-exporter` | PostgreSQL → Prometheus metrics |
| `nginx-prometheus-exporter` | Nginx → Prometheus metrics |

### Common Compose Commands

```bash
# Stop containers (keep volumes)
docker compose -f docker-compose.prod.yaml down

# Stop and delete all volumes (wipes all data)
docker compose -f docker-compose.prod.yaml down -v

# View logs for all services
docker compose -f docker-compose.prod.yaml logs -f

# Logs for a specific service
docker compose -f docker-compose.prod.yaml logs -f anti-cheat
docker compose -f docker-compose.prod.yaml logs -f ws-server

# Run a Prisma command inside the running frontend container
docker compose -f docker-compose.dev.yaml exec frontend pnpm exec prisma studio
docker compose -f docker-compose.dev.yaml exec frontend pnpm exec prisma migrate dev
```

---

## Environment Variables Reference

### Frontend

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection for `zugklang-frontend` |
| `REDIS_URL` | Yes | Redis connection string |
| `AUTH_URL` | Yes | Public base URL of the app |
| `AUTH_SECRET` | Yes | Random secret for NextAuth |
| `AUTH_GITHUB_ID` | Yes | GitHub OAuth App client ID |
| `AUTH_GITHUB_SECRET` | Yes | GitHub OAuth App client secret |
| `INTERNAL_API_SECRET` | Yes | Bearer token for `/api/admin/ban` and inter-service calls |
| `NEXT_PUBLIC_WS_URL` | No | WebSocket override (`ws://`/`wss://`). Leave empty to use same-origin `/ws` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | No | OpenTelemetry collector HTTP endpoint |

### WebSocket Server

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Port to listen on (default: `8080`) |
| `ALLOWED_ORIGINS` | No | Comma-separated allowed origins for WS upgrades |
| `ADMIN_KEY` | Yes | Secret for admin HTTP endpoints |
| `REDIS_URL` | No | Redis connection string (default: `redis://localhost:6379`) |
| `ANTI_CHEAT_URL` | No | Anti-cheat base URL — leave unset to disable |
| `GAME_RECORD_URL` | No | Next.js game-record endpoint URL |
| `INTERNAL_API_SECRET` | No | Bearer token for game-record and anti-cheat endpoints |
| `POD_ID` | No | Unique pod identifier; auto-generated if not set |
| `POD_URL` | No | Public WS URL of this pod for cross-pod reconnection |
| `WORKER_CONCURRENCY` | No | BullMQ worker concurrency per queue (default: `5`) |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | No | OpenTelemetry collector HTTP endpoint |

### Anti-Cheat Service

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection for `zugklang-anti-cheat` |
| `REDIS_URL` | Yes | Redis connection string — used for queue notify and ban keys |
| `INTERNAL_API_SECRET` | Yes | Bearer token to accept calls from the WS server |
| `BAN_THRESHOLD` | No | Prediction score above which a user is auto-banned (default: `0.9`) |
| `LOGGING_LEVEL` | No | Log verbosity: `DEBUG`, `INFO`, `WARNING` (default: `INFO`) |
| `BATCH_SIZE` | No | Max users per analysis batch (default: `50`) |
| `BATCH_TIMEOUT` | No | Seconds before a partial batch is flushed (default: `30`) |
| `BATCH_REFRESH_WAITING_TIME` | No | Seconds to block on Redis queue notify (default: `5`) |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | No | OpenTelemetry collector HTTP endpoint |

### Production Compose (top-level `.env`)

| Variable | Required | Description |
|---|---|---|
| `POSTGRES_USER` | Yes | PostgreSQL superuser |
| `POSTGRES_PASSWORD` | Yes | PostgreSQL password |
| `REDIS_PASSWORD` | Yes | Redis `requirepass` value |
| `GRAFANA_ADMIN_PASSWORD` | Yes | Grafana admin password |
| `GRAFANA_PUBLIC_URL` | Yes | Public URL for Grafana (e.g. `https://your-domain/grafana`) |

---

## Migrations

### Frontend (Prisma JS)

```bash
# Apply schema changes to the running DB
pnpm exec prisma migrate dev --name <migration-name>

# Or push schema without a migration file (dev/staging only)
pnpm exec prisma db push
```

### Anti-Cheat (Prisma Python)

```bash
cd backend/anti-cheat
uv run prisma db push
```

---

## Further Reading

- [Next.js docs](https://nextjs.org/docs)
- [Bun docs](https://bun.sh/docs)
- [Prisma docs](https://www.prisma.io/docs)
- [BullMQ docs](https://docs.bullmq.io)
- [Grafana provisioning docs](https://grafana.com/docs/grafana/latest/administration/provisioning/)
- [OpenTelemetry docs](https://opentelemetry.io/docs/)