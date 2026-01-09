import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import JoblyApi from "../api";
import UserContext from "../UserContext";

function LoginForm() {
  const { setToken } = useContext(UserContext);
  const [formData, setFormData] = useState({ username: "", password: "" });
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
      const token = await JoblyApi.request("auth/token", formData, "post");
      setToken(token.token);
      navigate("/");
    } catch (err) {
      setError(err[0] || "Login failed");
    }
  }

  return (
    <div>
      <h2>Login</h2>
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
          autoComplete="current-password"
          required
        />
        <div className="center-btn">
          <button type="submit">Log In</button>
        </div>
      </form>
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}

export default LoginForm;
