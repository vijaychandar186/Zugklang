"""Kaladin Anti-Cheat FastAPI application."""
from __future__ import annotations

import logging
import logging.handlers
import sys
from contextlib import asynccontextmanager
from datetime import datetime
from typing import Dict

from fastapi import BackgroundTasks, FastAPI, HTTPException
from fastapi.responses import JSONResponse

from .config import (
    ANALYSIS_DAYS,
    LOGGING_LEVEL,
    MODEL_CONFIGS,
    MODEL_DIR,
    TIME_CONTROLS,
    USE_EVAL,
)
from .db import close_db, init_db
from .ingestion import ingest_game
from .ml.explainer import load_shap_explainer
from .ml.prediction import run_inference
from .ml.training import train_model
from .queue_manager import QueueManager
from .schemas import (
    AnalyseRequest,
    AnalyseResponse,
    GameIngestionRequest,
    GameIngestionResponse,
    HealthResponse,
    PredictionResult,
    QueueStatusResponse,
)

import os


# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

def _setup_logger(name: str, level: str) -> logging.Logger:
    log = logging.getLogger(name)
    log.setLevel(level)
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter(
        "%(asctime)s | %(name)s | %(levelname)-8s | %(message)s"))
    log.addHandler(handler)
    return log


log = _setup_logger(__name__, LOGGING_LEVEL)
logging.getLogger("tensorflow").setLevel(logging.ERROR)


# ---------------------------------------------------------------------------
# Application state
# ---------------------------------------------------------------------------

_explainers: Dict = {}
_db = None


# ---------------------------------------------------------------------------
# Lifespan
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    global _explainers, _db

    _db = init_db()
    log.info("Connected to PostgreSQL via Prisma.")

    for cfg in MODEL_CONFIGS:
        model_dir = os.path.join(MODEL_DIR, f"eval{cfg[0]}_tc{cfg[1]}_days{cfg[2]}") + os.sep
        saved_model_path = os.path.join(model_dir, "model.SavedModel")
        if os.path.exists(saved_model_path):
            _explainers[cfg] = load_shap_explainer(model_dir)
            log.info("Loaded explainer for config %s.", cfg)
        else:
            log.warning("No saved model at %s — skipping.", saved_model_path)

    yield
    close_db()
    log.info("Database connection closed.")


# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Kaladin Anti-Cheat API",
    description="Chess engine detection via behavioural analysis and machine learning.",
    version="2.0.0",
    lifespan=lifespan,
)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check() -> HealthResponse:
    return HealthResponse(status="ok")


@app.get("/queue/status", response_model=QueueStatusResponse, tags=["Queue"])
async def queue_status() -> QueueStatusResponse:
    if _db is None:
        raise HTTPException(status_code=503, detail="Database not connected.")
    pending = _db.analysisqueue.count(where={"respondedAt": None})
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    processed = _db.analysisqueue.count(where={"respondedAt": {"gte": today}})
    return QueueStatusResponse(pending=pending, processed_today=processed)


@app.post("/analyse", response_model=AnalyseResponse, tags=["Analysis"])
async def analyse_users(request: AnalyseRequest) -> AnalyseResponse:
    if not request.users:
        raise HTTPException(status_code=422, detail="User list must not be empty.")
    if _db is None:
        raise HTTPException(status_code=503, detail="Database not connected.")

    result_df = run_inference(
        _db,
        use_eval=USE_EVAL,
        explainers=_explainers,
        live_user_list=request.users,
    )

    if result_df is None or result_df.empty:
        raise HTTPException(
            status_code=422, detail="Insufficient data for the requested users.")

    return AnalyseResponse(
        results=[
            PredictionResult(
                user=row["user"],
                tc=int(row["tc"]),
                days=int(row["days"]),
                pred=float(row["pred"]),
                insight_1=row.get("insight_1"),
                insight_2=row.get("insight_2"),
                insight_3=row.get("insight_3"),
            )
            for _, row in result_df.iterrows()
        ]
    )


@app.post("/game", response_model=GameIngestionResponse, tags=["Ingestion"])
async def ingest_game_endpoint(data: GameIngestionRequest) -> GameIngestionResponse:
    """Called by the WS server when a game ends.
    Replays the game, computes per-move Kaladin fields, and stores rows in PostgreSQL.
    """
    if _db is None:
        raise HTTPException(status_code=503, detail="Database not connected.")
    try:
        white_n, black_n = ingest_game(data, _db)
        log.info(
            "Ingested game %s | variant=%s | result=%s | white_moves=%d | black_moves=%d",
            data.game_id[:8], data.variant, data.result, white_n, black_n,
        )
        return GameIngestionResponse(
            stored=True,
            white_moves_stored=white_n,
            black_moves_stored=black_n,
        )
    except Exception as exc:
        log.error("Game ingestion failed for game %s: %s", data.game_id, exc)
        raise HTTPException(status_code=500, detail="Ingestion failed.")


@app.post("/queue/start", tags=["Queue"])
async def start_queue_worker(background_tasks: BackgroundTasks) -> JSONResponse:
    background_tasks.add_task(QueueManager().start)
    return JSONResponse({"message": "Queue worker started in background."})


@app.post("/train", tags=["Model"])
async def trigger_training(background_tasks: BackgroundTasks) -> JSONResponse:
    def _run():
        for _, tc, days in MODEL_CONFIGS:
            train_model(days, tc, USE_EVAL)
    background_tasks.add_task(_run)
    return JSONResponse({"message": "Model training started in background."})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=False)
