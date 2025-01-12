import React from "react";
import Navbar from "../components/Navbar"; // Make sure the path is correct
import Topbar from "./Topbar";
import styles from "./styles/Dashboard.module.css"; // Optional styling for Dashboard

const Dashboard = () => {
  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <Topbar />
      </div>
      <div className={styles.dashboardContainer}>
        <div>navbar</div>
        <div className={styles.dashboardContent}>
          <p>Dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
