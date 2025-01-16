import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faDiagramProject } from "@fortawesome/free-solid-svg-icons";
import styles from "./styles/Navbar.module.css"; // CSS module for styling

const Navbar = ({ onToggleView }) => {
  // Initialize state with value from localStorage (if available) or default to "Home"
  const [activeLink, setActiveLink] = useState(() => {
    const savedView = localStorage.getItem("activeView");
    return savedView ? savedView : "Home";
  });

  // List of links and their properties
  const navLinks = [
    { to: "/goals", label: "Goals", icon: faHouse },
    { to: "/projects", label: "Projects", icon: faDiagramProject },
  ];

  // Function to handle navigation and set active link
  const handleNavigation = (view) => {
    setActiveLink(view); // Update the active link based on the clicked view
    if (onToggleView) {
      onToggleView(view); // Pass the active view (Home or Projects) as a param
    }
    localStorage.setItem("activeView", view); // Save the selected view to localStorage
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}></div>
      <ul className={styles.navLinks}>
        {navLinks.map((link, index) => (
          <Link
            key={index}
            className={`${styles.link} ${
              activeLink === link.label ? styles.active : ""
            }`}
            onClick={() => handleNavigation(link.label)} // Pass the view name (Home or Projects)
          >
            <FontAwesomeIcon
              icon={link.icon}
              size="s"
              style={{ paddingRight: "8px" }}
            />
            {link.label}
          </Link>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
