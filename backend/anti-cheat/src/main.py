"""Kaladin Anti-Cheat — FastAPI entrypoint.

Start the server:
    uvicorn main:app --reload          # development
    uvicorn main:app --host 0.0.0.0   # production (also the Docker CMD)
"""
from contextlib import asynccontextmanager

import logging

from fastapi import FastAPI

from config import settings
from api.routes import router
from model.explainer import load_explainer
from util import get_logger

logging.getLogger("tensorflow").setLevel(logging.ERROR)
log = get_logger(__name__, settings.log_level)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load every model explainer once at startup; release on shutdown."""
    app.state.explainers = {}
    for cfg in settings.model_configs:
        use_eval, tc, days = cfg
        model_dir = settings.model_dir / f"eval{use_eval}_tc{tc}_days{days}"
        app.state.explainers[cfg] = load_explainer(model_dir)
        log.info(f"Loaded SHAP explainer  use_eval={use_eval}  tc={tc}  days={days}")
    yield
    app.state.explainers.clear()


app = FastAPI(
    title="Kaladin Anti-Cheat",
    description=(
        "Real-time chess engine detection using a multi-branch CNN "
        "trained on Lichess game insights, with SHAP explanations."
    ),
    version="2.0.0",
    lifespan=lifespan,
)

app.include_router(router)
