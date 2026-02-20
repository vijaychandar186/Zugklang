from __future__ import annotations

import logging
import pickle
import sys
import time
from functools import partial, wraps
from pathlib import Path
from typing import Any, Callable


def get_logger(name: str, level: str = "INFO") -> logging.Logger:
    log = logging.getLogger(name)
    log.setLevel(level)
    if not log.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(logging.Formatter(
            "%(asctime)s | %(name)-30s | %(levelname)-8s | %(message)s"
        ))
        log.addHandler(handler)
    return log


def pickle_save(obj: Any, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "wb") as f:
        pickle.dump(obj, f, protocol=5)


def pickle_load(path: Path) -> Any:
    with open(path, "rb") as f:
        return pickle.load(f)


def retry(
    func: Callable | None = None,
    *,
    on: type[Exception] = Exception,
    attempts: int | None = 5,
    delay: float = 2.0,
    backoff: float = 2.0,
    log: logging.Logger | None = None,
) -> Callable:
    """Exponential-backoff retry decorator.

    Parameters
    ----------
    on:       Exception type that triggers a retry.
    attempts: Maximum attempts. ``None`` retries indefinitely.
    delay:    Initial wait between retries (seconds).
    backoff:  Multiplier applied to delay after each failure.
    log:      Logger; falls back to ``print`` when ``None``.
    """
    if func is None:
        return partial(retry, on=on, attempts=attempts,
                       delay=delay, backoff=backoff, log=log)

    @wraps(func)
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        remaining, wait = attempts, delay
        while remaining is None or remaining > 1:
            try:
                return func(*args, **kwargs)
            except on as exc:
                msg = f"{func.__name__} failed: {exc}. Retrying in {wait:.1f}s…"
                (log.warning if log else print)(msg)
                time.sleep(wait)
                if remaining is not None:
                    remaining -= 1
                wait *= backoff
        return func(*args, **kwargs)

    return wrapper
