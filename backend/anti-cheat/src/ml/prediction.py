"""Inference pipeline: build training data, run predictions, compute SHAP."""
from __future__ import annotations

import glob
import logging
import os
from typing import Dict, List, Optional, Tuple

import numpy as np
import pandas as pd
import shap

from ..config import (
    ANALYSIS_DAYS,
    MAX_GAMES,
    MAX_MOVES,
    MIN_MOVES,
    MODEL_DIR,
    TIME_CONTROLS,
    USE_EVAL,
    model_artifact_path,
    resolve_model_dir_path,
)
from ..db import load_pickle, db_retry, save_pickle
from ..insights import (
    _aggregate_first_insight,
    build_binary_labels,
    build_dense_layer_data,
    build_dimension_arrays,
    build_eligible_players,
    build_player_date_index,
    clip_and_scale_features,
    enrich_with_composite_insights,
    filter_users_with_complete_dimensions,
    generate_all_insights,
    impute_missing_insight_values,
    partition_users,
)
from ..queries import acplfiltered_by_date, movetime_by_date
from .explainer import (
    compute_shap_explanations,
    build_top_insight_urls,
    load_model_for_inference,
    load_shap_explainer,
)
from .model import KaladinData

from sklearn.model_selection import train_test_split

log = logging.getLogger(__name__)


def _predict_single_config(
    days: int,
    tc: int,
    use_eval: int,
    users: List[str],
    inputs: list,
    labels: Optional[np.ndarray],
    explainer: Optional[shap.DeepExplainer],
    model_dir: str,
) -> pd.DataFrame:
    model = load_model_for_inference(model_artifact_path(model_dir, must_exist=True))
    preds = model.predict(inputs)
    output = pd.DataFrame(
        {"user": users, "tc": tc, "days": days, "label": labels, "pred": np.ravel(preds)})

    if explainer is None:
        explainer = load_shap_explainer(model_dir)
    if explainer is not None:
        shap_values = explainer.shap_values(inputs)
        shap_df = compute_shap_explanations(users, shap_values, model_dir)
        insight_urls = build_top_insight_urls(shap_df, tc, days, top_n=3)
        return output.merge(insight_urls, how="left")

    return output


def run_predictions(
    tc_list: List[int],
    days_list: List[int],
    use_eval: int,
    explainers: Optional[Dict] = None,
    data_dict: Optional[Dict] = None,
) -> pd.DataFrame:
    frames = []
    for tc in tc_list:
        for days in days_list:
            if data_dict is not None and (tc, days) not in data_dict:
                continue
            data = KaladinData(days, tc, use_eval, data_dict)
            explainer = explainers.get((use_eval, tc, days)) if explainers else None
            model_dir = resolve_model_dir_path(use_eval, tc, days)
            frames.append(_predict_single_config(
                days, tc, use_eval,
                data.test_user_list, data.test_inputs, data.test_labels,
                explainer, model_dir,
            ))

    df = pd.concat(frames).reset_index(drop=True)
    df = df.loc[df.groupby("user")["pred"].idxmax()].copy()
    if data_dict is None:
        output_path = os.path.join(MODEL_DIR, "output", f"eval{use_eval}_test_set_preds.pkl")
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        save_pickle(df, output_path)
    return df


@db_retry(log)
def run_inference(
    db,
    use_eval: int = 0,
    explainers: Optional[Dict] = None,
    live_user_list: Optional[List[str]] = None,
) -> Optional[pd.DataFrame]:
    try:
        data_dict = build_training_data(db, is_live=True, live_user_list=live_user_list)
    except Exception as exc:
        log.warning("build_training_data failed: %s", exc)
        if live_user_list and len(live_user_list) == 1:
            return None
        raise
    return run_predictions(
        tc_list=TIME_CONTROLS,
        days_list=list(ANALYSIS_DAYS.keys()),
        use_eval=use_eval,
        explainers=explainers,
        data_dict=data_dict,
    )


