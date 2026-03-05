# Production Hardening: Full Change Log

This document records every security, scalability, and operational improvement applied to the Zugklang codebase in the production hardening pass.

---

## Summary

The codebase had solid architectural foundations (typed, BullMQ, Redis, Glicko2, multi-pod routing) but was not production-safe due to a collection of critical bugs, security holes, and operational gaps. All items below have been addressed.

---

## 🔴 Critical Fixes (deploy-blocking)

### 1. Runtime Bug — `ABANDON_TIMEOUT_MS` not imported (`connection.ts`)

**Before:** `ABANDON_TIMEOUT_MS` was used in a `setTimeout` call (line 122) inside the 4-player disconnect handler but was never imported. Any 4-player lobby disconnect would throw a `ReferenceError` at runtime.

**After:** Added `import { ABANDON_TIMEOUT_MS } from '../config';` at the top of `backend/ws-server/handlers/connection.ts`.

---

### 2. WS Token In-Memory Map → Redis

**Before:** `frontend/src/app/api/ws-token/route.ts` stored pending WS tokens in a module-level `Map`. In multi-pod Next.js deployments each instance had its own Map — if the WS server's introspection HTTP call hit a different pod than the one that issued the token, authentication would randomly fail (return 404).

**After:** Replaced the in-memory Map with Redis `SET ws:pending:{token} {userId} EX 60 NX` (issue) and `GETDEL ws:pending:{token}` (validate + consume atomically). Tokens are now shared across all pods, one-time use, and auto-expire.

Files changed:
- `frontend/src/app/api/ws-token/route.ts` — complete rewrite

---

### 3. Hardcoded Secrets Removed from Compose Files

**Before:** `docker-compose.prod.yaml` and `docker-compose.dev.yaml` contained:
- `POSTGRES_PASSWORD: mysecretpassword` (hardcoded)
- `DATABASE_URL: postgresql://admin:mysecretpassword@...` (hardcoded)
- pgAdmin defaults: `admin@admin.com` / `admin`

**After:**
- All passwords now reference env vars: `${POSTGRES_PASSWORD}`, `${REDIS_PASSWORD}`, etc.
- Root `.gitignore` created to protect `.env`, `.env.production`, `.env.local`
- `secrets/README.md` created with generation instructions
- `frontend/.env.example` cleaned of real-looking secrets (`BETTER_AUTH_SECRET` hash and Prisma API key removed)

---

### 4. pgAdmin Removed from Production Compose

**Before:** `docker-compose.prod.yaml` included `pgadmin` service with default credentials exposed on port 5050.

**After:** `pgadmin` service removed entirely from `docker-compose.prod.yaml`. Database admin access should happen via a VPN or bastion host.

---

### 5. Internal Service Ports Unexposed in Production

**Before:** `ws-server` (8080), `anti-cheat` (8000), and `postgres` (5432) all published ports to the host machine, making them directly reachable bypassing nginx.

**After:** Changed to `expose:` (internal network only) for `ws-server`, `anti-cheat`, and `postgres`. Only nginx binds ports 80 and 443 externally.

---

### 6. WS Origin Check Fails-Closed in Production

**Before:** `backend/ws-server/server.ts` line 69: `if (ALLOWED_ORIGINS.length === 0) return true` — if `ALLOWED_ORIGINS` env var was not set in production, all origins were accepted.

**After:** Changed to fail-closed: empty `ALLOWED_ORIGINS` returns `false` when `NODE_ENV === 'production'`, and `true` only in development.

---

### 7. Anti-Cheat Endpoints Authenticated

**Before:** `POST /game`, `POST /analyse`, `POST /queue/start`, `POST /train` had no authentication. Anyone reaching port 8000 could inject fake game data or trigger model training.

**After:**
- Added `INTERNAL_API_SECRET` config variable to `backend/anti-cheat/src/config.py`
- Added `_require_internal_auth` FastAPI `HTTPBearer` dependency
- Applied to all four write endpoints via `dependencies=[Security(_require_internal_auth)]`
- `GET /health` and `GET /queue/status` remain public for load balancer checks

