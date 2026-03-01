from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class AnalyseRequest(BaseModel):
    users: list[str] = Field(..., min_length=1, max_length=100,
                             description="Usernames to analyse (max 100 per request).")


class UserPrediction(BaseModel):
    user:     str
    score:    float | None = Field(None, ge=0.0, le=1.0,
                                   description="Cheat probability in [0, 1].")
    insights: list[str] | None = Field(None,
                                       description="Top-3 insight URLs that explain the score.")
    tc:       int | None       = Field(None, description="Time control that produced the score.")
    error:    str | None       = Field(None, description="Set when the user could not be scored.")


class AnalyseResponse(BaseModel):
    results: list[UserPrediction]


class HealthResponse(BaseModel):
    status: str
    version: str


class WsTimeControl(BaseModel):
    mode: Literal["unlimited", "timed", "custom"]
    minutes: int = Field(..., ge=0, le=180)
    increment: int = Field(..., ge=0, le=60)


class WsMonitorStartRequest(BaseModel):
    game_id: str = Field(..., min_length=1, max_length=128)
    variant: str = Field(..., min_length=1, max_length=64)
    time_control: WsTimeControl
    white_user_id: str = Field(..., min_length=1, max_length=128)
    black_user_id: str = Field(..., min_length=1, max_length=128)
    started_at_ms: int = Field(..., ge=0)


class WsMonitorMovePayload(BaseModel):
    color: Literal["white", "black"]
    uci: str = Field(..., min_length=4, max_length=8)
    move_time_ms: int | None = Field(None, ge=0, le=600_000)
    white_time_ms: int | None = Field(None, ge=0)
    black_time_ms: int | None = Field(None, ge=0)


class WsMonitorMoveRequest(BaseModel):
    game_id: str = Field(..., min_length=1, max_length=128)
    ply: int = Field(..., ge=1, le=10_000)
    event_at_ms: int = Field(..., ge=0)
    move: WsMonitorMovePayload


class WsMonitorEndRequest(BaseModel):
    game_id: str = Field(..., min_length=1, max_length=128)
    event_at_ms: int = Field(..., ge=0)
    reason: str = Field(..., min_length=1, max_length=64)
    winner: Literal["white", "black"] | None = None


class WsPlayerMonitorReport(BaseModel):
    user_id: str
    color: Literal["white", "black"]
    moves: int = Field(..., ge=0)
    score: float = Field(..., ge=0.0, le=1.0)
    risk_level: Literal["low", "medium", "high"]
    avg_move_time_ms: int | None = Field(None, ge=0)
    move_time_cv: float | None = Field(None, ge=0.0)
    instant_ratio: float | None = Field(None, ge=0.0, le=1.0)
    flags: list[str]


class WsMonitorReport(BaseModel):
    game_id: str
    status: Literal["active", "ended"]
    variant: str
    time_control: WsTimeControl
    ply_count: int = Field(..., ge=0)
    last_event_ms: int = Field(..., ge=0)
    winner: Literal["white", "black"] | None = None
    reason: str | None = None
    white: WsPlayerMonitorReport
    black: WsPlayerMonitorReport
    overall_score: float = Field(..., ge=0.0, le=1.0)
    overall_risk_level: Literal["low", "medium", "high"]
