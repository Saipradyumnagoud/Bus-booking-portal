import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PersonalInformation.css";
import { FaUserCircle } from "react-icons/fa"; // User icon

const PersonalInformation = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        const response = await axios.get(`http://localhost:3000/userDetails?email=${email}`);
        setUserDetails(response.data);
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div className="personal-info-container">
      <div className="info-card">
        <h1>Personal Information</h1>
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading">Loading your details...</p>
          </div>
        ) : userDetails ? (
          <div className="info-details">
            <div className="profile-icon">
              <FaUserCircle size={60} color="#007bff" />
            </div>
            <p><strong>Name:</strong> {userDetails.name}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            {/* Add additional user details if necessary */}
          </div>
        ) : (
          <p className="error-message">Failed to load user details. Please try again.</p>
        )}
      </div>
    </div>
  );
};

export default PersonalInformation;
