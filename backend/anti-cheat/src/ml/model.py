"""KaladinData and KaladinModel: data container and Conv2D hypermodel."""
from __future__ import annotations

from typing import Dict, List, Optional

import numpy as np

# tf-keras provides Keras 2 compatibility; required to load legacy TF SavedModel format.
import tf_keras as keras
from tf_keras import layers, metrics, regularizers
from tf_keras.optimizers import Adam
from keras_tuner import HyperModel

from ..db import load_pickle


class KaladinData:
    """Loads and organises train/valid/test tensors for all model input branches."""

    def __init__(self, days: int, tc: int, use_eval: int, data_dict: Optional[Dict] = None) -> None:
        self.days = days
        self.tc = tc
        raw = data_dict[(tc, days)] if data_dict is not None else load_pickle(
            f"input_data/use_eval_{use_eval}/data_dct_tc{tc}_days{days}.pkl")

        self.dimensions: List[str] = raw["dimensions"]
        self.conv_dimensions: List[str] = [d for d in self.dimensions if d != "layer"]
        self.conv_train_inputs = [raw["train"][d] for d in self.conv_dimensions]
        self.conv_valid_inputs = [raw["valid"][d] for d in self.conv_dimensions]
        self.conv_test_inputs = [raw["test"][d] for d in self.conv_dimensions]
        self.train_inputs = list(self.conv_train_inputs)
        self.valid_inputs = list(self.conv_valid_inputs)
        self.test_inputs = list(self.conv_test_inputs)

        if use_eval:
            for split_name, input_list in [
                ("train", self.train_inputs),
                ("valid", self.valid_inputs),
                ("test", self.test_inputs),
            ]:
                layer = raw[split_name]["layer"]
                layer = layer[:, :, 1:].reshape([layer.shape[0], layer.shape[1]])
                input_list.append(layer)
            self.dense_train_input = self.train_inputs[-1]
            self.dense_valid_input = self.valid_inputs[-1]
            self.dense_test_input = self.test_inputs[-1]
        else:
            self.dense_train_input = self.dense_valid_input = self.dense_test_input = None

        self.train_user_list: List[str] = raw["train_user_list"]
        self.valid_user_list: List[str] = raw["valid_user_list"]
        self.test_user_list: List[str] = raw["test_user_list"]
        self.train_labels: np.ndarray = raw["train_labels"]
        self.valid_labels: np.ndarray = raw["valid_labels"]
        self.test_labels: np.ndarray = raw["test_labels"]
        self.insights_df = raw["df"]


class KaladinModel(HyperModel):
    """Multi-branch Conv2D hypermodel with optional dense branch, tuned via Keras Tuner."""

    def __init__(self, data: KaladinData) -> None:
        self.data = data

    def build(self, hp) -> keras.Model:
        num_filters = hp.Int("num_filters", 8, 32, step=8)
        filter_modifiers = [hp.Int(f"fltr_mod_{d}", 1, 3, step=1) for d in self.data.conv_dimensions]
        big_kernels = hp.Boolean("big_kernels")
        use_batch_norm = hp.Boolean("batch_norm")
        num_conv_layers = hp.Int("num_layers", 1, 3, step=1)
        dense_node_factor = hp.Int("dense_branch_node_factor", 1, 3, step=1)
        reg_l1 = hp.Float("reg_l1", 1e-6, 0.01, sampling="log")
        reg_l2 = hp.Float("reg_l2", 1e-6, 0.01, sampling="log")
        out1 = hp.Int("output_layer_1_size", 32, 512, step=32)
        out2 = hp.Int("output_layer_2_size", 32, 256, step=32)
        out3 = hp.Int("output_layer_3_size", 8, 64, step=8)
        lr = hp.Choice("learning_rate", values=[0.001, 0.0002])

        tensors, input_layers = [], []
        for i, dim in enumerate(self.data.conv_dimensions):
            inp, tensor = self._build_conv2d_branch(
                self.data.conv_train_inputs[i],
                num_filters=num_filters * filter_modifiers[i],
                num_layers=num_conv_layers,
                big_kernels=big_kernels,
                use_batch_norm=use_batch_norm,
            )
            tensors.append(tensor)
            input_layers.append(inp)

        if self.data.dense_train_input is not None:
            inp_dense, x_dense = self._build_dense_branch(
                self.data.dense_train_input,
                [16 * dense_node_factor, 4 * dense_node_factor],
                reg_l1,
                reg_l2,
            )
            tensors.append(x_dense)
            input_layers.append(inp_dense)

        x = layers.Concatenate()(tensors)
        regularizer = regularizers.l1_l2(l1=reg_l1, l2=reg_l2)
        for size in (out1, out2, out3):
            x = layers.Dense(size, activation="relu", kernel_regularizer=regularizer)(x)
        x = layers.Dense(1, activation="sigmoid")(x)

        model = keras.Model(inputs=input_layers, outputs=x, name="kaladin")
        model.compile(
            optimizer=Adam(lr),
            loss="binary_crossentropy",
            metrics=[
                metrics.AUC(name="auc"),
                metrics.Precision(name="p"),
                metrics.Recall(name="r"),
                metrics.BinaryAccuracy("acc"),
            ],
        )
        return model

    def _build_dense_branch(
        self,
        input_data: np.ndarray,
        layer_dims: List[int],
        reg_l1: float,
        reg_l2: float,
    ):
        inp = keras.Input(shape=input_data.shape[1:])
        x = inp
        for dim in layer_dims:
            x = layers.Dense(dim, activation="relu",
                              kernel_regularizer=regularizers.l1_l2(l1=reg_l1, l2=reg_l2))(x)
        return inp, x

    def _build_conv2d_branch(
        self,
        input_data: np.ndarray,
        num_filters: int,
        num_layers: int,
        big_kernels: bool,
        use_batch_norm: bool,
    ):
        inp = keras.Input(shape=input_data.shape[1:])
        kernel = (1, 2) if big_kernels else (1, 1)
        x = layers.Convolution2D(int(num_filters), kernel, strides=1, activation="relu")(inp)
        for n in range(num_layers - 1):
            x = layers.Convolution2D(
                int(num_filters / (n + 2) + 1), 1, strides=1, activation="relu")(x)
        if use_batch_norm:
            x = layers.BatchNormalization()(x)
        return inp, layers.Flatten()(x)
