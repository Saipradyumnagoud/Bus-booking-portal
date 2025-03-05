import React, { useState } from "react";
import { Link ,useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:3000/login", { email, password })
      .then((result) => {
        if (result.data.message === "Success") {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userEmail", email);
          alert("Login successful!");
          navigate("/buses");
        } else {
          alert("Incorrect password! Please try again.");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Login failed. Please try again.");
      });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email" className="input-label"><strong>Email Id</strong></label>
            <input
              type="email"
              id="email"
              placeholder="Enter Email"
              className="input-field"
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="input-label"><strong>Password</strong></label>
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              className="input-field"
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
          <div className="login-link">
          <p>Don't have an account? <Link to="/Signup" className="login-btn">Sign up here</Link>.</p>
        </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
