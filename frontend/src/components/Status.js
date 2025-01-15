// StatusBar.js
import React, { useState, useEffect } from "react";
import styles from "./styles/StatusBar.module.css";

const StatusBar = () => {
  const [showStatus, setShowStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const checkSuccessMessage = () => {
      const successMessage = localStorage.getItem("successMessage");
      console.log("Checking for success message in localStorage");

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

  if (!showStatus) return null;

  return (
    <div className={styles.statusTopbar}>
      <p>{statusMessage}</p>
    </div>
  );
};

export default StatusBar;
