import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookNow.css";

const BookNow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bus = location.state?.bus;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerDetails, setPassengerDetails] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setFormData((prev) => ({ ...prev, email: storedEmail }));
    }
  }, []);

  const handleSeatClick = (seatNumber) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        const updatedPassengers = { ...passengerDetails };
        delete updatedPassengers[seatNumber];
        setPassengerDetails(updatedPassengers);
        return prev.filter((seat) => seat !== seatNumber);
      }
      return [...prev, seatNumber];
    });
  };

  const handlePassengerNameChange = (seatNumber, value) => {
    setPassengerDetails((prev) => ({ ...prev, [seatNumber]: value }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !bus ||
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      selectedSeats.length === 0
    ) {
      alert("Please fill in all required fields and select at least one seat.");
      return;
    }

    const totalPrice = selectedSeats.length * parseFloat(bus.price);
    const bookingDetails = {
      email: formData.email,
      busId: bus._id,
      seats: selectedSeats.map((seat) => ({
        seatNumber: seat,
        passengerName: passengerDetails[seat] || "",
      })),
      totalAmount: totalPrice,
    };

    try {
      await axios.post("http://localhost:3000/orders", bookingDetails);
      alert(`Redirecting to the payment page of ₹${totalPrice.toFixed(2)}.`);
      navigate("/payment", { state: { bookingDetails } });
    } catch (err) {
      console.error("Error creating order:", err);
      alert("Error during booking.");
    }
  };

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
          <strong>Price per Passenger:</strong> ₹
          {parseFloat(bus.price).toFixed(2)}
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
            disabled
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
        <div className="total-price">
          <strong>
            Total Price: ₹
            {(selectedSeats.length * parseFloat(bus.price)).toFixed(2)}
          </strong>
        </div>
        <button type="submit" className="confirm-btn">
          Confirm Booking
        </button>
      </form>
      <div className="seat-selection">
        <h2>Select Your Seats</h2>
        <div className="bus-layout">
        <div className="luggage-space">Luggage Space</div>
          <div className="driver-seat">Driver</div>
          <div className="entrance">Entrance /Exit</div>
          {[...Array(20)].map((_, index) => {
            const seatNumber = index + 1;
            return (
              <div
                key={seatNumber}
                className={`seat ${
                  selectedSeats.includes(seatNumber) ? "selected" : ""
                }`}
                onClick={() => handleSeatClick(seatNumber)}
              >
                {seatNumber}
              </div>
            );
          })}
        </div>
      </div>
      {selectedSeats.length > 0 && (
        <div className="passenger-details">
          <h2>Enter Passenger Names</h2>
          {selectedSeats.map((seat) => (
            <div className="form-group" key={seat}>
              <label htmlFor={`passenger-${seat}`}>Seat {seat} Name:</label>
              <input
                type="text"
                id={`passenger-${seat}`}
                value={passengerDetails[seat] || ""}
                onChange={(e) =>
                  handlePassengerNameChange(seat, e.target.value)
                }
                required
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookNow;
