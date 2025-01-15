// Dashboard Component

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Topbar from "./Topbar";
import styles from "./styles/Dashboard.module.css";

const Dashboard = () => {
  // Dashboard Structure
  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <Topbar />
        <Navbar />
      </div>
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardTopbar}>
          <div className={styles.filters}></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
