from __future__ import annotations

from bson import ObjectId

from database.mongo_connection import get_collections
from preprocessing.feature_engineering import (
    normalize_bus,
    normalize_search,
    normalize_order,
    to_datetime,
)


def fetch_documents(collection, query=None, limit=100000):
    return list(collection.find(query or {}).limit(limit))


def build_bus_lookup(buses):
    return {
        str(bus["bus_id"]): bus
        for bus in buses
        if bus.get("bus_id")
    }


def _passenger_id_values(passenger_id):
    values = [str(passenger_id)]
    if ObjectId.is_valid(str(passenger_id)):
        values.append(ObjectId(str(passenger_id)))
    return values


def load_training_data():
    """
    Load all buses, search history and successful bookings.
    Searches and bookings are normalized into a common interaction format.
    """
    cols = get_collections()

    raw_buses = fetch_documents(cols["buses"])
    buses = [normalize_bus(doc) for doc in raw_buses]
    buses = [
        bus for bus in buses
        if bus.get("source") and bus.get("destination")
    ]

    bus_lookup = build_bus_lookup(buses)

    raw_searches = fetch_documents(cols["search_history"])
    searches = [normalize_search(doc) for doc in raw_searches]

    raw_orders = fetch_documents(
        cols["orders"],
        {"orderStatus": "Successful"},
    )
    orders = [
        normalize_order(doc, bus_lookup)
        for doc in raw_orders
    ]

    interactions = searches + orders
    interactions = [
        item for item in interactions
        if item.get("passenger_id")
        and item.get("source")
        and item.get("destination")
    ]

    return buses, interactions


def load_passenger_history(passenger_id):
    """Load one passenger's searches and successful bookings chronologically."""
    cols = get_collections()
    passenger_ids = _passenger_id_values(passenger_id)

    # Support the different field names used by the existing schemas.
    identity_clauses = []
    for field in ("passengerId", "passenger_id", "userId", "user_id"):
        identity_clauses.extend(
            [{field: value} for value in passenger_ids]
        )

    raw_searches = fetch_documents(
        cols["search_history"],
        {"$or": identity_clauses},
        limit=1000,
    )
    searches = [normalize_search(doc) for doc in raw_searches]

    raw_orders = fetch_documents(
        cols["orders"],
        {
            "$and": [
                {"$or": identity_clauses},
                {"orderStatus": "Successful"},
            ]
        },
        limit=1000,
    )

    raw_buses = fetch_documents(cols["buses"])
    buses = [normalize_bus(doc) for doc in raw_buses]
    bus_lookup = build_bus_lookup(buses)

    bookings = [
        normalize_order(doc, bus_lookup)
        for doc in raw_orders
    ]

    history = [
        item for item in searches + bookings
        if item.get("source") and item.get("destination")
    ]

    history.sort(
        key=lambda item: (
            to_datetime(item.get("created_at"))
            or to_datetime("1970-01-01T00:00:00Z")
        )
    )

    return history
