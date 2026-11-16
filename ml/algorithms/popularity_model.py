from collections import defaultdict
from datetime import datetime, timezone
import math

class PopularityRecommender:
    """Fallback recommender using weighted searches/bookings and time decay."""

    def fit(self, interactions):
        scores = defaultdict(float)
        route_names = {}
        now = datetime.now(timezone.utc)

        for row in interactions:
            source = str(row.get("source", "")).strip()
            destination = str(row.get("destination", "")).strip()
            if not source or not destination:
                continue
            key = (source.casefold(), destination.casefold())
            event = row.get("event", "search")
            weight = {"impression": 0.1, "clicked": 1.0, "selected": 2.0,
                      "search": 2.0, "booking": 5.0}.get(event, 1.0)
            dt = row.get("created_at")
            try:
                if dt:
                    if isinstance(dt, str):
                        from dateutil.parser import parse
                        dt = parse(dt)
                    if dt.tzinfo is None:
                        dt = dt.replace(tzinfo=timezone.utc)
                    age_days = max(0, (now - dt).total_seconds() / 86400)
                    weight *= math.exp(-age_days / 45.0)
            except Exception:
                pass
            scores[key] += weight
            route_names[key] = (source, destination)

        self.items_ = [
            {"source": route_names[k][0], "destination": route_names[k][1], "popularity_score": float(v)}
            for k, v in sorted(scores.items(), key=lambda x: x[1], reverse=True)
        ]
        return self

    def recommend(self, source=None, top_n=10):
        rows = self.items_
        if source:
            rows = [r for r in rows if r["source"].casefold() == source.casefold()]
        return rows[:top_n]
