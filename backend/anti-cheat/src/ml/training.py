"""Model training: hyperparameter search + fitting."""

from __future__ import annotations

import logging
import os

import numpy as np
from keras_tuner import Hyperband, Objective
from matplotlib import pyplot as plt
from tf_keras.callbacks import EarlyStopping

from ..config import model_artifact_path, model_dir_path, training_history_path
from .explainer import prepare_shap_background_data
from .model import KaladinData, KaladinModel

log = logging.getLogger(__name__)


def train_model(days: int, tc: int, use_eval: int) -> None:
    data = KaladinData(days, tc, use_eval)
    hypermodel = KaladinModel(data)
    early_stop = EarlyStopping(
        monitor="val_loss",
        min_delta=0.001,
        patience=15,
        mode="min",
        restore_best_weights=True,
    )

    tuner = Hyperband(
        hypermodel=hypermodel,
        objective=Objective("val_loss", direction="min"),
        max_epochs=300,
        factor=3,
        hyperband_iterations=1,
        seed=37,
        project_name=f"kaladin_tuning_{use_eval}_{days}_{tc}",
    )
    tuner.search(
        x=data.train_inputs,
        y=data.train_labels,
        batch_size=256,
        epochs=500,
        callbacks=[early_stop],
        validation_data=(data.valid_inputs, data.valid_labels),
    )

    best_model = hypermodel.build(tuner.get_best_hyperparameters()[0])
    combined_inputs = [
        np.concatenate([data.train_inputs[i], data.valid_inputs[i]])
        for i in range(len(data.train_inputs))
    ]
    history = best_model.fit(
        x=combined_inputs,
        y=np.concatenate([data.train_labels, data.valid_labels]),
        batch_size=256,
        epochs=500,
        callbacks=[early_stop],
        validation_data=(data.test_inputs, data.test_labels),
    )

    out_dir = model_dir_path(use_eval, tc, days)
    os.makedirs(out_dir, exist_ok=True)
    best_model.save(model_artifact_path(out_dir))

    fig, ax = plt.subplots(figsize=(12, 8), dpi=150)
    ax.plot(history.history["val_auc"], label="val_auc")
    ax.plot(history.history["auc"], label="auc")
    ax.set(title="Training history", xlabel="Epoch", ylabel="AUC")
    ax.legend()
    ax.grid(True)
    fig.savefig(training_history_path(out_dir))
    plt.close(fig)

    prepare_shap_background_data(data, out_dir)
    log.info("Training complete for eval=%d tc=%d days=%d.", use_eval, tc, days)
