"""
Generate synthetic input_data artifacts so the ML pipeline can run in dev.
Run inside the anti-cheat container:
  python generate_synthetic_artifacts.py
"""

import os
import pickle

import pandas as pd

USE_EVAL = 0
TIME_CONTROLS = [2, 6]
DAYS_LIST = [180]

OUT_DIR = f"input_data/use_eval_{USE_EVAL}"
os.makedirs(OUT_DIR, exist_ok=True)

# ---------------------------------------------------------------------------
# Insight → bin values mapping
# ---------------------------------------------------------------------------
# Bins mirror the SQL CASE / NTILE expressions in queries.py

INSIGHT_BINS = {
    # NTILE(10) by date
    "movetime_date": list(range(1, 11)),
    "timevariance_date": list(range(1, 11)),
    "blur_date": list(range(1, 11)),
    "opponentrating_date": list(range(1, 11)),
    "ratinggain_date": list(range(1, 11)),
    # material imbalance (9 buckets)
    "movetime_material": [1, 2, 3, 4, 5, 6, 7, 8, 9],
    "timevariance_material": [1, 2, 3, 4, 5, 6, 7, 8, 9],
    "blur_material": [1, 2, 3, 4, 5, 6, 7, 8, 9],
    # game phase (opening=1, mid=2, end=3)
    "movetime_phase": [1, 2, 3],
    "timevariance_phase": [1, 2, 3],
    "blur_phase": [1, 2, 3],
    # blur boolean (0=no blur, 1=blur)
    "movetime_blur": [0, 1],
    "timevariance_blur": [0, 1],
    # move time buckets (centiseconds)
    "blur_movetime": [1, 3, 5, 10, 30, 60],
    "timevariance_movetime": [1, 3, 5, 10, 30, 60],
    # time variance buckets
    "movetime_timevariance": [25000, 40000, 60000, 75000, 100000],
    "blur_timevariance": [25000, 40000, 60000, 75000, 100000],
    # result (1=win, 2=draw, 3=loss)
    "movetime_result": [1, 2, 3],
    "timevariance_result": [1, 2, 3],
    "blur_result": [1, 2, 3],
    "blurfiltered_result": [1, 2, 3],
    "opponentrating_result": [1, 2, 3],
    # piece type (1=pawn..6=king)
    "movetime_piecemoved": [1, 2, 3, 4, 5, 6],
    "timevariance_piecemoved": [1, 2, 3, 4, 5, 6],
    "blur_piecemoved": [1, 2, 3, 4, 5, 6],
    # first three moves (9 stats: mean/median/std × 3 moves, mapped to col indices)
    "movetime_firstthreemoves": [3, 4, 5, 6, 7, 8, 9, 10, 11],
}

# ---------------------------------------------------------------------------
# 1. insight_bin_keys.pkl — DataFrame(insight, bin)
# ---------------------------------------------------------------------------
bin_rows = []
for insight, bins in INSIGHT_BINS.items():
    for b in bins:
        bin_rows.append({"insight": insight, "bin": b})

bin_keys = pd.DataFrame(bin_rows)
with open(f"{OUT_DIR}/insight_bin_keys.pkl", "wb") as f:
    pickle.dump(bin_keys, f, protocol=4)
print(f"Wrote insight_bin_keys.pkl  ({len(bin_keys)} rows)")

# ---------------------------------------------------------------------------
# 2. insight_averages.pkl — DataFrame(insight, avg_value)
# After log(value+1) transform; typical movetime ~30cs -> log(31)~3.4
# ---------------------------------------------------------------------------
AVG_VALUES = {
    "movetime_date": 3.4,
    "timevariance_date": 0.4,
    "blur_date": 0.05,
    "opponentrating_date": 7.2,
    "ratinggain_date": 9.21,  # log(10001+0)
    "movetime_material": 3.4,
    "timevariance_material": 0.4,
    "blur_material": 0.05,
    "movetime_phase": 3.4,
    "timevariance_phase": 0.4,
    "blur_phase": 0.05,
    "movetime_blur": 3.4,
    "timevariance_blur": 0.4,
    "blur_movetime": 0.05,
    "timevariance_movetime": 0.4,
    "movetime_timevariance": 3.4,
    "blur_timevariance": 0.05,
    "movetime_result": 3.4,
    "timevariance_result": 0.4,
    "blur_result": 0.05,
    "blurfiltered_result": 0.05,
    "opponentrating_result": 7.2,
    "movetime_piecemoved": 3.4,
    "timevariance_piecemoved": 0.4,
    "blur_piecemoved": 0.05,
    "movetime_firstthreemoves": 3.4,
}

