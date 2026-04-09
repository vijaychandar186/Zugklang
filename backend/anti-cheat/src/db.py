"""Database utilities: Prisma client singleton + pickle I/O helpers."""

from __future__ import annotations

import logging
import os
import pickle
import time
from collections.abc import Callable
from functools import partial, wraps
from typing import Any

from prisma import Prisma
from prisma.errors import PrismaError

# ---------------------------------------------------------------------------
# Prisma client singleton
# ---------------------------------------------------------------------------

_db: Prisma | None = None


def get_db() -> Prisma:
    """Return the shared, already-connected Prisma instance."""
    if _db is None:
        raise RuntimeError(
            "Database not initialised. Call init_db() during application startup."
        )
    return _db


def init_db() -> Prisma:
    """Create and connect a Prisma client; store it as the process singleton."""
    global _db
    _db = Prisma()
    _db.connect()
    return _db


def close_db() -> None:
    """Disconnect the singleton client."""
    global _db
    if _db is not None:
        _db.disconnect()
        _db = None


# ---------------------------------------------------------------------------
# Pickle helpers
# ---------------------------------------------------------------------------


def save_pickle(data: Any, path: str) -> None:
    os.makedirs(path.rsplit("/", 1)[0], exist_ok=True)
    with open(path, "wb") as fh:
        pickle.dump(data, fh, protocol=4)


def load_pickle(path: str) -> Any:
    with open(path, "rb") as fh:
        return pickle.load(fh)


# ---------------------------------------------------------------------------
# Generic retry decorator
# ---------------------------------------------------------------------------


def retry(
    func: Callable | None = None,
    *,
    n_tries: int | None = 5,
    exception: type = Exception,
    delay: int = 30,
    backoff: int = 2,
    logger: logging.Logger | None = None,
) -> Callable:
    if func is None:
        return partial(
            retry,
            n_tries=n_tries,
            exception=exception,
            delay=delay,
            backoff=backoff,
            logger=logger,
        )

    @wraps(func)
    def wrapper(*args, **kwargs):
        remaining, current_delay = n_tries, delay
        while remaining is None or remaining > 1:
            try:
                return func(*args, **kwargs)
            except exception as exc:
                msg = f"[{func.__name__}] {exc}. Retrying in {current_delay}s..."
                (logger.warning if logger else print)(msg)
                time.sleep(current_delay)
                if remaining is not None:
                    remaining -= 1
                current_delay *= backoff
        return func(*args, **kwargs)

    return wrapper


def db_retry(logger: logging.Logger) -> Callable:
    """Decorator: retry indefinitely on transient Prisma / connection errors."""
    return partial(
        retry,
        n_tries=None,
        exception=PrismaError,
        delay=30,
        backoff=1,
        logger=logger,
    )
