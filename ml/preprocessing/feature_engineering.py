
from __future__ import annotations

from datetime import datetime
from typing import Any
import re

import numpy as np
import pandas as pd


ALIASES = {
    "bus_id": ["_id", "busId", "bus_id", "id"],
    "route": ["route"],
    "source": [
        "source", "from", "fromCity", "from_city",
        "origin", "departureCity", "startingPoint"
    ],
    "destination": [
        "destination", "to", "toCity", "to_city",
        "dest", "arrivalCity", "endingPoint"
    ],
    "fare": [
        "fare", "price", "ticketPrice", "ticket_price",
        "amount", "baseFare"
    ],
    "bus_type": ["busType", "bus_type", "type", "category", "coachType"],
    "departure": [
        "departureTime", "departure_time", "startTime",
        "start_time", "departure", "timing"
    ],
    "arrival": ["arrivalTime", "arrival_time", "endTime", "end_time", "arrival"],
    "duration": ["duration", "journeyDuration", "journey_duration"],
    "passenger_id": [
        "passengerId", "passenger_id", "userId",
        "user_id", "customerId", "customer_id"
    ],
    "order_bus_id": ["busId", "bus_id", "bus", "selectedBusId"],
    "created_at": [
        "createdAt", "created_at", "searchedAt",
        "searched_at", "bookingDate", "booking_date"
    ],
}


def first_value(doc: dict, names: list[str], default=None):
    for name in names:
        value = doc.get(name)
        if value is not None and value != "":
            return value
    return default


def clean_text(value: Any) -> str:
    if value is None:
        return ""
    return re.sub(r"\s+", " ", str(value)).strip()


def normalize_city(value: Any) -> str:
    return clean_text(value).casefold()


def parse_route(route: Any) -> tuple[str, str]:
    """
    Converts a route such as 'Mumbai - Pune'
    into ('Mumbai', 'Pune').
    """
    route = clean_text(route)

    if not route:
        return "", ""

    parts = re.split(r"\s+-\s+|\s+to\s+", route, maxsplit=1, flags=re.IGNORECASE)

    if len(parts) != 2:
        return "", ""

    return clean_text(parts[0]), clean_text(parts[1])


def to_float(value, default=np.nan):
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def normalize_bus(doc: dict) -> dict:
    bus_id = first_value(doc, ALIASES["bus_id"])

    source = clean_text(first_value(doc, ALIASES["source"]))
    destination = clean_text(first_value(doc, ALIASES["destination"]))

    # Use the route string if separate cities are unavailable.
    if not source or not destination:
        route_source, route_destination = parse_route(
            first_value(doc, ALIASES["route"])
        )
        source = source or route_source
        destination = destination or route_destination

    return {
        "bus_id": str(bus_id) if bus_id is not None else "",
        "source": source,
        "destination": destination,
        "fare": to_float(first_value(doc, ALIASES["fare"])),
        "bus_type": clean_text(first_value(doc, ALIASES["bus_type"])),
        "departure": clean_text(first_value(doc, ALIASES["departure"])),
        "arrival": clean_text(first_value(doc, ALIASES["arrival"])),
        "duration": clean_text(first_value(doc, ALIASES["duration"])),
        "raw": doc,
    }


def normalize_search(doc: dict) -> dict:
    pid = first_value(doc, ALIASES["passenger_id"])

    return {
        "passenger_id": str(pid) if pid is not None else "",
        "source": clean_text(first_value(doc, ALIASES["source"])),
        "destination": clean_text(first_value(doc, ALIASES["destination"])),
        "created_at": first_value(doc, ALIASES["created_at"]),
        "event": "search",
        "bus_id": "",
    }


def normalize_order(doc: dict, bus_lookup: dict | None = None) -> dict:
    pid = first_value(doc, ALIASES["passenger_id"])
    bid = first_value(doc, ALIASES["order_bus_id"])

    if isinstance(bid, dict):
        bid = bid.get("_id") or bid.get("id")

    bus_id = str(bid) if bid is not None else ""

    # Obtain route details from the associated bus.
    bus = (bus_lookup or {}).get(bus_id, {})

    source = clean_text(first_value(doc, ALIASES["source"]))
    destination = clean_text(first_value(doc, ALIASES["destination"]))

    if not source:
        source = bus.get("source", "")

    if not destination:
        destination = bus.get("destination", "")

    return {
        "passenger_id": str(pid) if pid is not None else "",
        "source": source,
        "destination": destination,
        "created_at": first_value(doc, ALIASES["created_at"]),
        "event": "booking",
        "bus_id": bus_id,
    }


def interaction_weight(event: str) -> float:
    return {
        "impression": 0.1,
        "clicked": 1.0,
        "selected": 2.0,
        "search": 2.0,
        "booking": 5.0,
    }.get(event, 1.0)


def make_route_key(source: str, destination: str) -> str:
    return f"{normalize_city(source)}|||{normalize_city(destination)}"


def to_datetime(value):
    if isinstance(value, datetime):
        return value

    if value is None:
        return None

    try:
        return pd.to_datetime(value, utc=True).to_pydatetime()
    except Exception:
        return None
