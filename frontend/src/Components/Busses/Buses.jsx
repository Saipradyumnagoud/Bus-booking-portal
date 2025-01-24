import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import "./Buses.css";

const Buses = () => {
  const [buses, setBuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/Bus_Schedule.csv")
      .then((response) => response.text())
      .then((data) => {
        Papa.parse(data, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setBuses(result.data);
          },
        });
      });
  }, []);

  const handleBookNow = (selectedBus) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      alert("You must be logged in to book a bus.");
      navigate("/login");
      return;
    }
    navigate("/booknow", { state: { bus: selectedBus } });
  };

  const filteredBuses = buses.filter((bus) =>
    bus.route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="buses-page">
      <h1 className="buses-title">Available Buses</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by route..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="buses-list">
        {filteredBuses.length > 0 ? (
          filteredBuses.map((bus) => (
            <div key={bus.id} className="bus-card">
              <h2>{bus.name}</h2>
              <p>Route: {bus.route}</p>
              <p>Price: {bus.price}</p>
              <p>Departure: {bus.timing}</p>
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
