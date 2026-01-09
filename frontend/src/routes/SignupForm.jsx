import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import JoblyApi from "../api";
import UserContext from "../UserContext";

function SignupForm() {
  const { setToken } = useContext(UserContext);
  const [formData, setFormData] = useState({ username: "", password: "", firstName: "", lastName: "", email: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    setError(null);
    try {
      const token = await JoblyApi.request("auth/register", {
        username: formData.username,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      }, "post");
      setToken(token.token);
      navigate("/");
    } catch (err) {
      setError(err[0] || "Signup failed");
    }
  }

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          autoComplete="username"
          required
        />
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          autoComplete="new-password"
          required
        />
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          autoComplete="email"
          required
        />
        <div className="center-btn">
          <button type="submit">Sign Up</button>
        </div>
      </form>
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}

export default SignupForm;
