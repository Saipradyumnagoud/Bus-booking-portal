import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import "./Buses.css";

const Buses = () => {
  const [buses, setBuses] = useState([]); // Store bus data
  const [searchTerm, setSearchTerm] = useState(""); // Search term input
  const navigate = useNavigate();

  // Fetch the bus data from the CSV file
  useEffect(() => {
    fetch("/Bus_Schedule.csv")
      .then((response) => response.text())
      .then((data) => {
        Papa.parse(data, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            // Ensure valid data structure
            const parsedBuses = result.data.map((bus) => ({
              id: bus.id || "", // Fallback to empty string
              name: bus.name || "Unknown Bus",
              route: bus.route || "Unknown Route",
              price: bus.price || "0",
              timing: bus.timing || "Unknown Time",
            }));
            setBuses(parsedBuses);
          },
        });
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
            <div key={bus.id} className="bus-card">
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
