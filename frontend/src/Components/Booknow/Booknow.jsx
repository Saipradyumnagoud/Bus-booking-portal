import React from "react";
import { useLocation } from "react-router-dom";
import "./BookNow.css";

const BookNow = () => {
  const location = useLocation();
  const bus = location.state?.bus;

  if (!bus) {
    return <p>No bus selected. Please go back and choose a bus.</p>;
  }

  return (
    <div className="booknow-container">
      <h1>Confirm Booking</h1>
      <p><strong>Route:</strong> {bus.route}</p>
      <p><strong>Departure Time:</strong> {bus.time}</p>
      <p><strong>Price:</strong> {bus.price}</p>
      <p><strong>Seats Available:</strong> {bus.seatsAvailable}</p>
      <button className="confirm-btn">Confirm Booking</button>
    </div>
  );
};

export default BookNow;
