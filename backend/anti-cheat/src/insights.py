"""Insight generation: builds per-user statistical feature DataFrames from PostgreSQL."""
from __future__ import annotations

import logging
import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple

import numpy as np
import pandas as pd
from prisma import Prisma

from .config import (
    ANALYSIS_DAYS,
    MAX_GAMES,
    MAX_MOVES,
    MIN_MOVES,
    TIME_CONTROLS,
    USE_EVAL,
)
from .db import load_pickle, save_pickle
from .queries import (
    acpl_by_blur,
    acpl_by_evaluation,
    acpl_by_material,
    acpl_by_movetime,
    acpl_by_piecemoved,
    acpl_by_result,
    acpl_by_timevariance,
    acplfiltered_by_blur,
    acplfiltered_by_date,
    all_user_ids,
    blur_by_centipawnloss,
    blur_by_date,
    blur_by_evaluation,
    blur_by_material,
    blur_by_movetime,
    blur_by_phase,
    blur_by_piecemoved,
    blur_by_result,
    blur_by_timevariance,
    blurfiltered_by_result,
    first_three_move_times,
    latest_game_date,
    movetime_by_blur,
    movetime_by_centipawnloss,
    movetime_by_date,
    movetime_by_date_eval,
    movetime_by_evaluation,
    movetime_by_material,
    movetime_by_phase,
    movetime_by_piecemoved,
    movetime_by_result,
    movetime_by_timevariance,
    opponentrating_by_date,
    opponentrating_by_result,
    ratinggain_by_date,
    timevariance_by_blur,
    timevariance_by_centipawnloss,
    timevariance_by_date,
    timevariance_by_evaluation,
    timevariance_by_material,
    timevariance_by_movetime,
    timevariance_by_phase,
    timevariance_by_piecemoved,
    timevariance_by_result,
)

log = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# User-level data helpers
# ---------------------------------------------------------------------------

def build_player_date_index(
    db: Prisma,
    legit_users: List[str],
    time_controls: List[int],
    is_live: bool,
) -> Dict[str, Dict[int, datetime]]:
    index: Dict[str, Dict[int, datetime]] = {}
    for username in legit_users:
        index[username] = {}
        for tc in time_controls:
            dt = latest_game_date(db, username, tc)
            index[username][tc] = dt if dt is not None else datetime.now()

    if not is_live:
        engine_users = db.user.find_many(
            where={"engineMark": True},
            include={"username": True},  # type: ignore[arg-type]
        )
        for user in engine_users:
            if user.markDate is not None:
                index[user.username] = {tc: user.markDate for tc in time_controls}

    return index


def build_rating_dataframe(db: Prisma) -> pd.DataFrame:
    tc_name_map = {2: "ratingBlitz", 6: "ratingRapid"}
    users = db.user.find_many()
    rows = []
    for user in users:
        for tc, field in tc_name_map.items():
            rating = getattr(user, field, None)
            if rating is not None:
                rows.append({"user": user.username, "tc": tc, "rating": rating})
    return pd.DataFrame(rows)


