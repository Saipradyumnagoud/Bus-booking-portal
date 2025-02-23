import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./PersonalInformation.css";
import { FaUserCircle } from "react-icons/fa"; // User icon

const PersonalInformation = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    gender: "",
    email: "",
    mobile: "",
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        const response = await axios.get(
          `http://localhost:3000/userDetails?email=${email}`
        );
        setUserDetails(response.data);
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(
        `http://localhost:3000/userDetails/${userDetails.email}`,
        userDetails
      );
      alert("Personal information updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update user details:", err);
      alert("Error updating details. Please try again.");
    }
  };

  const handleDeactivateAccount = () => {
    if (window.confirm("Are you sure you want to deactivate your account?")) {
      console.log("Account Deactivated (API call placeholder)");
      alert("Your account has been deactivated.");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete your account? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(
          `http://localhost:3000/userDetails/${userDetails.email}`
        );
        alert("Your account has been deleted.");
        localStorage.clear();
        navigate("/");
      } catch (err) {
        console.error("Failed to delete account:", err);
        alert("Error deleting account. Please try again.");
      }
    }
  };

  return (
    <div className="account-container">
      <div className="sidebar">
        <h3>Account</h3>
        <ul>
          <li>
            <Link to="/personalinformation">Personal Information</Link>
          </li>
          <li>
            <Link to="/changepassword">Change Password</Link>
          </li>
          <li>
            <Link to="/orders">Orders</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
          <li>
            <button
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      <div className="profile-content">
        <h1>Personal Information</h1>
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-message">Loading your details...</p>
          </div>
        ) : (
          <div className="profile-details">
            <div className="profile-icon">
              <FaUserCircle size={80} color="#007bff" />
            </div>
            <label>
              <strong>Name:</strong>
            </label>
            <input
              type="text"
              name="name"
              value={userDetails.name}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <label>
              <strong>Gender:</strong>
            </label>
            <div className="gender-options">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={userDetails.gender === "Male"}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={userDetails.gender === "Female"}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                Female
              </label>
            </div>

            <label>
              <strong>Email:</strong>
            </label>
            <input type="email" name="email" value={userDetails.email} disabled />

            <label>
              <strong>Mobile Number:</strong>
            </label>
            <input
              type="text"
              name="mobile"
              value={userDetails.mobile}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <div className="button-group">
              {isEditing ? (
                <button className="save-button" onClick={handleSaveChanges}>
                  Save Changes
                </button>
              ) : (
                <button className="edit-button" onClick={() => setIsEditing(true)}>
                  Edit
                </button>
              )}
              <button className="deactivate-button" onClick={handleDeactivateAccount}>
                Deactivate
              </button>
              <button className="delete-button" onClick={handleDeleteAccount}>
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInformation;
