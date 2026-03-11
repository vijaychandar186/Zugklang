#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${NGROK_AUTHTOKEN:-}" ]]; then
  echo "NGROK_AUTHTOKEN is not set. Skipping ngrok setup."
  exit 0
fi

ngrok config add-authtoken "$NGROK_AUTHTOKEN"