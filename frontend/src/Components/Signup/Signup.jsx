
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !gender || !mobile) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      setLoading(true);

      const result = await axios.post(
        "http://localhost:3000/signup",
        {
          name,
          email,
          password,
          gender,
          mobile,
        }
      );

      alert("Signup successful! Please log in.");
      navigate("/login");

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.error ||
        "Signup failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">

        <h2 className="signup-title">Signup</h2>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label className="input-label">Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email address</label>
            <input
              type="email"
              className="input-field"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Gender</label>
            <select
              className="input-field"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Mobile Number</label>
            <input
              type="tel"
              className="input-field"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="signup-btn"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

        </form>

        <div className="login-link">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="login-btn">
              Log in here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;