def build_dense_layer_data(insights_df: pd.DataFrame, db: Prisma) -> pd.DataFrame:
    df = (
        insights_df[["user", "tc", "days"]].drop_duplicates()
        .merge(insights_df[(insights_df["insight"] == "acpl_result") & (insights_df["bin"] == 1)][["user", "tc", "days", "nb", "value"]].rename(columns={"nb": "nb1", "value": "value1"}), how="left")
        .merge(insights_df[(insights_df["insight"] == "acpl_result") & (insights_df["bin"] == 3)][["user", "tc", "days", "nb", "value"]].rename(columns={"nb": "nb3", "value": "value3"}), how="left")
        .merge(insights_df[insights_df["insight"] == "acpl_result"][["user", "tc", "days", "nb"]].groupby(["user", "tc", "days"], as_index=False).sum().rename(columns={"nb": "eval_ss"}), how="left")
        .merge(insights_df[(insights_df["insight"] == "movetime_result") & (insights_df["bin"] == 1)][["user", "tc", "days", "nb"]].groupby(["user", "tc", "days"], as_index=False).sum().rename(columns={"nb": "all_nb1"}), how="left")
        .merge(insights_df[(insights_df["insight"] == "movetime_result") & (insights_df["bin"] == 3)][["user", "tc", "days", "nb"]].groupby(["user", "tc", "days"], as_index=False).sum().rename(columns={"nb": "all_nb3"}), how="left")
        .merge(insights_df[insights_df["insight"] == "movetime_result"][["user", "tc", "days", "nb"]].groupby(["user", "tc", "days"], as_index=False).sum().rename(columns={"nb": "all_ss"}), how="left")
    )
    df["eval_win_loss_ratio"] = (df["nb1"] / df["nb3"]).fillna(50)
    df["all_win_loss_ratio"] = (df["all_nb1"] / df["all_nb3"]).fillna(50)
    df["eval_all_win_loss_ratio"] = df["eval_win_loss_ratio"] / df["all_win_loss_ratio"]
    df["eval_sample_ratio"] = df["eval_ss"] / df["all_ss"]
    df = df.drop(["nb1", "value1", "nb3", "value3", "all_nb1", "all_nb3"], axis=1)
    df = df.merge(build_rating_dataframe(db))
    df = pd.melt(df, id_vars=["user", "tc", "days"], var_name="bin")
    df["nb"] = 1
    dense_fields = sorted(df["bin"].unique().tolist())
    df["num_map"] = df["bin"].map(dict(zip(dense_fields, range(len(dense_fields)))))
    df["insight"] = "dense" + df["num_map"].astype(str) + "_layer"
    df["bin"] = 1
    df = df[["insight", "user", "tc", "days", "bin", "nb", "value"]
            ].sort_values(["insight", "user", "tc", "days", "bin"])
    return pd.concat([insights_df, df], ignore_index=True)


# ---------------------------------------------------------------------------
# Insight generation
# ---------------------------------------------------------------------------

def _get_user_date_window(
    user_index: int,
    username: str,
    time_controls: List[int],
    is_marked: bool,
    player_date_index: Dict,
) -> Optional[Dict[int, datetime]]:
    if user_index % 500 == 0:
        log.debug("Processed %d users.", user_index)
    try:
        return {tc: player_date_index[username][tc] for tc in time_controls}
    except KeyError:
        return None if is_marked else {tc: player_date_index[username][tc] for tc in time_controls}


def partition_users(
    db: Prisma,
    is_live: bool = False,
    live_user_list: Optional[List[str]] = None,
) -> Tuple[List[str], List[str]]:
    if is_live:
        return live_user_list or [], []
    all_users = set(all_user_ids(db))
    engine_ids = {u.username for u in db.user.find_many(where={"engineMark": True})}
    return list(all_users - engine_ids), list(all_users & engine_ids)


def build_eligible_players(
    cheat_first_df: pd.DataFrame,
    legit_first_df: pd.DataFrame,
    time_controls: List[int],
    date_bucket_config: Dict[int, int],
) -> Dict:
    eligible: Dict = {tc: {days: [] for days in date_bucket_config} for tc in time_controls}
    for tc in legit_first_df["tc"].unique():
        for days in legit_first_df["days"].unique():
            eligible[tc][days] = (
                list(cheat_first_df[(cheat_first_df["tc"] == tc) & (
                    cheat_first_df["days"] == days)]["user"].unique())
                + list(legit_first_df[(legit_first_df["tc"] == tc) &
                       (legit_first_df["days"] == days)]["user"].unique())
            )
    return eligible


def build_user_eligibility_map(
    time_controls: List[int],
    days_list: List[int],
    eligible_players: Dict,
    user_list: List[str],
    overwrite: bool,
    is_marked: bool,
    is_live: bool,
    use_eval: int,
) -> Dict[str, List[Tuple[int, int]]]:
    cache_path = f"input_data/use_eval_{use_eval}/user_eligibility_dct_{is_marked}.pkl"
    if not overwrite and not is_live and os.path.exists(cache_path):
        return load_pickle(cache_path)
    result = {
        user: [(tc, days)
               for tc in time_controls for days in days_list if user in eligible_players[tc][days]]
        for user in user_list
    }
    result = {k: v for k, v in result.items() if v}
    if not is_live:
        save_pickle(result, cache_path)
    return result


