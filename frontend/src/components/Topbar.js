import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logout from "./Logout";
import styles from "./styles/Topbar.module.css"; // CSS module for styling
import targetIcon from "../images/target.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie, faCircle, faBars } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";

const Topbar = () => {
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false); // New state for mobile detection
  const [dropdownOpen, setDropdownOpen] = useState(false); // New state to manage dropdown visibility

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    const fetchUser = async () => {
      const response = await fetch("http://localhost:5000/get-user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user); // Set the user data from the response
      } else {
        alert("Error: " + data.error);
      }
    };

    if (token) {
      fetchUser();
    }

    // Check screen size on mount and on window resize
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setIsMobile(true); // If screen size is mobile
      } else {
        setIsMobile(false); // Otherwise, not mobile
      }
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize); // Listen for resize events

    return () => window.removeEventListener("resize", handleResize); // Cleanup on unmount
  }, []); // Run only once on mount

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <img
          src={targetIcon}
          alt="Goal Icon"
          style={{ width: "50px", height: "50px" }}
        />
        <div>DevHub</div>
      </div>

      {/* Mobile and Desktop layout switch */}
      {isMobile ? (
        <div className={styles.mobileNav}>
          <button
            className={styles.mobileButton}
            onClick={toggleDropdown} // Toggle the dropdown when clicked
          >
            <FontAwesomeIcon icon={faBars} />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className={styles.dropdown}>
              <ul className={styles.navigation}>
                <a
                  href="https://github.com/RanbirSDeol/goal-tracker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.sourceLink}
                >
                  Source Code
                </a>

                <button className={styles.notification}>
                  <FontAwesomeIcon icon={faBell} size="lg" />
                </button>
                <Logout />
                <div className={styles.profile}>
                  <div className={styles.circleContainer}>
                    <FontAwesomeIcon
                      icon={faCircle}
                      size="2xl"
                      className={styles.circle}
                    />
                    <FontAwesomeIcon
                      icon={faUserTie}
                      size="lg"
                      className={styles.userIcon}
                    />
                  </div>
                  <div className={styles.name}>
                    {user ? (
                      <>
                        <p>{user.name}</p>
                        <p>{user.email}</p>
                      </>
                    ) : (
                      <p>Loading...</p>
                    )}
                  </div>
                </div>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <ul className={styles.navigation}>
          <a
            href="https://github.com/RanbirSDeol/goal-tracker"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.sourceLink}
          >
            Source Code
          </a>

          <button className={styles.notification}>
            <FontAwesomeIcon icon={faBell} size="lg" />
          </button>
          <Logout />
          <div className={styles.profile}>
            <div className={styles.circleContainer}>
              <FontAwesomeIcon
                icon={faCircle}
                size="2xl"
                className={styles.circle}
              />
              <FontAwesomeIcon
                icon={faUserTie}
                size="lg"
                className={styles.userIcon}
              />
            </div>
            <div className={styles.name}>
              {user ? (
                <>
                  <p>{user.name}</p>
                  <p>{user.email}</p>
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </ul>
      )}
    </div>
  );
};

export default Topbar;
