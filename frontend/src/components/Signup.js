import React, { useState } from "react";
import styles from "./styles/Signup.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCrosshairs,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; // Importing useNavigate for navigation after successful login

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState(""); // Error state to hold error message
  const navigate = useNavigate(); // Hook to navigate after login

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setError("");

    // Validation for empty fields
    if (!name || !email || !password) {
      setError("Email, password, and a name are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      // Check if the response is successful
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }

      const data = await response.json();

      // Log the response data to see if the token is returned
      console.log("Server Response:", data);

      // Check if token is returned
      if (data) {
        // Navigate to the home/dashboard page
        navigate("/login");
      } else {
        setError("Account could not be created.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.leftContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h1 className={styles.displayName}>
            <FontAwesomeIcon
              icon={faCrosshairs}
              size="xl"
              style={{ marginRight: "5px", color: "#4D4847" }}
            />
            GoalTracker
          </h1>
          <h1 className={styles.title}>Sign Up</h1>

          {/* Display error message */}
          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.inputContainer}>
            <label htmlFor="name" className={styles.label}></label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              placeholder="Enter your name"
            />
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="email" className={styles.label}></label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="Enter your email" // Optional: add a placeholder
            />
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="password" className={styles.label}></label>
            <div className={styles.passwordWrapper}>
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="Enter your password" // Optional: add a placeholder
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className={styles.toggleButton}
              >
                {isPasswordVisible ? (
                  <FontAwesomeIcon icon={faEyeSlash} />
                ) : (
                  <FontAwesomeIcon icon={faEye} />
                )}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.sign_in_button}>
            Create
          </button>
          <p className={styles.subtitle}>
            Already have an account?{" "}
            <a className={styles.link} href="/login">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