def _aggregate_first_insight(
    db: Prisma,
    user_list: List[str],
    time_controls: List[int],
    days_list: List[int],
    max_games: int,
    max_moves: int,
    min_moves: int,
    query_fn,          # one of: movetime_by_date or acplfiltered_by_date
    metric: str,
    date_bucket_config: Dict[int, int],
    is_marked: bool,
    player_date_index: Dict,
    is_live: bool,
    output_dir: str,
    overwrite: bool,
) -> pd.DataFrame:
    cache_path = f"{output_dir}/{metric}_{bool(is_marked)}.pkl"
    if os.path.isfile(cache_path) and not overwrite:
        return load_pickle(cache_path)

    rows = []
    for idx, username in enumerate(user_list):
        date_window = _get_user_date_window(
            idx, username, time_controls, is_marked, player_date_index)
        if date_window is None:
            continue
        for tc in time_controls:
            for days in days_list:
                start = date_window[tc] - timedelta(days=days)
                n_buckets = date_bucket_config[days]
                results = query_fn(db, username, tc, start, date_window[tc],
                                   max_games, max_moves, n_buckets)
                if sum(r["nb"] for r in results) < min_moves:
                    continue
                for i, row in enumerate(results):
                    rows.append([metric, username, tc, days, i, row["nb"], row["v"]])

    df = pd.DataFrame(rows, columns=["insight", "user", "tc", "days", "bin", "nb", "value"])
    if not is_live:
        save_pickle(df, cache_path)
    return df


def _run_move_metric_by_date(
    db: Prisma,
    user_eligibility: Dict,
    query_fn,
    metric: str,
    time_controls: List[int],
    max_games: int,
    max_moves: int,
    date_bucket_config: Dict[int, int],
    is_marked: bool,
    player_date_index: Dict,
    is_live: bool,
    output_dir: str,
    overwrite: bool,
) -> Optional[pd.DataFrame]:
    cache_path = f"{output_dir}/{metric}_{bool(is_marked)}.pkl"
    if os.path.isfile(cache_path) and not overwrite:
        return None

    rows = []
    for idx, username in enumerate(user_eligibility.keys()):
        date_window = _get_user_date_window(
            idx, username, time_controls, is_marked, player_date_index)
        if date_window is None:
            continue
        for tc, days in user_eligibility[username]:
            start = date_window[tc] - timedelta(days=days)
            n_buckets = date_bucket_config[days]
            for i, row in enumerate(query_fn(db, username, tc, start, date_window[tc],
                                             max_games, max_moves, n_buckets)):
                rows.append([metric, username, tc, days, i, row["nb"], row["v"]])

    df = pd.DataFrame(rows, columns=["insight", "user", "tc", "days", "bin", "nb", "value"])
    if is_live:
        return df
    save_pickle(df, cache_path)
    return None


def _run_game_metric_by_date(
    db: Prisma,
    user_eligibility: Dict,
    query_fn,
    metric: str,
    time_controls: List[int],
    max_games: int,
    date_bucket_config: Dict[int, int],
    is_marked: bool,
    player_date_index: Dict,
    is_live: bool,
    output_dir: str,
    overwrite: bool,
) -> Optional[pd.DataFrame]:
    cache_path = f"{output_dir}/{metric}_{bool(is_marked)}.pkl"
    if os.path.isfile(cache_path) and not overwrite:
        return None

    rows = []
    for idx, username in enumerate(user_eligibility.keys()):
        date_window = _get_user_date_window(
            idx, username, time_controls, is_marked, player_date_index)
        if date_window is None:
            continue
        for tc, days in user_eligibility[username]:
            start = date_window[tc] - timedelta(days=days)
            n_buckets = date_bucket_config[days]
            for i, row in enumerate(query_fn(db, username, tc, start, date_window[tc],
                                             max_games, n_buckets)):
                rows.append([metric, username, tc, days, i, row["nb"], row["v"]])

    df = pd.DataFrame(rows, columns=["insight", "user", "tc", "days", "bin", "nb", "value"])
    if is_live:
        return df
    save_pickle(df, cache_path)
    return None


def _run_metric_by_dimension(
    db: Prisma,
    user_eligibility: Dict,
    query_fn,
    metric: str,
    time_controls: List[int],
    max_games: int,
    max_moves: int,
    is_marked: bool,
    player_date_index: Dict,
    is_live: bool,
    output_dir: str,
    overwrite: bool,
) -> Optional[pd.DataFrame]:
    cache_path = f"{output_dir}/{metric}_{bool(is_marked)}.pkl"
    if os.path.isfile(cache_path) and not overwrite:
        return None

    rows = []
    for idx, username in enumerate(user_eligibility.keys()):
        date_window = _get_user_date_window(
            idx, username, time_controls, is_marked, player_date_index)
        if date_window is None:
            continue
        for tc, days in user_eligibility[username]:
            start = date_window[tc] - timedelta(days=days)
            for row in query_fn(db, username, tc, start, date_window[tc], max_games, max_moves):
                rows.append([metric, username, tc, days, row["_id"], row["nb"], row["v"]])

    df = pd.DataFrame(rows, columns=["insight", "user", "tc", "days", "bin", "nb", "value"])
    if "_blur" in metric:
        df["bin"] = df["bin"].replace({None: 0, True: 1, False: 0})
    if is_live:
        return df
    save_pickle(df, cache_path)
    return None


