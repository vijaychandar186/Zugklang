from __future__ import annotations

import os

from dotenv import dotenv_values


def load_config() -> dict[str, str]:
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

INTERNAL_API_SECRET: str = config.get("INTERNAL_API_SECRET", "")
LOGGING_LEVEL: str = config.get("LOGGING_LEVEL", "INFO").upper()
BATCH_TIMEOUT: int = int(config.get("BATCH_TIMEOUT", 30))
BATCH_SIZE: int = int(config.get("BATCH_SIZE", 50))
BATCH_REFRESH_WAIT: int = int(config.get("BATCH_REFRESH_WAITING_TIME", 5))

TIME_CONTROLS: list[int] = [2, 6]
ANALYSIS_DAYS: dict[int, int] = {180: 10}
USE_EVAL: int = 0
MAX_GAMES: int = 250
MAX_MOVES: int = 6000
MIN_MOVES: int = 1000

MODEL_CONFIGS: list[tuple[int, int, int]] = [
    (0, 2, 180),
    (0, 6, 180),
]

# Absolute path to the model directory (parent of src/).
_SRC_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(_SRC_DIR)
MODEL_DIR: str = os.path.join(PROJECT_DIR, "model")
MODEL_ARTIFACT_DIR: str = "saved_model"
LEGACY_MODEL_ARTIFACT_DIR: str = "model.SavedModel"
SHAP_BACKGROUND_FILENAME: str = "shap_data.pkl"
INSIGHTS_LOCATION_FILENAME: str = "insights_location_dct.pkl"
TRAINING_HISTORY_FILENAME: str = "training_history.png"

# Human-readable names for model directories by time-control bucket.
TIME_CONTROL_MODEL_NAMES: dict[int, str] = {
    2: "bullet_blitz",
    6: "rapid_classical",
}


def model_dir_name(use_eval: int, tc: int, days: int) -> str:
    tc_name = TIME_CONTROL_MODEL_NAMES.get(tc, f"tc{tc}")
    feature_name = "movetime" if use_eval == 0 else f"eval{use_eval}"
    return f"{tc_name}_{feature_name}_days{days}"


def model_dir_path(use_eval: int, tc: int, days: int) -> str:
    return os.path.join(MODEL_DIR, model_dir_name(use_eval, tc, days)) + os.sep


def legacy_model_dir_path(use_eval: int, tc: int, days: int) -> str:
    return os.path.join(MODEL_DIR, f"eval{use_eval}_tc{tc}_days{days}") + os.sep


def model_artifact_path(model_directory: str, must_exist: bool = False) -> str:
    preferred = os.path.join(model_directory, MODEL_ARTIFACT_DIR)
    if not must_exist or os.path.exists(preferred):
        return preferred
    return os.path.join(model_directory, LEGACY_MODEL_ARTIFACT_DIR)


def shap_background_path(model_directory: str) -> str:
    return os.path.join(model_directory, SHAP_BACKGROUND_FILENAME)


def insights_location_path(model_directory: str) -> str:
    return os.path.join(model_directory, INSIGHTS_LOCATION_FILENAME)


def training_history_path(model_directory: str) -> str:
    return os.path.join(model_directory, TRAINING_HISTORY_FILENAME)


def resolve_model_dir_path(use_eval: int, tc: int, days: int) -> str:
    preferred = model_dir_path(use_eval, tc, days)
    preferred_saved_model = os.path.join(preferred, MODEL_ARTIFACT_DIR)
    preferred_legacy_saved_model = os.path.join(preferred, LEGACY_MODEL_ARTIFACT_DIR)
    if os.path.exists(preferred_saved_model) or os.path.exists(preferred_legacy_saved_model):
        return preferred

    legacy = legacy_model_dir_path(use_eval, tc, days)
    legacy_saved_model = os.path.join(legacy, MODEL_ARTIFACT_DIR)
    legacy_legacy_saved_model = os.path.join(legacy, LEGACY_MODEL_ARTIFACT_DIR)
    if os.path.exists(legacy_saved_model) or os.path.exists(legacy_legacy_saved_model):
        return legacy

    return preferred


# ---------------------------------------------------------------------------
# Lichess insight URL formatters
# ---------------------------------------------------------------------------

DIMENSION_FORMATTER: dict[str, str] = {
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

METRIC_FORMATTER: dict[str, str] = {
    "acpl": "acpl",
    "timevariance": "timeVariance",
    "blur": "blurs",
    "movetime": "movetime",
    "opponentrating": "opponentRating",
    "ratinggain": "ratingDiff",
}

VARIANT_FORMATTER: dict[str, str] = {
    "6": "rapid",
    "2": "blitz",
}
