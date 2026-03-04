# Reverse Proxy (nginx)

All dev traffic enters through a single nginx container on **port 80**. Internal services are not reachable from the host directly (except dev tools listed below).

## Routing table

| Path | Backend | Notes |
|---|---|---|
| `/` | `frontend:3000` | Next.js app |
| `/_next/webpack-hmr` | `frontend:3000` | HMR websocket — 1h timeout |
| `/ws` | `ws-server:8080` | Game WebSocket |
| `/anti-cheat/` | `anti-cheat:8000` | FastAPI — `root_path="/anti-cheat"` set in app |
| `/pgadmin/` | `pgadmin:80` | pgAdmin 4 — `SCRIPT_NAME=/pgadmin` env var required |
| `/redis/` | `redis-commander:8081` | Redis Commander — `URL_PREFIX=/redis` env var required |

## Dev tools on host ports

These bypass nginx intentionally in dev and are removed in production:

| Service | Host port | Tool |
|---|---|---|
| `prisma-frontend` | `5555` | Prisma Studio for `zugklang-frontend` DB |
| `prisma-anti-cheat` | `5556` | Prisma Studio for `zugklang-anti-cheat` DB |

## Config files

- Nginx config: [`nginx.conf`](../nginx.conf)
- Compose file: [`docker-compose.dev.yaml`](../docker-compose.dev.yaml)

## WebSocket handling

nginx uses a `map` to promote HTTP connections to WebSocket where needed:

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}
```

Applied to `/_next/webpack-hmr` (HMR) and `/ws` (game). The `/anti-cheat/` route is HTTP-only.

## Port exposure summary

| Service | Exposed to host | How |
|---|---|---|
| nginx | ✅ `80` | `ports` |
| prisma-frontend | ✅ `5555` | `ports` (dev only) |
| prisma-anti-cheat | ✅ `5556` | `ports` (dev only) |
| frontend | internal only | `expose` |
| ws-server | internal only | `expose` |
| anti-cheat | internal only | `expose` |
| pgadmin | internal only | `expose` |
| redis-commander | internal only | `expose` |
| postgres | internal only | no mapping |
| redis | internal only | no mapping |

## Notes

- pgAdmin requires `PGADMIN_CONFIG_ENHANCED_COOKIE_PROTECTION: "False"` and `PGADMIN_CONFIG_WTF_CSRF_CHECK_DEFAULT: "False"` to work behind a reverse proxy.
- Redis Commander's `URL_PREFIX` must match the nginx location path exactly (without trailing slash in `proxy_pass`) so the prefix is preserved end-to-end.
- The anti-cheat FastAPI app sets `root_path="/anti-cheat"` so Swagger UI generates correct spec URLs (e.g. `/anti-cheat/openapi.json`).
