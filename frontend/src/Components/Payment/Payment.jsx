import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state?.bookingDetails;

  if (!bookingDetails) {
    return <p>No booking details found. Please go back and try again.</p>;
  }

  const handlePaymentSuccess = () => {
    alert("Payment successful!");
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
        <span style={styles.strongText}>Total Amount:</span> ₹
        {bookingDetails.totalAmount.toFixed(2)}
      </p>
      <button
        style={styles.button}
        onClick={handlePaymentSuccess}
        onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
        onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
      >
        Simulate Payment
      </button>
    </div>
  );
};

export default Payment;
