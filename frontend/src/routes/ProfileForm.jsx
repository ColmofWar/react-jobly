import React, { useContext, useState } from "react";
import PasswordChangeForm from "./PasswordChangeForm";
import UserContext from "../UserContext";
import JoblyApi from "../api";

function ProfileForm() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    email: currentUser?.email || "",
    password: ""
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    setError(null);
    setMessage(null);
    try {
      // Authenticate password before allowing update
      await JoblyApi.request("auth/token", {
        username: currentUser.username,
        password: formData.password
      }, "post");

      // If password is correct, proceed with update
      const updated = await JoblyApi.updateUser(currentUser.username, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });
      setCurrentUser(updated);
      setMessage("Profile updated!");
      setFormData(f => ({ ...f, password: "" }));
    } catch (err) {
      if (err && err[0] && err[0].toLowerCase().includes("invalid username/password")) {
        setError("Incorrect password. Please try again.");
      } else {
        setError(err[0] || "Update failed");
      }
    }
  }

  if (!currentUser) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit Profile</h2>
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setShowPasswordForm(f => !f)}
        >
          {showPasswordForm ? "Hide Password Change" : "Change Password"}
        </button>
      </div>
      {showPasswordForm && (
        <div style={{ marginBottom: '2rem' }}>
          <PasswordChangeForm />
        </div>
      )}
      <form onSubmit={handleSubmit} className="profile-form">
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <label htmlFor="password">Confirm Password to Save</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Confirm password to save"
          required
        />
        <div className="form-center-btn">
          <button type="submit">Save Changes</button>
        </div>
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

export default ProfileForm;
