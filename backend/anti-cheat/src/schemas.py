from __future__ import annotations

import enum
from datetime import datetime

from pydantic import BaseModel


class AnalysisError(enum.Enum):
    BATCH_FAILURE = enum.auto()
    INSUFFICIENT_DATA = enum.auto()


class AnalyseRequest(BaseModel):
    users: list[str]


class PredictionResult(BaseModel):
    user: str
    tc: int
    days: int
    pred: float
    insight_1: str | None = None
    insight_2: str | None = None
    insight_3: str | None = None


class AnalyseResponse(BaseModel):
    results: list[PredictionResult]


class HealthResponse(BaseModel):
    status: str


class QueueStatusResponse(BaseModel):
    pending: int
    processed_today: int


class GameIngestionRequest(BaseModel):
    game_id: str
    variant: str
    time_control_minutes: int
    time_control_increment: int
    moves: list[str]
    move_times_white_ms: list[int]
    move_times_black_ms: list[int]
    white_user_id: str | None = None
    black_user_id: str | None = None
    white_username: str | None = None
    black_username: str | None = None
    white_rating: int | None = None
    black_rating: int | None = None
    result: str  # 'white' | 'black' | 'draw'
    played_at: datetime | None = None


class GameIngestionResponse(BaseModel):
    stored: bool
    white_moves_stored: int
    black_moves_stored: int
