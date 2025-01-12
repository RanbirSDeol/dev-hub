import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation(); // Get the current location from React Router
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    setActiveLink(location.pathname); // Update the active link whenever the route changes
  }, [location]);

  // List of links and their properties
  const navLinks = [
    { to: "/home", label: "Home", icon: faHouse },
    { to: "/create", label: "Create", icon: faPlus },
    { to: "/goals", label: "Goals", icon: faBullseye },
    { to: "/statistics", label: "Statistics", icon: faChartSimple },
    { to: "/settings", label: "Settings", icon: faGear },
    { to: "/login", label: "Logout", icon: faRightFromBracket, logout: true }, // Adding special case for logout
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}></div>
      <ul className={styles.navLinks}>
        <li className={styles.linkContainer}>
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className={`${styles.link} ${
                activeLink === link.to ? styles.active : ""
              }`}
            >
              <FontAwesomeIcon icon={link.icon} size="xl" />
              {link.label}
              {link.logout && <Logout />}{" "}
              {/* Render logout component for the Logout link */}
            </Link>
          ))}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
