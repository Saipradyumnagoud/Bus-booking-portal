import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookNow.css";

const BookNow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bus = location.state?.bus;

  const [numPassengers, setNumPassengers] = useState(1);
  const [passengerDetails, setPassengerDetails] = useState([{ name: "" }]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Handle changes in passenger details
  const handlePassengerChange = (index, value) => {
    const updatedPassengers = [...passengerDetails];
    updatedPassengers[index].name = value;
    setPassengerDetails(updatedPassengers);
  };

  // Handle the change in the number of passengers
  const handleNumPassengersChange = (e) => {
    const value = parseInt(e.target.value, 10) || 1;
    setNumPassengers(value);
    const updatedPassengers = Array(value)
      .fill("")
      .map((_, i) => passengerDetails[i] || { name: "" });
    setPassengerDetails(updatedPassengers);
  };

  // Handle changes in the main form fields
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Submit booking
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!bus || !formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all required fields.");
      return;
    }

    const totalPrice = numPassengers * parseFloat(bus.price);
    const bookingDetails = {
      bus,
      customer: formData,
      passengers: passengerDetails,
      totalPrice,
    };

    console.log("Booking Details:", bookingDetails);

    alert(`Booking confirmed! Total Price: ₹${totalPrice.toFixed(2)}. Redirecting to payment...`);

    // Redirect to a payment or confirmation page
    navigate("/payment", { state: { bookingDetails } });
  };

  // If no bus is selected
  if (!bus) {
    return <p>No bus selected. Please go back and choose a bus.</p>;
  }

  return (
    <div className="booknow-container">
      <h1>Confirm Your Booking</h1>
      <div className="bus-details">
        <p>
          <strong>Route:</strong> {bus.route}
        </p>
        <p>
          <strong>Departure Time:</strong> {bus.timing}
        </p>
        <p>
          <strong>Price per Passenger:</strong> ₹{parseFloat(bus.price).toFixed(2)}
        </p>
        {/* <p>
          <strong>Seats Available:</strong> {bus.seatsAvailable}
        </p> */}
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
            <label htmlFor={`passenger-${index}`}>
              Passenger {index + 1} Name:
            </label>
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
