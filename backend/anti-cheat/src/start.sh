#!/bin/sh -e

# Resolve project root (parent of this script's directory)
root=$(dirname "$(dirname "$(readlink -f "$0")")")
export PYTHONPATH="$root/src"

target=${1:-prod}  # prod | dev

if [ "$target" = "prod" ]; then
    exec uv run --project "$root" uvicorn src.main:app --host 0.0.0.0 --port 8000
elif [ "$target" = "dev" ]; then
    exec uv run --project "$root" uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
else
    echo "Usage: start.sh [prod|dev]"
    exit 1
fi
