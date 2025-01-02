import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import styles from "./styles/Navbar.module.css"; // CSS module for styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faCrosshairs,
  faPlus,
  faBullseye,
  faChartSimple,
  faGear,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("/home"); // Default active link

  const handleLinkClick = (path) => {
    setActiveLink(path); // Update active link state
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <FontAwesomeIcon
          icon={faCrosshairs}
          size="xl"
          style={{ marginLeft: "25px", color: "#8BAAAD" }}
        />
      </div>
      <ul className={styles.navLinks}>
        <li className={styles.linkContainer}>
          <Link
            to="/home"
            className={`${styles.link} ${
              activeLink === "/home" ? styles.active : ""
            }`}
            onClick={() => handleLinkClick("/home")}
          >
            <FontAwesomeIcon icon={faHouse} size="xl" />
            Home
          </Link>

          <Link
            to="/create"
            className={`${styles.link} ${
              activeLink === "/create" ? styles.active : ""
            }`}
            onClick={() => handleLinkClick("/create")}
          >
            <FontAwesomeIcon icon={faPlus} size="xl" />
            Create
          </Link>

          <Link
            to="/goals"
            className={`${styles.link} ${
              activeLink === "/goals" ? styles.active : ""
            }`}
            onClick={() => handleLinkClick("/goals")}
          >
            <FontAwesomeIcon icon={faBullseye} size="xl" />
            Goals
          </Link>

          <Link
            to="/goals"
            className={`${styles.link} ${
              activeLink === "/goals" ? styles.active : ""
            }`}
            onClick={() => handleLinkClick("/goals")}
          >
            <FontAwesomeIcon icon={faChartSimple} size="xl" />
            Statistics
          </Link>

          <Link
            to="/goals"
            className={`${styles.link} ${
              activeLink === "/goals" ? styles.active : ""
            }`}
            onClick={() => handleLinkClick("/goals")}
          >
            <FontAwesomeIcon icon={faGear} size="xl" />
            Settings
          </Link>

          <Link
            to="/login"
            className={`${styles.link} ${
              activeLink === "/login" ? styles.active : ""
            }`}
            onClick={() => handleLinkClick("/login")}
          >
            <FontAwesomeIcon icon={faRightFromBracket} size="xl" />
            Logout
            <Logout />
          </Link>
        </li>
      </ul>
    </nav>

    /*
    <nav className={styles.navbar}>
    <Link to="/dashboard" className={`${styles.link} ${styles.active}`}>
            <FontAwesomeIcon
              icon={faHouse}
              size="m"
              style={{ marginRight: "15px" }}
            />
            DASHBOARD
          </Link>
      <h1 className={styles.logo}>My App</h1>
      <ul className={styles.navLinks}>
        <li>
          <Link to="/dashboard" className={styles.link}>Dashboard</Link>
        </li>
        <li>
          <button className={styles.logoutButton}>Logout</button>
        </li>
      </ul>
    </nav>*/
  );
};

export default Navbar;
