from __future__ import annotations
import os
import joblib
import numpy as np
import pandas as pd

FEATURES = [
    "knn_score", "content_score", "popularity_score",
    "route_search_count", "route_booking_count",
    "source_match", "destination_seen_count",
    "fare", "fare_preference_match", "bus_available"
]

class LightGBMRanker:
    def __init__(self):
        self.model = None
        self.available = False

    def fit(self, X, y, groups):
        try:
            import lightgbm as lgb
        except ImportError as exc:
            raise RuntimeError("Install lightgbm: pip install lightgbm") from exc
        X = pd.DataFrame(X).reindex(columns=FEATURES, fill_value=0)
        group_sizes = [int(g) for g in groups if int(g) > 0]
        if len(X) == 0 or len(y) != len(X) or sum(group_sizes) != len(X):
            raise ValueError("Invalid ranking training data/groups.")
        self.model = lgb.LGBMRanker(
            objective="lambdarank",
            metric="ndcg",
            n_estimators=250,
            learning_rate=0.04,
            num_leaves=15,
            max_depth=-1,
            min_child_samples=5,
            reg_lambda=1.0,
            random_state=42,
            verbosity=-1,
        )
        self.model.fit(X, np.asarray(y, dtype=int), group=group_sizes)
        self.available = True
        return self

    def predict_scores(self, rows):
        if not self.available or self.model is None:
            return None
        X = pd.DataFrame(rows).reindex(columns=FEATURES, fill_value=0)
        return self.model.predict(X).tolist()

    def save(self, path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        joblib.dump({"model": self.model, "available": self.available}, path)

    @classmethod
    def load(cls, path):
        obj = cls()
        if os.path.exists(path):
            saved = joblib.load(path)
            obj.model = saved["model"]
            obj.available = saved["available"]
        return obj
