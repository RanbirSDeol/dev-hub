// Dashboard Component

import React, { useState } from "react";
import Navbar from "./Navbar";
import Topbar from "./Topbar";
import Home from "./Home";
import Projects from "./Projects";
import styles from "./styles/Dashboard.module.css";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("Home"); // State to track the active component

  // Function to toggle between views
  const toggleView = (view) => {
    setActiveView(view);
  };

  // Dashboard Structure
  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <Topbar />
        <Navbar onToggleView={toggleView} />
      </div>
      <div className={styles.content}>
        {activeView === "Home" && <Home />}
        {activeView === "Projects" && <Projects />}
      </div>
    </div>
  );
};

export default Dashboard;