---

## 🟠 High Priority Fixes

### 8. `redis.keys()` Replaced with `SCAN` in Admin Handler

**Before:** `backend/ws-server/handlers/http.ts` called `redis.keys('queue:*:*:*:*')` in both `/admin/stats` and `/admin` endpoints. `KEYS` is O(N) and **blocks the entire Redis event loop** — under load this would stall every other Redis operation across all services.

**After:** Replaced both calls with an async `scanKeys()` helper that iterates using `SCAN ... COUNT 100` in non-blocking cursor batches.

---

### 9. Matchmaking: O(n) Full Queue Scan → Bounded `ZRANGEBYSCORE`

**Before:** `backend/ws-server/handlers/queue.ts` line 310: `redis.zrange(queueKey, 0, -1)` fetched all queued players as candidates, then did per-candidate `HGETALL` lookups. Under 1000 concurrent players this becomes thousands of Redis round-trips per join event.

**After:**
- Changed the ZADD score from `queuedAt` to `rating` so players are indexed by rating in the sorted set
- Replaced `ZRANGE 0 -1` with `ZRANGEBYSCORE minRating maxRating LIMIT 0 20` (capped at 20 candidates)
- `eloCompatible()` check still runs on the small candidate set (handles expanding wait-time bands)
- Updated all three `redis.zadd()` calls to use `rating` as the score

---

### 10. nginx Production Config (`nginx.prod.conf`)

**Before:** `nginx.conf` was shared between dev and prod and had:
- No HTTPS/TLS
- No security headers
- Webpack HMR route exposed (`/_next/webpack-hmr`)
- Redis Commander and pgAdmin publicly routed
- No rate limiting

**After:** Created `nginx.prod.conf` (referenced in prod compose):
- HTTP → HTTPS redirect (port 80)
- TLS with TLSv1.2/1.3 only, strong cipher suite, OCSP stapling
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `X-XSS-Protection`, `Strict-Transport-Security`, `Content-Security-Policy`
- Nginx rate limiting: `limit_req_zone` for API (30r/m) and WS (5r/m) endpoints
- `client_max_body_size 2m`, request/response timeouts
- Removed all dev routes (HMR, Redis Commander, pgAdmin)
- Anti-cheat no longer publicly routed (internal only)
- Grafana exposed at `/grafana/` with IP restriction comment

---

### 11. Redis Password Authentication

**Before:** Redis had no password (`--requirepass` not set), so any container on the network could access all data.

**After:** Added `--requirepass ${REDIS_PASSWORD}` to Redis command; all `REDIS_URL` values updated to `redis://:${REDIS_PASSWORD}@redis:6379`.

---

### 12. Container Security Hardening

**After (all services in `docker-compose.prod.yaml`):**
- `security_opt: [no-new-privileges:true]` — prevents privilege escalation
- `cap_drop: [ALL]` — drops all Linux capabilities (with selective `cap_add` where needed)
- `deploy.resources.limits` — CPU and memory limits per service
- `HEALTHCHECK` instructions added to `Dockerfile.prod` files for frontend, ws-server, and anti-cheat
- Anti-cheat Dockerfile now creates and uses a non-root `kaladin` user

---

### 13. Hardcoded ngrok URL Removed from `next.config.ts`

**Before:** `allowedDevOrigins` contained a hardcoded development ngrok domain (`unmellifluently-unforcible-ricky.ngrok-free.dev`).

**After:** Reads from `NEXT_ALLOWED_DEV_ORIGINS` env var (comma-separated), falling back to `['localhost:3000']`.

---

## 🟡 Medium Priority Fixes

### 14. Prisma Migration Discipline

**Before:** `docker-compose.dev.yaml` and `frontend/Dockerfile.dev` used `prisma db push` (destructive, no migration history). Production had no migration step at all.

**After:**
- `docker-compose.dev.yaml` and `Dockerfile.dev` now use `prisma migrate dev`
- `frontend/Dockerfile.prod` now runs `npx prisma migrate deploy` before `node server.js`
- Migrations folder should be tracked in git (`frontend/prisma/migrations/`)

