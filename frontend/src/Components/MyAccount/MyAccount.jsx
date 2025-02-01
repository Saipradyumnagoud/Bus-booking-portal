import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyAccount.css";

const MyAccount = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        try {
          const email = localStorage.getItem("userEmail");
          const response = await axios.get(`http://localhost:3000/userDetails?email=${email}`);
          setUserDetails(response.data);
        } catch (err) {
          console.error("Failed to fetch user details:", err);
        }
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setUserDetails(null);
    navigate("/");
  };

  return (
    <div className="account-container">
      <div className="sidebar">
        <h3>Account</h3>
        <ul>
          <li><Link to="/personalinformation">Personal Information</Link></li>
          <li><Link to="/changepassword">Change Password</Link></li>
          <li><Link to="/orders">Orders</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
      </div>

      <div className="main-content">
        {isLoggedIn ? (
          userDetails ? (
            <>
              <h1>My Account</h1>
              <div className="account-details">
                <p><strong>Name:</strong> {userDetails.name}</p>
                <p><strong>Email:</strong> {userDetails.email}</p>
              </div>
            </>
          ) : (
            <p>Wait while we are Loading your account details...</p>
          )
        ) : (
          <div className="login-prompt">
            <h2>You are not logged in.</h2>
            <p>
              <Link to="/login" className="login-btn">Login</Link> or{" "}
              <Link to="/signup" className="signup-btn">Sign Up</Link> to access your account.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccount;
