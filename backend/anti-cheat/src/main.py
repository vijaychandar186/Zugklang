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
from db import connect_db, disconnect_db
from util import get_logger
from ws_monitor.repository import ensure_ws_monitor_schema

logging.getLogger("tensorflow").setLevel(logging.ERROR)
log = get_logger(__name__, settings.log_level)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize DB and ws-monitor schema; close DB on shutdown."""
    await connect_db()
    if settings.ws_monitor_persist:
        await ensure_ws_monitor_schema()
    yield
    await disconnect_db()


app = FastAPI(
    title="Kaladin Anti-Cheat",
    description=(
        "Real-time anti-cheat monitoring for ws-server games "
        "with live timing-based scoring and persistence."
    ),
    version="2.0.0",
    lifespan=lifespan,
)

app.include_router(router)
