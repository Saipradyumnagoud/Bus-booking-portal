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
    bookingDate: ""
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setFormData((prev) => ({ ...prev, email: storedEmail }));
    }
  }, []);

  const handleSeatClick = (seatNumber) => {
    setSelectedSeats((prevSeats) =>
      prevSeats.includes(seatNumber)
        ? prevSeats.filter((seat) => seat !== seatNumber)
        : [...prevSeats, seatNumber]
    );

    setPassengerDetails((prevDetails) => ({
      ...prevDetails,
      [seatNumber]: prevDetails[seatNumber] || { name: "", age: "", gender: "" },
    }));
  };

  const handlePassengerChange = (seat, field, value) => {
    setPassengerDetails((prevDetails) => ({
      ...prevDetails,
      [seat]: { ...prevDetails[seat], [field]: value },
    }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bus || !formData.name || !formData.email || !formData.phone || selectedSeats.length === 0) {
      alert("Please fill in all required fields and select seats.");
      return;
    }

    const totalPrice = selectedSeats.length * parseFloat(bus.price);
    const travelers = selectedSeats.map((seat) => ({
      seatNumber: seat,
      name: passengerDetails[seat]?.name || "",
      age: passengerDetails[seat]?.age || "",
      gender: passengerDetails[seat]?.gender || "",
    }));

    if (travelers.some((t) => !t.name || !t.age || !t.gender)) {
      alert("Please complete passenger details for all selected seats.");
      return;
    }

    const bookingDetails = {
      email: formData.email,
      busId: bus._id,
      busName: bus.name,
      route: bus.route,
      timing: bus.timing,
      pricePerPassenger: bus.price,
      seats: selectedSeats.length,
      totalAmount: totalPrice,
      selectedSeats,
      travelers,
      bookingDate: formData.bookingDate,  // ✅ Booking date is included
    };
    

    try {
      const isConfirmed = window.confirm(
        `Proceed with the booking? Total amount: ₹${totalPrice.toFixed(2)}`
      );
    
      if (!isConfirmed) {
        alert("Booking canceled.");
        return;
      }
    
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
        <p><strong>Bus Name:</strong> {bus.name}</p>
        <p><strong>Route:</strong> {bus.route}</p>
        <p><strong>Departure Time:</strong> {bus.timing}</p>
        <p><strong>Price per Passenger:</strong> ₹{parseFloat(bus.price).toFixed(2)}</p>
      </div>
      <form className="booking-form" onSubmit={handleSubmit}>
        <h2>Enter Your Details</h2>
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleFormChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} disabled />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleFormChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="bookingDate">Booking Date:</label>
          <input type="date" id="bookingDate" name="bookingDate" value={formData.bookingDate} onChange={handleFormChange} required />
        </div>
        {/* Seat Selection */}
        <div className="seat-selection">
          <h2>Select Your Seats</h2>
          <div className="bus-layout">
            <div className="luggage-space">Luggage Space</div>
            <div className="driver-seat">Driver</div>
            <div className="entrance">Entrance / Exit</div>
            {[...Array(20)].map((_, index) => {
              const seatNumber = index + 1;
              return (
                <div
                  key={seatNumber}
                  className={`seat ${selectedSeats.includes(seatNumber) ? "selected" : ""}`}
                  onClick={() => handleSeatClick(seatNumber)}
                >
                  {seatNumber}
                </div>
              );
            })}
          </div>
        </div>

        {/* Passenger Details */}
        {selectedSeats.length > 0 && (
          <div className="passenger-details">
            <h2>Enter Passenger Details</h2>
            {selectedSeats.map((seat) => (
              <div className="form-group" key={seat}>
                <label>Seat {seat} Passenger Details:</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={passengerDetails[seat]?.name || ""}
                  onChange={(e) => handlePassengerChange(seat, "name", e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Age"
                  value={passengerDetails[seat]?.age || ""}
                  onChange={(e) => handlePassengerChange(seat, "age", e.target.value)}
                  required
                />
                <select
                  style={{ width: "200px", padding: "5px", fontSize: "16px", borderRadius: "5px" }}
                  value={passengerDetails[seat]?.gender || ""}
                  onChange={(e) => handlePassengerChange(seat, "gender", e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            ))}
          </div>
        )}

        <div className="total-price">
          <strong>Total Price: ₹{(selectedSeats.length * parseFloat(bus.price)).toFixed(2)}</strong>
        </div>
        <button type="submit" className="confirm-btn">Confirm Booking</button>
      </form>
    </div>
  );
};

export default BookNow;
