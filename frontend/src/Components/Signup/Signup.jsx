import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("Please fill out all fields.");
      return;
    }

    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_API_URL}/signup`, { name, email, password })
      .then((result) => {
        alert("Signup successful! Please log in.");
        navigate("/login");
      })
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.error || "Signup failed. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">Signup</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username" className="input-label">Name</label>
            <input
              type="text"
              className="input-field"
              id="username"
              placeholder="Enter your username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email" className="input-label">Email address</label>
            <input
              type="email"
              className="input-field"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="input-label">Password</label>
            <input
              type="password"
              className="input-field"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <div className="login-link">
          <p>Already have an account? <Link to="/login" className="login-btn">Log in here</Link>.</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
