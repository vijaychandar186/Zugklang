#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

FRONTEND_ENV="$ROOT_DIR/frontend/.env.local"
WS_ENV="$ROOT_DIR/backend/ws-server/.env.local"
ANTI_CHEAT_ENV="$ROOT_DIR/backend/anti-cheat/.env"

# Defaults used when matching environment variables are not set.
default_frontend_database_url="postgresql://admin:mysecretpassword@localhost:5432/zugklang-frontend"
default_frontend_auth_url="https://unmellifluently-unforcible-ricky.ngrok-free.dev"
default_frontend_auth_secret="theanswertothegreatquestionoflifetheuniverseandeverythingis42"
default_frontend_github_id=""
default_frontend_github_secret=""
default_frontend_google_id=""
default_frontend_google_secret=""
default_frontend_ws_url="ws://localhost:8080"

echo "Generating env files with default values:"
echo "- $FRONTEND_ENV"
echo "- $WS_ENV"
echo "- $ANTI_CHEAT_ENV"
echo

# Use explicit environment values (e.g. GitHub/Codespaces secrets) when available.
frontend_database_url="${DATABASE_URL:-$default_frontend_database_url}"
frontend_auth_url="${AUTH_URL:-$default_frontend_auth_url}"
frontend_auth_secret="${AUTH_SECRET:-$default_frontend_auth_secret}"
frontend_github_id="${AUTH_GITHUB_ID:-$default_frontend_github_id}"
frontend_github_secret="${AUTH_GITHUB_SECRET:-$default_frontend_github_secret}"
frontend_google_id="${AUTH_GOOGLE_ID:-$default_frontend_google_id}"
frontend_google_secret="${AUTH_GOOGLE_SECRET:-$default_frontend_google_secret}"
frontend_ws_url="${NEXT_PUBLIC_WS_URL:-$default_frontend_ws_url}"

cat > "$FRONTEND_ENV" <<FRONTEND_EOF
DATABASE_URL="$frontend_database_url"
AUTH_URL="$frontend_auth_url"
AUTH_SECRET="$frontend_auth_secret"
AUTH_GITHUB_ID="$frontend_github_id"
AUTH_GITHUB_SECRET="$frontend_github_secret"
AUTH_GOOGLE_ID="$frontend_google_id"
AUTH_GOOGLE_SECRET="$frontend_google_secret"
NEXT_PUBLIC_WS_URL="$frontend_ws_url"
FRONTEND_EOF

cat > "$WS_ENV" <<'WS_EOF'
PORT=8080
ALLOWED_ORIGINS="http://localhost:3000"
NEXT_APP_URL="http://localhost:3000"
ADMIN_KEY="change-me-admin-key"
REDIS_URL="redis://localhost:6379"
ANTI_CHEAT_URL="http://localhost:8000"
GAME_RECORD_URL="http://localhost:3000/api/internal/game-record"
INTERNAL_API_SECRET="change-me-internal-secret"
WORKER_CONCURRENCY="5"
WS_EOF

cat > "$ANTI_CHEAT_ENV" <<'ANTI_CHEAT_EOF'
DATABASE_URL=postgresql://admin:mysecretpassword@localhost:5432/zugklang-anti-cheat
REDIS_URL=redis://localhost:6379
ANTI_CHEAT_EOF

echo "Done. Default env files were written."