---

### 15. CI Quality Gates Improved

**Frontend CI (`.github/workflows/frontend-ci.yml`):**
- Added gitleaks secret scanning step
- Added test coverage with thresholds (70% lines/functions via vitest `--coverage`)
- Added production build step (`pnpm build`) with stub env vars
- Added `pnpm audit --audit-level=high` dependency check

**Anti-Cheat CI (`.github/workflows/anti-cheat-ci.yml`):**
- Added gitleaks secret scanning step
- Changed `pytest` to run with `--cov=src --cov-fail-under=70` coverage enforcement
- Added `pip-audit` dependency vulnerability check
- Added Trivy container image scanning (blocks on CRITICAL/HIGH)

**WS Server CI (`.github/workflows/ws-server-ci.yml`):**
- Added gitleaks secret scanning step

---

### 16. Observability Stack Added

**Prometheus + Grafana added to `docker-compose.prod.yaml`:**
- `prometheus` service scraping ws-server (`/metrics`), anti-cheat (`/metrics`), nginx, redis, postgres exporters
- `grafana` service with auto-provisioned Prometheus datasource, served at `/grafana/` behind nginx
- Config files: `monitoring/prometheus.yml`, `monitoring/grafana/provisioning/`

**WS Server Prometheus metrics (`backend/ws-server/`):**
- Created `utils/metrics.ts` — lightweight counter/gauge registry, renders Prometheus text format
- `handlers/http.ts` — added `/metrics` endpoint exposing: `ws_connected_players`, `ws_active_rooms`, `ws_ended_rooms`, `ws_open_challenges`, `ws_queued_players` (gauges), `ws_auth_failures_total` (counter)
- `server.ts` — increments `ws_auth_failures_total` on every rejected WS connection

**Anti-cheat:** `prometheus-fastapi-instrumentator` should be added to `pyproject.toml` to auto-expose `/metrics` for HTTP request counts, latencies, etc.

**WS Server logging:** Already emitted JSON (`logger.ts`) — no change needed.

---

### 17. API Rate Limiting Added

**Before:** Critical API endpoints had no rate limiting — a single user could spam game saves or game reports.

**After:** Used existing `checkRateLimit()` from `frontend/src/lib/redis.ts`:

| Endpoint | Limit |
|----------|-------|
| `POST /api/games` | 10 req/min per user |
| `POST /api/game-review/report` | 5 req/min per user |

---

### 18. Root `.gitignore` Created

Added `/.gitignore` at repo root to protect `.env`, `.env.production`, `.env.local`, `docker-compose.override.yml`, Python artifacts, and logs from accidental commits.

---

## Files Changed

