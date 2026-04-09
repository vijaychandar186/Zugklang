#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "Installing frontend dependencies..."
cd "$ROOT_DIR/frontend" && pnpm install && pnpm exec husky ../.husky

echo "Installing ws-server dependencies..."
cd "$ROOT_DIR/backend/ws-server" && bun install

echo "Installing anti-cheat dependencies..."
cd "$ROOT_DIR/backend/anti-cheat" && uv sync

echo "Configuring git hooks..."
cd "$ROOT_DIR"
git config core.hooksPath .husky
chmod +x .husky/*
