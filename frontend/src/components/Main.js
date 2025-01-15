import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Topbar from "./Topbar";
import Home from "./Home";
import Projects from "./Projects";
import styles from "./styles/Main.module.css";

const Dashboard = () => {
  const [showStatus, setShowStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Initialize state with value from localStorage (if available) or default to "Home"
  const [activeView, setActiveView] = useState(() => {
    const savedView = localStorage.getItem("activeView");
    return savedView ? savedView : "Home";
  });

  // Function to toggle between views and store the selected view in localStorage
  const toggleView = (view) => {
    setActiveView(view);
    localStorage.setItem("activeView", view); // Save the selected view to localStorage
  };

  useEffect(() => {
    const checkSuccessMessage = () => {
      const successMessage = localStorage.getItem("successMessage");
      console.log("Checking for success message in localStorage");

      // If a success message is found in localStorage
      if (successMessage) {
        console.log("Found success message in localStorage");
        setStatusMessage(successMessage); // Set the success message

        // Show the topbar with success message
        setShowStatus(true);

        // Auto-hide the status message after 3 seconds
        setTimeout(() => {
          setShowStatus(false);
          localStorage.removeItem("successMessage"); // Remove successMessage from localStorage
        }, 3000);
      }
    };

    // Initial check on mount
    checkSuccessMessage();

    // Set an interval to periodically check for success message in localStorage
    const intervalId = setInterval(checkSuccessMessage, 1000); // Check every second

    // Listen for changes to localStorage from other tabs
    window.addEventListener("storage", checkSuccessMessage);

    // Cleanup the interval and event listener when the component unmounts
    return () => {
      clearInterval(intervalId); // Clear the interval
      window.removeEventListener("storage", checkSuccessMessage); // Cleanup event listener
    };
  }, []);

  // Dashboard Structure
  return (
    <>
      {showStatus && (
        <div className={styles.statusTopbar}>
          <p>{statusMessage}</p>
        </div>
      )}
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
    </>
  );
};

export default Dashboard;
