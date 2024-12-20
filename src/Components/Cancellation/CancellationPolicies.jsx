import React from "react";
import "./CancellationPolicies.css";

const CancellationPolicies = () => {
  return (
    <div className="cancellation-policies-container">
      <h1>Cancellation Policies</h1>
      
      <section className="policy-overview">
        <p>
          At <strong>BookNow</strong>, we strive to provide flexibility and ease when it comes to canceling your bus tickets. Please review the following cancellation policies to understand the terms and conditions that apply.
        </p>
      </section>

      <section className="general-cancellation-policy">
        <h2>General Cancellation Policy</h2>
        <p>
          If you wish to cancel your booking, please do so at least 24 hours before the scheduled departure to receive a full refund. Cancellations made less than 24 hours before the departure will incur a cancellation fee based on the type of service booked.
        </p>
      </section>

      <section className="refund-eligibility">
        <h2>Refund Eligibility</h2>
        <ul>
          <li><strong>Full Refund:</strong> If the cancellation is made at least 24 hours before the departure time, you are eligible for a full refund.</li>
          <li><strong>Partial Refund:</strong> Cancellations made within 24 hours of the departure may be eligible for a partial refund, depending on the type of ticket purchased and the specific service.</li>
          <li><strong>No Refund:</strong> If the cancellation occurs after the bus has already departed, no refund will be issued.</li>
        </ul>
      </section>

      <section className="cancellation-fees">
        <h2>Cancellation Fees</h2>
        <p>The following cancellation fees apply based on the time of cancellation:</p>
        <ul>
          <li><strong>More than 24 hours before departure:</strong> No cancellation fee.</li>
          <li><strong>12-24 hours before departure:</strong> 20% of the ticket price.</li>
          <li><strong>Less than 12 hours before departure:</strong> 50% of the ticket price.</li>
          <li><strong>After departure:</strong> No refund issued.</li>
        </ul>
      </section>

      <section className="how-to-cancel">
        <h2>How to Cancel Your Booking</h2>
        <p>You can easily cancel your booking through the following methods:</p>
        <ul>
          <li><strong>Online Cancellation:</strong> Log in to your account on our website or app, navigate to your booking history, and select the booking you wish to cancel.</li>
          <li><strong>Customer Support:</strong> You can also reach out to our customer support team via email or phone to assist with your cancellation request.</li>
        </ul>
      </section>

      <section className="special-cancellations">
        <h2>Special Cancellation Cases</h2>
        <p>
          We understand that there may be special circumstances where the standard cancellation policy does not apply. Please refer to the following cases:
        </p>
        <ul>
          <li><strong>Travel Disruptions:</strong> In the event of a natural disaster or travel disruption, we will provide full refunds or allow free rescheduling, depending on the situation.</li>
          <li><strong>Health Issues:</strong> In the case of illness or medical emergencies, we may provide a full or partial refund upon the submission of relevant documentation.</li>
          <li><strong>Government Regulations:</strong> In cases where cancellations are required by local government regulations (e.g., lockdowns or restrictions), we will offer full refunds to affected passengers.</li>
        </ul>
      </section>
    </div>
  );
};

export default CancellationPolicies;
