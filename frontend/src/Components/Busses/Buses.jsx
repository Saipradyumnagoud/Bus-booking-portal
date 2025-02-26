import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Buses.css";

const Buses = () => {
  const [buses, setBuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch bus data from backend API
  useEffect(() => {
    fetch("http://192.168.0.102:3000/api/buses")
      .then((response) => response.json())
      .then((data) => {
        setBuses(data);
      })
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

  // Filter buses based on the search term
  const filteredBuses = buses.filter((bus) =>
    (bus.route || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="buses-page">
      <h1 className="buses-title">Available Buses</h1>

      {/* Search bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by route..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Bus list */}
      <div className="buses-list">
        {filteredBuses.length > 0 ? (
          filteredBuses.map((bus) => (
            <div key={bus._id} className="bus-card">
              <h2>{bus.name}</h2>
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
                <strong>Seats Available:</strong> 20
              </p>
              <button
                className="book-button"
                onClick={() => handleBookNow(bus)}
              >
                Book Now
              </button>
            </div>
          ))
        ) : (
          <p className="no-results">No buses found for your search.</p>
        )}
      </div>
    </div>
  );
};

export default Buses;
