#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PROD_PROJECT_NAME="${PROD_PROJECT_NAME:-zugklang-prod}"
SENTRY_PROJECT_NAME="${SENTRY_PROJECT_NAME:-zugklang-sentry}"

# Feature toggles (1/0)
SENTRY_ENABLED="${SENTRY_ENABLED:-0}"
MONITORING_ENABLED="${MONITORING_ENABLED:-1}"
GRAFANA_ENABLED="${GRAFANA_ENABLED:-1}"
OTEL_ENABLED="${OTEL_ENABLED:-1}"
DETACH="${DETACH:-0}"

ACTION="${1:-up}"
shift || true

core_services=(
  redis
  postgres
  ws-server
  frontend
  nginx
  anti-cheat
)

monitoring_services=(
  redis-exporter
  postgres-exporter
  nginx-prometheus-exporter
  prometheus
  tempo
  loki
  promtail
)

prod_services=("${core_services[@]}")
if [[ "$MONITORING_ENABLED" == "1" ]]; then
  prod_services+=("${monitoring_services[@]}")
fi
if [[ "$GRAFANA_ENABLED" == "1" ]]; then
  prod_services+=(grafana)
fi
if [[ "$OTEL_ENABLED" == "1" ]]; then
  prod_services+=(otel-collector)
fi

if [[ "$ACTION" == "up" ]]; then
  up_mode_args=()
  if [[ "$DETACH" == "1" ]]; then
    up_mode_args=(-d)
  fi

  if [[ "$SENTRY_ENABLED" == "1" ]]; then
    docker compose -p "$SENTRY_PROJECT_NAME" -f docker-compose.sentry.yaml up "${up_mode_args[@]}" "$@"
  fi
  docker compose -p "$PROD_PROJECT_NAME" -f docker-compose.prod.yaml up "${up_mode_args[@]}" "$@" "${prod_services[@]}"
elif [[ "$ACTION" == "services" ]]; then
  printf '%s\n' "${prod_services[@]}"
  if [[ "$SENTRY_ENABLED" == "1" ]]; then
    echo "sentry-stack"
  fi
elif [[ "$ACTION" == "down" ]]; then
  docker compose -p "$PROD_PROJECT_NAME" -f docker-compose.prod.yaml down "$@"
  if [[ "$SENTRY_ENABLED" == "1" ]]; then
    docker compose -p "$SENTRY_PROJECT_NAME" -f docker-compose.sentry.yaml down "$@"
  fi
elif [[ "$ACTION" == "start" || "$ACTION" == "stop" || "$ACTION" == "restart" ]]; then
  docker compose -p "$PROD_PROJECT_NAME" -f docker-compose.prod.yaml "$ACTION" "$@" "${prod_services[@]}"
  if [[ "$SENTRY_ENABLED" == "1" ]]; then
    docker compose -p "$SENTRY_PROJECT_NAME" -f docker-compose.sentry.yaml "$ACTION" "$@"
  fi
else
  docker compose -p "$PROD_PROJECT_NAME" -f docker-compose.prod.yaml "$ACTION" "$@"
  if [[ "$SENTRY_ENABLED" == "1" ]]; then
    docker compose -p "$SENTRY_PROJECT_NAME" -f docker-compose.sentry.yaml "$ACTION" "$@"
  fi
fi
