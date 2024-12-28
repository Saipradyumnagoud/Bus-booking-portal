import React from "react";
import "./TravelInsurance.css";

const TravelInsurance = () => {
  return (
    <div className="travel-insurance-container">
      <h1>Travel Insurance</h1>

      <section className="insurance-overview">
        <p>
          <strong>Travel with confidence!</strong> At <strong>BookNow</strong>, we provide comprehensive travel insurance options to ensure your journey is secure and stress-free. From trip cancellations to medical emergencies, we’ve got you covered.
        </p>
      </section>

      <section className="benefits">
        <h2>Benefits of Travel Insurance</h2>
        <ul>
          <li><strong>Trip Cancellation Coverage:</strong> Get reimbursed for non-refundable expenses if your trip is canceled due to unforeseen circumstances.</li>
          <li><strong>Medical Emergencies:</strong> Covers hospitalization, medical treatments, and ambulance services during your trip.</li>
          <li><strong>Lost Luggage Protection:</strong> Receive compensation for lost, stolen, or damaged baggage.</li>
          <li><strong>Travel Delays:</strong> Reimbursement for expenses incurred due to significant travel delays.</li>
          <li><strong>Accidental Coverage:</strong> Financial support in case of accidental injuries during your trip.</li>
        </ul>
      </section>

      <section className="coverage-details">
        <h2>What’s Covered?</h2>
        <ul>
          <li>Medical and hospitalization expenses.</li>
          <li>Trip cancellations or interruptions.</li>
          <li>Loss of personal belongings or luggage.</li>
          <li>Emergency evacuation or repatriation.</li>
          <li>Travel delays exceeding 6 hours.</li>
          <li>Accidental death or disability.</li>
        </ul>
      </section>

      <section className="exclusions">
        <h2>What’s Not Covered?</h2>
        <ul>
          <li>Pre-existing medical conditions.</li>
          <li>Self-inflicted injuries or reckless behavior.</li>
          <li>Travel to restricted or war-prone regions.</li>
          <li>Losses due to illegal activities.</li>
          <li>Non-declared valuable items in checked baggage.</li>
        </ul>
      </section>

      <section className="how-to-purchase">
        <h2>How to Purchase Travel Insurance</h2>
        <p>Purchasing travel insurance is easy and hassle-free:</p>
        <ul>
          <li>Select the "Add Travel Insurance" option while booking your tickets on BookNow.</li>
          <li>Review the coverage details and pricing before proceeding.</li>
          <li>Make your payment along with the ticket price, and your travel insurance will be activated immediately.</li>
        </ul>
      </section>

      <section className="claims-process">
        <h2>How to File a Claim</h2>
        <p>In case of an emergency, follow these steps to file a claim:</p>
        <ul>
          <li>Contact our insurance support team at <strong>+1-800-INSURE</strong> or email <strong>claims@booknow.com</strong>.</li>
          <li>Provide your ticket details, insurance policy number, and relevant documentation.</li>
          <li>Our team will process your claim within 7-10 business days.</li>
        </ul>
      </section>
    </div>
  );
};

export default TravelInsurance;
