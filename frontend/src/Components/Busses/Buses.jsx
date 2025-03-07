import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Buses.css";

const Buses = () => {
  const [buses, setBuses] = useState([]);
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [date, setDate] = useState("");
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [priceRange, setPriceRange] = useState(1000);
  const [busType, setBusType] = useState("All");
  const [showCancellationPolicies, setShowCancellationPolicies] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/buses")
      .then((response) => response.json())
      .then((data) => setBuses(data))
      .catch((err) => console.error("Error fetching bus data:", err));
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

  const handleSearch = () => {
    if (!fromStation || !date) {
      alert("Please select From, To stations, and Date.");
      return;
    }

    const results = buses.filter((bus) => {
      const routeMatch =
        bus.route.toLowerCase().includes(fromStation.toLowerCase()) &&
        bus.route.toLowerCase().includes(toStation.toLowerCase());
      const priceMatch = bus.price <= priceRange;
      const typeMatch = busType === "All" || bus.type === busType;

      return routeMatch && priceMatch && typeMatch;
    });

    setFilteredBuses(results);
    setShowSearchResults(true);
    setShowCancellationPolicies(false);
  };
  
  useEffect(() => {
    if (!showSearchResults) return; // Only filter after search

    const results = buses.filter((bus) => {
      const routeMatch =
        bus.route.toLowerCase().includes(fromStation.toLowerCase()) &&
        bus.route.toLowerCase().includes(toStation.toLowerCase());
      const priceMatch = bus.price <= priceRange;
      const typeMatch = busType === "All" || bus.type === busType;

      return routeMatch && priceMatch && typeMatch;
    });
    
    setFilteredBuses(results);
  }, [priceRange, busType, showSearchResults, buses, fromStation, toStation]);
  return (
    <div className="buses-container">
      <h1 className="buses-title">Search Available Buses</h1>

      {/* Search Section */}
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
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Show Filters and Results Only After Search */}
      {showSearchResults && (
        <div className="buses-content">
          {/* Left-side Filters Section */}
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
                onChange={(e) => setPriceRange(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Bus Type</label>
              <select value={busType} onChange={(e) => setBusType(e.target.value)}>
                <option value="All">All</option>
                <option value="AC">AC</option>
                <option value="Non-AC">Non-AC</option>
                <option value="Sleeper">Sleeper</option>
              </select>
            </div>
          </div>

          {/* Bus List */}
          <div className="buses-list">
            {filteredBuses.length > 0 ? (
              filteredBuses.map((bus) => (
                <div key={bus._id} className="bus-card">
                  <h2>{bus.name}</h2>
                  <p><strong>Route:</strong> {bus.route}</p>
                  <p><strong>Price:</strong> ₹{bus.price}</p>
                  <p><strong>Departure:</strong> {bus.timing}</p>
                  <p><strong>Seats Available:</strong> 20</p>
                  {/* <p><strong>Type:</strong> {bus.type}</p> */}
                  <button className="book-button" onClick={() => handleBookNow(bus)}>
                    Book Now
                  </button>
                </div>
              ))
            ) : (
              <p className="no-results">No buses found for the selected route and date.</p>
            )}
          </div>
        </div>
      )}

      {showCancellationPolicies && (
      <div className="cancellation-policies-container">
      <h1>Bus booking FAQ'S</h1>
      
      <section className="policy-overview">
        <p>
          At <strong>BookNow</strong>, we strive to provide flexibility and ease when it comes to canceling your bus tickets. Please review the following cancellation policies to understand the terms and conditions that apply.
        </p>
      </section>

      <section className="general-cancellation-policy">
        <h2>General Cancellation Policy</h2>
        <p>
          If you wish to cancel your booking, please do so at least 24 hours before the scheduled departure to receive a full refund. Cancellations made less than 24 hours before the departure will incur a cancellation fee based on the type of service booked.
        </p>
      </section>

      <section className="refund-eligibility">
        <h2>Refund Eligibility</h2>
        <ul>
          <li><strong>Full Refund:</strong> If the cancellation is made at least 24 hours before the departure time, you are eligible for a full refund.</li>
          <li><strong>Partial Refund:</strong> Cancellations made within 24 hours of the departure may be eligible for a partial refund, depending on the type of ticket purchased and the specific service.</li>
          <li><strong>No Refund:</strong> If the cancellation occurs after the bus has already departed, no refund will be issued.</li>
        </ul>
      </section>

      <section className="cancellation-fees">
        <h2>Cancellation Fees</h2>
        <p>The following cancellation fees apply based on the time of cancellation:</p>
        <ul>
          <li><strong>More than 24 hours before departure:</strong> No cancellation fee.</li>
          <li><strong>12-24 hours before departure:</strong> 20% of the ticket price.</li>
          <li><strong>Less than 12 hours before departure:</strong> 50% of the ticket price.</li>
          <li><strong>After departure:</strong> No refund issued.</li>
        </ul>
      </section>

      <section className="how-to-cancel">
        <h2>How to Cancel Your Booking</h2>
        <p>You can easily cancel your booking through the following methods:</p>
        <ul>
          <li><strong>Online Cancellation:</strong> Log in to your account on our website or app, navigate to your booking history, and select the booking you wish to cancel.</li>
          <li><strong>Customer Support:</strong> You can also reach out to our customer support team via email or phone to assist with your cancellation request.</li>
        </ul>
      </section>

      <section className="special-cancellations">
        <h2>Special Cancellation Cases</h2>
        <p>
          We understand that there may be special circumstances where the standard cancellation policy does not apply. Please refer to the following cases:
        </p>
        <ul>
          <li><strong>Travel Disruptions:</strong> In the event of a natural disaster or travel disruption, we will provide full refunds or allow free rescheduling, depending on the situation.</li>
          <li><strong>Health Issues:</strong> In the case of illness or medical emergencies, we may provide a full or partial refund upon the submission of relevant documentation.</li>
          <li><strong>Government Regulations:</strong> In cases where cancellations are required by local government regulations (e.g., lockdowns or restrictions), we will offer full refunds to affected passengers.</li>
        </ul>
      </section>
    </div>
      )}
    </div>
  );
};

export default Buses;
