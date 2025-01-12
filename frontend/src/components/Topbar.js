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
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <img
          src={targetIcon}
          alt="Goal Icon"
          style={{ width: "40px", height: "40px" }}
        />
        <div>goal-tracker</div>
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
            <p>John Doe</p>
            <p>admin@admin.com</p>
          </div>
        </div>
      </ul>
    </div>
  );
};

export default Topbar;
