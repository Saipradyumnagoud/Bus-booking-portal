import React from "react";
import "./Offers.css";

const Offers = () => {
  return (
    <div className="offers-container">
      <h1>Exclusive Offers</h1>
      <p>Save big on your travels with our special discounts and deals. Grab these limited-time offers now!</p>

      <section className="offer-cards">
        <div className="offer-card">
          <h2>Early Bird Discount</h2>
          <p>
            Book your tickets at least 15 days in advance and get <strong>20% off</strong> on your total fare. Don’t miss out!
          </p>
          <button className="claim-button">Claim Now</button>
        </div>

        <div className="offer-card">
          <h2>Weekend Special</h2>
          <p>
            Travel on Saturdays and Sundays to avail up to <strong>30% discount</strong>. Make your weekends even better!
          </p>
          <button className="claim-button">Claim Now</button>
        </div>

        <div className="offer-card">
          <h2>Refer & Earn</h2>
          <p>
            Refer your friends to BookNow and get <strong>₹100 cashback</strong> for every successful booking made by your referral.
          </p>
          <button className="claim-button">Refer Now</button>
        </div>

        <div className="offer-card">
          <h2>Student Discount</h2>
          <p>
            Students can enjoy an exclusive <strong>15% discount</strong>. Verify your student ID to unlock this offer.
          </p>
          <button className="claim-button">Verify Now</button>
        </div>
      </section>

      <section className="terms-conditions">
        <h2>Terms and Conditions</h2>
        <ul>
          <li>Offers are valid only for online bookings made through BookNow.</li>
          <li>Discounts cannot be combined with other promotional offers.</li>
          <li>Refer & Earn cashback will be credited to your account within 48 hours after a successful booking.</li>
          <li>BookNow reserves the right to modify or withdraw offers at any time without prior notice.</li>
          <li>Student discount requires a valid student ID for verification.</li>
        </ul>
      </section>
    </div>
  );
};

export default Offers;
