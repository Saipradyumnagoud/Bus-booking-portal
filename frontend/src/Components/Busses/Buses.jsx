import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import "./Buses.css";

const Buses = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/Bus_Schedule.csv")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch CSV: ${response.statusText}`);
        }
        return response.text();
      })
      .then((data) => {
        Papa.parse(data, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const filteredBuses = result.data.filter((bus) => {
              if (!bus["Start Time"]) return false;
              try {
                const currentTime = new Date();
                const busTime = new Date(
                  `2025-01-22T${bus["Start Time"].trim()}`
                );
                return busTime > currentTime;
              } catch (error) {
                console.error("Error parsing time:", error);
                return false;
              }
            });
            setBuses(filteredBuses);
            setLoading(false);
          },
          error: (error) => {
            console.error("Error parsing CSV:", error);
            setLoading(false);
          },
        });
      })
      .catch((error) => {
        console.error("Error fetching CSV:", error);
        setLoading(false);
      });
  }, []);

  const handleSelectBus = (bus) => setSelectedBus(bus);

  const handleBookNow = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      alert("You must be logged in to book a bus.");
      navigate("/login");
      return;
    }
    navigate("/booknow", { state: { bus: selectedBus } });
  };

  return (
    <div className="buses-container">
      <h1>Available Buses</h1>
      {loading ? (
        <p>Loading buses...</p>
      ) : (
        <div className="bus-list">
          {buses.length > 0 ? (
            buses.map((bus, index) => (
              <div
                key={index}
                className="bus-card"
                onClick={() => handleSelectBus(bus)}
              >
                <h3>{`${bus["Start Location"]} to ${bus["End Location"]}`}</h3>
                <p>Departure: {bus["Start Time"]}</p>
                <p>Price: ₹{bus.price || "N/A"}</p>
                <p>Seats Available: 30</p>
              </div>
            ))
          ) : (
            <p>No buses available at the moment.</p>
          )}
        </div>
      )}
      {selectedBus && (
        <div className="bus-details">
          <h2>Bus Details</h2>
          <p>
            <strong>Route:</strong>{" "}
            {`${selectedBus["Start Location"]} to ${selectedBus["End Location"]}`}
          </p>
          <p>
            <strong>Departure Time:</strong> {selectedBus["Start Time"]}
          </p>
          <p>
            <strong>Price:</strong> ₹{selectedBus.price || "N/A"}
          </p>
          <p>
            <strong>Seats Available:</strong> 30
          </p>
          <button className="cta-button" onClick={handleBookNow}>
            Book Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Buses;
