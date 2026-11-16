from __future__ import annotations

from collections import Counter, defaultdict
from datetime import datetime, timezone
import math

from algorithms.collaborative_filtering import ItemKNNRecommender
from algorithms.content_based import ContentBasedRecommender
from algorithms.popularity_model import PopularityRecommender
from ranking.lightgbm_ranker import LightGBMRanker


class RecommendationEngine:
    """
    Personalized route recommender.

    Current searches/viewed routes contribute source and destination preferences.
    Previous successful bookings contribute stronger preferences.
    Recommendations are selected from real buses in the bus collection.
    The current search route is a preference signal, NOT a hard route filter.
    """

    def __init__(self, model_dir="models"):
        self.knn = ItemKNNRecommender()
        self.content = ContentBasedRecommender()
        self.popularity = PopularityRecommender()
        self.ranker = LightGBMRanker.load(
            f"{model_dir}/lightgbm_ranker.pkl"
        )
        self.ready = False
        self.buses = []
        self.interactions = []

    
    @staticmethod
    def normalize(value):
        value = str(value or "").strip().casefold()
        aliases = {
            "hyderbad": "hyderabad",
            "vijaywada": "vijayawada",
        }
        return aliases.get(value, value)

    @classmethod
    def route_key(cls, item):
        return (
            cls.normalize(item.get("source")),
            cls.normalize(item.get("destination")),
        )

    @staticmethod
    def _event_weight(event):
        return {
            "impression": 0.15,
            "view": 0.5,
            "viewed": 0.75,
            "clicked": 1.5,
            "selected": 2.5,
            "search": 2.0,
            "booking": 5.0,
            "booked": 5.0,
        }.get(str(event or "search").casefold(), 1.0)

    @staticmethod
    def _recency_multiplier(created_at):
        if not created_at:
            return 1.0
        try:
            if isinstance(created_at, str):
                from dateutil.parser import parse
                created_at = parse(created_at)
            if created_at.tzinfo is None:
                created_at = created_at.replace(tzinfo=timezone.utc)
            age_days = max(
                0.0,
                (datetime.now(timezone.utc) - created_at).total_seconds()
                / 86400.0,
            )
            return math.exp(-age_days / 45.0)
        except Exception:
            return 1.0

    def fit_fallbacks(self, buses, interactions):
        self.buses = buses or []
        self.interactions = interactions or []

        self.knn.fit(self.interactions)
        self.content.fit(self.buses)
        self.popularity.fit(self.interactions)

        self.ready = True
        return self

    def _build_user_profile(
        self, passenger_id, history, interactions, current_source=None,
        current_destination=None
    ):
        source_scores = Counter()
        destination_scores = Counter()
        route_scores = Counter()

        # Use this passenger's own searches and bookings only.
        combined = list(history or [])
        if not combined:
            combined = [
                row for row in (interactions or [])
                if str(row.get("passenger_id", "")) == str(passenger_id)
            ]

        for item in combined:
            source, destination = self.route_key(item)
            if not source or not destination:
                continue

            event = item.get("event", "search")
            weight = self._event_weight(event)
            weight *= self._recency_multiplier(item.get("created_at"))

            source_scores[source] += weight
            destination_scores[destination] += weight
            route_scores[(source, destination)] += weight

        # The route the traveller is searching/viewing now is a strong,
        # temporary signal. It does not exclude other destinations.
        if current_source:
            source_scores[self.normalize(current_source)] += 4.0
        if current_destination:
            destination_scores[self.normalize(current_destination)] += 3.0
        if current_source and current_destination:
            route_scores[
                (self.normalize(current_source),
                 self.normalize(current_destination))
            ] += 2.0

        return source_scores, destination_scores, route_scores

    @staticmethod
    def _scaled(value, maximum):
        return float(value / maximum) if maximum > 0 else 0.0

    def recommend(
        self,
        passenger_id,
        history,
        buses,
        interactions,
        top_n=5,
        source=None,
        destination=None,
    ):
        if not self.ready:
            self.fit_fallbacks(buses, interactions)

        if not buses:
            return []

        source_profile, destination_profile, route_profile = (
            self._build_user_profile(
                passenger_id=passenger_id,
                history=history,
                interactions=interactions,
                current_source=source,
                current_destination=destination,
            )
        )

        # Algorithmic candidate scores, keyed by route.
        knn_scores = {}
        for item in self.knn.recommend(passenger_id, top_n=100):
            key = self.route_key(item)
            if all(key):
                knn_scores[key] = max(
                    knn_scores.get(key, 0.0),
                    float(item.get("knn_score", 0.0) or 0.0),
                )

        content_scores = {}
        for item in self.content.recommend(
            history or [], source=source, destination=destination, top_n=200
        ):
            key = self.route_key(item)
            if all(key):
                content_scores[key] = max(
                    content_scores.get(key, 0.0),
                    float(item.get("content_score", 0.0) or 0.0),
                )

        popularity_scores = {}
        for item in self.popularity.recommend(top_n=10000):
            key = self.route_key(item)
            if all(key):
                popularity_scores[key] = float(
                    item.get("popularity_score", 0.0) or 0.0
                )

        # Aggregate global route counts for ranking features.
        route_search = Counter()
        route_booking = Counter()
        for item in interactions or []:
            key = self.route_key(item)
            if not all(key):
                continue
            event = str(item.get("event", "search")).casefold()
            if event in {"booking", "booked"}:
                route_booking[key] += 1
            else:
                route_search[key] += 1

        # Every real bus is a candidate. This is important: recommendations
        # should be drawn from all available routes, not only exact searches.
        bus_groups = defaultdict(list)
        for bus in buses:
            key = self.route_key(bus)
            if all(key):
                bus_groups[key].append(bus)

        if not bus_groups:
            return []

        max_source = max(source_profile.values(), default=0.0)
        max_destination = max(destination_profile.values(), default=0.0)
        max_route = max(route_profile.values(), default=0.0)
        max_knn = max(knn_scores.values(), default=0.0)
        max_content = max(content_scores.values(), default=0.0)
        max_popularity = max(popularity_scores.values(), default=0.0)

        rows = []
        for key, route_buses in bus_groups.items():
            source_affinity = self._scaled(
                source_profile.get(key[0], 0.0), max_source
            )
            destination_affinity = self._scaled(
                destination_profile.get(key[1], 0.0), max_destination
            )
            exact_route_affinity = self._scaled(
                route_profile.get(key, 0.0), max_route
            )
            knn_score = self._scaled(knn_scores.get(key, 0.0), max_knn)
            content_score = self._scaled(
                content_scores.get(key, 0.0), max_content
            )
            popularity_score = self._scaled(
                popularity_scores.get(key, 0.0), max_popularity
            )

            # Weighted preference score: source and destination affinities
            # matter most; previous bookings are already weighted more heavily.
            profile_score = (
                0.40 * source_affinity
                + 0.35 * destination_affinity
                + 0.10 * exact_route_affinity
                + 0.08 * knn_score
                + 0.05 * content_score
                + 0.02 * popularity_score
            )

            for bus in route_buses:
                try:
                    fare = float(bus.get("fare") or 0.0)
                except (TypeError, ValueError):
                    fare = 0.0

                rows.append({
                    "bus_id": bus.get("bus_id"),
                    "source": bus.get("source"),
                    "destination": bus.get("destination"),
                    "fare": fare,
                    "bus_type": bus.get("bus_type"),
                    "departure": bus.get("departure"),
                    "route_search_count": float(route_search[key]),
                    "route_booking_count": float(route_booking[key]),
                    "source_match": source_affinity,
                    "destination_seen_count": destination_affinity,
                    "fare_preference_match": 0.0,
                    "bus_available": 1.0,
                    "knn_score": knn_score,
                    "content_score": content_score,
                    "popularity_score": popularity_score,
                    "source_affinity": source_affinity,
                    "destination_affinity": destination_affinity,
                    "profile_score": profile_score,
                })

        if not rows:
            return []

        # The existing LightGBM model was trained on older features and may
        # not know the new source/destination affinity fields. Keep its score
        # as a secondary signal; do not let it override the user profile.
        predictions = self.ranker.predict_scores(rows)
        if predictions is not None and len(predictions) == len(rows):
            low = min(float(score) for score in predictions)
            high = max(float(score) for score in predictions)
            span = high - low

            for row, prediction in zip(rows, predictions):
                model_score = (
                    (float(prediction) - low) / span if span > 0 else 0.0
                )
                row["ranking_score"] = (
                    0.85 * row["profile_score"] + 0.15 * model_score
                )
                row["ranking_method"] = "personalized_profile_plus_lightgbm"
        else:
            for row in rows:
                row["ranking_score"] = row["profile_score"]
                row["ranking_method"] = "personalized_hybrid_fallback"

        rows.sort(key=lambda item: item["ranking_score"], reverse=True)

        # Return distinct real buses. Preserve the route and explain why it
        # was recommended so the frontend can display a useful reason.
        output = []
        seen_routes = set()

        for row in rows:
            route = self.route_key(row)

            if not all(route) or route in seen_routes:
                continue

            seen_routes.add(route)

            reasons = []

            if row["source_affinity"] > 0:
                reasons.append("matches sources you searched")

            if row["destination_affinity"] > 0:
                reasons.append("matches destinations in your travel history")

            if row["knn_score"] > 0:
                reasons.append("similar travellers preferred this route")

            if row["popularity_score"] > 0:
                reasons.append("popular among travellers")

            result = dict(row)
            result["reason"] = (
                "Recommended because it " + " and ".join(reasons)
                if reasons else "Suggested from available routes"
            )

            output.append(result)

            if len(output) >= top_n:
                break

        return output
