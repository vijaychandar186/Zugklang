#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

FRONTEND_ENV="$ROOT_DIR/frontend/.env.local"
WS_ENV="$ROOT_DIR/backend/ws-server/.env.local"
ANTI_CHEAT_ENV="$ROOT_DIR/backend/anti-cheat/.env"

echo "Generating env files with default values:"
echo "- $FRONTEND_ENV"
echo "- $WS_ENV"
echo "- $ANTI_CHEAT_ENV"
echo

cat > "$FRONTEND_ENV" <<'FRONTEND_EOF'
DATABASE_URL="postgresql://admin:mysecretpassword@localhost:5432/zugklang-frontend"
AUTH_URL="https://unmellifluently-unforcible-ricky.ngrok-free.dev"
AUTH_SECRET="theanswertothegreatquestionoflifetheuniverseandeverythingis42"
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
NEXT_PUBLIC_WS_URL="ws://localhost:8080"
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
