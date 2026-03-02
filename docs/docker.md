# Docker Guide

This project includes separate Docker configurations for development and production environments.

---

## Files Overview

### Dockerfiles (in `frontend/`)

- **`Dockerfile.dev`** - Development environment with hot reload
- **`Dockerfile.prod`** - Production-optimized multi-stage build

### Docker Compose Files (at project root)

- **`docker-compose.dev.yaml`** - Development with volume mounts for hot reload
- **`docker-compose.prod.yaml`** - Production configuration with Nginx reverse proxy

---

## Services

| Service       | Description                                         | Dev container name           | Prod container name           |
|---------------|-----------------------------------------------------|------------------------------|-------------------------------|
| `postgres`    | PostgreSQL 16 (hosts `zugklang-frontend` + `zugklang-anti-cheat` DBs) | `zugklang-postgres-dev` | `zugklang-postgres-prod` |
| `pgadmin`     | pgAdmin 4 web UI for the database                   | `zugklang-pgadmin-dev`       | `zugklang-pgadmin-prod`       |
| `ws-server`   | WebSocket backend server                            | `zugklang-ws-dev`            | `zugklang-ws-prod`            |
| `frontend`    | Next.js application                                 | `zugklang-frontend-dev`      | `zugklang-frontend-prod`      |
| `anti-cheat`  | Python/FastAPI anti-cheat service (Kaladin CNN)     | `zugklang-anti-cheat-dev`    | `zugklang-anti-cheat-prod`    |
| `nginx`       | Reverse proxy (prod only)                           | —                            | `zugklang-nginx-prod`         |

All services are connected via the `zugklang-net` bridge network.

---

## Development Environment

### Start Development Containers

```bash
docker-compose -f docker-compose.dev.yaml up --build
```

### Features

- **Hot Reload** - Source code changes reflect immediately
- **Volume Mounts** - `src/`, `public/`, `prisma/` directories mounted
- **Fast Iterations** - No rebuild needed for code changes
- **Isolated Database** - Separate PostgreSQL volume (`postgres_dev_data`)

### Access Points

- **Frontend (Next.js)**: http://localhost:3000
- **WebSocket Server**: ws://localhost:8080
- **Anti-Cheat API**: http://localhost:8000
- **PostgreSQL**: localhost:5432
- **pgAdmin**: http://localhost:5050
  - Email: `admin@admin.com`
  - Password: `admin`

---

## Production Environment

### Build and Run Production Containers

```bash
docker-compose -f docker-compose.prod.yaml up --build
```

### Features

- **Multi-Stage Build** - Optimized image size
- **Standalone Output** - Next.js standalone mode
- **No Source Mounts** - Code baked into image
- **Nginx Reverse Proxy** - Routes traffic on port 80 to the frontend

### Access Points

- **Nginx (Reverse Proxy)**: http://localhost:80
- **WebSocket Server**: ws://localhost:8080
- **Anti-Cheat API**: http://localhost:8000
- **PostgreSQL**: localhost:5432 (external)
- **pgAdmin**: http://localhost:5050
  - Email: `admin@admin.com`
  - Password: `admin`

---

## Common Commands

### Stop All Containers

```bash
# Development
docker-compose -f docker-compose.dev.yaml down

# Production
docker-compose -f docker-compose.prod.yaml down
```

### Stop and Remove Volumes

```bash
# Development (removes database data)
docker-compose -f docker-compose.dev.yaml down -v

# Production
docker-compose -f docker-compose.prod.yaml down -v
```

### View Logs

```bash
# All services
docker-compose -f docker-compose.dev.yaml logs -f

# Specific service
docker-compose -f docker-compose.dev.yaml logs -f frontend
docker-compose -f docker-compose.dev.yaml logs -f ws-server
```

### Rebuild Without Cache

```bash
# Development
docker-compose -f docker-compose.dev.yaml build --no-cache

# Production
docker-compose -f docker-compose.prod.yaml build --no-cache
```

---

## Database Management

### Access PostgreSQL CLI

```bash
# Development
docker exec -it zugklang-postgres-dev psql -U admin -d zugklang-frontend

# Production
docker exec -it zugklang-postgres-prod psql -U admin -d zugklang-frontend
```

### Run Prisma Commands

```bash
# Generate Prisma client
docker-compose -f docker-compose.dev.yaml exec frontend pnpm exec prisma generate

# Push schema changes (dev)
docker-compose -f docker-compose.dev.yaml exec frontend pnpm exec prisma db push

# Open Prisma Studio
docker-compose -f docker-compose.dev.yaml exec frontend pnpm exec prisma studio
```

---

## Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
lsof -i :3000
lsof -i :8080

# Stop the conflicting process or change the port in the compose file
```

### Database Connection Issues

1. Ensure the PostgreSQL container is healthy:
   ```bash
   docker ps | grep postgres
   ```

2. Check `DATABASE_URL` inside the frontend container:
   ```bash
   docker-compose -f docker-compose.dev.yaml exec frontend env | grep DATABASE_URL
   ```

3. Verify credentials match across:
   - `frontend/.env.local` (dev) or `frontend/.env.production` (prod)
   - The `environment` block in the compose file

### Hot Reload Not Working

Volume mounts should handle this, but if changes aren't reflected:

1. Check volume mounts in `docker-compose.dev.yaml`
2. Restart the dev container:
   ```bash
   docker-compose -f docker-compose.dev.yaml restart frontend
   ```

---

## Environment Variables

### Development (`frontend/.env.local`)

```env
DATABASE_URL="postgresql://admin:mysecretpassword@postgres:5432/zugklang-frontend"
AUTH_URL="http://localhost:3000"
AUTH_SECRET="your-secret-key"
AUTH_GITHUB_ID="your-github-oauth-id"
AUTH_GITHUB_SECRET="your-github-oauth-secret"
```

### Production (`frontend/.env.production`)

```env
DATABASE_URL="postgresql://admin:mysecretpassword@postgres:5432/zugklang-frontend"
NEXT_PUBLIC_WS_URL="wss://your-domain.com"
AUTH_SECRET="your-secret-key"
AUTH_GITHUB_ID="your-github-oauth-id"
AUTH_GITHUB_SECRET="your-github-oauth-secret"
```

### WebSocket Server (`backend/ws-server/.env.local` / `.env.production`)

```env
ADMIN_KEY="your-admin-key"
```

### Anti-Cheat Service (`backend/anti-cheat/.env` / `.env.production`)

```env
DATABASE_URL="postgresql://admin:mysecretpassword@postgres:5432/zugklang-anti-cheat"
LOGGING_LEVEL=INFO
BATCH_SIZE=10
BATCH_TIMEOUT=15
BATCH_REFRESH_WAITING_TIME=10
```

### Container vs Host URLs

- **In containers**: Use service names (e.g., `postgres:5432`, `frontend:3000`)
- **On host machine**: Use `localhost` with the exposed port (e.g., `localhost:5432`)

---

## Best Practices

1. **Development**: Use `docker-compose.dev.yaml` for active development
2. **Production Testing**: Test with `docker-compose.prod.yaml` before deploying
3. **Keep env files updated**: Ensure credentials match across all configurations
4. **Clean Builds**: Use `--no-cache` when dependencies or the Prisma schema change
5. **Monitor Logs**: Use `docker-compose logs -f` to debug issues
6. **pgAdmin in production**: Change the default pgAdmin credentials before exposing to a public server

---

## Next Steps

- [Prisma Documentation](./prisma.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