def _run_game_metric_by_dimension(
    db: Prisma,
    user_eligibility: Dict,
    query_fn,
    metric: str,
    time_controls: List[int],
    max_games: int,
    is_marked: bool,
    player_date_index: Dict,
    is_live: bool,
    output_dir: str,
    overwrite: bool,
) -> Optional[pd.DataFrame]:
    cache_path = f"{output_dir}/{metric}_{bool(is_marked)}.pkl"
    if os.path.isfile(cache_path) and not overwrite:
        return None

    rows = []
    for idx, username in enumerate(user_eligibility.keys()):
        date_window = _get_user_date_window(
            idx, username, time_controls, is_marked, player_date_index)
        if date_window is None:
            continue
        for tc, days in user_eligibility[username]:
            start = date_window[tc] - timedelta(days=days)
            for row in query_fn(db, username, tc, start, date_window[tc], max_games):
                rows.append([metric, username, tc, days, row["_id"], row["nb"], row["v"]])

    df = pd.DataFrame(rows, columns=["insight", "user", "tc", "days", "bin", "nb", "value"])
    if is_live:
        return df
    save_pickle(df, cache_path)
    return None


def _run_movetime_first_three_moves(
    db: Prisma,
    user_eligibility: Dict,
    time_controls: List[int],
    is_marked: bool,
    player_date_index: Dict,
    is_live: bool,
    output_dir: str,
    overwrite: bool,
) -> Optional[pd.DataFrame]:
    cache_path = f"{output_dir}/movetime_firstthreemoves_{bool(is_marked)}.pkl"
    if os.path.isfile(cache_path) and not overwrite:
        return None

    rows = []
    for idx, username in enumerate(user_eligibility.keys()):
        date_window = _get_user_date_window(
            idx, username, time_controls, is_marked, player_date_index)
        if date_window is None:
            continue
        for tc, days in user_eligibility[username]:
            start = date_window[tc] - timedelta(days=days)
            for game in first_three_move_times(db, username, tc, start, date_window[tc]):
                rows.append([username, tc, days, game["id"],
                             game["m1"], game["m2"], game["m3"]])

    df = pd.DataFrame(rows, columns=["user", "tc", "days", "id", "m1", "m2", "m3"])
    agg = (
        df[["user", "tc", "days", "m1", "m2", "m3"]]
        .groupby(["user", "tc", "days"])
        .agg(
            mean_m1=("m1", "mean"), mean_m2=("m2", "mean"), mean_m3=("m3", "mean"),
            median_m1=("m1", "median"), median_m2=("m2", "median"), median_m3=("m3", "median"),
            std_m1=("m1", "std"), std_m2=("m2", "std"), std_m3=("m3", "std"),
            nb=("m1", "count"),
        )
        .reset_index()
    )
    col_map = {col: c for c, col in enumerate(agg.columns) if col not in ["user", "tc", "days", "nb"]}
    agg = agg.melt(id_vars=["user", "tc", "days", "nb"], var_name="bin", value_name="value")
    agg["bin"] = agg["bin"].map(col_map)
    agg["insight"] = "movetime_firstthreemoves"
    agg = agg[["insight", "user", "tc", "days", "bin", "nb", "value"]]

    if is_live:
        return agg
    save_pickle(agg, cache_path)
    return None


