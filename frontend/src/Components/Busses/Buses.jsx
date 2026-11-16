import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Buses.css";

const BUS_API =
  process.env.REACT_APP_BUS_API_URL || "http://localhost:3000/api/buses";

const ML_API =
  process.env.REACT_APP_ML_API_URL || "http://localhost:8000";

const SEARCH_HISTORY_API =
  process.env.REACT_APP_SEARCH_HISTORY_API_URL ||
  "http://localhost:3000/api/search-history";

const getPassengerId = () => {
  const id =
    localStorage.getItem("passengerId") ||
    localStorage.getItem("userId");

  if (id) return id;

  try {
    const user = JSON.parse(
      localStorage.getItem("user") ||
      localStorage.getItem("passenger") ||
      "null"
    );
    return user?._id || user?.id || null;
  } catch {
    return null;
  }
};

const normalize = (value) => String(value || "").trim().toLowerCase();

const getRouteParts = (route = "") => {
  const parts = String(route).split(/\s+(?:to|→|->)\s+|\s*[-|]\s*/i);
  return {
    source: (parts[0] || "").trim(),
    destination: parts.slice(1).join(" - ").trim(),
  };
};

const matchesRoute = (route, from, to) => {
  const { source, destination } = getRouteParts(route);
  if (source && destination) {
    return (
      normalize(source) === normalize(from) &&
      normalize(destination) === normalize(to)
    );
  }

  const normalizedRoute = normalize(route);
  return (
    normalizedRoute.includes(normalize(from)) &&
    normalizedRoute.includes(normalize(to))
  );
};

