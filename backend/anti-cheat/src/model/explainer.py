from __future__ import annotations

from pathlib import Path
from typing import Any

from model.shap_values import train_shap_explainer


def load_explainer(model_dir: Path) -> Any:
    """Load a SHAP DeepExplainer for one model directory."""
    return train_shap_explainer(model_dir)


def prepare_background(*args, **kwargs) -> None:
    """Compatibility stub: legacy Kaladin stores SHAP data via shap_data.pkl."""
    raise NotImplementedError("Use model.shap_values.prepare_shap_explainer_data for legacy models.")
