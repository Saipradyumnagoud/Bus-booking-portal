import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
      <h1 className="heading">Welcome to BookNow</h1>

        <p>Effortless bus booking for your next adventure. Travel smart, travel easy!</p>
        <button className="cta-button">Get Started</button>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose BookNow?</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Easy Booking</h3>
            <p>Book your tickets in just a few clicks. Quick, easy, and hassle-free!</p>
          </div>
          <div className="feature-card">
            <h3>Multiple Payment Options</h3>
            <p>Pay the way you want—credit cards, wallets, and more.</p>
          </div>
          <div className="feature-card">
            <h3>Real-Time Updates</h3>
            <p>Stay informed with live updates about your bus schedule and seat availability.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2>What Our Customers Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <p>"Booking a bus was never easier! BookNow made it so simple and efficient. Highly recommended!"</p>
            <h4>- Sarah K.</h4>
          </div>
          <div className="testimonial-card">
            <p>"I love the multiple payment options. It made my booking experience smooth and hassle-free!"</p>
            <h4>- Michael T.</h4>
          </div>
          <div className="testimonial-card">
            <p>"The real-time updates kept me informed throughout my journey. Definitely using BookNow again!"</p>
            <h4>- Emma L.</h4>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta">
      <h2>Ready to Book Your Next Ride?</h2>
      <Link to="/buses">
      <button className="cta-button">
      Start Your Journey
      </button>
      </Link>
      </section>

    </div>
  );
};

export default Home;
