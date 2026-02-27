"""Performance and smoke tests for the Kaladin API.

Run against a live server:
    python run_tests.py [--url http://localhost:8000]

The script samples 1, 10, and 100 legit users from PostgreSQL via Prisma,
fires POST /analyse for each batch, and reports runtime and the JSON response.
"""
from __future__ import annotations

import argparse
import asyncio
import random
import time
from pathlib import Path

import httpx

from db import connect_db, db, disconnect_db
from util import get_logger, pickle_save

log = get_logger(__name__, "DEBUG")


async def load_legit_users() -> list[str]:
    # Pull ids for users not marked as engine.
    rows = await db.query_raw(
        """
        SELECT id
        FROM users
        WHERE marks IS DISTINCT FROM 'engine'
        """
    )
    return [str(r["id"]) for r in rows if r.get("id") is not None]


async def run_tests(api_url: str) -> None:
    await connect_db()
    try:
        legit_users = await load_legit_users()
    finally:
        await disconnect_db()

    if not legit_users:
        log.error("No legit users found in PostgreSQL; aborting tests")
        return

    async with httpx.AsyncClient(timeout=120) as client:
        for x in [1, 10, 100]:
            sample = random.sample(legit_users, min(x, len(legit_users)))
            start = time.time()
            resp = await client.post(f"{api_url}/analyse", json={"users": sample})
            elapsed = time.time() - start

            resp.raise_for_status()
            result = {"runtime": elapsed, "output": resp.json()}

            log.info(f"{x} user(s): {elapsed:.2f}s")
            pickle_save(result, Path(f"tests/test_case_{x}_result.pkl"))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default="http://localhost:8000")
    args = parser.parse_args()
    asyncio.run(run_tests(args.url))


if __name__ == "__main__":
    main()
