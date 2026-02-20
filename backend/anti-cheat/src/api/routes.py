from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException, Request

from api.schemas import AnalyseRequest, AnalyseResponse, HealthResponse, UserPrediction
from config import settings
from data.loader import build_live_dataset
from model.predictor import predict_batch

log = logging.getLogger(__name__)
router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["ops"])
async def health() -> HealthResponse:
    return HealthResponse(status="ok", version="2.0.0")


@router.post("/analyse", response_model=AnalyseResponse, tags=["inference"])
async def analyse(body: AnalyseRequest, request: Request) -> AnalyseResponse:
    """Score a batch of users for engine assistance.

    Returns a cheat probability in **[0, 1]** plus the top-3 most
    influential Lichess insight URLs for each user.
    """
    log.info(f"Received analysis request for {len(body.users)} user(s)")

    try:
        data_dct = build_live_dataset(settings, body.users)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=f"Insight data unavailable: {exc}")
    except Exception as exc:
        log.exception("Unexpected error during data loading")
        raise HTTPException(status_code=500, detail=str(exc))

    if not data_dct:
        return AnalyseResponse(results=[
            UserPrediction(user=u, error="insufficient_data") for u in body.users
        ])

    df = predict_batch(
        tc_list=settings.tc_list,
        days_list=settings.days_list,
        use_eval=settings.use_eval,
        explainers=request.app.state.explainers,
        data_dct=data_dct,
    )

    scored = df.set_index("user").to_dict("index") if not df.empty else {}

    results = []
    for user in body.users:
        if user not in scored:
            results.append(UserPrediction(user=user, error="insufficient_data"))
        else:
            row = scored[user]
            results.append(UserPrediction(
                user=user,
                score=float(row["score"]),
                insights=[row["insight_1"], row["insight_2"], row["insight_3"]],
                tc=int(row["tc"]),
            ))

    return AnalyseResponse(results=results)
