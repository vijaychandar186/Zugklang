# Zugklang

> Where Strategy Meets Symphony

A modern full-stack chess platform featuring Stockfish 18 engine integration, real-time online multiplayer, immersive audio feedback, game analysis, puzzles, opening explorer, and more.

---

## What is Zugklang?

Zugklang combines a **Next.js frontend** with a **Bun-powered WebSocket server** to deliver a premium chess experience. Play against the engine, challenge friends online, review your games with deep engine analysis, or sharpen your skills with training tools.

### Features

- **Engine Play** — Stockfish 18 (WASM) with adjustable difficulty
- **Online Multiplayer** — Real-time WebSocket matchmaking, challenges, and game rooms
- **Game Analysis** — Move-by-move engine evaluation and best move suggestions
- **Training Tools** — Puzzles, opening explorer, vision and memory drills
- **Auth** — GitHub OAuth via Auth.js v5
- **Themes** — Multiple board/piece themes, full light/dark mode

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Zustand, Radix UI |
| Backend | Bun, TypeScript, Zod |
| Chess Logic | chessops, react-chessboard, Fairy Stockfish WASM |
| Database | PostgreSQL 16 via Prisma ORM |
| Cache / Pub-Sub | Redis 7 (matchmaking, rejoin tokens, cross-pod routing) |
| Job Queue | BullMQ (anti-cheat delivery, game records, abort/abandon timers) |
| Auth | Auth.js v5 + Prisma adapter |
| Infrastructure | Docker, Nginx, pgAdmin |

---

## Project Structure

```
Zugklang/
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── app/           # Routes and pages
│   │   ├── features/      # Chess features (engine, multiplayer, analysis, etc.)
│   │   ├── components/    # Shared UI components
│   │   └── lib/           # Utilities and helpers
│   └── prisma/            # Database schema and migrations
├── backend/
│   ├── ws-server/         # Bun WebSocket server
│   └── anti-cheat/        # Python/FastAPI anti-cheat service (Kaladin CNN)
├── postgres/
│   └── init.sql           # Creates zugklang-anti-cheat DB on first postgres start
├── docker-compose.dev.yaml
├── docker-compose.prod.yaml
└── nginx.conf
```

---

## Running Without Docker

### Prerequisites

