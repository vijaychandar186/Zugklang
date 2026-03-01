"""SHAP explainability: load DeepExplainer and compute insight attributions."""
from __future__ import annotations

import logging
import os
from typing import Dict, List, Optional

import numpy as np
import pandas as pd
import shap
import tensorflow as tf

from ..config import DIMENSION_FORMATTER, METRIC_FORMATTER, VARIANT_FORMATTER
from ..db import load_pickle, save_pickle

log = logging.getLogger(__name__)


def load_model_for_inference(model_path: str):
    """Load a TF SavedModel for inference.

    Uses tf.saved_model.load() which is compatible with all TF/Keras versions
    and doesn't require the model architecture to match the currently installed
    Keras. Returns a wrapper with a .predict(inputs) method.
    """
    loaded = tf.saved_model.load(model_path)
    infer = loaded.signatures["serving_default"]
    input_keys = sorted(infer.structured_input_signature[1].keys())
    output_key = list(infer.structured_outputs.keys())[0]

    class _InferenceWrapper:
        def predict(self, inputs, verbose: int = 0) -> np.ndarray:
            input_dict = {
                key: tf.cast(inp, tf.float32)
                for key, inp in zip(input_keys, inputs)
            }
            return infer(**input_dict)[output_key].numpy()

    return _InferenceWrapper()


def load_shap_explainer(model_directory: str) -> Optional[shap.DeepExplainer]:
    """Load a SHAP DeepExplainer for a trained Kaladin model.

    Attempts to load via tf-keras (Keras 2 compatible). Returns None if the
    saved model was produced by an older TF/Keras version that can't be
    reconstructed; in that case predictions still work but insight URLs are
    unavailable.
    """
    import tf_keras

    model_path = os.path.join(model_directory, "model.SavedModel")
    background_path = os.path.join(model_directory, "shap_data.pkl")

    if not os.path.exists(background_path):
        log.warning("No SHAP background data at %s — skipping.", background_path)
        return None

    try:
        model = tf_keras.models.load_model(model_path)
        background = load_pickle(background_path)
        shap.explainers._deep.deep_tf.op_handlers["FusedBatchNormV3"] = (
            shap.explainers._deep.deep_tf.passthrough
        )
        return shap.DeepExplainer(model, background)
    except Exception as exc:
        log.warning(
            "Could not build SHAP explainer for %s (%s). "
            "Predictions will run without insight URLs.",
            model_directory, exc,
        )
        return None


def prepare_shap_background_data(data, model_directory: str) -> None:
    """Compute and save SHAP background data + insight location map after training."""
    location_map: Dict = {}
    all_insights = data.insights_df["insight"].unique().tolist()
    ordered_dims = data.conv_dimensions + [
        d for d in data.dimensions if d not in data.conv_dimensions
    ]
    for d, dim in enumerate(ordered_dims):
        for ix, insight in enumerate(sorted(i for i in all_insights if f"_{dim}" in i)):
            location_map[(d, ix)] = insight
    save_pickle(location_map, os.path.join(model_directory, "insights_location_dct.pkl"))

    n = min(5000, len(data.conv_train_inputs[0]))
    idx = np.random.choice(len(data.conv_train_inputs[0]), n, replace=False)
    save_pickle(
        [branch[idx] for branch in data.train_inputs],
        os.path.join(model_directory, "shap_data.pkl"),
    )


def compute_shap_explanations(
    users: List[str],
    shap_values: list,
    model_directory: str,
) -> pd.DataFrame:
    location_map = load_pickle(os.path.join(model_directory, "insights_location_dct.pkl"))
    rows = []
    for d, branch in enumerate(shap_values[0]):
        for n in range(branch.shape[0]):
            for ix in range(branch[n].shape[0]):
                name = location_map[(d, ix)]
                rows.append([users[n], name.split("_")[1], name, branch[n][ix].sum()])
    df = pd.DataFrame(rows, columns=["user", "dimension", "insight", "shap_insight_sum"])
    df["shap_dimension_sum"] = (
        df.groupby(["user", "dimension"])["shap_insight_sum"].transform("sum")
    )
    df["shap_insight_abssum"] = np.abs(df["shap_insight_sum"])
    return df


def build_top_insight_urls(
    df: pd.DataFrame,
    tc: int,
    days: int,
    top_n: int = 3,
) -> pd.DataFrame:
    df = df.sort_values(["user", "shap_insight_sum"], ascending=[True, False]).copy()
    df = df.groupby("user").head(top_n)
    df["rank"] = df.groupby("user").cumcount() + 1
    df["fmt_dimension"] = df["dimension"].map(DIMENSION_FORMATTER)
    df["fmt_metric"] = df["insight"].str.split("_", 1).str[0].map(METRIC_FORMATTER)
    can_format = ~df[["fmt_dimension", "fmt_metric"]].isnull().any(axis=1)
    df["insight_url"] = np.where(
        can_format,
        "https://lichess.org/insights/" + df["user"] + "/" + df["fmt_metric"] + "/" +
        df["fmt_dimension"] + "/variant:" + VARIANT_FORMATTER[str(tc)] + "/period:" + str(days),
        df["insight"],
    )
    result_cols = []
    for i in range(1, top_n + 1):
        df[f"insight_{i}"] = np.where(df["rank"] == i, df["insight_url"], np.nan)
        df[f"shap_score_{i}"] = np.where(df["rank"] == i, df["shap_insight_sum"], np.nan)
        result_cols += [f"insight_{i}", f"shap_score_{i}"]
    return df[["user"] + result_cols].groupby("user", as_index=False).first()
