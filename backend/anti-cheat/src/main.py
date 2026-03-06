"""Kaladin Anti-Cheat FastAPI application."""
from __future__ import annotations

import logging
import logging.handlers
import os
import sys
from contextlib import asynccontextmanager
from datetime import datetime
from typing import Dict

import sentry_sdk
from fastapi import BackgroundTasks, FastAPI, HTTPException, Security
from fastapi.responses import JSONResponse, PlainTextResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.logging import LoggingIntegration
from sentry_sdk.integrations.redis import RedisIntegration

from .config import (
    ANALYSIS_DAYS,
    INTERNAL_API_SECRET,
    LOGGING_LEVEL,
    MODEL_CONFIGS,
    TIME_CONTROLS,
    USE_EVAL,
    model_artifact_path,
    resolve_model_dir_path,
)
from .db import close_db, init_db
from .ingestion import ingest_game
from .ml.explainer import load_shap_explainer
from .ml.prediction import run_inference
from .ml.training import train_model
from .queue_manager import QueueManager
from .redis_client import close_redis, get_redis
from .schemas import (
    AnalyseRequest,
    AnalyseResponse,
    GameIngestionRequest,
    GameIngestionResponse,
    HealthResponse,
    PredictionResult,
    QueueStatusResponse,
)

import json


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
# Sentry + OpenTelemetry initialisation
# ---------------------------------------------------------------------------

def _init_observability() -> None:
    """Initialise Sentry error tracking and OTel distributed tracing."""
    _node_env = os.environ.get("NODE_ENV", "production")
    _sentry_dsn = os.environ.get("SENTRY_DSN")

    if _sentry_dsn:
        sentry_sdk.init(
            dsn=_sentry_dsn,
            environment=_node_env,
            release=os.environ.get("SENTRY_RELEASE"),
            traces_sample_rate=0.1 if _node_env == "production" else 1.0,
            sample_rate=1.0,
            integrations=[
                FastApiIntegration(),
                RedisIntegration(),
                LoggingIntegration(
                    level=logging.WARNING,      # Capture WARNING+ as breadcrumbs
                    event_level=logging.ERROR,  # Send ERROR+ as Sentry events
                ),
            ],
            # Don't send PII (user IPs etc.) to Sentry
            send_default_pii=False,
        )
        log.info("Sentry initialised (env=%s).", _node_env)

    _otel_endpoint = os.environ.get(
        "OTEL_EXPORTER_OTLP_ENDPOINT", "http://otel-collector:4318"
    )
    provider = TracerProvider(
        resource=Resource.create({
            "service.name": "zugklang-anti-cheat",
            "service.version": "2.0.0",
            "deployment.environment": _node_env,
        })
    )
    provider.add_span_processor(
        BatchSpanProcessor(
            OTLPSpanExporter(endpoint=f"{_otel_endpoint}/v1/traces")
        )
    )
    trace.set_tracer_provider(provider)
    log.info("OpenTelemetry tracer initialised (endpoint=%s).", _otel_endpoint)


_init_observability()


# ---------------------------------------------------------------------------
# Application state
# ---------------------------------------------------------------------------

_explainers: Dict = {}
_db = None
_analysis_queue_available = True


# ---------------------------------------------------------------------------
# Lifespan
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    global _explainers, _db

    _db = init_db()
    log.info("Connected to PostgreSQL via Prisma.")

    get_redis()

    for cfg in MODEL_CONFIGS:
        model_dir = resolve_model_dir_path(cfg[0], cfg[1], cfg[2])
        saved_model_path = model_artifact_path(model_dir, must_exist=True)
        if os.path.exists(saved_model_path):
            _explainers[cfg] = load_shap_explainer(model_dir)
            log.info("Loaded explainer for config %s.", cfg)
        else:
            log.warning("No saved model at %s — skipping.", saved_model_path)

    yield
    close_db()
    log.info("Database connection closed.")
    close_redis()


# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Kaladin Anti-Cheat API",
    description="Chess engine detection via behavioural analysis and machine learning.",
    version="2.0.0",
    lifespan=lifespan,
    root_path="/anti-cheat",
)

# Instrument FastAPI with OTel — must happen after app creation
FastAPIInstrumentor.instrument_app(app)

_bearer = HTTPBearer()


