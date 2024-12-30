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
          const response = await axios.get("http://localhost:3000/userdetails");
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
    setIsLoggedIn(false);
    setUserDetails(null);
    navigate("/");
  };

  return (
    <div className="my-account">
      {isLoggedIn ? (
        userDetails ? (
          <>
            <h1>My Account</h1>
            <div className="account-details">
              <p><strong>Name:</strong> {userDetails.name}</p>
              <p><strong>Email:</strong> {userDetails.email}</p>
              <p><strong>Phone:</strong> {userDetails.phone || "N/A"}</p>
              <p><strong>Booking History:</strong></p>
              <ul>
                {userDetails.bookings && userDetails.bookings.length > 0 ? (
                  userDetails.bookings.map((booking, index) => (
                    <li key={index}>
                      {`Booking #${booking.id} - ${booking.details}`}
                    </li>
                  ))
                ) : (
                  <li>No bookings found.</li>
                )}
              </ul>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </>
        ) : (
          <p>Loading account details...</p>
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
  );
};

export default MyAccount;