| File | Change |
|------|--------|
| `backend/ws-server/handlers/connection.ts` | Added `ABANDON_TIMEOUT_MS` import |
| `frontend/src/app/api/ws-token/route.ts` | Rewrote: Redis SETEX/GETDEL replaces in-memory Map |
| `backend/ws-server/server.ts` | Fail-closed origin check + auth failure counter |
| `backend/anti-cheat/src/config.py` | Added `INTERNAL_API_SECRET` |
| `backend/anti-cheat/src/main.py` | Added `_require_internal_auth` dependency on 4 endpoints |
| `backend/ws-server/handlers/http.ts` | `redis.keys()` → `scanKeys()` + `/metrics` endpoint |
| `backend/ws-server/handlers/queue.ts` | ZRANGEBYSCORE + bounded candidates + rating as score |
| `backend/ws-server/utils/metrics.ts` | **NEW** — lightweight Prometheus metrics module |
| `docker-compose.prod.yaml` | Full overhaul: env vars, no pgAdmin, no exposed ports, Redis auth, container hardening, monitoring |
| `nginx.prod.conf` | **NEW** — production nginx with TLS, security headers, rate limiting |
| `frontend/next.config.ts` | Env-driven `allowedDevOrigins`, removed ngrok hardcode |
| `.github/workflows/frontend-ci.yml` | Prod build + coverage + gitleaks + audit |
| `.github/workflows/anti-cheat-ci.yml` | Coverage + pip-audit + Trivy + gitleaks |
| `.github/workflows/ws-server-ci.yml` | gitleaks added |
| `frontend/src/app/api/games/route.ts` | Rate limiting (10 req/min) |
| `frontend/src/app/api/game-review/report/route.ts` | Rate limiting (5 req/min) |
| `frontend/Dockerfile.prod` | `prisma migrate deploy` + `HEALTHCHECK` |
| `frontend/Dockerfile.dev` | `prisma migrate dev` replaces `db push` |
| `backend/ws-server/Dockerfile.prod` | `HEALTHCHECK` added |
| `backend/anti-cheat/Dockerfile` | Non-root user + `HEALTHCHECK` |
| `docker-compose.dev.yaml` | `prisma migrate dev` replaces `db push` |
| `frontend/.env.example` | Removed real-looking secrets |
| `.gitignore` | **NEW** — root-level gitignore for secrets |
| `secrets/README.md` | **NEW** — secrets management guide |
| `monitoring/prometheus.yml` | **NEW** — Prometheus scrape config; targets: ws-server, anti-cheat, nginx, redis-exporter, postgres-exporter, otel-collector |
| `monitoring/grafana/provisioning/` | **NEW** — Grafana auto-provisioning |
| `monitoring/otel-collector.yml` | **NEW** — OTel Collector config; debug exporter excluded from pipelines |
| `monitoring/tempo.yml` | **NEW** — Tempo trace storage |
| `monitoring/loki.yml` | **NEW** — Loki log storage |
| `monitoring/promtail.yml` | **NEW** — Promtail Docker socket log scraping |

---

## Observability Phase 2 — OpenTelemetry + Sentry + Monitoring Wiring Fixes

### Monitoring Stack Stability Fixes

Six bugs in the monitoring configuration were causing silent failures at startup. All have been corrected.

**prometheus.yml — three broken scrape targets fixed:**

| Job | Problem | Fix |
|-----|---------|-----|
| `nginx` | `nginx:9113` — no backing service | Added `nginx-prometheus-exporter` service; added `stub_status` block to `nginx.prod.conf` on port 8081 (internal only) |
| `redis` | `redis-exporter:9121` — service did not exist | Added `redis-exporter` service (`oliver006/redis_exporter`) |
| `postgres` | `postgres-exporter:9187` — service did not exist | Added `postgres-exporter` service (`prometheuscommunity/postgres-exporter`) |
| `otel-collector` | Not scraped at all — OTLP app metrics were silently dropped | Added `otel-collector:8889` scrape job |

**promtail — Docker log discovery completely broken:**
- `docker_sd_configs.host` was set to `unix:///var/lib/docker/containers` (a directory, not a socket) → fixed to `unix:///var/run/docker.sock`
- Docker socket `/var/run/docker.sock` was not mounted into the promtail container → added `- /var/run/docker.sock:/var/run/docker.sock:ro` volume

**otel-collector — debug exporter left on in production:**
- `debug` exporter was wired into all three pipelines → removed from `service.pipelines` (declaration retained but unused)

**loki — unreachable alertmanager reference:**
- `ruler.alertmanager_url: http://localhost:9093` caused a connection error on startup (no alertmanager service exists, and `localhost` is meaningless in Docker) → removed

---

### Overview

Full distributed observability is now wired across all three services:

| Layer | Tool | Coverage |
|-------|------|----------|
| Error tracking | Sentry | Frontend (client + server + edge), WS server, Anti-cheat |
| Distributed traces | OpenTelemetry → Grafana Tempo | All services via OTel Collector |
| Log aggregation | Grafana Loki + Promtail | All Docker container stdout/stderr |
| Metrics | Prometheus + Grafana | All services (existing) |
| Trace-log correlation | Grafana (Tempo ↔ Loki links) | Auto-linked via `traceId` JSON field |

---

### Frontend (`@sentry/nextjs`)

