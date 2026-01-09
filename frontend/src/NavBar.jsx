import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import UserContext from "./UserContext";
import "./NavBar.css";

function NavBar() {
  const { currentUser, setToken, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  function handleLogout() {
    setToken(null);
    setCurrentUser(null);
    navigate("/");
  }

  return (
    <nav className="NavBar">
      <NavLink to="/" className="NavBar-link">Home</NavLink>
      {currentUser && (
        <>
          <NavLink to="/companies" className="NavBar-link">Companies</NavLink>
          <NavLink to="/jobs" className="NavBar-link">Jobs</NavLink>
          <NavLink to="/profile" className="NavBar-link">Profile</NavLink>
          <span className="NavBar-link" style={{cursor:'pointer'}} onClick={handleLogout}>
            Log out {currentUser.username}
          </span>
        </>
      )}
      {!currentUser && (
        <>
          <NavLink to="/login" className="NavBar-link">Login</NavLink>
          <NavLink to="/signup" className="NavBar-link">Signup</NavLink>
        </>
      )}
    </nav>
  );
}

export default NavBar;
