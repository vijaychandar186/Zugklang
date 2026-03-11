#!/bin/sh -e

target=${1:-dev} # dev | prod

# Ensure Prisma query engine binary exists for this runtime before DB connect.
prisma py fetch
prisma db push --schema schema.prisma --skip-generate

if [ "$target" = "prod" ]
then
    python -m uvicorn src.main:app --host 0.0.0.0 --port 8000 --log-level warning --no-access-log
elif [ "$target" = "dev" ]
then
    python -m uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
else
    echo "target can only be dev or prod, not $target"
    exit 1
fi