**New files:**
- `frontend/src/instrumentation.ts` — Next.js auto-loads this at startup; initialises Sentry for both `nodejs` and `edge` runtimes; exports `onRequestError = Sentry.captureRequestError` so every unhandled API route error is automatically sent to Sentry
- `frontend/sentry.client.config.ts` — browser-side Sentry init with Session Replay (PII masked), Browser Tracing, 10% trace sample rate in prod / 100% in dev
- `frontend/next.config.ts` — wrapped with `withSentryConfig()` enabling: source map upload to Sentry, tunnel route at `/monitoring` (bypasses ad-blockers), tree-shaking of unused SDK code, React component annotation for readable stack traces

**New packages (`frontend/package.json`):**
- `@sentry/nextjs ^8.55.0`
- `@opentelemetry/api ^1.9.0`

**Run:** `pnpm install` inside `frontend/`

---

### WS Server (`@sentry/bun` + `@opentelemetry/sdk-node`)

**New files:**
- `backend/ws-server/utils/instrumentation.ts` — initialises Sentry Bun SDK and OTel `NodeSDK` with `OTLPTraceExporter` (HTTP); must be the first import in `server.ts` so the SDK patches internals before any other module loads

**Changed files:**
- `backend/ws-server/server.ts` — `import './utils/instrumentation'` added as absolute first line
- `backend/ws-server/bullmq/worker.ts` — captures final BullMQ job failures and worker-level errors to Sentry (`captureException`); only fires on last retry (no retries remaining) to avoid noise

**New packages (`backend/ws-server/package.json`):**
- `@sentry/bun ^8.55.0`
- `@opentelemetry/sdk-node ^0.57.0`
- `@opentelemetry/api ^1.9.0`
- `@opentelemetry/resources ^1.30.0`
- `@opentelemetry/semantic-conventions ^1.30.0`
- `@opentelemetry/exporter-trace-otlp-http ^0.57.0`
- `@opentelemetry/instrumentation-http ^0.57.0`

**Run:** `bun install` inside `backend/ws-server/`

---

### Anti-Cheat (`sentry-sdk[fastapi]` + `opentelemetry-instrumentation-fastapi`)

**Changed files:**
- `backend/anti-cheat/src/main.py` — added `_init_observability()` called at module load:
  - Sentry `init()` with `FastApiIntegration`, `RedisIntegration`, `SqlalchemyIntegration`, `LoggingIntegration` (WARNING breadcrumbs / ERROR events); `send_default_pii=False`
  - OTel `TracerProvider` with `BatchSpanProcessor` + `OTLPSpanExporter` pointing to the collector
  - `FastAPIInstrumentor.instrument_app(app)` auto-instruments all route handlers

**New packages (`backend/anti-cheat/pyproject.toml`):**
- `sentry-sdk[fastapi]>=2.22.0`
- `opentelemetry-sdk>=1.30.0`
- `opentelemetry-instrumentation-fastapi>=0.51b0`
- `opentelemetry-exporter-otlp-proto-http>=1.30.0`

**Run:** `uv sync` inside `backend/anti-cheat/`

---

### Infrastructure — New Compose Services

Eight new services added to `docker-compose.prod.yaml`:

| Service | Image | Ports (internal) | Purpose |
|---------|-------|-------------------|---------|
| `otel-collector` | `otel/opentelemetry-collector-contrib` | 4317 (gRPC), 4318 (HTTP), 8889 (Prometheus exporter) | Receives OTLP from all services; routes traces → Tempo, metrics → Prometheus, logs → Loki |
| `tempo` | `grafana/tempo` | 3200 (API), 4317/4318 (ingest) | Stores distributed traces (3-day local retention) |
| `loki` | `grafana/loki` | 3100 | Stores aggregated logs (7-day retention) |
| `promtail` | `grafana/promtail` | — | Scrapes Docker container stdout/stderr via Docker socket, parses JSON log lines, ships to Loki |
| `redis-exporter` | `oliver006/redis_exporter` | 9121 | Exports Redis metrics to Prometheus |
| `postgres-exporter` | `prometheuscommunity/postgres-exporter` | 9187 | Exports PostgreSQL metrics to Prometheus |
| `nginx-prometheus-exporter` | `nginx/nginx-prometheus-exporter` | 9113 | Reads nginx `stub_status` (port 8081, internal) and exports to Prometheus |

