import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import "./Buses.css";

const Buses = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch and parse the CSV file
    fetch("/Bus_Schedule.csv") // Ensure the file is in the 'public' folder
      .then((response) => response.text())
      .then((data) => {
        Papa.parse(data, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const filteredBuses = result.data.filter((bus) => {
              if (!bus["Start Time"]) return false; // Skip if Start Time is missing
              try {
                const currentTime = new Date();
                const busTime = new Date(
                  `2025-01-22T${bus["Start Time"].trim()}`
                ); // Format the Start Time
                return busTime > currentTime; // Only include future buses
              } catch (error) {
                console.error("Error parsing time:", error);
                return false;
              }
            });
            setBuses(filteredBuses);
          },
          error: (error) => console.error("Error parsing CSV:", error),
        });
      })
      .catch((error) => console.error("Error fetching CSV:", error));
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
      <div className="bus-list">
        {buses.map((bus, index) => (
          <div
            key={index}
            className="bus-card"
            onClick={() => handleSelectBus(bus)}
          >
            <h3>{`${bus["Start Location"]} to ${bus["End Location"]}`}</h3>
            <p>Departure: {bus["Start Time"]}</p>
            <p>Price: ₹{bus.price || "N/A"}</p>
            {/* {bus.seatsAvailable || "N/A"} */}
            <p>Seats Available: 30 </p>
          </div>
        ))}
      </div>
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
            <strong>Seats Available:</strong> {selectedBus.seatsAvailable || "N/A"}
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
