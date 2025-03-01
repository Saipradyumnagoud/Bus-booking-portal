import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Buses.css";

const Buses = () => {
  const [buses, setBuses] = useState([]);
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [date, setDate] = useState(""); // Date selection
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const navigate = useNavigate();

  // Fetch bus data from backend API
  useEffect(() => {
    fetch("http://localhost:3000/api/buses")
      .then((response) => response.json())
      .then((data) => setBuses(data))
      .catch((err) => console.error("Error fetching bus data:", err));
  }, []);

  // Handle booking a bus
  const handleBookNow = (selectedBus) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      alert("You must be logged in to book a bus.");
      navigate("/login");
      return;
    }
    navigate("/booknow", { state: { bus: selectedBus } });
  };

  // Handle Search
  const handleSearch = () => {
    if (!fromStation  || !date) {
      alert("Please select From, To stations, and Date.");
      return;
    }

    const results = buses.filter((bus) => {
      const routeMatch =
        bus.route.toLowerCase().includes(fromStation.toLowerCase()) &&
        bus.route.toLowerCase().includes(toStation.toLowerCase());

      const dateMatch = true; // Adjust based on backend date filtering if needed

      return routeMatch && dateMatch;
    });

    setFilteredBuses(results);
    setShowSearchResults(true);
  };

  return (
    <div className="buses-page">
      <h1 className="buses-title">Search Available Buses</h1>

      {/* Search Filters */}
      <div className="search-container">
        <div className="search-field">
          <label>From Station</label>
          <input
            type="text"
            placeholder="Enter starting station..."
            value={fromStation}
            onChange={(e) => setFromStation(e.target.value)}
          />
        </div>

        <div className="search-field">
          <label>To Station</label>
          <input
            type="text"
            placeholder="Enter destination..."
            value={toStation}
            onChange={(e) => setToStation(e.target.value)}
          />
        </div>

        <div className="search-field">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]} // Prevent past dates
          />
        </div>

        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Bus List */}
      {showSearchResults && (
        <div className="buses-list">
          {filteredBuses.length > 0 ? (
            filteredBuses.map((bus) => (
              <div key={bus._id} className="bus-card">
                <h2>{bus.name}</h2>
                <p><strong>Route:</strong> {bus.route}</p>
                <p><strong>Price:</strong> ₹{bus.price}</p>
                <p><strong>Departure:</strong> {bus.timing}</p>
                <p><strong>Seats Available:</strong> 20</p>
                <button className="book-button" onClick={() => handleBookNow(bus)}>
                  Book Now
                </button>
              </div>
            ))
          ) : (
            <p className="no-results">No buses found for the selected route and date.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Buses;
