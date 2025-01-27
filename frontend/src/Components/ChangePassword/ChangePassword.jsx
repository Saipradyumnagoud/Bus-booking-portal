import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

      setMessage(response.data.message);

      if (response.data.success) {
        // Optionally redirect after password change
        navigate("/account"); // Redirect to account page or logout
      }
    } catch (err) {
      setMessage("Error updating password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password">
      <h1>Change Password</h1>
      <form onSubmit={handlePasswordChange}>
        <label>
          Old Password:
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </label>
        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ChangePassword;
