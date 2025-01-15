import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/Logout.module.css"; // CSS module for styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
    localStorage.setItem("successMessage", "Logged Out");
    setTimeout(() => {
      localStorage.removeItem("successMessage");
    }, 1000);
  };

  return (
    <button onClick={handleLogout} className={styles.logout}>
      <FontAwesomeIcon icon={faRightFromBracket} size="lg" />
    </button>
  );
};

export default Logout;
