#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

FRONTEND_ENV="$ROOT_DIR/frontend/.env.local"
WS_ENV="$ROOT_DIR/backend/ws-server/.env.local"
ANTI_CHEAT_ENV="$ROOT_DIR/backend/anti-cheat/.env"
NON_INTERACTIVE=0

print_help() {
  cat <<'EOF'
Usage: ./bootstrap-env.sh [options]

Options:
  -d, --defaults   Write env files immediately using defaults/current values.
  -h, --help       Show this help message.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    -d|--defaults)
      NON_INTERACTIVE=1
      shift
      ;;
    -h|--help)
      print_help
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      print_help
      exit 1
      ;;
  esac
done

trim_quotes() {
  local value="$1"
  value="${value#\"}"
  value="${value%\"}"
  printf '%s' "$value"
}

resolve_value() {
  local env_key="$1"
  local file_path="$2"
  local file_key="$3"
  local fallback_value="${4:-}"

  # Prefer explicit environment variables (e.g., GitHub Codespaces secrets),
  # then existing file values, then fallback.
  if [[ -n "${!env_key:-}" ]]; then
    printf '%s' "${!env_key}"
    return 0
  fi

  if value="$(read_existing_value "$file_path" "$file_key" 2>/dev/null)"; then
    if [[ -n "$value" ]]; then
      printf '%s' "$value"
      return 0
    fi
  fi

  printf '%s' "$fallback_value"
}

warn_if_empty_oauth() {
  local provider="$1"
  local id_value="$2"
  local secret_value="$3"

  if [[ -z "$id_value" || -z "$secret_value" ]]; then
    echo "Warning: ${provider} OAuth credentials are empty."
    echo "Set ${provider} vars in your shell (or Codespaces secrets), then re-run bootstrap."
    echo
  fi
}

read_existing_value() {
  local file_path="$1"
  local key="$2"
  if [[ ! -f "$file_path" ]]; then
    return 1
  fi

  local line
  line="$(grep -E "^${key}=" "$file_path" | tail -n 1 || true)"
  if [[ -z "$line" ]]; then
    return 1
  fi

  local value="${line#*=}"
  trim_quotes "$value"
}

prompt_value() {
  local label="$1"
  local default_value="$2"
  local answer=""
  read -r -p "$label [$default_value]: " answer
  if [[ -z "$answer" ]]; then
    printf '%s' "$default_value"
  else
    printf '%s' "$answer"
  fi
}

prompt_optional_value() {
  local label="$1"
  local default_value="$2"
  local answer=""
  read -r -p "$label [$default_value] (empty to disable): " answer
  if [[ -z "$answer" ]]; then
    printf '%s' "$default_value"
  else
    printf '%s' "$answer"
  fi
}

echo "Generating env files in:"
echo "- $FRONTEND_ENV"
echo "- $WS_ENV"
echo "- $ANTI_CHEAT_ENV"
echo

# Defaults (prefer existing values if present).
frontend_database_url="$(read_existing_value "$FRONTEND_ENV" "DATABASE_URL" || printf '%s' "postgresql://admin:mysecretpassword@localhost:5432/zugklang-frontend")"
frontend_auth_url="$(read_existing_value "$FRONTEND_ENV" "AUTH_URL" || printf '%s' "https://unmellifluently-unforcible-ricky.ngrok-free.dev")"
frontend_auth_secret="$(read_existing_value "$FRONTEND_ENV" "AUTH_SECRET" || printf '%s' "theanswertothegreatquestionoflifetheuniverseandeverythingis42")"
frontend_github_id="$(resolve_value "AUTH_GITHUB_ID" "$FRONTEND_ENV" "AUTH_GITHUB_ID" "")"
frontend_github_secret="$(resolve_value "AUTH_GITHUB_SECRET" "$FRONTEND_ENV" "AUTH_GITHUB_SECRET" "")"
frontend_google_id="$(read_existing_value "$FRONTEND_ENV" "AUTH_GOOGLE_ID" || printf '%s' "")"
frontend_google_secret="$(read_existing_value "$FRONTEND_ENV" "AUTH_GOOGLE_SECRET" || printf '%s' "")"
frontend_ws_url="$(read_existing_value "$FRONTEND_ENV" "NEXT_PUBLIC_WS_URL" || printf '%s' "")"

warn_if_empty_oauth "AUTH_GITHUB" "$frontend_github_id" "$frontend_github_secret"

