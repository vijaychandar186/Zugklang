from __future__ import annotations

import enum
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class AnalysisError(enum.Enum):
    BATCH_FAILURE = enum.auto()
    INSUFFICIENT_DATA = enum.auto()


class AnalyseRequest(BaseModel):
    users: List[str]


class PredictionResult(BaseModel):
    user: str
    tc: int
    days: int
    pred: float
    insight_1: Optional[str] = None
    insight_2: Optional[str] = None
    insight_3: Optional[str] = None


class AnalyseResponse(BaseModel):
    results: List[PredictionResult]


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
    moves: List[str]
    move_times_white_ms: List[int]
    move_times_black_ms: List[int]
    white_user_id: Optional[str] = None
    black_user_id: Optional[str] = None
    white_rating: Optional[int] = None
    black_rating: Optional[int] = None
    result: str  # 'white' | 'black' | 'draw'
    played_at: Optional[datetime] = None


class GameIngestionResponse(BaseModel):
    stored: bool
    white_moves_stored: int
    black_moves_stored: int
