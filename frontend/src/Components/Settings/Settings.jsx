import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Settings.css";

const Settings = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  // Function to toggle dark mode
  const handleToggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode", !darkMode);
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
        <h1>Settings</h1>
        <div className="settings-section">
          <h2>Account Settings</h2>
          <p>Manage your account preferences here.</p>
          <button onClick={handleToggleDarkMode}>
            {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>
        </div>

        <div className="settings-section">
          <h2>Privacy Settings</h2>
          <p>Manage privacy and security settings.</p>
          <button>Enable Two-Factor Authentication</button>
        </div>

        <div className="settings-section">
          <h2>Notification Settings</h2>
          <p>Set your notification preferences.</p>
          <button>Enable Email Notifications</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
