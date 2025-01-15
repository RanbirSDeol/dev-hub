import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logout from "./Logout";
import styles from "./styles/Topbar.module.css"; // CSS module for styling
import targetIcon from "../images/target.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTie,
  faCircle,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";

const Topbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    const fetchUser = async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to fetch user data.");
      }
    };

    if (token) {
      fetchUser();
    }
  }, []); // Run only once on mount

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
  );
};

export default Topbar;
