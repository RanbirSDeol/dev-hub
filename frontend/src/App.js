// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

// A simple function to check if the user is logged in (i.e., if the token exists in localStorage)
const isAuthenticated = () => {
  return localStorage.getItem('authToken') !== null;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />
        
        {/* Private route: Check if user is authenticated before granting access to /home */}
        <Route 
          path="/home" 
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
