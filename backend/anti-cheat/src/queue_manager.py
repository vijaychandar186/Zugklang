"""QueueManager: polls the analysis_queue table, runs batch inference, writes results."""
from __future__ import annotations

import json
import logging
from copy import deepcopy
from datetime import datetime, timedelta
from typing import Any, Dict, List

from prisma import Prisma

from .config import (
    BATCH_REFRESH_WAIT,
    BATCH_SIZE,
    BATCH_TIMEOUT,
    MODEL_CONFIGS,
    resolve_model_dir_path,
)
from .db import db_retry, get_db
from .ml.explainer import load_shap_explainer
from .ml.prediction import run_inference
from .redis_client import get_redis
from .schemas import AnalysisError

log = logging.getLogger(__name__)

Record = Dict[str, Any]


class QueueManager:
    """Polls analysis_queue for pending users, runs inference in batches, writes results back."""

    def __init__(self) -> None:
        self.db: Prisma = get_db()
        self.explainers = {
            cfg: load_shap_explainer(resolve_model_dir_path(cfg[0], cfg[1], cfg[2]))
            for cfg in MODEL_CONFIGS
        }
        log.info("QueueManager initialised.")

    def start(self) -> None:
        while True:
            batch_start = datetime.utcnow()
            pending: List[Record] = []
            while len(pending) < BATCH_SIZE:
                self._fetch_next(pending)
                if pending and (datetime.utcnow() - batch_start).total_seconds() > BATCH_TIMEOUT:
                    break
            if not pending:
                continue
            try:
                self._write_results(self._analyse_batch(pending))
            except Exception as exc:
                log.warning("Batch failed (%s); falling back to single-user mode.", exc)
                for item in pending:
                    self._analyse_single(item)

    def _analyse_batch(self, pending: List[Record]) -> List[Record]:
        completed = deepcopy(pending)
        usernames = [doc["username"] for doc in pending]
        response = run_inference(
            self.db,
            explainers=self.explainers,
            live_user_list=usernames,
        )
        response_index = (
            {} if response is None or response.empty
            else response.set_index("user").to_dict("index")
        )

        for doc in completed:
            result: Dict[str, Any] = {"at": datetime.utcnow(), "read": False}
            if response is None:
                result["error"] = AnalysisError.BATCH_FAILURE.name
            elif doc["username"] not in response_index:
                result["error"] = AnalysisError.INSUFFICIENT_DATA.name
            else:
                user_data = response_index[doc["username"]]
                result["pred"] = user_data["pred"]
                result["tc"] = int(user_data["tc"])
                result["insight1"] = user_data.get("insight_1")
                result["insight2"] = user_data.get("insight_2")
                result["insight3"] = user_data.get("insight_3")
            doc["_result"] = result

        return completed

    @db_retry(log)
    def _fetch_next(self, pending: List[Record]) -> None:
        # Block on Redis list for up to BATCH_REFRESH_WAIT seconds as a wake-up
        # signal. Falls through to the DB fetch regardless of whether a message
        # was received so that stale/retried jobs are still picked up.
        get_redis().blpop("analysis:queue:notify", timeout=BATCH_REFRESH_WAIT)

        cutoff = datetime.utcnow() - timedelta(seconds=10 * BATCH_TIMEOUT)
        record = self.db.analysisqueue.find_first(
            where={
                "respondedAt": None,
                "OR": [
                    {"startedAt": None},
                    {"startedAt": {"lt": cutoff}},
                ],
            },
            order={"priority": "desc"},
        )
        if record is None:
            return
        self.db.analysisqueue.update(
            where={"username": record.username},
            data={"startedAt": datetime.utcnow()},
        )
        pending.append({"username": record.username, "priority": record.priority})

    @db_retry(log)
    def _write_results(self, completed: List[Record]) -> None:
        redis = get_redis()
        for doc in completed:
            r = doc.get("_result", {})
            self.db.analysisqueue.update(
                where={"username": doc["username"]},
                data={
                    "respondedAt": r.get("at"),
                    "read": r.get("read", False),
                    "error": r.get("error"),
                    "pred": r.get("pred"),
                    "tc": r.get("tc"),
                    "insight1": r.get("insight1"),
                    "insight2": r.get("insight2"),
                    "insight3": r.get("insight3"),
                },
            )
            if r.get("error") is None:
                redis.publish(
                    "analysis:done",
                    json.dumps({
                        "username": doc["username"],
                        "pred": r.get("pred"),
                        "tc": r.get("tc"),
                    }),
                )

    def _analyse_single(self, doc: Record) -> None:
        self._write_results(self._analyse_batch([doc]))
