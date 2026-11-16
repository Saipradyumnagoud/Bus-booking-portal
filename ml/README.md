# BookNow ML Recommendation Service

Hybrid route/bus recommendation service using:
- Item-based collaborative filtering (KNN + cosine similarity)
- Content-based filtering
- Popularity fallback
- Optional LightGBM LambdaRank reranking
- FastAPI + MongoDB

## 1. Setup

Create a virtual environment and install dependencies:

```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and set `MONGO_URI`.
Default database is `passenger`.

## 2. MongoDB assumptions

The code expects these collections:
- `buses`
- `orders`
- `passengers`
- `search_history` (created when first search is logged)
- `recommendation_events` (created when first recommendation is returned)

The feature normalizer supports common aliases. Check `preprocessing/feature_engineering.py` and adjust `ALIASES` to match your actual documents.

For orders, the code expects a passenger identifier and source/destination, or an order with a bus identifier plus route fields. If your order schema stores only `busId`, enrich it by joining the bus document in `data_collection.py`.

## 3. Start API

```bash
uvicorn app:app --reload --port 8000
```

Open `http://localhost:8000/docs`.

Health:
`GET /health`

Recommendations:
`POST /recommendations`

```json
{
  "passenger_id": "YOUR_PASSENGER_ID",
  "source": "Hyderabad",
  "top_n": 5
}
```

Log a search:
`POST /search`

```json
{
  "passengerId": "YOUR_PASSENGER_ID",
  "source": "Hyderabad",
  "destination": "Bangalore"
}
```

Log an interaction:
`POST /events`

```json
{
  "passengerId": "YOUR_PASSENGER_ID",
  "busId": "BUS_ID",
  "source": "Hyderabad",
  "destination": "Bangalore",
  "event": "clicked"
}
```

Allowed events: `clicked`, `selected`, `booked`, `ignored`.

## 4. Train LightGBM

```bash
python train.py
```

Important: the included training routine is a bootstrap scaffold, not a production-grade unbiased ranker. It uses existing search/booking events and may not have true negative examples. For reliable LambdaRank training, collect recommendation impressions and subsequent clicks/bookings, build passenger-session query groups, and use exposed-but-not-clicked candidates as carefully defined negatives. Split data chronologically before evaluating.

## 5. Connect Node/Express to FastAPI

Example server-side call (keep this call on your Node backend; do not expose internal ML service directly to browsers):

```js
const response = await fetch("http://localhost:8000/recommendations", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    passenger_id: req.user.id,
    source: req.query.source,
    top_n: 5
  })
});
const data = await response.json();
res.json(data);
```

Use the authenticated passenger ID from your auth middleware, never trust a passenger ID supplied directly by an unauthenticated client.

## 6. Production notes

- Add authentication between Node and FastAPI.
- Add pagination/limits and MongoDB indexes.
- Filter buses by actual journey date and remaining seats before returning recommendations.
- Do not treat an impression as a negative label unless the item was genuinely visible.
- Train periodically, not on every API request.
- Evaluate Precision@5, Recall@5 and NDCG@5 with a chronological holdout.
- With only a handful of passengers/orders, use content/popularity fallbacks until more interaction data is collected.
