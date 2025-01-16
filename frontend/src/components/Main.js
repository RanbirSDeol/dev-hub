import React, { useState, useEffect } from "react";
import Status from "./Status";
import Navbar from "./Navbar";
import Topbar from "./Topbar";
import Goals from "./Goals";
import Projects from "./Projects";
import styles from "./styles/Main.module.css";

const Dashboard = () => {
  // Initialize state with value from localStorage (if available) or default to "Home"
  const [activeView, setActiveView] = useState(() => {
    const savedView = localStorage.getItem("activeView");
    return savedView ? savedView : "Goals";
  });

  // Function to toggle between views and store the selected view in localStorage
  const toggleView = (view) => {
    setActiveView(view);
    localStorage.setItem("activeView", view); // Save the selected view to localStorage
  };

  // Dashboard Structure
  return (
    <>
      <Status />
      <div className={styles.container}>
        <div className={styles.navbar}>
          <Topbar />
          <Navbar onToggleView={toggleView} />
        </div>
        <div className={styles.content}>
          {activeView === "Goals" && <Goals />}
          {activeView === "Projects" && <Projects />}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
