// src/App.js
import React from "react";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Login from "./components/Login";
import Main from "./components/Main";
import Signup from "./components/Signup";

// A simple function to check if the user is logged in (i.e., if the token exists in localStorage)
const isAuthenticated = () => {
  return localStorage.getItem("authToken") !== null;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={isAuthenticated() ? "/home" : "/login"} />}
        />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />

        {/* Private routes: Check if user is authenticated before granting access to /home */}
        <Route
          path="/home"
          element={isAuthenticated() ? <Main /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