const Buses = () => {
  const navigate = useNavigate();

  const [buses, setBuses] = useState([]);
  const [loadingBuses, setLoadingBuses] = useState(true);
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [date, setDate] = useState("");
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [priceRange, setPriceRange] = useState(5000);
  const [busType, setBusType] = useState("All");
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [recommendationError, setRecommendationError] = useState("");
  const [recommendationContext, setRecommendationContext] = useState(null);
  const [busError, setBusError] = useState("");
  const [searchHistoryError, setSearchHistoryError] = useState("");

  // Load bus records from the Express backend.
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoadingBuses(true);
        setBusError("");

        const response = await fetch(BUS_API);
        if (!response.ok) {
          throw new Error(`Bus API returned ${response.status}`);
        }

        const data = await response.json();
        const busList = Array.isArray(data)
          ? data
          : data.buses || data.data || [];

        setBuses(busList);
      } catch (error) {
        console.error("Bus API error:", error);
        setBusError(
          "Unable to load buses. Check that your Node.js server is running."
        );
      } finally {
        setLoadingBuses(false);
      }
    };

    fetchBuses();
  }, []);

  // Ask the Python ML service for personalized recommendations.
  const fetchRecommendations = useCallback(async (source = "", destination = "") => {
    const passengerId = getPassengerId();

    if (!passengerId) {
      setRecommendations([]);
      setRecommendationError(
        "Log in to see your personalized recommendations."
      );
      return;
    }

    try {
      setLoadingRecommendations(true);
      setRecommendationError("");
      setRecommendationContext(
        source && destination ? { source, destination } : null
      );

      const response = await fetch(`${ML_API}/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passenger_id: passengerId,
          source: source || null,
          destination: destination || null,
          top_n: 5,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || data.error || `Recommendation API returned ${response.status}`
        );
      }

      setRecommendations(
        Array.isArray(data.recommendations) ? data.recommendations : []
      );
    } catch (error) {
      console.error("ML recommendation error:", error);
      setRecommendations([]);
      setRecommendationError(
        error.message ||
        "Unable to load recommendations. Check that the Python ML service is running."
      );
    } finally {
      setLoadingRecommendations(false);
    }
  }, []);

  // Load general recommendations when the page opens.
  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const handleBookNow = (selectedBus) => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      alert("You must be logged in to book a bus.");
      navigate("/login");
      return;
    }

    navigate("/booknow", { state: { bus: selectedBus } });
  };

  // Save search history through Express, not the Python ML service.
  const saveSearchHistory = async (source, destination, searchDate) => {
    const passengerId = getPassengerId();

    if (!passengerId) {
      setSearchHistoryError("Log in to save your search history.");
      return false;
    }

    try {
      const response = await fetch(SEARCH_HISTORY_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passengerId,
          source,
          destination,
          searchDate,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || `Search history API returned ${response.status}`
        );
      }

      setSearchHistoryError("");
      console.log("Search history saved:", data.history || data);
      return true;
    } catch (error) {
      console.error("Search history save failed:", error);
      setSearchHistoryError(
        `Search history could not be saved: ${error.message}`
      );
      return false;
    }
  };

  const filterBuses = useCallback(() => {
    return buses.filter((bus) => {
      const routeMatch = matchesRoute(bus.route, fromStation, toStation);
      const priceMatch = Number(bus.price) <= Number(priceRange);
      const typeMatch =
        busType === "All" || normalize(bus.type) === normalize(busType);
      const seatsMatch =
        bus.seatsAvailable == null || Number(bus.seatsAvailable) > 0;

      return routeMatch && priceMatch && typeMatch && seatsMatch;
    });
  }, [buses, fromStation, toStation, priceRange, busType]);

  const handleSearch = async () => {
    const source = fromStation.trim();
    const destination = toStation.trim();
    const searchDate = date;

    if (!source || !destination || !searchDate) {
      alert("Please enter From, To and Date.");
      return;
    }

    if (normalize(source) === normalize(destination)) {
      alert("Starting location and destination cannot be the same.");
      return;
    }

    setFilteredBuses(filterBuses());
    setShowSearchResults(true);
    setSearchHistoryError("");

    // These are independent operations; a history failure should not block ML.
    await Promise.all([
      saveSearchHistory(source, destination, searchDate),
      fetchRecommendations(source, destination),
    ]);
  };

  useEffect(() => {
    if (showSearchResults) {
      setFilteredBuses(filterBuses());
    }
  }, [filterBuses, showSearchResults]);

  const getRecommendedBus = (item) => {
    const recommendationBusId = item.bus_id || item._id || item.id;
    if (!recommendationBusId) return null;

    return (
      buses.find(
        (bus) => String(bus._id) === String(recommendationBusId)
      ) || null
    );
  };

  const renderRecommendations = () => (
    <section className="recommendations-section">
      <div className="recommendations-header">
        <div>
          <h2>
            {recommendationContext
              ? `Suggestions for ${recommendationContext.source} → ${recommendationContext.destination}`
              : "Recommended Buses For You"}
          </h2>
          <p>
            {recommendationContext
              ? "Personalized suggestions based on your selected route and travel history."
              : "Discover routes based on your previous searches and bookings."}
          </p>
        </div>
        <span className="ml-badge">ML Powered</span>
      </div>

      {loadingRecommendations && (
        <div className="recommendation-status">
          Finding the best buses for you...
        </div>
      )}

      {!loadingRecommendations && recommendationError && (
        <div className="recommendation-status">{recommendationError}</div>
      )}

      {!loadingRecommendations &&
        !recommendationError &&
        recommendations.length === 0 && (
          <div className="recommendation-status">
            No personalized recommendations found yet. Your search and booking
            history can help improve future suggestions.
          </div>
        )}

      <div className="recommendations-grid">
        {recommendations.map((item, index) => {
          const selectedBus = getRecommendedBus(item);
          const routeLabel =
            item.source && item.destination
              ? `${item.source} → ${item.destination}`
              : item.route || "Suggested route";

          return (
            <div
              className="recommendation-card"
              key={
                item.bus_id ||
                item._id ||
                item.id ||
                `${routeLabel}-${index}`
              }
            >
              <span className="recommendation-number">
                Recommended #{index + 1}
              </span>
              <h3>{routeLabel}</h3>
              <p>
                <strong>Bus:</strong>{" "}
                {selectedBus?.name || item.name || "Available Bus"}
              </p>
              <p>
                <strong>Departure:</strong>{" "}
                {selectedBus?.timing || item.departure || "N/A"}
              </p>
              <p>
                <strong>Price:</strong> ₹
                {selectedBus?.price ?? item.fare ?? "N/A"}
              </p>
              <p>
                <strong>Seats:</strong>{" "}
                {selectedBus?.seatsAvailable ?? "Check availability"}
              </p>
              <p className="recommendation-reason">
                {item.reason ||
                  "Suggested based on your travel history and selected route."}
              </p>
              <button
                className="book-button"
                disabled={!selectedBus}
                onClick={() => selectedBus && handleBookNow(selectedBus)}
              >
                {selectedBus ? "Book Now" : "Bus Unavailable"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );

  return (
    <div className="buses-container">
      <h1 className="buses-title">Search Available Buses</h1>

      <div className="search-container">
        <div className="search-field">
          <label htmlFor="from-station">From Station</label>
          <input
            id="from-station"
            type="text"
            placeholder="Enter starting station..."
            value={fromStation}
            onChange={(event) => setFromStation(event.target.value)}
          />
        </div>

        <div className="search-field">
          <label htmlFor="to-station">To Station</label>
          <input
            id="to-station"
            type="text"
            placeholder="Enter destination..."
            value={toStation}
            onChange={(event) => setToStation(event.target.value)}
          />
        </div>

        <div className="search-field">
          <label htmlFor="travel-date">Date</label>
          <input
            id="travel-date"
            type="date"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>

        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {searchHistoryError && (
        <p className="no-results">{searchHistoryError}</p>
      )}

      {!showSearchResults && renderRecommendations()}

      {showSearchResults && (
        <div className="buses-content">
          <div className="filters-container">
            <h2>Filters</h2>

            <div className="filter-group">
              <label>Max Price: ₹{priceRange}</label>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={priceRange}
                onChange={(event) =>
                  setPriceRange(Number(event.target.value))
                }
              />
            </div>

            <div className="filter-group">
              <label htmlFor="bus-type">Bus Type</label>
              <select
                id="bus-type"
                value={busType}
                onChange={(event) => setBusType(event.target.value)}
              >
                <option value="All">All</option>
                <option value="AC">AC</option>
                <option value="Non-AC">Non-AC</option>
                <option value="Sleeper">Sleeper</option>
              </select>
            </div>

            <button
              className="search-button"
              onClick={() => {
                setShowSearchResults(false);
                setFilteredBuses([]);
              }}
            >
              Back to Recommendations
            </button>
          </div>

          <div className="buses-list">
            <h2>Available Buses</h2>

            {loadingBuses && <p>Loading buses...</p>}
            {busError && <p className="no-results">{busError}</p>}

            {!loadingBuses &&
              filteredBuses.map((bus) => (
                <div key={bus._id} className="bus-card">
                  <h2>{bus.name || "Available Bus"}</h2>
                  <p>
                    <strong>Route:</strong> {bus.route}
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{bus.price}
                  </p>
                  <p>
                    <strong>Departure:</strong> {bus.timing}
                  </p>
                  <p>
                    <strong>Seats Available:</strong>{" "}
                    {bus.seatsAvailable ?? "Check availability"}
                  </p>
                  <button
                    className="book-button"
                    onClick={() => handleBookNow(bus)}
                  >
                    Book Now
                  </button>
                </div>
              ))}

            {!loadingBuses &&
              !busError &&
              filteredBuses.length === 0 && (
                <p className="no-results">
                  No buses found for the selected route and filters.
                </p>
              )}
          </div>

          {renderRecommendations()}
        </div>
      )}
    </div>
  );
};

export default Buses;
