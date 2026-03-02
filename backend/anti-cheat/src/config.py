from __future__ import annotations

import os
from typing import Dict, List, Tuple

from dotenv import dotenv_values


def load_config() -> Dict[str, str]:
    return {
        **dotenv_values(".env.base"),
        **dotenv_values(".env"),
        **os.environ,
    }


config = load_config()

DATABASE_URL: str = config.get(
    "DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/kaladin"
)
REDIS_URL: str = config.get("REDIS_URL", "redis://localhost:6379")

LOGGING_LEVEL: str = config.get("LOGGING_LEVEL", "INFO").upper()
BATCH_TIMEOUT: int = int(config.get("BATCH_TIMEOUT", 30))
BATCH_SIZE: int = int(config.get("BATCH_SIZE", 50))
BATCH_REFRESH_WAIT: int = int(config.get("BATCH_REFRESH_WAITING_TIME", 5))

TIME_CONTROLS: List[int] = [2, 6]
ANALYSIS_DAYS: Dict[int, int] = {180: 10}
USE_EVAL: int = 0
MAX_GAMES: int = 250
MAX_MOVES: int = 6000
MIN_MOVES: int = 1000

MODEL_CONFIGS: List[Tuple[int, int, int]] = [
    (0, 2, 180),
    (0, 6, 180),
]

# Absolute path to the model directory (parent of src/).
_SRC_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(_SRC_DIR)
MODEL_DIR: str = os.path.join(PROJECT_DIR, "model")


# ---------------------------------------------------------------------------
# Lichess insight URL formatters
# ---------------------------------------------------------------------------

DIMENSION_FORMATTER: Dict[str, str] = {
    "date": "date",
    "movetime": "movetime",
    "material": "material",
    "phase": "phase",
    "blur": "blur",
    "timevariance": "timeVariance",
    "result": "result",
    "centipawnloss": "cpl",
    "piecemoved": "piece",
    "evaluation": "eval",
    "opponentstrength": "opponentStrength",
}

METRIC_FORMATTER: Dict[str, str] = {
    "acpl": "acpl",
    "timevariance": "timeVariance",
    "blur": "blurs",
    "movetime": "movetime",
    "opponentrating": "opponentRating",
    "ratinggain": "ratingDiff",
}

VARIANT_FORMATTER: Dict[str, str] = {
    "6": "rapid",
    "2": "blitz",
}
