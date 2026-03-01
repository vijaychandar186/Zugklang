from __future__ import annotations

import logging

from fastapi import APIRouter, Header, HTTPException

from api.schemas import (
    HealthResponse,
    WsMonitorEndRequest,
    WsMonitorMoveRequest,
    WsMonitorReport,
    WsMonitorStartRequest,
)
from config import settings
from ws_monitor.repository import (
    load_latest_report,
    persist_game_end,
    persist_game_move,
    persist_game_start,
    persist_report,
)
from ws_monitor.service import monitor_store

log = logging.getLogger(__name__)
router = APIRouter()


def _authorize_ws_monitor(x_ws_monitor_token: str | None) -> None:
    expected = settings.ws_monitor_token
    if expected and x_ws_monitor_token != expected:
        raise HTTPException(status_code=401, detail="Invalid ws-monitor token.")


@router.get("/health", response_model=HealthResponse, tags=["ops"])
async def health() -> HealthResponse:
    return HealthResponse(status="ok", version="2.0.0")


@router.post("/ws-monitor/start", response_model=WsMonitorReport, tags=["ws-monitor"])
async def ws_monitor_start(
    body: WsMonitorStartRequest,
    x_ws_monitor_token: str | None = Header(default=None),
) -> WsMonitorReport:
    _authorize_ws_monitor(x_ws_monitor_token)
    report = monitor_store.start_game(
        game_id=body.game_id,
        variant=body.variant,
        time_control=body.time_control.model_dump(),
        white_user_id=body.white_user_id,
        black_user_id=body.black_user_id,
        started_at_ms=body.started_at_ms,
    )
    if settings.ws_monitor_persist:
        payload = body.model_dump()
        await persist_game_start(payload)
        await persist_report(body.game_id, "start", body.started_at_ms, report)
    return WsMonitorReport.model_validate(report)


@router.post("/ws-monitor/move", response_model=WsMonitorReport, tags=["ws-monitor"])
async def ws_monitor_move(
    body: WsMonitorMoveRequest,
    x_ws_monitor_token: str | None = Header(default=None),
) -> WsMonitorReport:
    _authorize_ws_monitor(x_ws_monitor_token)
    try:
        report = monitor_store.record_move(
            game_id=body.game_id,
            color=body.move.color,
            event_at_ms=body.event_at_ms,
            move_time_ms=body.move.move_time_ms,
        )
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Unknown game_id: {body.game_id}")
    if settings.ws_monitor_persist:
        payload = body.model_dump()
        await persist_game_move(payload)
        await persist_report(body.game_id, "move", body.event_at_ms, report)
    return WsMonitorReport.model_validate(report)


@router.post("/ws-monitor/end", response_model=WsMonitorReport, tags=["ws-monitor"])
async def ws_monitor_end(
    body: WsMonitorEndRequest,
    x_ws_monitor_token: str | None = Header(default=None),
) -> WsMonitorReport:
    _authorize_ws_monitor(x_ws_monitor_token)
    try:
        report = monitor_store.end_game(
            game_id=body.game_id,
            event_at_ms=body.event_at_ms,
            reason=body.reason,
            winner=body.winner,
        )
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Unknown game_id: {body.game_id}")
    if settings.ws_monitor_persist:
        payload = body.model_dump()
        await persist_game_end(payload)
        await persist_report(body.game_id, "end", body.event_at_ms, report)
    return WsMonitorReport.model_validate(report)


@router.get("/ws-monitor/game/{game_id}", response_model=WsMonitorReport, tags=["ws-monitor"])
async def ws_monitor_get_game(
    game_id: str,
    x_ws_monitor_token: str | None = Header(default=None),
) -> WsMonitorReport:
    _authorize_ws_monitor(x_ws_monitor_token)
    report = monitor_store.get_game_report(game_id)
    if report is None and settings.ws_monitor_persist:
        report = await load_latest_report(game_id)
    if report is None:
        raise HTTPException(status_code=404, detail=f"Unknown game_id: {game_id}")
    return WsMonitorReport.model_validate(report)
