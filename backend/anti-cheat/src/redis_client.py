"""Redis client singleton for the anti-cheat service."""
from __future__ import annotations

import logging

import redis as _redis

from .config import REDIS_URL

log = logging.getLogger(__name__)

_client: _redis.Redis | None = None


def get_redis() -> _redis.Redis:
    global _client
    if _client is None:
        _client = _redis.Redis.from_url(REDIS_URL, decode_responses=True)
        _client.ping()
        log.info("Connected to Redis at %s.", REDIS_URL)
    return _client


def close_redis() -> None:
    global _client
    if _client is not None:
        _client.close()
        _client = None
        log.info("Redis connection closed.")
