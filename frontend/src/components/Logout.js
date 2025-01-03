import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} style={logoutButtonStyle}>
      Log Out
    </button>
  );
};

const logoutButtonStyle = {
  backgroundColor: "transparent",
  position: "absolute",
  width: "2%",
  color: "transparent",
};

export default Logout;
