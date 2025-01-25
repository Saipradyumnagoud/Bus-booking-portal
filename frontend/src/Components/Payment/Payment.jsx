import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state?.bookingDetails;

  // If no booking details are provided
  if (!bookingDetails) {
    return <p>No booking details found. Please go back and make a booking.</p>;
  }

  const { bus, customer, passengers, totalPrice } = bookingDetails;

  const handlePayment = () => {
    alert("Payment successful! Your booking is confirmed.");
    navigate("/"); // Redirect to the home page or a confirmation page
  };

  return (
    <div className="payment-container">
      <h1>Payment</h1>
      <div className="payment-details">
        <h2>Booking Summary</h2>
        <p>
          <strong>Route:</strong> {bus.route}
        </p>
        <p>
          <strong>Departure Time:</strong> {bus.timing}
        </p>
        <p>
          <strong>Price per Passenger:</strong> ₹{parseFloat(bus.price).toFixed(2)}
        </p>
        <p>
          <strong>Number of Passengers:</strong> {passengers.length}
        </p>
        <p>
          <strong>Total Price:</strong> ₹{totalPrice.toFixed(2)}
        </p>
      </div>
      <h2>Customer Details</h2>
      <p>
        <strong>Name:</strong> {customer.name}
      </p>
      <p>
        <strong>Email:</strong> {customer.email}
      </p>
      <p>
        <strong>Phone:</strong> {customer.phone}
      </p>
      <button className="pay-btn" onClick={handlePayment}>
        Pay ₹{totalPrice.toFixed(2)}
      </button>
    </div>
  );
};

export default Payment;
