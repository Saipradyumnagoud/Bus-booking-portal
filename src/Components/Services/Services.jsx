import React from "react";
import "./Services.css";

const Services = () => {
  return (
    <div className="services-container">
      <h1>Our Services</h1>

      <section className="service-cards">
        <div className="service-card">
          <h3>Standard Bus</h3>
          <p>Our Standard Bus service offers comfortable seating, free Wi-Fi, and air conditioning to ensure a pleasant journey.</p>
          <ul>
            <li>Comfortable Seating</li>
            <li>Air Conditioning</li>
            <li>Free Wi-Fi</li>
            <li>Affordable Pricing</li>
          </ul>
        </div>

        <div className="service-card">
          <h3>Luxury Bus</h3>
          <p>For a more luxurious experience, our Luxury Bus offers recliner seats, entertainment options, and complimentary refreshments.</p>
          <ul>
            <li>Recliner Seating</li>
            <li>Complimentary Refreshments</li>
            <li>Onboard Entertainment</li>
            <li>Premium Service</li>
          </ul>
        </div>

        <div className="service-card">
          <h3>Express Bus</h3>
          <p>For faster travel, our Express Bus ensures quick travel times, with fewer stops and a premium experience.</p>
          <ul>
            <li>Fewer Stops</li>
            <li>Faster Travel Times</li>
            <li>Free Snacks</li>
            <li>Comfortable Seats</li>
          </ul>
        </div>
      </section>

      <section className="additional-services">
        <h2>Additional Services</h2>
        <p>We also offer the following additional services to make your journey even more convenient and enjoyable:</p>
        <ul>
          <li><strong>Seat Selection:</strong> Choose your preferred seat when booking your ticket.</li>
          <li><strong>Meal Options:</strong> Choose from a variety of meal options available during the trip.</li>
          <li><strong>Online Booking:</strong> Book your tickets online for a smooth and easy process.</li>
          <li><strong>Travel Insurance:</strong> Add travel insurance for peace of mind during your trip.</li>
        </ul>
      </section>
    </div>
  );
};

export default Services;
