import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Settings.css";

const Settings = () => {
  const navigate = useNavigate();

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
        <p>Settings functionality can be implemented as needed.</p>
      </div>
    </div>
  );
};

export default Settings;