insight_averages = pd.DataFrame(
    [{"insight": k, "avg_value": v} for k, v in AVG_VALUES.items()]
)
with open(f"{OUT_DIR}/insight_averages.pkl", "wb") as f:
    pickle.dump(insight_averages, f, protocol=4)
print(f"Wrote insight_averages.pkl  ({len(insight_averages)} rows)")

# ---------------------------------------------------------------------------
# 3. minmax_values_for_clipping.pkl — DataFrame(insight,tc,days,nb_min,nb_max,value_min,value_max)
# Values are after log(x) / log(x+1) transforms.
# ---------------------------------------------------------------------------
VALUE_RANGES = {
    "movetime_date": (0.5, 6.0),
    "timevariance_date": (0.0, 1.0),
    "blur_date": (0.0, 4.7),
    "opponentrating_date": (5.5, 8.5),
    "ratinggain_date": (9.0, 9.5),
    "movetime_material": (0.5, 6.0),
    "timevariance_material": (0.0, 1.0),
    "blur_material": (0.0, 4.7),
    "movetime_phase": (0.5, 6.0),
    "timevariance_phase": (0.0, 1.0),
    "blur_phase": (0.0, 4.7),
    "movetime_blur": (0.5, 6.0),
    "timevariance_blur": (0.0, 1.0),
    "blur_movetime": (0.0, 4.7),
    "timevariance_movetime": (0.0, 1.0),
    "movetime_timevariance": (0.5, 6.0),
    "blur_timevariance": (0.0, 4.7),
    "movetime_result": (0.5, 6.0),
    "timevariance_result": (0.0, 1.0),
    "blur_result": (0.0, 4.7),
    "blurfiltered_result": (0.0, 4.7),
    "opponentrating_result": (5.5, 8.5),
    "movetime_piecemoved": (0.5, 6.0),
    "timevariance_piecemoved": (0.0, 1.0),
    "blur_piecemoved": (0.0, 4.7),
    "movetime_firstthreemoves": (0.5, 6.0),
}

# nb is log(count): typical 1-500 moves per bin -> log(2) to log(501) ≈ 0.7 to 6.2
NB_MIN, NB_MAX = 0.0, 7.0

minmax_rows = []
for insight, (vmin, vmax) in VALUE_RANGES.items():
    for tc in TIME_CONTROLS:
        for days in DAYS_LIST:
            minmax_rows.append(
                {
                    "insight": insight,
                    "tc": tc,
                    "days": days,
                    "nb_min": NB_MIN,
                    "nb_max": NB_MAX,
                    "value_min": vmin,
                    "value_max": vmax,
                }
            )

minmax_df = pd.DataFrame(minmax_rows)
with open(f"{OUT_DIR}/minmax_values_for_clipping.pkl", "wb") as f:
    pickle.dump(minmax_df, f, protocol=4)
print(f"Wrote minmax_values_for_clipping.pkl  ({len(minmax_df)} rows)")

# ---------------------------------------------------------------------------
# 4. metadata_dct.pkl — train/valid/test split (empty for dev)
# ---------------------------------------------------------------------------
meta = {
    "cheat_users": [],
    "legit_users": [],
    "train_users": [],
    "valid_users": [],
    "test_users": [],
    "eligible_player_dct": {
        tc: {days: [] for days in DAYS_LIST} for tc in TIME_CONTROLS
    },
}
with open(f"{OUT_DIR}/metadata_dct.pkl", "wb") as f:
    pickle.dump(meta, f, protocol=4)
print("Wrote metadata_dct.pkl")

print("\nAll synthetic artifacts generated successfully.")
print(f"Location: {os.path.abspath(OUT_DIR)}/")