- **Node.js** 22+
- **pnpm** — `npm install -g pnpm`
- **Bun** — [bun.sh](https://bun.sh)
- **PostgreSQL** 16 running locally
- **Redis** 6+ running locally (`redis-server` or via Docker)

### 1. Database

Create a database and user:

```sql
CREATE USER admin WITH PASSWORD 'mysecretpassword';
CREATE DATABASE "zugklang-frontend" OWNER admin;
CREATE DATABASE "zugklang-anti-cheat" OWNER admin;
```

### 2. Frontend

```bash
cd frontend

# Copy and fill in environment variables
cp .env.example .env.local   # or create .env.local manually
```

Minimum required variables in `frontend/.env.local`:

```env
DATABASE_URL="postgresql://admin:mysecretpassword@localhost:5432/zugklang-frontend"
AUTH_URL="http://localhost:3000"
AUTH_SECRET="any-random-secret"
AUTH_GITHUB_ID="your-github-oauth-app-id"
AUTH_GITHUB_SECRET="your-github-oauth-app-secret"
```

```bash
pnpm install        # installs deps and generates Prisma client
pnpm exec prisma db push   # push schema to the database
pnpm dev            # starts on http://localhost:3000
```

### 3. WebSocket Server

Open a second terminal:

```bash
cd backend/ws-server

# Copy and fill in environment variables
cp .env.example .env.local   # or create .env.local manually
```

Minimum required variables in `backend/ws-server/.env.local`:

```env
PORT=8080
ALLOWED_ORIGINS=http://localhost:3000
ADMIN_KEY=any-secret-admin-key
REDIS_URL=redis://localhost:6379
```

```bash
bun install
bun dev             # starts on ws://localhost:8080
```

Both services are now running. Open [http://localhost:3000](http://localhost:3000).

---

## Running With Docker (manual)

Use this approach if you want fine-grained control over individual containers.

### 1. Create a shared network

```bash
docker network create zugklang-net
```

### 2. PostgreSQL

```bash
docker run -d \
  --name zugklang-postgres \
  --network zugklang-net \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -p 5432:5432 \
  -v zugklang-pg-data:/var/lib/postgresql/data \
  postgres:16-alpine

# Wait for postgres to be ready, then create both databases
docker exec zugklang-postgres pg_isready -U admin
docker exec zugklang-postgres psql -U admin -d postgres -c 'CREATE DATABASE "zugklang-frontend";'
docker exec zugklang-postgres psql -U admin -d postgres -c 'CREATE DATABASE "zugklang-anti-cheat";'
```

### 3. WebSocket Server

```bash
# From the project root
docker build -t zugklang-ws ./backend/ws-server -f ./backend/ws-server/Dockerfile.dev

docker run -d \
  --name zugklang-ws \
  --network zugklang-net \
  -e PORT=8080 \
  -e ALLOWED_ORIGINS=http://localhost:3000 \
  -p 8080:8080 \
  zugklang-ws
```

### 4. Frontend

```bash
# From the project root
docker build -t zugklang-frontend ./frontend -f ./frontend/Dockerfile.dev

docker run -d \
  --name zugklang-frontend \
  --network zugklang-net \
  -e DATABASE_URL=postgresql://admin:mysecretpassword@zugklang-postgres:5432/zugklang-frontend \
  -e NEXT_PUBLIC_WS_URL=ws://localhost:8080 \
  -e AUTH_URL=http://localhost:3000 \
  -e AUTH_SECRET=your-secret \
  -e AUTH_GITHUB_ID=your-github-id \
  -e AUTH_GITHUB_SECRET=your-github-secret \
  -p 3000:3000 \
  zugklang-frontend
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Anti-Cheat Service

```bash
# From the project root
docker build -t zugklang-anti-cheat ./backend/anti-cheat -f ./backend/anti-cheat/Dockerfile

docker run -d \
  --name zugklang-anti-cheat \
  --network zugklang-net \
  -e DATABASE_URL=postgresql://admin:mysecretpassword@zugklang-postgres:5432/zugklang-anti-cheat \
  -p 8000:8000 \
  zugklang-anti-cheat ./start.sh prod
```

### Cleanup

```bash
docker stop zugklang-frontend zugklang-ws zugklang-anti-cheat zugklang-postgres
docker rm zugklang-frontend zugklang-ws zugklang-anti-cheat zugklang-postgres
docker volume rm zugklang-pg-data
docker network rm zugklang-net
```

---

## Running With Docker Compose

This is the recommended approach. Both dev and prod compose files wire up all services automatically on the `zugklang-net` network.

### Services

| Service | Dev port | Prod port | Description |
|---|---|---|---|
| `postgres` | 5432 | 5432 | PostgreSQL 16 (hosts both `zugklang-frontend` and `zugklang-anti-cheat` DBs) |
| `pgadmin` | 5050 | 5050 | pgAdmin 4 web UI |
| `ws-server` | — (internal via Nginx) | 8080 | WebSocket server |
| `frontend` | — (internal via Nginx) | — (internal) | Next.js app |
| `anti-cheat` | 8000 | 8000 | Anti-cheat FastAPI service (Kaladin CNN) |
| `nginx` | 3000 | 80 | Reverse proxy |

### Development

Mounts `src/`, `public/`, and `prisma/` for hot reload. Changes to source files reflect immediately without rebuilding.

```bash
docker-compose -f docker-compose.dev.yaml up --build
```

| URL | Service |
|---|---|
| http://localhost:3000 | Frontend + WebSocket (via Nginx) |
| http://localhost:5050 | pgAdmin (`admin@admin.com` / `admin`) |

Environment variables are loaded from:
- `frontend/.env.local`
- `backend/ws-server/.env.local`

### Production

Builds optimized images with no source mounts. Nginx proxies port 80 to the frontend.

```bash
docker-compose -f docker-compose.prod.yaml up --build
```

| URL | Service |
|---|---|
| http://localhost | Frontend (via Nginx) |
| ws://localhost:8080 | WebSocket server |
| http://localhost:5050 | pgAdmin |

Environment variables are loaded from:
- `frontend/.env.production`
- `backend/ws-server/.env.production`

### Common Compose Commands

```bash
# Stop containers (keep volumes)
docker-compose -f docker-compose.dev.yaml down

# Stop and delete all volumes (wipes database)
docker-compose -f docker-compose.dev.yaml down -v

# View logs
docker-compose -f docker-compose.dev.yaml logs -f

# Logs for a specific service
docker-compose -f docker-compose.dev.yaml logs -f frontend
docker-compose -f docker-compose.dev.yaml logs -f ws-server

# Rebuild without cache
docker-compose -f docker-compose.dev.yaml build --no-cache

# Run a Prisma command inside the running frontend container
docker-compose -f docker-compose.dev.yaml exec frontend pnpm exec prisma studio
docker-compose -f docker-compose.dev.yaml exec frontend pnpm exec prisma db push
```

---

## Environment Variables Reference

### Frontend

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `AUTH_URL` | Yes | Public base URL of the app |
| `AUTH_SECRET` | Yes | Random secret for NextAuth |
| `AUTH_GITHUB_ID` | Yes | GitHub OAuth App client ID |
| `AUTH_GITHUB_SECRET` | Yes | GitHub OAuth App client secret |
| `NEXT_PUBLIC_WS_URL` | No | Optional WebSocket override (`ws://`/`wss://`). Leave empty to use same-origin `/ws`. |

### WebSocket Server

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Port to listen on (default: 8080) |
| `ALLOWED_ORIGINS` | No | Comma-separated allowed origins for WS upgrades |
| `ADMIN_KEY` | Yes | Secret key for admin HTTP endpoints |
| `REDIS_URL` | No | Redis connection string (default: `redis://localhost:6379`) |
| `POD_ID` | No | Unique pod identifier; auto-generated if not set |
| `POD_URL` | No | Public WS URL of this pod for cross-pod reconnection |
| `ANTI_CHEAT_URL` | No | Anti-cheat service base URL; leave unset to disable |
| `GAME_RECORD_URL` | No | Next.js game-record endpoint URL |
| `INTERNAL_API_SECRET` | No | Bearer token for the game-record endpoint |
| `WORKER_CONCURRENCY` | No | BullMQ worker concurrency per queue (default: 5) |

### Anti-Cheat Service

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string for the `zugklang-anti-cheat` database |
| `LOGGING_LEVEL` | No | Log verbosity: `DEBUG`, `INFO`, `WARNING` (default: `INFO`) |
| `BATCH_SIZE` | No | Max games per analysis batch (default: 10) |
| `BATCH_TIMEOUT` | No | Seconds before a batch is flushed (default: 15) |
| `BATCH_REFRESH_WAITING_TIME` | No | Seconds between queue polls (default: 10) |

---

## Further Reading

- [Docker guide](frontend/docs/docker.md)
- [Prisma docs](frontend/docs/prisma.md)
- [Next.js docs](https://nextjs.org/docs)
- [Bun docs](https://bun.sh/docs)
