// src/Login.js
import React, { useState } from 'react';
import styles from './Login.module.css';  // Import the CSS Module for styling

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, you will handle the form submission, e.g., call an API
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>Login</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputContainer}>
          <label htmlFor="username" className={styles.label}>Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>Login</button>
      </form>
    </div>
  );
};

export default Login;