ws_port="$(read_existing_value "$WS_ENV" "PORT" || printf '%s' "8080")"
ws_allowed_origins="$(read_existing_value "$WS_ENV" "ALLOWED_ORIGINS" || printf '%s' "http://localhost:3000")"
ws_next_app_url="$(read_existing_value "$WS_ENV" "NEXT_APP_URL" || printf '%s' "http://localhost:3000")"
ws_admin_key="$(read_existing_value "$WS_ENV" "ADMIN_KEY" || printf '%s' "change-me-admin-key")"
ws_redis_url="$(read_existing_value "$WS_ENV" "REDIS_URL" || printf '%s' "redis://localhost:6379")"
ws_anti_cheat_url="$(read_existing_value "$WS_ENV" "ANTI_CHEAT_URL" || printf '%s' "http://localhost:8000")"
ws_game_record_url="$(read_existing_value "$WS_ENV" "GAME_RECORD_URL" || printf '%s' "http://localhost:3000/api/internal/game-record")"
ws_internal_api_secret="$(read_existing_value "$WS_ENV" "INTERNAL_API_SECRET" || printf '%s' "change-me-internal-secret")"
ws_worker_concurrency="$(read_existing_value "$WS_ENV" "WORKER_CONCURRENCY" || printf '%s' "5")"

anti_cheat_database_url="$(read_existing_value "$ANTI_CHEAT_ENV" "DATABASE_URL" || printf '%s' "postgresql://admin:mysecretpassword@localhost:5432/zugklang-anti-cheat")"
anti_cheat_redis_url="$(read_existing_value "$ANTI_CHEAT_ENV" "REDIS_URL" || printf '%s' "redis://localhost:6379")"

if [[ "$NON_INTERACTIVE" -eq 0 ]]; then
  echo "Frontend (.env.local)"
  frontend_database_url="$(prompt_value "DATABASE_URL" "$frontend_database_url")"
  frontend_auth_url="$(prompt_value "AUTH_URL" "$frontend_auth_url")"
  frontend_auth_secret="$(prompt_value "AUTH_SECRET" "$frontend_auth_secret")"
  frontend_github_id="$(prompt_optional_value "AUTH_GITHUB_ID" "$frontend_github_id")"
  frontend_github_secret="$(prompt_optional_value "AUTH_GITHUB_SECRET" "$frontend_github_secret")"
  frontend_google_id="$(prompt_optional_value "AUTH_GOOGLE_ID" "$frontend_google_id")"
  frontend_google_secret="$(prompt_optional_value "AUTH_GOOGLE_SECRET" "$frontend_google_secret")"
  frontend_ws_url="$(prompt_value "NEXT_PUBLIC_WS_URL" "$frontend_ws_url")"
  echo

  echo "WebSocket server (.env.local)"
  ws_port="$(prompt_value "PORT" "$ws_port")"
  ws_allowed_origins="$(prompt_value "ALLOWED_ORIGINS" "$ws_allowed_origins")"
  ws_next_app_url="$(prompt_value "NEXT_APP_URL" "$ws_next_app_url")"
  ws_admin_key="$(prompt_value "ADMIN_KEY" "$ws_admin_key")"
  ws_redis_url="$(prompt_value "REDIS_URL" "$ws_redis_url")"
  ws_anti_cheat_url="$(prompt_value "ANTI_CHEAT_URL" "$ws_anti_cheat_url")"
  ws_game_record_url="$(prompt_value "GAME_RECORD_URL" "$ws_game_record_url")"
  ws_internal_api_secret="$(prompt_value "INTERNAL_API_SECRET" "$ws_internal_api_secret")"
  ws_worker_concurrency="$(prompt_value "WORKER_CONCURRENCY" "$ws_worker_concurrency")"
  echo

  echo "Anti-cheat (.env)"
  anti_cheat_database_url="$(prompt_value "DATABASE_URL" "$anti_cheat_database_url")"
  anti_cheat_redis_url="$(prompt_value "REDIS_URL" "$anti_cheat_redis_url")"
  echo
else
  echo "Non-interactive mode enabled: writing defaults/current values."
  echo
fi

cat > "$FRONTEND_ENV" <<EOF
DATABASE_URL="$frontend_database_url"
AUTH_URL="$frontend_auth_url"
AUTH_SECRET="$frontend_auth_secret"
AUTH_GITHUB_ID="$frontend_github_id"
AUTH_GITHUB_SECRET="$frontend_github_secret"
AUTH_GOOGLE_ID="$frontend_google_id"
AUTH_GOOGLE_SECRET="$frontend_google_secret"
NEXT_PUBLIC_WS_URL="$frontend_ws_url"
EOF

cat > "$WS_ENV" <<EOF
PORT=$ws_port
ALLOWED_ORIGINS="$ws_allowed_origins"
NEXT_APP_URL="$ws_next_app_url"
ADMIN_KEY="$ws_admin_key"
REDIS_URL="$ws_redis_url"
ANTI_CHEAT_URL="$ws_anti_cheat_url"
GAME_RECORD_URL="$ws_game_record_url"
INTERNAL_API_SECRET="$ws_internal_api_secret"
WORKER_CONCURRENCY="$ws_worker_concurrency"
EOF

cat > "$ANTI_CHEAT_ENV" <<EOF
DATABASE_URL=$anti_cheat_database_url
REDIS_URL=$anti_cheat_redis_url
EOF

echo "Done. Env files were written."
