from __future__ import annotations
import numpy as np
import pandas as pd
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import normalize

class ItemKNNRecommender:
    """
    Item-based collaborative filtering over route interactions.
    A route is source|||destination. Interactions are weighted by event strength.
    """

    def fit(self, interactions):
        rows = []
        for r in interactions:
            pid = str(r.get("passenger_id", ""))
            source = str(r.get("source", "")).strip()
            dest = str(r.get("destination", "")).strip()
            if not pid or not source or not dest:
                continue
            event = r.get("event", "search")
            weight = {"impression": .1, "clicked": 1., "selected": 2., "search": 2., "booking": 5.}.get(event, 1.)
            rows.append((pid, f"{source.casefold()}|||{dest.casefold()}", weight))

        self.user_routes_ = {}
        self.route_meta_ = {}
        if not rows:
            self.matrix_ = None
            return self

        frame = pd.DataFrame(rows, columns=["user", "route", "weight"])
        grouped = frame.groupby(["user", "route"], as_index=False)["weight"].sum()
        matrix = grouped.pivot(index="user", columns="route", values="weight").fillna(0)
        self.matrix_ = matrix
        self.route_names_ = list(matrix.columns)
        self.user_names_ = list(matrix.index)
        self.user_vectors_ = matrix.values
        self.route_vectors_ = normalize(matrix.values.T, norm="l2")
        if len(self.route_names_) >= 2:
            self.nn_ = NearestNeighbors(metric="cosine", algorithm="brute")
            self.nn_.fit(self.route_vectors_)
        else:
            self.nn_ = None
        return self

    def recommend(self, passenger_id, top_n=10):
        if self.matrix_ is None or self.nn_ is None:
            return []
        pid = str(passenger_id)
        if pid not in self.matrix_.index:
            return []
        user_row = self.matrix_.loc[pid]
        seen = set(user_row[user_row > 0].index)
        scores = {}
        for route in seen:
            idx = self.route_names_.index(route)
            distances, indices = self.nn_.kneighbors(self.route_vectors_[idx:idx+1],
                                                      n_neighbors=min(10, len(self.route_names_)))
            strength = float(user_row[route])
            for distance, neighbor_idx in zip(distances[0], indices[0]):
                neighbor = self.route_names_[neighbor_idx]
                if neighbor in seen:
                    continue
                similarity = max(0.0, 1.0 - float(distance))
                scores[neighbor] = scores.get(neighbor, 0.0) + similarity * strength
        result = []
        for route, score in sorted(scores.items(), key=lambda x: x[1], reverse=True)[:top_n]:
            source, destination = route.split("|||", 1)
            result.append({"source": source.title(), "destination": destination.title(),
                           "knn_score": float(score)})
        return result