All existing services (`ws-server`, `frontend`, `anti-cheat`) have `OTEL_EXPORTER_OTLP_ENDPOINT: http://otel-collector:4318` injected via compose environment.

**New config files:**
- `monitoring/otel-collector.yml` — OTLP receivers, batch + memory-limiter processors, Tempo/Prometheus/Loki exporters; `debug` exporter excluded from all pipelines in production
- `monitoring/tempo.yml` — local block storage, OTLP ingest on 4317/4318, 3-day retention
- `monitoring/loki.yml` — TSDB storage, 7-day retention, 3100 HTTP
- `monitoring/promtail.yml` — Docker socket discovery (`unix:///var/run/docker.sock`), JSON pipeline stage (parses `level`/`msg`/`ts` fields)
- `monitoring/grafana/provisioning/datasources/prometheus.yml` — updated; now auto-provisions Prometheus + Tempo + Loki with cross-linking

---

### Grafana Cross-Linking (Traces ↔ Logs ↔ Metrics)

| From | To | How |
|------|----|-----|
| Prometheus metric → Trace | Tempo | Exemplar links on `traceID` label |
| Trace span → Logs | Loki | Time-window log query for matching `service.name` |
| Log line → Trace | Tempo | `traceId` JSON field parsed as a derived field link |

---

### Environment Variables Added

| Variable | Services | Purpose |
|----------|----------|---------|
| `SENTRY_DSN` | All | Sentry project DSN (server-side) |
| `NEXT_PUBLIC_SENTRY_DSN` | Frontend | Browser-side Sentry DSN |
| `SENTRY_AUTH_TOKEN` | Frontend (build) | Source map upload CI secret |
| `SENTRY_ORG` / `SENTRY_PROJECT` | Frontend (build) | Sentry project identifiers |
| `SENTRY_RELEASE` | All | Git SHA for release tracking |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | All | OTel Collector OTLP HTTP endpoint |

See `secrets/README.md` for generation and setup instructions.

---

---

## Self-Hosted Sentry

Self-hosted Sentry is run as a **separate** compose stack (`docker-compose.sentry.yaml`) to keep it isolated from the application stack. It is resource-heavy (4 CPU / 16 GB RAM minimum) and should be deployed on a dedicated server or VM.

### Services

| Service | Image | Purpose |
|---------|-------|---------|
| `sentry-postgres` | `postgres:14-alpine` | Sentry metadata / event store |
| `sentry-redis` | `redis:7-alpine` | Queuing and caching |
| `sentry-memcached` | `memcached:1.6-alpine` | Session/Django cache |
| `sentry-zookeeper` | `confluentinc/cp-zookeeper:7.6.0` | Kafka coordination |
| `sentry-kafka` | `confluentinc/cp-kafka:7.6.0` | Event pipeline |
| `sentry-clickhouse` | `altinity/clickhouse-server:23.8` | Search and aggregation (Snuba backend) |
| `snuba-api` | `getsentry/snuba` | ClickHouse query layer |
| `snuba-consumer` (×4) | `getsentry/snuba` | Kafka consumers for errors/transactions/sessions/outcomes |
| `relay` | `getsentry/relay` | SDK ingest endpoint |
| `sentry-web` | `getsentry/sentry` | Sentry UI and API |
| `sentry-worker` | `getsentry/sentry` | Background job processor |
| `sentry-cron` | `getsentry/sentry` | Scheduled tasks |
| `sentry-ingest-consumer` | `getsentry/sentry` | Ingest pipeline |
| `sentry-post-process-forwarder` (×2) | `getsentry/sentry` | Post-processing for errors + transactions |
| `sentry-subscription-consumer` (×2) | `getsentry/sentry` | Alert subscription consumers |
| `sentry-nginx` | `nginx:alpine` | Proxy; exposes Sentry on host port 9000 |

### Config Files

