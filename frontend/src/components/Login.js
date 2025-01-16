import React, { useState } from "react";
import styles from "./styles/Login.module.css";
import Status from "./Status";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCrosshairs,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import targetIcon from "../images/target.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData.error);
        setError(errorData.error || "An error occurred.");
        return;
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("authToken", data.token);
        setTimeout(() => {
          localStorage.setItem("successMessage", "Logged In");
          setTimeout(() => {
            localStorage.removeItem("successMessage");
          }, 50);
          navigate("/home");
          navigate(0);
        }, 1000);
      } else {
        setError("No token received.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <div>
      <Status /> {/* Render the Status component first */}
      <div className={styles.mainContainer}>
        <div className={styles.leftContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h1 className={styles.displayName}>
              <img
                src={targetIcon}
                alt="Goal Icon"
                style={{ width: "80px", height: "80px" }}
              />
              DevHub
            </h1>
            <h1 className={styles.title}>Sign in</h1>

            {/* Display error message */}
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.inputContainer}>
              <label htmlFor="email" className={styles.label}></label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="Enter your email"
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
                  placeholder="Enter your password"
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
              Login
            </button>
            <p className={styles.subtitle}>
              Don't have an account?{" "}
              <a className={styles.link} href="/sign-up">
                Create one!
              </a>
            </p>
          </form>
        </div>
      </div>
    </div> // Wrap everything inside a parent div
  );
};

export default Login;
