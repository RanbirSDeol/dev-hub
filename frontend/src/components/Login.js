import React, { useState } from 'react';
import styles from './styles/Login.module.css';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';  // Importing useNavigate for navigation after successful login

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState('');  // Error state to hold error message
  const navigate = useNavigate();  // Hook to navigate after login

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setError('');

    // Validation for empty fields
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if the response is successful
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }

      const data = await response.json();

      // Log the response data to see if the token is returned
      console.log('Server Response:', data);

      // Check if token is returned
      if (data.token) {
        // Store the token in localStorage
        localStorage.setItem('authToken', data.token);
        console.log('Token saved to localStorage');
        
        // Navigate to the home/dashboard page
        navigate('/home');
      } else {
        setError('No token received.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error(error);
    }
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

          {/* Display error message */}
          {error && <div className={styles.errorMessage}>{error}</div>}

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
                  <FontAwesomeIcon icon={faEyeSlash} />
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
        <img
          src="https://cdni.iconscout.com/illustration/premium/thumb/workers-rotating-cogwheels-teamwork-process-illustration-download-in-svg-png-gif-file-formats--business-achievement-strategies-entrepreneurial-goal-realization-objectives-driven-ventures-triumphs-and-team-work-building-part-2-pack-illustrations-8354754.png"
          alt="People Chasing Goal"
          width="600"
          height="600"
        />
      </div>
    </div>
  );
};

export default Login;
