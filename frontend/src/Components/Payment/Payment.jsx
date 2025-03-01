import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation
import "./Payment.css"; 
import qrCode from "./qr-code.png";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state?.bookingDetails;

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState("");

  const validPromoCodes = {
    "SAVE10": 10,  
    "BUS20": 20,   
    "WELCOME50": 50 
  };

  if (!bookingDetails) {
    return <p className="error-message">No booking details found. Please go back and try again.</p>;
  }

  // ✅ Debugging: Show booking details on the screen
  console.log("Booking Details:", bookingDetails);

  const handleApplyPromo = () => {
    if (validPromoCodes[promoCode.toUpperCase()]) {
      setDiscount(validPromoCodes[promoCode.toUpperCase()]);
    } else {
      setDiscount(0);
      alert("Invalid promo code.");
    }
  };

  const finalAmount = (bookingDetails.totalAmount * (1 - discount / 100)).toFixed(2);

  const generatePDF = () => {
    const doc = new jsPDF();
    const currentTime = new Date().toLocaleString();

    doc.setFontSize(18);
    doc.text("Ticket Details", 80, 20);

    doc.setFontSize(12);
    doc.text(`Email: ${bookingDetails.email || "N/A"}`, 20, 40);
    doc.text(`Seats: ${bookingDetails.seats || "N/A"}`, 20, 50);
    doc.text(`Total Amount: ₹${finalAmount || "N/A"}`, 20, 60);
    doc.text(`Payment Method: ${paymentMethod.toUpperCase() || "N/A"}`, 20, 70);
    doc.text(`Payment Done Time: ${currentTime}`, 20, 80);

    // ✅ Bus Details
    doc.setFontSize(14);
    doc.text("Bus Details:", 20, 100);
    doc.setFontSize(12);
    doc.text(`Bus Name: ${bookingDetails.busName || "N/A"}`, 20, 110);
    doc.text(`Route: ${bookingDetails.route || "N/A"}`, 20, 120);
    doc.text(`Departure Time: ${bookingDetails.timing || "N/A"}`, 20, 130);
    doc.text(`Price Per Passenger: ₹${bookingDetails.pricePerPassenger || "N/A"}`, 20, 140);

    // ✅ Traveler Details Debug Log
    console.log("Traveler Details:", bookingDetails.travelers);

    if (Array.isArray(bookingDetails.travelers) && bookingDetails.travelers.length > 0) {
        doc.setFontSize(14);
        doc.text("Traveler Details:", 20, 160);
        doc.setFontSize(12);
        
        bookingDetails.travelers.forEach((traveler, index) => {
            console.log(`Traveler ${index + 1}:`, traveler);
            const travelerInfo = `${index + 1}. ${traveler.name || "Unknown"}, Age: ${traveler.age || "N/A"}, Gender: ${traveler.gender || "N/A"}`;
            doc.text(travelerInfo, 20, 170 + index * 10);
        });
    } else {
        doc.text("No traveler details available.", 20, 160);
    }

    doc.text("Thank you for booking with us!", 20, 200);

    doc.save("payment_receipt.pdf");
};


  const handlePayment = () => {
    if (paymentMethod === "upi" && !upiId.match(/^\w+@\w+$/)) {
      setError("Invalid UPI ID. Please enter a valid one (e.g., example@upi)");
      return;
    }

    if (paymentMethod === "card") {
      if (!cardNumber.match(/^\d{16}$/) || !expiry.match(/^\d{2}\/\d{2}$/) || !cvv.match(/^\d{3}$/)) {
        setError("Invalid card details. Please check your inputs.");
        return;
      }
    }

    setError("");
    alert(`Payment successful via ${paymentMethod.toUpperCase()}!`);
    
    generatePDF(); // Generate PDF receipt

    navigate("/");
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2 className="payment-title">Checkout</h2>

        <div className="payment-details">
          <div className="detail-row">
            <span>Email:</span>
            <p>{bookingDetails.email}</p>
          </div>
          <div className="detail-row">
            <span>Seats:</span>
            <p>{bookingDetails.seats}</p>
          </div>
          <div className="detail-row">
            <span>Total Amount:</span>
            <p>₹{finalAmount}</p>
          </div>
        </div>

        <div className="promo-section">
          <input
            type="text"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="input-field"
          />
          <button className="apply-btn" onClick={handleApplyPromo}>Apply</button>
        </div>
        {discount > 0 && <p className="success-message">Promo Applied! {discount}% off</p>}

        <div className="payment-method">
          <label>Select Payment Method:</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="input-field">
            <option value="upi">UPI</option>
            <option value="card">Credit/Debit Card</option>
            <option value="netbanking">Net Banking</option>
            <option value="wallet">Wallet</option>
            <option value="other">Buy Now Pay Later</option>
          </select>
        </div>

        {paymentMethod === "upi" && (
          <div className="payment-input">
            <label>Enter UPI ID or Scan QR Code:</label>
            <input
              type="text"
              placeholder="example@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="input-field"
            />
            <img src={qrCode} alt="Scan QR" className="qr-code" />
          </div>
        )}

        {paymentMethod === "card" && (
          <div className="payment-input">
            <label>Card Number:</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="input-field"
            />
            <div className="card-details">
              <div>
                <label>Expiry Date:</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="input-field small-input"
                />
              </div>
              <div>
                <label>CVV:</label>
                <input
                  type="password"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="input-field small-input"
                />
              </div>
            </div>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}

        <div className="payment-footer">
          <button className="pay-btn" onClick={handlePayment}>
            Pay ₹{finalAmount}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