def generate_all_insights(
    db: Prisma,
    user_list: List[str],
    eligible_players: Dict,
    time_controls: List[int],
    date_bucket_config: Dict[int, int],
    is_live: bool,
    chunk_list: list,
    use_eval: int,
    is_marked: bool = False,
    player_date_index: Optional[Dict] = None,
    max_games: int = 1000,
    max_moves: int = 20000,
    overwrite: bool = False,
    overwrite_eligibility: bool = True,
) -> list:
    overwrite = overwrite or is_live
    days_list = list(date_bucket_config.keys())
    user_eligibility = build_user_eligibility_map(
        time_controls, days_list, eligible_players, user_list,
        overwrite=overwrite_eligibility, is_marked=bool(is_marked),
        is_live=is_live, use_eval=use_eval,
    )
    output_dir = f"insights_df_chunks/use_eval_{use_eval}/"
    os.makedirs(output_dir, exist_ok=True)

    shared = dict(
        db=db,
        user_eligibility=user_eligibility,
        time_controls=time_controls,
        is_marked=is_marked,
        player_date_index=player_date_index,
        is_live=is_live,
        output_dir=output_dir,
        overwrite=overwrite,
    )

    move_date_queries = [
        (timevariance_by_date, "timevariance_date"),
        (blur_by_date, "blur_date"),
    ]
    metric_dim_queries = [
        (timevariance_by_movetime, "timevariance_movetime"),
        (blur_by_movetime, "blur_movetime"),
        (movetime_by_material, "movetime_material"),
        (timevariance_by_material, "timevariance_material"),
        (blur_by_material, "blur_material"),
        (timevariance_by_phase, "timevariance_phase"),
        (blur_by_phase, "blur_phase"),
        (movetime_by_phase, "movetime_phase"),
        (timevariance_by_blur, "timevariance_blur"),
        (movetime_by_blur, "movetime_blur"),
        (blur_by_timevariance, "blur_timevariance"),
        (movetime_by_timevariance, "movetime_timevariance"),
        (timevariance_by_result, "timevariance_result"),
        (blur_by_result, "blur_result"),
        (blurfiltered_by_result, "blurfiltered_result"),
        (movetime_by_result, "movetime_result"),
        (movetime_by_piecemoved, "movetime_piecemoved"),
        (timevariance_by_piecemoved, "timevariance_piecemoved"),
        (blur_by_piecemoved, "blur_piecemoved"),
    ]
    game_date_queries = [
        (opponentrating_by_date, "opponentrating_date"),
        (ratinggain_by_date, "ratinggain_date"),
    ]
    game_dim_queries = [
        (opponentrating_by_result, "opponentrating_result"),
    ]

    for query_fn, metric in move_date_queries:
        chunk_list.append(_run_move_metric_by_date(
            query_fn=query_fn, metric=metric,
            max_games=max_games, max_moves=max_moves,
            date_bucket_config=date_bucket_config, **shared))
    for query_fn, metric in metric_dim_queries:
        chunk_list.append(_run_metric_by_dimension(
            query_fn=query_fn, metric=metric,
            max_games=max_games, max_moves=max_moves, **shared))
    for query_fn, metric in game_date_queries:
        chunk_list.append(_run_game_metric_by_date(
            query_fn=query_fn, metric=metric,
            max_games=max_games, date_bucket_config=date_bucket_config, **shared))
    for query_fn, metric in game_dim_queries:
        chunk_list.append(_run_game_metric_by_dimension(
            query_fn=query_fn, metric=metric, max_games=max_games, **shared))

    chunk_list.append(_run_movetime_first_three_moves(
        db=db,
        user_eligibility=user_eligibility,
        time_controls=time_controls,
        is_marked=is_marked,
        player_date_index=player_date_index,
        is_live=is_live,
        output_dir=output_dir,
        overwrite=overwrite,
    ))

    if not use_eval:
        return chunk_list

    eval_move_date = [
        (movetime_by_date_eval, "movetime_date"),
        (acplfiltered_by_date, "acplfiltered_date"),
    ]
    eval_metric_dim = [
        (acpl_by_movetime, "acpl_movetime"),
        (acpl_by_phase, "acpl_phase"),
        (acpl_by_material, "acpl_material"),
        (acpl_by_blur, "acpl_blur"),
        (acplfiltered_by_blur, "acplfiltered_blur"),
        (acpl_by_timevariance, "acpl_timevariance"),
        (acpl_by_result, "acpl_result"),
        (acpl_by_piecemoved, "acpl_piecemoved"),
        (movetime_by_evaluation, "movetime_evaluation"),
        (acpl_by_evaluation, "acpl_evaluation"),
        (timevariance_by_evaluation, "timevariance_evaluation"),
        (blur_by_evaluation, "blur_evaluation"),
        (timevariance_by_centipawnloss, "timevariance_centipawnloss"),
        (blur_by_centipawnloss, "blur_centipawnloss"),
        (movetime_by_centipawnloss, "movetime_centipawnloss"),
    ]

    for query_fn, metric in eval_move_date:
        chunk_list.append(_run_move_metric_by_date(
            query_fn=query_fn, metric=metric,
            max_games=max_games, max_moves=max_moves,
            date_bucket_config=date_bucket_config, **shared))
    for query_fn, metric in eval_metric_dim:
        chunk_list.append(_run_metric_by_dimension(
            query_fn=query_fn, metric=metric,
            max_games=max_games, max_moves=max_moves, **shared))

    return chunk_list


