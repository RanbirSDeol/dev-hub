import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/Navbar.module.css'; // CSS module for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.profile}>
        <img 
          src="https://www.pngkey.com/png/full/73-730477_first-name-profile-image-placeholder-png.png"
          alt="People Chasing Goal"
          width="150"
          height="150"
        />
        <p>John Doe</p>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <Link to="/dashboard" className={styles.link}>
            <FontAwesomeIcon icon={faHouse} size="m" style={{ marginRight: '15px' }} />
            DASHBOARD
          </Link>
        </li>
        <li>
          <Link to="/dashboard" className={styles.link}>Dashboard</Link>
        </li>
        <li>
          <Link to="/dashboard" className={styles.link}>Dashboard</Link>
        </li>
      </ul>
    </nav>

    /*
    <nav className={styles.navbar}>
      <h1 className={styles.logo}>My App</h1>
      <ul className={styles.navLinks}>
        <li>
          <Link to="/dashboard" className={styles.link}>Dashboard</Link>
        </li>
        <li>
          <button className={styles.logoutButton}>Logout</button>
        </li>
      </ul>
    </nav>*/
  );
};

export default Navbar;
