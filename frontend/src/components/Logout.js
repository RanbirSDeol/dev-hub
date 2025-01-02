import React from 'react';
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  }

  return (
    <button onClick={handleLogout} style={logoutButtonStyle}>
      Log Out
    </button>
  );
};

const logoutButtonStyle = {
  backgroundColor: "#e74c3c",
  color: "white",
  border: "none",
  padding: "10px 15px",
  cursor: "pointer",
  borderRadius: "5px",
  fontSize: "16px",
};

export default Logout;