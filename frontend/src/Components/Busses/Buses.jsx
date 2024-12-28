import React, { useState } from "react";
import "./Buses.css";

const Buses = () => {
  const [selectedBus, setSelectedBus] = useState(null);

  const buses = [
    {
      id: 1,
      route: "New York to Boston",
      time: "10:00 AM",
      price: "$45",
      seatsAvailable: 30,
    },
    {
      id: 2,
      route: "San Francisco to Los Angeles",
      time: "2:00 PM",
      price: "$55",
      seatsAvailable: 20,
    },
    {
      id: 3,
      route: "Chicago to Miami",
      time: "8:00 PM",
      price: "$65",
      seatsAvailable: 25,
    },
    {
      id: 4,
      route: "Seattle to Portland",
      time: "6:00 AM",
      price: "$40",
      seatsAvailable: 40,
    },
  ];

  const handleSelectBus = (bus) => {
    setSelectedBus(bus);
  };

  return (
    <div className="buses-container">
      <h1>Available Buses</h1>
      
      <div className="bus-list">
        {buses.map((bus) => (
          <div
            key={bus.id}
            className="bus-card"
            onClick={() => handleSelectBus(bus)}
          >
            <h3>{bus.route}</h3>
            <p>Departure: {bus.time}</p>
            <p>Price: {bus.price}</p>
            <p>Seats Available: {bus.seatsAvailable}</p>
          </div>
        ))}
      </div>

      {selectedBus && (
        <div className="bus-details">
          <h2>Bus Details</h2>
          <p><strong>Route:</strong> {selectedBus.route}</p>
          <p><strong>Departure Time:</strong> {selectedBus.time}</p>
          <p><strong>Price:</strong> {selectedBus.price}</p>
          <p><strong>Seats Available:</strong> {selectedBus.seatsAvailable}</p>
          <button className="cta-button">Book Now</button>
        </div>
      )}
    </div>
  );
};

export default Buses;
