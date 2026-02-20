from __future__ import annotations

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
