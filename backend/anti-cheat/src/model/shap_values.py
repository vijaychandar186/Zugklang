from pathlib import Path
import json

import numpy as np
import pandas as pd
import shap

from common.utils import pickle_me, unpickle_me
from tensorflow.keras.models import load_model


def load_kaladin_model(directory):
    """Load model from modern Keras formats and fail clearly for legacy-only exports."""
    directory = Path(directory)
    keras_path = directory / "model.keras"
    h5_path = directory / "model.h5"
    legacy_savedmodel = directory / "model.SavedModel"

    if keras_path.exists():
        return load_model(keras_path)
    if h5_path.exists():
        return load_model(h5_path)
    if legacy_savedmodel.exists():
        raise RuntimeError(
            f"Unsupported legacy model format at {legacy_savedmodel}. "
            "This environment uses Keras 3 (Python 3.13), which cannot load "
            "legacy SavedModel checkpoints. Provide `model.keras` (preferred) "
            "or `model.h5` in the same directory."
        )
    raise FileNotFoundError(
        f"No model file found in {directory}. Expected one of: "
        "`model.keras`, `model.h5`, `model.SavedModel`."
    )

def get_shap_explanations(users, shap_values, insights_location_dct):
    # Build shap explanations frame
    shap_list = []
    for d, input_branch in enumerate(shap_values[0]):
        for n in range(input_branch.shape[0]):
            for index in range(input_branch[n].shape[0]):
                shap_list.append([
                    users[n],
                    insights_location_dct[(d, index)].split('_')[1], 
                    insights_location_dct[(d, index)], 
                    input_branch[n][index].sum()
                ])
    shap_df = pd.DataFrame(shap_list, columns=['user', 'dimension', 'insight', 'shap_insight_sum'])
    shap_df['shap_dimension_sum'] = shap_df.groupby(['user', 'dimension'])['shap_insight_sum'].transform('sum')
    shap_df['shap_insight_abssum'] = np.abs(shap_df['shap_insight_sum'])
    return shap_df

def train_shap_explainer(directory):
    directory = Path(directory)
    model = load_kaladin_model(directory)
    shap_data = unpickle_me(directory / "shap_data.pkl")

    # Train explainer
    shap.explainers._deep.deep_tf.op_handlers["FusedBatchNormV3"] = shap.explainers._deep.deep_tf.passthrough
    explainer = shap.DeepExplainer(
        model, 
        shap_data,
    )
    return explainer

def prepare_shap_explainer_data(data, directory):
    directory = Path(directory)
    # Get indexes for each insight
    insights_location_dct = {}
    insights_list = list(data.insights_df['insight'].unique())
    for d, dim in enumerate(data.conv_dimensions+[
    dimension for dimension in data.dimensions if dimension not in data.conv_dimensions]):
        insights_list_ss = [insight for insight in insights_list if '_'+dim in insight]
        insights_list_ss.sort()
        for ix, insight in enumerate(insights_list_ss):
            insights_location_dct[(d, ix)] = insight
    pickle_me(insights_location_dct, directory / "insights_location_dct.pkl")

    # Randomly select rows from training set for shap value estimation
    idx = np.random.choice(np.arange(len(data.conv_train_inputs[0])), 5000, replace=False)
    shap_data = [dimension[idx] for dimension in data.train_inputs]
    pickle_me(shap_data, directory / "shap_data.pkl")


def get_shap_explanations(users, shap_values, directory):
    directory = Path(directory)
    insights_location_dct = unpickle_me(directory / "insights_location_dct.pkl")
    # Build shap explanations frame
    shap_list = []
    for d, input_branch in enumerate(shap_values[0]):
        for n in range(input_branch.shape[0]):
            for index in range(input_branch[n].shape[0]):
                shap_list.append([
                    users[n],
                    insights_location_dct[(d, index)].split('_')[1], 
                    insights_location_dct[(d, index)], 
                    input_branch[n][index].sum()
                ])
    shap_df = pd.DataFrame(shap_list, columns=['user', 'dimension', 'insight', 'shap_insight_sum'])
    shap_df['shap_dimension_sum'] = shap_df.groupby(['user', 'dimension'])['shap_insight_sum'].transform('sum')
    shap_df['shap_insight_abssum'] = np.abs(shap_df['shap_insight_sum'])
    return shap_df


def get_top_explanation_urls(df, tc, days, top_n):
    formatters_dir = Path(__file__).resolve().parent / "formatters"
    # Read formatters
    with open(formatters_dir / "dimension_formatter.json") as f:
        dimension_formatter = json.load(f)
    
    with open(formatters_dir / "metric_formatter.json") as f:
        metric_formatter = json.load(f)

    with open(formatters_dir / "variant_formatter.json") as f:
        variant_formatter = json.load(f)

    # Rank top n insights by contribution to cheat probability
    df = df.sort_values(['user', 'shap_insight_sum'], ascending=[True, False])
    df = df.groupby('user').head(top_n)
    df['rank'] = df.groupby('user').cumcount()+1

    # Build URLs for top insights when possible
    df['formatted_dimension'] = df['dimension'].map(dimension_formatter)
    df['formatted_metric'] = df['insight'].str.split('_', 1).str[0].map(metric_formatter)
    df['insight_url'] = np.where(
        df[['formatted_dimension', 'formatted_metric']].isnull().any(axis=1), 
        df['insight'], 
        (
            'https://lichess.org/insights/' 
            + df['user'] 
            + '/' 
            + df['formatted_metric']
            + '/'
            + df['formatted_dimension']
            + '/variant:'
            + variant_formatter[str(tc)]
            + '/period:'
            + str(days)
        )
    )
    
    # Reshape data so it's one row per user
    relevant_cols = []
    for i in range(1, top_n+1):
        insight_col, shap_score_col = 'insight_{}'.format(i), 'shap_score_{}'.format(i)
        df[insight_col] = np.where(df['rank'] == i, df['insight_url'], np.nan)
        df[shap_score_col] = np.where(df['rank'] == i, df['shap_insight_sum'], np.nan)
        relevant_cols.append(insight_col)
        relevant_cols.append(shap_score_col)
    
    df = df[['user']+relevant_cols].groupby('user', as_index=False).first()
    return df
