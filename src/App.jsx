// package imports
import { useState, useEffect } from 'react'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import UserContext from "./UserContext";
import JoblyApi from "./api";

// css import
import "./App.css";

// conmponents imports
import Homepage from "./routes/Homepage";
import CompanyList from "./routes/CompanyList";
import CompanyDetail from "./routes/CompanyDetail";
import JobList from "./routes/JobList";
import LoginForm from "./routes/LoginForm";
import SignupForm from "./routes/SignupForm";
import ProfileForm from "./routes/ProfileForm";
import PasswordChangeForm from "./routes/PasswordChangeForm";
import NavBar from "./NavBar";
import PrivateRoute from "./PrivateRoute";

// custom hooks import
import useLocalStorage from "./hooks/useLocalStorage";


function App() {
  const [token, setToken] = useLocalStorage("jobly-token", null);
  const [currentUser, setCurrentUser] = useState(null);
  const [infoLoaded, setInfoLoaded] = useState(false);

  useEffect(() => {
    async function getUser() {
      setInfoLoaded(false);
      JoblyApi.token = token;
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const user = await JoblyApi.getUser(payload.username);
          setCurrentUser(user);
        } catch (err) {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setInfoLoaded(true);
    }
    getUser();
  }, [token]);

  if (!infoLoaded) return <div className="App"><div style={{textAlign:'center',marginTop:'4rem'}}>Loading...</div></div>;

  return (
    <div className="App">
      <BrowserRouter>
        <UserContext.Provider value={{ currentUser, setCurrentUser, token, setToken }}>
          <NavBar />
          <main>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/companies" element={
                <PrivateRoute>
                  <CompanyList />
                </PrivateRoute>
              } />
              <Route path="/companies/:handle" element={
                <PrivateRoute>
                  <CompanyDetail />
                </PrivateRoute>
              } />
              <Route path="/jobs" element={
                <PrivateRoute>
                  <JobList />
                </PrivateRoute>
              } />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/profile" element={<PrivateRoute><ProfileForm /></PrivateRoute>} />
              <Route path="/change-password" element={<PrivateRoute><PasswordChangeForm /></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App
