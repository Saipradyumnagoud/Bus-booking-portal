import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your message has been sent!");
    // You can implement form submission logic here.
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>

      <section className="contact-details">
        <h2>Get in Touch</h2>
        <p>If you have any questions or concerns, feel free to reach out to us. Our team is here to assist you!</p>

        <div className="contact-info">
          <div className="contact-item">
            <h3>Email</h3>
            <p><a href="mailto:support@booknow.com">support@booknow.com</a></p>
          </div>

          <div className="contact-item">
            <h3>Phone</h3>
            <p><a href="tel:+1234567890">+1-234-567-890</a></p>
          </div>

          <div className="contact-item">
            <h3>Address</h3>
            <p>123, Main Street, City, Country</p>
          </div>
        </div>
      </section>

      <section className="contact-form">
        <h2>Send Us a Message</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">Send Message</button>
        </form>
      </section>

      <section className="social-media">
        <h2>Follow Us</h2>
        <p>Stay connected with us on social media for updates and offers!</p>
        <div className="social-links">
          <a href="https://www.facebook.com/BookNow" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com/BookNow" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://www.instagram.com/BookNow" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.linkedin.com/company/BookNow" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </section>

      <section className="map">
        <h2>Our Location</h2>
        <div className="map-container">
          <iframe
            title="Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.2799082106!2d-74.2598677!3d40.6976701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a23b7888e7b%3A0x928fae3b2b6e83e!2sNew+York%2C+NY%2C+USA!5e0!3m2!1sen!2sin!4v1633443293650!5m2!1sen!2sin"
            width="600"
            height="450"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default Contact;
