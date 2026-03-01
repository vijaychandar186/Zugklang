#!/bin/sh -e

target=${1:-dev} # dev | prod

if [ "$target" = "prod" ]
then
    uv run uvicorn src.main:app --host 0.0.0.0 --port 8000
elif [ "$target" = "dev" ]
then
    uv run uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
else
    echo "target can only be dev or prod, not $target"
    exit 1
fi
