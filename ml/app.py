
from __future__ import annotations

import os
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from database.mongo_connection import get_collections, check_connection
from data_collection import load_training_data, load_passenger_history
from recommendation_engine import RecommendationEngine


# --------------------------------------------------
# 1. Environment configuration
# --------------------------------------------------

load_dotenv()

engine = RecommendationEngine(
    os.getenv("MODEL_DIR", "models")
)


# --------------------------------------------------
# 2. FastAPI lifespan
# --------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        buses, interactions = load_training_data()

        engine.fit_fallbacks(
            buses,
            interactions
        )

        print(
            f"Recommendation engine ready: "
            f"{len(buses)} buses, "
            f"{len(interactions)} interactions."
        )

    except Exception as exc:
        print(f"Startup data load warning: {exc}")

    yield


# --------------------------------------------------
# 3. Create FastAPI application
# --------------------------------------------------

app = FastAPI(
    title="BookNow ML Recommendation API",
    version="1.0.0",
    lifespan=lifespan
)


# --------------------------------------------------
# 4. CORS configuration
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# 5. Recommendation request model
# --------------------------------------------------

class RecommendRequest(BaseModel):

    passenger_id: str = Field(
        ...,
        min_length=1
    )

    source: Optional[str] = None

    destination: Optional[str] = None

    top_n: int = Field(
        default=5,
        ge=1,
        le=20
    )


# --------------------------------------------------
# 6. Utility function
# --------------------------------------------------

def safe_id(value):

    if isinstance(value, ObjectId):
        return str(value)

    return value


# --------------------------------------------------
# 7. Health check API
# --------------------------------------------------

@app.get("/health")
def health():

    try:
        db_status = check_connection()

    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail=f"MongoDB connection failed: {exc}"
        )

    return {
        "status": "ok",
        "database": db_status,
        "engine_ready": engine.ready
    }


# --------------------------------------------------
# 8. Bus recommendation API
# --------------------------------------------------

@app.post("/recommendations")
def recommendations(request: RecommendRequest):

    try:

        cols = get_collections()

        # Load latest buses and interactions
        buses, interactions = load_training_data()

        # Load individual passenger history
        history = load_passenger_history(
            request.passenger_id
        )

        # Fallback to loaded interactions if history is empty
        if not history:

            history = [
                item
                for item in interactions
                if str(item.get("passenger_id"))
                == str(request.passenger_id)
            ]

        # Fit recommendation algorithms
        engine.fit_fallbacks(
            buses,
            interactions
        )

        # Generate recommendations using both source and destination
        results = engine.recommend(
            passenger_id=request.passenger_id,
            history=history,
            buses=buses,
            interactions=interactions,
            top_n=request.top_n,
            source=request.source,
            destination=request.destination
        )

        # Save recommendation impressions
        if results:

            cols["recommendation_events"].insert_many([

                {
                    "passengerId": request.passenger_id,

                    "busId": safe_id(
                        result.get("bus_id")
                    ),

                    "source": result.get("source"),

                    "destination": result.get("destination"),

                    "event": "impression",

                    "createdAt": datetime.now(timezone.utc)
                }

                for result in results

            ])

        return {

            "passenger_id": request.passenger_id,

            "source": request.source,

            "destination": request.destination,

            "count": len(results),

            "recommendations": results

        }

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=str(exc)
        )


# --------------------------------------------------
# 9. Recommendation event tracking API
# --------------------------------------------------

@app.post("/events")
def log_event(payload: dict):

    required = [
        "passengerId",
        "event"
    ]

    if any(not payload.get(key) for key in required):

        raise HTTPException(
            status_code=400,
            detail="passengerId and event are required"
        )

    allowed = {
        "clicked",
        "selected",
        "booked",
        "ignored"
    }

    if payload["event"] not in allowed:

        raise HTTPException(
            status_code=400,
            detail=f"event must be one of {sorted(allowed)}"
        )

    try:

        cols = get_collections()

        payload.setdefault(
            "createdAt",
            datetime.now(timezone.utc)
        )

        result = cols["recommendation_events"].insert_one(
            payload
        )

        return {

            "saved": True,

            "event_id": str(result.inserted_id)

        }

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=str(exc)
        )


# --------------------------------------------------
# 10. Search tracking API
# --------------------------------------------------

@app.post("/search")
def log_search(payload: dict):

    required = [
        "passengerId",
        "source",
        "destination"
    ]

    if any(not payload.get(key) for key in required):

        raise HTTPException(
            status_code=400,
            detail=(
                "passengerId, source and destination "
                "are required"
            )
        )

    try:

        cols = get_collections()

        payload["searchedAt"] = (
            payload.get("searchedAt")
            or datetime.now(timezone.utc)
        )

        result = cols["search_history"].insert_one(
            payload
        )

        return {

            "saved": True,

            "search_id": str(result.inserted_id)

        }

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=str(exc)
        )