def build_training_data(
    db,
    is_live: bool,
    live_user_list: Optional[List[str]] = None,
) -> Optional[Dict]:
    overwrite_data = False
    overwrite_train_split = False
    overwrite_eligibility = False

    legit_users, cheat_users = partition_users(db, is_live, live_user_list)
    player_date_index = build_player_date_index(db, legit_users, TIME_CONTROLS, is_live)

    first_query_fn = acplfiltered_by_date if USE_EVAL else movetime_by_date
    first_metric = "acpl_date" if USE_EVAL else "movetime_date"
    chunk_dir = f"insights_df_chunks/use_eval_{USE_EVAL}/"
    os.makedirs(chunk_dir, exist_ok=True)

    legit_first_df = _aggregate_first_insight(
        db, legit_users, TIME_CONTROLS, list(ANALYSIS_DAYS.keys()),
        MAX_GAMES, MAX_MOVES, MIN_MOVES, first_query_fn, first_metric,
        ANALYSIS_DAYS, is_marked=False, player_date_index=player_date_index,
        is_live=is_live, output_dir=chunk_dir, overwrite=overwrite_data or is_live)
    cheat_first_df = _aggregate_first_insight(
        db, cheat_users, TIME_CONTROLS, list(ANALYSIS_DAYS.keys()),
        MAX_GAMES, MAX_MOVES, MIN_MOVES, first_query_fn, first_metric,
        ANALYSIS_DAYS, is_marked=True, player_date_index=player_date_index,
        is_live=is_live, output_dir=chunk_dir, overwrite=overwrite_data or is_live)

    eligible_players = build_eligible_players(
        cheat_first_df, legit_first_df, TIME_CONTROLS, ANALYSIS_DAYS)

    if is_live:
        train_users, valid_users, test_users = [], [], (legit_users + cheat_users)
    elif overwrite_train_split:
        train_users, test_users = train_test_split(legit_users + cheat_users, test_size=0.1)
        train_users, valid_users = train_test_split(train_users, test_size=0.22)
        save_pickle(
            {"cheat_users": cheat_users, "legit_users": legit_users,
             "train_users": train_users, "valid_users": valid_users,
             "test_users": test_users, "eligible_player_dct": eligible_players},
            f"input_data/use_eval_{USE_EVAL}/metadata_dct.pkl")
    else:
        meta = load_pickle(f"input_data/use_eval_{USE_EVAL}/metadata_dct.pkl")
        train_users = meta["train_users"]
        valid_users = meta["valid_users"]
        test_users = meta["test_users"]

    chunk_list: list = [cheat_first_df, legit_first_df]
    chunk_list = generate_all_insights(
        db, legit_users, eligible_players, TIME_CONTROLS, ANALYSIS_DAYS,
        is_live, chunk_list, USE_EVAL, is_marked=False, player_date_index=player_date_index,
        max_games=MAX_GAMES, max_moves=MAX_MOVES, overwrite=overwrite_data,
        overwrite_eligibility=overwrite_eligibility)
    if not is_live:
        generate_all_insights(
            db, cheat_users, eligible_players, TIME_CONTROLS, ANALYSIS_DAYS,
            is_live, chunk_list, USE_EVAL, is_marked=True, player_date_index=player_date_index,
            max_games=MAX_GAMES, max_moves=MAX_MOVES, overwrite=overwrite_data,
            overwrite_eligibility=overwrite_eligibility)

    if is_live:
        insights_df = pd.concat([c for c in chunk_list if c is not None], ignore_index=True)
    else:
        paths = glob.glob(f"insights_df_chunks/use_eval_{USE_EVAL}/*.pkl")
        insights_df = pd.concat([load_pickle(p) for p in paths], axis=0)

    if USE_EVAL:
        insights_df = build_dense_layer_data(insights_df, db)
        insights_df = enrich_with_composite_insights(insights_df)

    insights_df = clip_and_scale_features(
        insights_df, train_users, is_live=is_live, use_eval=USE_EVAL)
    if not is_live:
        save_pickle(insights_df, f"input_data/use_eval_{USE_EVAL}/insights_df.pkl")

    live_data: Dict = {}
    for tc in insights_df["tc"].unique():
        for days in insights_df["days"].unique():
            subset = insights_df[
                (insights_df["tc"] == tc) & (insights_df["days"] == days)].copy()
            subset = impute_missing_insight_values(subset, is_live, USE_EVAL)
            dimensions = sorted({i.split("_")[1] for i in subset["insight"].unique()})
            tr, va, te = filter_users_with_complete_dimensions(
                subset, dimensions, train_users, valid_users, test_users)
            tr_users, tr_labels = build_binary_labels(
                subset[subset["user"].isin(tr)], cheat_users, legit_users)
            va_users, va_labels = build_binary_labels(
                subset[subset["user"].isin(va)], cheat_users, legit_users)
            te_users, te_labels = build_binary_labels(
                subset[subset["user"].isin(te)], cheat_users, legit_users)

            data_entry: Dict = {
                "train": {}, "valid": {}, "test": {},
                "train_labels": tr_labels, "valid_labels": va_labels, "test_labels": te_labels,
                "train_user_list": tr_users, "valid_user_list": va_users, "test_user_list": te_users,
                "dimensions": dimensions, "df": subset,
            }
            for dim in dimensions:
                data_entry["train"][dim] = build_dimension_arrays(
                    subset, tr, dim, suppress_warnings=is_live)
                data_entry["valid"][dim] = build_dimension_arrays(
                    subset, va, dim, suppress_warnings=is_live)
                data_entry["test"][dim] = build_dimension_arrays(subset, te, dim)

            if is_live:
                live_data[(tc, days)] = data_entry
            else:
                save_pickle(data_entry,
                            f"input_data/use_eval_{USE_EVAL}/data_dct_tc{tc}_days{days}.pkl")

    return live_data if is_live else None
