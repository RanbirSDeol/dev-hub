// src/Login.js
import React, { useState } from 'react';
import styles from './Login.module.css';  // Import the CSS Module for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, you will handle the form submission, e.g., call an API
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.leftContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h1 className={styles.title}>
            Welcome back
          </h1>
          <p className={styles.subtitle}>
            Please enter your details
          </p> 
          <div className={styles.inputContainer}>
            <label htmlFor="email" className={styles.label}>Email address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.inputContainer}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <div className={styles.passwordWrapper}>
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className={styles.toggleButton}
            >
              {isPasswordVisible ? (
                <FontAwesomeIcon icon={faEyeSlash}/>
              ) : (
                <FontAwesomeIcon icon={faEye} />
              )}
            </button>
          </div>
          </div>
        
          <button type="submit" className={styles.sign_in_button}>Login</button>
          <p className={styles.subtitle}>
              Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </form>
      </div>
      <div className={styles.rightContainer}>
        <img src="https://cdni.iconscout.com/illustration/premium/thumb/workers-rotating-cogwheels-teamwork-process-illustration-download-in-svg-png-gif-file-formats--business-achievement-strategies-entrepreneurial-goal-realization-objectives-driven-ventures-triumphs-and-team-work-building-part-2-pack-illustrations-8354754.png" alt="People Chasing Goal" width="600" height="600"></img>
      </div>
    </div>
  );
};

export default Login;
 