# Zugklang

> Where Strategy Meets Symphony

A modern full-stack chess platform featuring Stockfish 16 engine integration, real-time online multiplayer, immersive audio feedback, game analysis, puzzles, opening explorer, and more.

---

## What is Zugklang?

Zugklang combines a **Next.js frontend** with a **Bun-powered WebSocket server** to deliver a premium chess experience. Play against the engine, challenge friends online, review your games with deep engine analysis, or sharpen your skills with training tools.

### Features

- **Engine Play** — Stockfish 16 (WASM) with adjustable difficulty
- **Online Multiplayer** — Real-time WebSocket matchmaking, challenges, and game rooms
- **Game Analysis** — Move-by-move engine evaluation and best move suggestions
- **Training Tools** — Puzzles, opening explorer, vision and memory drills
- **Auth** — GitHub OAuth via NextAuth v5
- **Themes** — Multiple board/piece themes, full light/dark mode

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Zustand, Radix UI |
| Backend | Bun, TypeScript, Zod |
| Chess Logic | chessops, react-chessboard, Fairy Stockfish WASM |
| Database | PostgreSQL 16 via Prisma ORM |
| Auth | NextAuth v5 + Prisma adapter |
| Infrastructure | Docker, Nginx, pgAdmin |

---

## Project Structure

```
Zugklang/
├── web/                    # Next.js application
│   ├── src/
│   │   ├── app/           # Routes and pages
│   │   ├── features/      # Chess features (engine, multiplayer, analysis, etc.)
│   │   ├── components/    # Shared UI components
│   │   └── lib/           # Utilities and helpers
│   └── prisma/            # Database schema and migrations
├── backend/
│   └── ws-server/         # Bun WebSocket server
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

### 1. Database

Create a database and user:

```sql
CREATE USER admin WITH PASSWORD 'mysecretpassword';
CREATE DATABASE mydatabase OWNER admin;
```

### 2. Next.js App

```bash
cd web

# Copy and fill in environment variables
cp .env.example .env.local   # or create .env.local manually
```

Minimum required variables in `web/.env.local`:

```env
DATABASE_URL="postgresql://admin:mysecretpassword@localhost:5432/mydatabase"
NEXTAUTH_URL="http://localhost:3000"
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
  -e POSTGRES_DB=mydatabase \
  -p 5432:5432 \
  -v zugklang-pg-data:/var/lib/postgresql/data \
  postgres:16-alpine
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

### 4. Next.js App

```bash
# From the project root
docker build -t zugklang-web ./web -f ./web/Dockerfile.dev

docker run -d \
  --name zugklang-web \
  --network zugklang-net \
  -e DATABASE_URL=postgresql://admin:mysecretpassword@zugklang-postgres:5432/mydatabase \
  -e NEXT_PUBLIC_WS_URL=ws://localhost:8080 \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e AUTH_SECRET=your-secret \
  -e AUTH_GITHUB_ID=your-github-id \
  -e AUTH_GITHUB_SECRET=your-github-secret \
  -p 3000:3000 \
  zugklang-web
```

Open [http://localhost:3000](http://localhost:3000).

### Cleanup

```bash
docker stop zugklang-web zugklang-ws zugklang-postgres
docker rm zugklang-web zugklang-ws zugklang-postgres
docker volume rm zugklang-pg-data
docker network rm zugklang-net
```

---

## Running With Docker Compose

This is the recommended approach. Both dev and prod compose files wire up all services automatically on the `zugklang-net` network.

### Services

| Service | Dev port | Prod port | Description |
|---|---|---|---|
| `postgres` | 5432 | 5432 | PostgreSQL database |
| `pgadmin` | 5050 | 5050 | pgAdmin 4 web UI |
| `ws-server` | 8080 | 8080 | WebSocket server |
| `web` | 3000 | — (internal) | Next.js app |
| `nginx` | — | 80 | Reverse proxy (prod only) |

### Development

Mounts `src/`, `public/`, and `prisma/` for hot reload. Changes to source files reflect immediately without rebuilding.

```bash
docker-compose -f docker-compose.dev.yaml up --build
```

| URL | Service |
|---|---|
| http://localhost:3000 | Frontend |
| ws://localhost:8080 | WebSocket server |
| http://localhost:5050 | pgAdmin (`admin@admin.com` / `admin`) |

Environment variables are loaded from:
- `web/.env.local`
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
- `web/.env.production`
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
docker-compose -f docker-compose.dev.yaml logs -f web
docker-compose -f docker-compose.dev.yaml logs -f ws-server

# Rebuild without cache
docker-compose -f docker-compose.dev.yaml build --no-cache

# Run a Prisma command inside the running web container
docker-compose -f docker-compose.dev.yaml exec web pnpm exec prisma studio
docker-compose -f docker-compose.dev.yaml exec web pnpm exec prisma db push
```

---

## Environment Variables Reference

### Frontend

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_URL` | Yes | Public base URL of the app |
| `AUTH_SECRET` | Yes | Random secret for NextAuth |
| `AUTH_GITHUB_ID` | Yes | GitHub OAuth App client ID |
| `AUTH_GITHUB_SECRET` | Yes | GitHub OAuth App client secret |
| `NEXT_PUBLIC_WS_URL` | Yes | WebSocket server URL (`ws://` or `wss://`) |

### WebSocket Server

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | Port to listen on (default: 8080) |
| `ALLOWED_ORIGINS` | No | Comma-separated allowed origins for WS upgrades |
| `ADMIN_KEY` | No | Secret key for admin HTTP endpoints |

---

## Further Reading

- [Docker guide](web/docs/docker.md)
- [Prisma docs](web/docs/prisma.md)
- [Next.js docs](https://nextjs.org/docs)
- [Bun docs](https://bun.sh/docs)
