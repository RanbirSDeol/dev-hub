import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import styles from "./styles/Navbar.module.css"; // CSS module for styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faDiagramProject } from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ onToggleView }) => {
  // Destructure onToggleView from props
  const location = useLocation(); // Get the current location
  const navigate = useNavigate(); // Hook for navigation
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    setActiveLink(location.pathname); // Update the active link whenever the route changes
  }, [location]);

  // List of links and their properties
  const navLinks = [
    { to: "/home", label: "Home", icon: faHouse },
    { to: "/projects", label: "Projects", icon: faDiagramProject },
  ];

  const handleNavigation = (path) => {
    if (onToggleView) {
      onToggleView(path === "/home" ? "Home" : "Projects");
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}></div>
      <ul className={styles.navLinks}>
        <li className={styles.linkContainer}>
          {navLinks.map((link, index) => (
            <Link
              key={index}
              onClick={() => handleNavigation(link.to)}
              className={`${styles.link} ${
                activeLink === link.to ? styles.active : ""
              }`}
            >
              <FontAwesomeIcon
                icon={link.icon}
                size="s"
                style={{ paddingRight: "8px" }}
              />
              {link.label}
            </Link>
          ))}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
