import React, { useState } from "react";
import axios from "axios";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const email = localStorage.getItem("userEmail");
      const response = await axios.post("http://localhost:3000/changePassword", {
        email,
        oldPassword,
        newPassword,
      });
      setMessage(response.data.message);
    } catch (err) {
      setMessage("Error updating password.");
    }
  };

  return (
    <div className="change-password">
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
        <button type="submit">Update Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ChangePassword;
