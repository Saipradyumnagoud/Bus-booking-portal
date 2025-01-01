import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./BookNow.css";

const BookNow = () => {
  const location = useLocation();
  const bus = location.state?.bus;

  const [numPassengers, setNumPassengers] = useState(1);
  const [passengerDetails, setPassengerDetails] = useState([{ name: "" }]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handlePassengerChange = (index, value) => {
    const updatedPassengers = [...passengerDetails];
    updatedPassengers[index].name = value;
    setPassengerDetails(updatedPassengers);
  };

  const handleNumPassengersChange = (e) => {
    const value = parseInt(e.target.value, 10) || 1; // Ensure valid input
    setNumPassengers(value);
    const updatedPassengers = Array(value)
      .fill("")
      .map((_, i) => passengerDetails[i] || { name: "" });
    setPassengerDetails(updatedPassengers);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalPrice = numPassengers * parseFloat(bus.price);
    alert(`Booking confirmed! Total Price: ₹${totalPrice}. Redirecting to payment...`);
    console.log("Booking Details:", {
      bus,
      customer: formData,
      passengers: passengerDetails,
      totalPrice,
    });
  };

  if (!bus) {
    return <p>No bus selected. Please go back and choose a bus.</p>;
  }

  return (
    <div className="booknow-container">
      <h1>Confirm Booking</h1>
      <div className="bus-details">
        <p>
          <strong>Route:</strong> {bus.route}
        </p>
        <p>
          <strong>Departure Time:</strong> {bus.time}
        </p>
        <p>
          <strong>Price per Passenger:</strong> ₹{parseFloat(bus.price).toFixed(2)}
        </p>
        <p>
          <strong>Seats Available:</strong> {bus.seatsAvailable}
        </p>
      </div>
      <form className="booking-form" onSubmit={handleSubmit}>
        <h2>Enter Your Details</h2>
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleFormChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleFormChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="numPassengers">Number of Passengers:</label>
          <input
            type="number"
            id="numPassengers"
            name="numPassengers"
            min="1"
            max={bus.seatsAvailable}
            value={numPassengers}
            onChange={handleNumPassengersChange}
            required
          />
        </div>
        {passengerDetails.map((passenger, index) => (
          <div className="form-group" key={index}>
            <label htmlFor={`passenger-${index}`}>Passenger {index + 1} Name:</label>
            <input
              type="text"
              id={`passenger-${index}`}
              value={passenger.name}
              onChange={(e) => handlePassengerChange(index, e.target.value)}
              required
            />
          </div>
        ))}
        <div className="total-price">
          <strong>Total Price: ₹{(numPassengers * parseFloat(bus.price)).toFixed(2)}</strong>
        </div>
        <button type="submit" className="confirm-btn">
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookNow;
