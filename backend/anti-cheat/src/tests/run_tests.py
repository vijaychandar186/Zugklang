"""Performance and smoke tests for the Kaladin API.

Run against a live server:
    python run_tests.py [--url http://localhost:8000] [--mongo mongodb://localhost:27017]

The script samples 1, 10, and 100 legit users from MongoDB, fires POST /analyse
for each batch, and reports runtime and the JSON response.
"""
import argparse
import logging
import random
import time

import httpx
from pymongo import MongoClient

from common.utils import configure_logging, pickle_me

log = logging.getLogger(__file__)


def main(api_url: str, user_collection) -> None:
    legit = list(user_collection.find({"marks": {"$ne": "engine"}}, {"_id": 1}))
    legit_users = [u["_id"] for u in legit]

    if not legit_users:
        log.error("No legit users found in MongoDB — aborting tests")
        return

    for x in [1, 10, 100]:
        sample = random.sample(legit_users, min(x, len(legit_users)))

        start = time.time()
        resp = httpx.post(f"{api_url}/analyse", json={"users": sample}, timeout=120)
        elapsed = time.time() - start

        resp.raise_for_status()
        result = {"runtime": elapsed, "output": resp.json()}

        log.info(f"{x} user(s): {elapsed:.2f}s")
        pickle_me(result, f"tests/test_case_{x}_result.pkl")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default="http://localhost:8000")
    parser.add_argument("--mongo", default="mongodb://localhost:27017")
    parser.add_argument("--db", default="kaladin")
    parser.add_argument("--collection", default="users")
    args = parser.parse_args()

    configure_logging(log)
    log.setLevel(logging.DEBUG)

    client = MongoClient(args.mongo)
    main(args.url, client[args.db][args.collection])
    client.close()