def build_composite_insight(df: pd.DataFrame, metric_a: str, metric_b: str) -> pd.DataFrame:
    merged = (
        df[df["insight"] == f"{metric_a}_date"][["user", "tc", "days", "bin", "nb", "value"]]
        .rename(columns={"nb": f"nb_{metric_a}", "value": f"value_{metric_a}"})
        .merge(df[df["insight"] == f"{metric_b}_date"][["user", "tc", "days", "bin", "nb", "value"]]
               .rename(columns={"nb": f"nb_{metric_b}", "value": f"value_{metric_b}"}))
    )
    merged["insight"] = f"{metric_a}over{metric_b}_date"
    merged["nb"] = merged[f"nb_{metric_a}"] / merged[f"nb_{metric_b}"]
    merged["value"] = merged[f"value_{metric_a}"] / merged[f"value_{metric_b}"]
    return merged[["insight", "user", "tc", "days", "bin", "nb", "value"]]


def enrich_with_composite_insights(df: pd.DataFrame) -> pd.DataFrame:
    return pd.concat(
        [df,
         build_composite_insight(df, "movetime", "acpl"),
         build_composite_insight(df, "opponentrating", "acpl")],
        ignore_index=True,
    )


# ---------------------------------------------------------------------------
# ML transformation helpers (pure pandas — no DB access needed)
# ---------------------------------------------------------------------------

def _get_users_missing_dimension(df: pd.DataFrame, user_list: List[str], dimension: str) -> set:
    subset = df[(df["user"].isin(user_list)) & (df["insight"].str.contains(f"_{dimension}"))]
    return set(user_list) - set(subset["user"].unique())


def filter_users_with_complete_dimensions(
    df: pd.DataFrame,
    dimensions: List[str],
    train_users: List[str],
    valid_users: List[str],
    test_users: List[str],
) -> Tuple[List[str], List[str], List[str]]:
    tr_remove, va_remove, te_remove = set(), set(), set()
    for dim in dimensions:
        tr_remove |= _get_users_missing_dimension(df, train_users, dim)
        va_remove |= _get_users_missing_dimension(df, valid_users, dim)
        te_remove |= _get_users_missing_dimension(df, test_users, dim)
    return (
        list(set(train_users) - tr_remove),
        list(set(valid_users) - va_remove),
        list(set(test_users) - te_remove),
    )


def build_dimension_arrays(
    df: pd.DataFrame,
    user_list: List[str],
    dimension: str,
    suppress_warnings: bool = False,
) -> np.ndarray:
    subset = df[df["user"].isin(user_list)].copy()
    dim_df = subset[subset["insight"].str.contains(f"_{dimension}")].sort_values(
        ["user", "insight", "bin"])
    nb_vals = dim_df["nb"].values
    if len(nb_vals) == 0:
        if not suppress_warnings:
            log.debug("No data for dimension: %s", dimension)
        return np.empty((0, 0, 0, 0))
    n_users, n_insights = dim_df["user"].nunique(), dim_df["insight"].nunique()
    nb_arr = np.reshape(nb_vals, (n_users, n_insights, 1, -1))
    val_arr = np.reshape(dim_df["value"].values, (n_users, n_insights, 1, -1))
    return np.concatenate((nb_arr, val_arr), axis=2)


def build_binary_labels(
    df: pd.DataFrame,
    cheat_users: List[str],
    legit_users: List[str],
) -> Tuple[List[str], np.ndarray]:
    users = pd.DataFrame({"user": df["user"].unique()})
    users["label"] = np.where(
        users["user"].isin(cheat_users), 1,
        np.where(users["user"].isin(legit_users), 0, np.nan),
    )
    users = users.dropna().sort_values("user").reset_index(drop=True)
    return list(users["user"].values), users["label"].values