def _require_internal_auth(
    credentials: HTTPAuthorizationCredentials = Security(_bearer),
) -> None:
    """Validate the shared INTERNAL_API_SECRET bearer token."""
    if not INTERNAL_API_SECRET:
        raise HTTPException(status_code=503, detail="Internal auth not configured.")
    if credentials.credentials != INTERNAL_API_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized.")


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check() -> HealthResponse:
    return HealthResponse(status="ok")


@app.get("/metrics", response_class=PlainTextResponse, tags=["System"])
async def metrics() -> PlainTextResponse:
    """Expose minimal Prometheus metrics for service liveness and queue depth."""
    global _analysis_queue_available
    pending_queue = 0
    db_ok = 1
    if _db is not None and _analysis_queue_available:
        try:
            pending_queue = _db.analysisqueue.count(where={"respondedAt": None})
        except Exception:
            # Keep /metrics scrapeable even when DB schema is not initialized yet.
            db_ok = 0
            pending_queue = 0
            _analysis_queue_available = False
    else:
        db_ok = 0

    body = (
        "# HELP anti_cheat_up Whether the anti-cheat API process is running.\n"
        "# TYPE anti_cheat_up gauge\n"
        "anti_cheat_up 1\n"
        "# HELP anti_cheat_db_ok Whether anti-cheat DB queue metrics are available.\n"
        "# TYPE anti_cheat_db_ok gauge\n"
        f"anti_cheat_db_ok {db_ok}\n"
        "# HELP anti_cheat_pending_queue Pending anti-cheat analysis queue items.\n"
        "# TYPE anti_cheat_pending_queue gauge\n"
        f"anti_cheat_pending_queue {pending_queue}\n"
    )
    return PlainTextResponse(
        content=body,
        media_type="text/plain; version=0.0.4; charset=utf-8",
    )


@app.get("/queue/status", response_model=QueueStatusResponse, tags=["Queue"])
async def queue_status() -> QueueStatusResponse:
    if _db is None:
        raise HTTPException(status_code=503, detail="Database not connected.")
    pending = _db.analysisqueue.count(where={"respondedAt": None})
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    processed = _db.analysisqueue.count(where={"respondedAt": {"gte": today}})
    return QueueStatusResponse(pending=pending, processed_today=processed)


@app.post("/analyse", response_model=AnalyseResponse, tags=["Analysis"],
          dependencies=[Security(_require_internal_auth)])
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


@app.post("/game", response_model=GameIngestionResponse, tags=["Ingestion"],
          dependencies=[Security(_require_internal_auth)])
async def ingest_game_endpoint(data: GameIngestionRequest) -> GameIngestionResponse:
    """Called by the WS server when a game ends.
    Replays the game, computes per-move Kaladin fields, and stores rows in PostgreSQL.
    """
    if _db is None:
        raise HTTPException(status_code=503, detail="Database not connected.")

    r = get_redis()
    rate_key = f"ratelimit:game:{data.game_id}"
    if r.set(rate_key, 1, nx=True, ex=60) is None:
        raise HTTPException(status_code=429, detail="Game already being processed.")

    try:
        white_n, black_n = ingest_game(data, _db)
        log.info(
            "Ingested game %s | variant=%s | result=%s | white_moves=%d | black_moves=%d",
            data.game_id[:8], data.variant, data.result, white_n, black_n,
        )
        r.rpush(
            "analysis:queue:notify",
            json.dumps({"white": data.white_username, "black": data.black_username}),
        )
        return GameIngestionResponse(
            stored=True,
            white_moves_stored=white_n,
            black_moves_stored=black_n,
        )
    except Exception as exc:
        r.delete(rate_key)
        log.error("Game ingestion failed for game %s: %s", data.game_id, exc)
        raise HTTPException(status_code=500, detail="Ingestion failed.")


@app.post("/queue/start", tags=["Queue"],
          dependencies=[Security(_require_internal_auth)])
async def start_queue_worker(background_tasks: BackgroundTasks) -> JSONResponse:
    background_tasks.add_task(QueueManager().start)
    return JSONResponse({"message": "Queue worker started in background."})


@app.post("/train", tags=["Model"],
          dependencies=[Security(_require_internal_auth)])
async def trigger_training(background_tasks: BackgroundTasks) -> JSONResponse:
    def _run():
        for _, tc, days in MODEL_CONFIGS:
            train_model(days, tc, USE_EVAL)
    background_tasks.add_task(_run)
    return JSONResponse({"message": "Model training started in background."})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=False)
