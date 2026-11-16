import os
from functools import lru_cache
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

@lru_cache(maxsize=1)
def get_client():
    uri = os.getenv("MONGO_URI")
    if not uri:
        raise RuntimeError("MONGO_URI is missing. Copy .env.example to .env and configure it.")
    return MongoClient(uri, serverSelectionTimeoutMS=5000)

def get_db():
    return get_client()[os.getenv("MONGO_DB_NAME", "passenger")]

def get_collections():
    db = get_db()
    return {
        "buses": db[os.getenv("BUSES_COLLECTION", "buses")],
        "orders": db[os.getenv("ORDERS_COLLECTION", "orders")],
        "passengers": db[os.getenv("PASSENGERS_COLLECTION", "passengers")],
        "search_history": db[os.getenv("SEARCH_HISTORY_COLLECTION", "searchhistories")],
        "recommendation_events": db[os.getenv("RECOMMENDATION_EVENTS_COLLECTION", "recommendation_events")],
    }

def check_connection():
    get_client().admin.command("ping")
    return {"connected": True, "database": os.getenv("MONGO_DB_NAME", "passenger")}
