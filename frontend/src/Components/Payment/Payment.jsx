import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state?.bookingDetails;
  const [upiId, setUpiId] = useState("");
  const [error, setError] = useState("");

  if (!bookingDetails) {
    return <p>No booking details found. Please go back and try again.</p>;
  }

  const handlePayment = () => {
    if (!upiId.match(/^\w+@\w+$/)) {
      setError("Invalid UPI ID. Please enter a valid one (e.g., example@upi)");
      return;
    }
    setError("");
    alert("Payment successful via UPI!");
    navigate("/");
  };

  const styles = {
    container: {
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      textAlign: "center",
      maxWidth: "600px",
      margin: "0 auto",
      border: "1px solid #ddd",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    heading: {
      fontSize: "2rem",
      color: "#333",
      marginBottom: "20px",
    },
    paragraph: {
      fontSize: "1.1rem",
      color: "#555",
      marginBottom: "15px",
    },
    strongText: {
      fontWeight: "bold",
    },
    input: {
      padding: "10px",
      width: "80%",
      fontSize: "1rem",
      marginBottom: "10px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      textAlign: "center",
    },
    error: {
      color: "red",
      fontSize: "0.9rem",
      marginBottom: "10px",
    },
    button: {
      padding: "12px 20px",
      backgroundColor: "#28a745",
      color: "white",
      fontSize: "1rem",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#218838",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Payment Details</h1>
      <p style={styles.paragraph}>
        <span style={styles.strongText}>Email:</span> {bookingDetails.email}
      </p>
      <p style={styles.paragraph}>
        <span style={styles.strongText}>Seats:</span> {bookingDetails.seats}
      </p>
      <p style={styles.paragraph}>
        <span style={styles.strongText}>Total Amount:</span> ₹{bookingDetails.totalAmount.toFixed(2)}
      </p>
      <input
        type="text"
        placeholder="Enter UPI ID (e.g., example@upi)"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
        style={styles.input}
      />
      {error && <p style={styles.error}>{error}</p>}
      <button
        style={styles.button}
        onClick={handlePayment}
        onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
        onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
      >
        Pay Now
      </button>
    </div>
  );
};

export default Payment;
