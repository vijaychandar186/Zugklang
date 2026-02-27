from __future__ import annotations

from typing import Any

import pandas as pd

from model.predict import predict_all


def predict_batch(
    tc_list: list[int],
    days_list: list[int],
    use_eval: int,
    explainers: dict[tuple[int, int, int], Any],
    data_dct: dict[tuple[int, int], dict[str, Any]],
) -> pd.DataFrame:
    """Predict cheat probabilities and normalize output columns for API."""
    df = predict_all(
        tc_list=tc_list,
        days_list=days_list,
        use_eval=use_eval,
        explainers=explainers,
        data_dct=data_dct,
    )
    if df.empty:
        return df

    out = df.rename(columns={"pred": "score"}).copy()
    for ix in (1, 2, 3):
        out[f"insight_{ix}"] = out[f"insight_{ix}"].fillna("")
    return out[["user", "tc", "score", "insight_1", "insight_2", "insight_3"]]
