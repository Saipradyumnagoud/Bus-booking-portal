import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      <h1>About Us</h1>
      
      <section className="about-intro">
        <p>
          <strong>BookNow</strong> is your go-to platform for seamless and hassle-free bus ticket booking experiences. We offer a variety of services tailored to meet your travel needs, from comfortable standard buses to luxurious travel options.
        </p>
      </section>

      <section className="mission">
        <h2>Our Mission</h2>
        <p>
          Our mission is to provide travelers with the easiest, most convenient, and affordable way to book their bus tickets online. We aim to transform the way people travel by making every journey a smooth and memorable experience.
        </p>
      </section>

      <section className="values">
        <h2>Our Core Values</h2>
        <ul>
          <li><strong>Customer Satisfaction:</strong> We prioritize our customers' needs and provide exceptional service at every step.</li>
          <li><strong>Reliability:</strong> Our platform and buses are reliable, ensuring you can travel with peace of mind.</li>
          <li><strong>Innovation:</strong> We continually innovate our services to enhance your travel experience.</li>
          <li><strong>Affordability:</strong> We believe in offering affordable travel options without compromising on comfort or quality.</li>
        </ul>
      </section>

      <section className="our-team">
        <h2>Meet the Team</h2>
        <p>Our dedicated team works tirelessly to ensure your travel experience is seamless and enjoyable. Here's a look at the key members of our team:</p>
        <div className="team-members">
          <div className="team-member">
            <h3>John Doe</h3>
            <p><strong>CEO & Founder</strong></p>
            <p>John is passionate about making travel easier for everyone. He started BookNow with the vision of transforming the bus travel experience.</p>
          </div>
          <div className="team-member">
            <h3>Jane Smith</h3>
            <p><strong>Chief Technology Officer</strong></p>
            <p>Jane leads the tech team and is responsible for ensuring the platform remains innovative, user-friendly, and secure.</p>
          </div>
          <div className="team-member">
            <h3>Michael Brown</h3>
            <p><strong>Head of Customer Service</strong></p>
            <p>Michael ensures that every customer interaction is smooth, providing top-notch support to all our users.</p>
          </div>
        </div>
      </section>

      <section className="history">
        <h2>Our Journey</h2>
        <p>Founded in 2020, BookNow started as a small team with a big dream—to change the way people travel by bus. Over the years, we’ve grown and expanded our services, becoming a trusted platform for thousands of travelers. Our commitment to quality and customer satisfaction has made us one of the top choices for bus travel booking.</p>
      </section>
    </div>
  );
};

export default About;
