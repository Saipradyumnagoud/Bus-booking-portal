
from __future__ import annotations

import numpy as np
from collections import defaultdict
from sklearn.feature_extraction import DictVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class ContentBasedRecommender:
    """Recommend buses using the passenger's complete route history."""

    def __init__(self):
        self.buses_ = []
        self.vectorizer_ = DictVectorizer(sparse=True)
        self.X_ = None
        self.is_fitted_ = False

    @staticmethod
    def normalize(value):
        return str(value or "").strip().casefold()

    def fit(self, buses):
        self.buses_ = [
            bus for bus in (buses or [])
            if bus.get("source") and bus.get("destination")
        ]

        self.vectorizer_ = DictVectorizer(sparse=True)
        self.X_ = None
        self.is_fitted_ = False

        if not self.buses_:
            print("ContentBased: No valid buses available for fitting.")
            return self

        features = [
            self._features(bus)
            for bus in self.buses_
        ]

        # Fit the vectorizer before using transform().
        self.X_ = self.vectorizer_.fit_transform(features)
        self.is_fitted_ = True

        print(
            f"ContentBased: Fitted successfully with "
            f"{len(self.buses_)} buses."
)
        

        return self

    @staticmethod
    def _features(bus):
        try:
            fare = float(bus.get("fare") or 0)
        except (TypeError, ValueError):
            fare = 0.0

        return {
            "source": str(bus.get("source", "")).strip().casefold(),
            "destination": str(bus.get("destination", "")).strip().casefold(),
            "bus_type": str(bus.get("bus_type", "")).strip().casefold(),
            "departure": str(bus.get("departure", ""))[:2],
            "fare": fare,
        }

    def recommend(
        self,
        history,
        source=None,
        destination=None,
        top_n=100
    ):
        if not self.is_fitted_ or self.X_ is None:
            print(
                "ContentBased: Model is not fitted. "
                "Call fit(buses) before recommend()."
            )
            return []

        valid = [
            item for item in (history or [])
            if item.get("source") and item.get("destination")
        ]

        # Include the current search as an additional preference.
        profile_rows = []

        if source and destination:
            profile_rows.append({
                "source": source,
                "destination": destination,
                "event": "search"
            })

        # Include ALL history rather than only the latest search.
        profile_rows.extend(valid)

        if not profile_rows:
            return []

        route_scores = defaultdict(float)

        event_weights = {
            "search": 2.0,
            "clicked": 2.5,
            "selected": 3.0,
            "booking": 5.0,
            "booked": 5.0
        }

        for item in profile_rows:
            route = (
                self.normalize(item.get("source")),
                self.normalize(item.get("destination"))
            )

            event = str(
                item.get("event", "search")
            ).casefold()

            weight = event_weights.get(event, 1.0)
            route_scores[route] += weight

        # Create one profile entry per distinct route.
        profile_features = []
        profile_weights = []

        for (route_source, route_destination), weight in route_scores.items():
            profile_features.append({
                "source": route_source,
                "destination": route_destination,
                "bus_type": "",
                "departure": "",
                "fare": 0.0
            })

            profile_weights.append(weight)

        history_matrix = self.vectorizer_.transform(
            profile_features
        )

        similarities = cosine_similarity(
            history_matrix,
            self.X_
        )

        weights = np.asarray(profile_weights, dtype=float)

        weighted_scores = (
            similarities * weights[:, None]
        ).sum(axis=0) / max(weights.sum(), 1.0)

        order = np.argsort(weighted_scores)[::-1]

        results = []
        seen_routes = set()

        for index in order:
            bus = self.buses_[int(index)]

            route = (
                self.normalize(bus.get("source")),
                self.normalize(bus.get("destination"))
            )

            if route in seen_routes:
                continue

            seen_routes.add(route)

            results.append({
                "bus_id": bus.get("bus_id"),
                "source": bus.get("source"),
                "destination": bus.get("destination"),
                "fare": bus.get("fare"),
                "bus_type": bus.get("bus_type"),
                "departure": bus.get("departure"),
                "content_score": float(weighted_scores[index])
            })

            if len(results) >= top_n:
                break

        return results