| File | Purpose |
|------|---------|
| `sentry/.env.sentry.example` | Copy to `.env.sentry`; fill in `SENTRY_POSTGRES_PASSWORD`, `SENTRY_SECRET_KEY`, email settings, `SENTRY_URL_PREFIX` |
| `sentry/sentry.conf.py` | Django settings: DB, Redis, Kafka, Snuba, Memcached, file storage, email |
| `sentry/config.yml` | Sentry system config: secret key, URL prefix, registration disabled |
| `sentry/relay/config.yml` | Relay: managed mode, upstream → sentry-web |
| `sentry/clickhouse/config.xml` | Disables noisy ClickHouse system logs |
| `sentry/nginx.conf` | Proxies port 80 → sentry-web:9000 |

### First-Time Setup

```bash
cp sentry/.env.sentry.example sentry/.env.sentry
# Edit sentry/.env.sentry — set SENTRY_POSTGRES_PASSWORD and SENTRY_URL_PREFIX at minimum

# 1. Generate secret key and save it to SENTRY_SECRET_KEY in .env.sentry
docker compose -f docker-compose.sentry.yaml run --rm sentry-web config generate-secret-key

# 2. Run DB migrations
docker compose -f docker-compose.sentry.yaml run --rm sentry-web upgrade --noinput

# 3. Migrate Snuba/ClickHouse schemas
docker compose -f docker-compose.sentry.yaml run --rm snuba-api migrations migrate --force

# 4. Create admin user
docker compose -f docker-compose.sentry.yaml run --rm sentry-web createuser \
  --email admin@example.com --password <pass> --superuser

# 5. Start
docker compose -f docker-compose.sentry.yaml up -d
```

Access at `http://<host>:9000`. For TLS, put a reverse proxy (nginx/Caddy) in front of port 9000.

### Connecting App Services to Self-Hosted Sentry

Once running, create a project per service in the Sentry UI and set the DSN env vars in each service's `.env.production`:

```
SENTRY_DSN=http://<key>@<sentry-host>:9000/<project-id>
NEXT_PUBLIC_SENTRY_DSN=http://<key>@<sentry-host>:9000/<project-id>
```

### Upgrading

```bash
docker compose -f docker-compose.sentry.yaml pull
docker compose -f docker-compose.sentry.yaml run --rm sentry-web upgrade --noinput
docker compose -f docker-compose.sentry.yaml up -d
```

---

## What Remains (Future Work)

- **Prisma migration files**: Run `pnpm prisma migrate dev --name init` inside the running dev container to generate the initial `frontend/prisma/migrations/` folder and commit it
- **TLS certificates**: Replace `YOUR_DOMAIN` placeholder in `nginx.prod.conf` with actual domain; provision via Let's Encrypt certbot
- **Redis Sentinel/Cluster**: For true HA, move to Redis Sentinel or Redis Cluster (single node is a SPOF)
- **Prisma connection pooling**: Add `?connection_limit=10&pool_timeout=20` to `DATABASE_URL` in production
- **Anti-cheat `db push` in README**: Update documentation references from `prisma db push` to `prisma migrate dev`
- **Sentry alerts**: After self-hosted Sentry is running, configure alert rules in the UI for error rate spikes and P95 latency thresholds
- **OTel metrics from ws-server**: The manual Prometheus metrics in `utils/metrics.ts` can be migrated to OTel `MeterProvider` for unified metric export through the collector
- **Sentry TLS**: Put a reverse proxy (nginx/Caddy) in front of `sentry-nginx:9000` with a TLS certificate if the Sentry instance is internet-facing
- **Sentry file storage**: `sentry/sentry.conf.py` uses local filesystem storage (`/data/files`); for larger deployments swap for S3 or GCS (`filestore.backend = "s3"`)
- **Pin image versions**: `docker-compose.sentry.yaml` defaults to `nightly` tags; pin `SENTRY_VERSION`, `SNUBA_VERSION`, and `RELAY_VERSION` in `.env.sentry` to a specific release (e.g. `25.3.0`) for reproducible deploys