def impute_missing_insight_values(df: pd.DataFrame, is_live: bool, use_eval: int) -> pd.DataFrame:
    user_keys = df[["user", "insight"]].drop_duplicates()
    cache_prefix = f"input_data/use_eval_{use_eval}"

    if is_live:
        bin_keys = load_pickle(f"{cache_prefix}/insight_bin_keys.pkl")
        insight_averages = load_pickle(f"{cache_prefix}/insight_averages.pkl")
    else:
        bin_keys = df[["insight", "bin"]].drop_duplicates()
        insight_averages = (
            df[["insight", "value"]]
            .groupby("insight", as_index=False)
            .mean()
            .rename(columns={"value": "avg_value"})
        )
        save_pickle(bin_keys, f"{cache_prefix}/insight_bin_keys.pkl")
        save_pickle(insight_averages, f"{cache_prefix}/insight_averages.pkl")

    df = (
        user_keys
        .merge(bin_keys)
        .merge(df[["user", "insight", "bin", "nb", "value"]], how="left")
        .sort_values(["user", "insight", "bin"])
    )
    df = df.replace([np.inf, -np.inf], np.nan)
    df["nb"] = df["nb"].fillna(1)
    df["value"] = df["value"].fillna(
        df.groupby(["user", "insight"])["value"].transform("mean"))

    bin_keys["_dummy"] = 1
    user_keys = pd.DataFrame({"user": df["user"].unique(), "_dummy": 1})
    frames = []
    for dim in {insight.split("_")[1] for insight in df["insight"].unique()}:
        sub = df[df["insight"].str.contains(f"_{dim}")]
        sub = (
            user_keys
            .merge(bin_keys[bin_keys["insight"].str.contains(f"_{dim}")])
            .merge(sub, how="left")
            .drop("_dummy", axis=1)
        )
        sub["nb"] = sub["nb"].fillna(1)
        sub = sub.merge(insight_averages, how="left")
        sub["value"] = sub["value"].fillna(sub["avg_value"])
        frames.append(sub)

    return (
        pd.concat(frames, axis=0)
        .drop("avg_value", axis=1)
        .sort_values(["user", "insight", "bin"])
        .reset_index(drop=True)
    )


def _compute_quantile_bounds(
    df: pd.DataFrame,
    train_users: List[str],
    lower_q: float,
    upper_q: float,
) -> pd.DataFrame:
    train_df = df[df["user"].isin(train_users)]
    lower = (
        train_df
        .groupby(["insight", "tc", "days"], as_index=False)[["nb", "value"]]
        .quantile(lower_q)
        .rename(columns={"nb": "nb_min", "value": "value_min"})
    )
    upper = (
        train_df
        .groupby(["insight", "tc", "days"], as_index=False)[["nb", "value"]]
        .quantile(upper_q)
        .rename(columns={"nb": "nb_max", "value": "value_max"})
    )
    return lower.merge(upper)


def clip_and_scale_features(
    df: pd.DataFrame,
    train_users: List[str],
    is_live: bool,
    use_eval: int,
) -> pd.DataFrame:
    for col in ["value", "nb", "tc", "days"]:
        df[col] = pd.to_numeric(df[col], errors="raise")
    df["value"] = np.where(df["insight"] == "ratinggain_date", df["value"] + 10000, df["value"])
    df["nb"] = np.log(df["nb"])
    df["value"] = np.log(df["value"] + 1)

    cache_path = f"input_data/use_eval_{use_eval}/minmax_values_for_clipping.pkl"
    if is_live:
        quantile_df = load_pickle(cache_path)
    else:
        quantile_df = _compute_quantile_bounds(df, train_users, 0.01, 0.98)
        save_pickle(quantile_df, cache_path)

    df = df.merge(quantile_df, on=["insight", "tc", "days"])
    df["nb"] = df["nb"].clip(lower=df["nb_min"], upper=df["nb_max"])
    df["value"] = df["value"].clip(lower=df["value_min"], upper=df["value_max"])
    df["value"] = 2 * (df["value"] - df["value_min"]) / (df["value_max"] - df["value_min"]) - 1
    df["nb"] = 2 * (df["nb"] - df["nb_min"]) / (df["nb_max"] - df["nb_min"]) - 1
    return df.drop(["nb_min", "nb_max", "value_min", "value_max"], axis=1)
