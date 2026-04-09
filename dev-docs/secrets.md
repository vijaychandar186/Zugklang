# Production Secrets Management

This directory documents how to populate secrets for each environment.
**Never commit real secret values to version control.**

---

## Required Environment Variables

### Root-level (docker-compose.prod.yaml substitutions)

Create a `.env` file at the repository root (never commit it):

```env
# PostgreSQL
POSTGRES_USER=zugklang_prod
POSTGRES_PASSWORD=<generate: openssl rand -hex 32>

# Redis
REDIS_PASSWORD=<generate: openssl rand -hex 32>

# Grafana monitoring
GRAFANA_ADMIN_PASSWORD=<generate: openssl rand -hex 16>
```

---

### Observability (OpenTelemetry)

Add to each service's `.env.production` if using an external OTel backend (e.g. Grafana Cloud):

```env
# OpenTelemetry — already set in compose via OTEL_EXPORTER_OTLP_ENDPOINT
# Override here only if using an external OTel backend
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
```

---

### Frontend — `frontend/.env.production`

```env
AUTH_SECRET=<generate: openssl rand -base64 32>   # min 32 chars
AUTH_URL=https://yourdomain.com
AUTH_TRUST_HOST=true
AUTH_GITHUB_ID=<from GitHub OAuth app settings>
AUTH_GITHUB_SECRET=<from GitHub OAuth app settings>
AUTH_GOOGLE_ID=<from Google Cloud Console>
AUTH_GOOGLE_SECRET=<from Google Cloud Console>
NEXT_PUBLIC_WS_URL=wss://yourdomain.com/ws
```

---

### WS Server — `backend/ws-server/.env.production`

```env
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
ADMIN_KEY=<generate: openssl rand -hex 32>
INTERNAL_API_SECRET=<same value as anti-cheat INTERNAL_API_SECRET>
ANTI_CHEAT_URL=http://anti-cheat:8000
GAME_RECORD_URL=http://frontend:3000/api/games
NEXT_APP_URL=http://frontend:3000
```

---

### Anti-Cheat — `backend/anti-cheat/.env.production`

```env
INTERNAL_API_SECRET=<generate: openssl rand -hex 32>
LOGGING_LEVEL=INFO
```

---

## Generating Secrets

```bash
# 32-byte hex (good for passwords, keys)
openssl rand -hex 32

# Base64 (good for JWT secrets)
openssl rand -base64 32

# UUID
python3 -c "import uuid; print(uuid.uuid4())"
```

---

## Secret Rotation

1. Generate new value
2. Update secret in the relevant `.env.production` file (or secret manager)
3. Restart the affected service: `docker compose -f docker-compose.prod.yaml restart <service>`
4. Verify the service is healthy: `docker compose -f docker-compose.prod.yaml ps`

---

## Recommended: Use a Secret Manager

For production at scale, use one of:
- **AWS Secrets Manager** — integrate with ECS/EKS via IAM roles
- **HashiCorp Vault** — self-hosted, works with Docker via the Vault agent injector
- **Doppler / Infisical** — SaaS options with Docker Compose support

Docker Compose supports native secrets via `docker secret create` (Swarm mode).
