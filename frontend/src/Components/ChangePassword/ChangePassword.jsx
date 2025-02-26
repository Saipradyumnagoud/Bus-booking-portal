import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./ChangePassword.css";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login"); // Redirect to login page if not logged in
    }
  }, [navigate]);
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
  
    if (newPassword.length < 6) {
      setMessage("New password should be at least 6 characters long.");
      setLoading(false);
      return;
    }
  
    try {
      const email = localStorage.getItem("userEmail");
      const response = await axios.post("http://localhost:3000/changePassword", {
        email,
        oldPassword,
        newPassword,
      });
  
      if (response.data.success) {
        alert("Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
        setMessage("");
      } else {
        setMessage(response.data.message || "Error updating password.");
      }
    } catch (err) {
      setMessage("Error updating password.");
    } finally {
      setLoading(false);
    }
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
          <li><button onClick={() => { localStorage.clear(); navigate("/"); }}>Logout</button></li>
        </ul>
      </div>

      <div className="main-content">
        <h1>Change Password</h1>
        <form onSubmit={handlePasswordChange}>
          <label>
            Old Password:
            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
          </label>
          <label>
            New Password:
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ChangePassword;
