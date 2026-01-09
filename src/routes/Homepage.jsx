import React, { useContext } from "react";
import UserContext from "../UserContext";

function Homepage() {
  const { currentUser } = useContext(UserContext);
  return (
    <div>
      <h1>Welcome to Jobly!</h1>
      {currentUser ? (
        <p>Welcome back, {currentUser.firstName || currentUser.username}!</p>
      ) : (
        <>
          <p>Your job search starts here. Please log in or sign up to get started.</p>
          <div style={{marginTop: '1.5rem'}}>
            <a href="/login" className="btn btn-primary" style={{marginRight: '1rem'}}>Log In</a>
            <a href="/signup" className="btn btn-secondary">Sign Up</a>
          </div>
        </>
      )}
    </div>
  );
}

export default Homepage;
