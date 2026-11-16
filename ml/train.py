from __future__ import annotations
import os
from collections import defaultdict
from data_collection import load_training_data
from ranking.lightgbm_ranker import LightGBMRanker, FEATURES

def build_ranker_training_data(interactions, buses):
    """
    Build query groups by passenger. Labels:
      0 = searched but not booked; 3 = booked.
    This is a bootstrap dataset. For production-quality learning-to-rank,
    log recommendation impressions and clicks, then train on exposed candidates.
    """
    bus_by_route = {}
    for b in buses:
        k = (b["source"].casefold(), b["destination"].casefold())
        bus_by_route.setdefault(k, []).append(b)

    grouped = defaultdict(list)
    for r in interactions:
        pid = r["passenger_id"]
        k = (r["source"].casefold(), r["destination"].casefold())
        label = 3 if r["event"] == "booking" else 1
        candidates = bus_by_route.get(k, [])
        if not candidates:
            candidates = [{"fare": 0, "bus_type": "", "departure": ""}]
        for b in candidates:
            grouped[pid].append({
                "knn_score": 0.0,
                "content_score": 0.0,
                "popularity_score": 0.0,
                "route_search_count": 1.0,
                "route_booking_count": 1.0 if label == 3 else 0.0,
                "source_match": 1.0,
                "destination_seen_count": 1.0,
                "fare": float(b.get("fare") or 0),
                "fare_preference_match": 0.0,
                "bus_available": 1.0,
                "label": label,
            })

    X, y, groups = [], [], []
    for pid, rows in grouped.items():
        if len(rows) < 2:
            continue
        X.extend([{f: row.get(f, 0) for f in FEATURES} for row in rows])
        y.extend([row["label"] for row in rows])
        groups.append(len(rows))
    return X, y, groups

def main():
    buses, interactions = load_training_data()
    print(f"Loaded {len(buses)} buses and {len(interactions)} interactions.")
    X, y, groups = build_ranker_training_data(interactions, buses)
    if not X or len(groups) < 2:
        print("Not enough ranking groups to train LightGBM yet.")
        print("Collect more searches, bookings, and recommendation impressions/clicks.")
        return
    ranker = LightGBMRanker().fit(X, y, groups)
    os.makedirs(os.getenv("MODEL_DIR", "models"), exist_ok=True)
    ranker.save(os.path.join(os.getenv("MODEL_DIR", "models"), "lightgbm_ranker.pkl"))
    print(f"Saved LightGBM ranker using {len(X)} rows across {len(groups)} passenger groups.")

if __name__ == "__main__":
    main()
