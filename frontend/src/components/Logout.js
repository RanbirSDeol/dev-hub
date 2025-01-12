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
  };

  return (
    <button onClick={handleLogout} className={styles.logout}>
      <FontAwesomeIcon icon={faRightFromBracket} size="lg" />
    </button>
  );
};

export default Logout;
