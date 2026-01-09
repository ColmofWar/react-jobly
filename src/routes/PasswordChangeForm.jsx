import React, { useState, useContext } from "react";
import UserContext from "../UserContext";
import JoblyApi from "../api";

function PasswordChangeForm() {
  const { currentUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    setError(null);
    setMessage(null);
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }
    try {
      // Authenticate old password
      await JoblyApi.request("auth/token", {
        username: currentUser.username,
        password: formData.oldPassword
      }, "post");
      // Update password
      await JoblyApi.updateUser(currentUser.username, {
        password: formData.newPassword
      });
      setMessage("Password updated successfully!");
      setFormData({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (err) {
      if (err && err[0] && err[0].toLowerCase().includes("invalid username/password")) {
        setError("Incorrect current password.");
      } else {
        setError(err[0] || "Password update failed");
      }
    }
  }

  if (!currentUser) return <p>Loading...</p>;

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit} className="password-form">
        <input
          name="oldPassword"
          type="password"
          value={formData.oldPassword}
          onChange={handleChange}
          placeholder="Current Password"
          required
        />
        <input
          name="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="New Password"
          required
        />
        <input
          name="confirmNewPassword"
          type="password"
          value={formData.confirmNewPassword}
          onChange={handleChange}
          placeholder="Confirm New Password"
          required
        />
        <button type="submit">Change Password</button>
      </form>
      {message && (
        <div className="form-success" style={{
          background: '#2ecc40',
          color: '#fff',
          padding: '0.75rem 1.25rem',
          borderRadius: '8px',
          marginTop: '1rem',
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
          {message}
        </div>
      )}
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}

export default PasswordChangeForm;
