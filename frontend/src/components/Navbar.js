import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/Navbar.module.css'; // CSS module for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHouse, faPlus, faBullseye, faBell,
  faCalendar, faGear, faMoon
} from '@fortawesome/free-solid-svg-icons';

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
        <p className={styles.name}>John Doe</p>
      </div>
      <ul className={styles.navLinks}>
        <li className={styles.linkContainer}>
          <Link to="/dashboard" className={`${styles.link} ${styles.active}`}>
            <FontAwesomeIcon icon={faHouse} size="m" style={{ marginRight: '15px' }} />
            DASHBOARD
          </Link>
          <Link to="/dashboard" className={`${styles.link}`}>
            <FontAwesomeIcon icon={faPlus} size="m" style={{ marginRight: '15px' }} />
            Create Goal
          </Link>
          <Link to="/dashboard" className={`${styles.link}`}>
            <FontAwesomeIcon icon={faBullseye} size="m" style={{ marginRight: '15px' }} />
            View Goal
          </Link>
          <Link to="/dashboard" className={`${styles.link}`}>
            <FontAwesomeIcon icon={faBell} size="m" style={{ marginRight: '15px' }} />
            Notifications
          </Link>
          <Link to="/dashboard" className={`${styles.link}`}>
            <FontAwesomeIcon icon={faCalendar} size="m" style={{ marginRight: '15px' }} />
            Calendar
          </Link>
          <Link to="/dashboard" className={`${styles.link}`}>
            <FontAwesomeIcon icon={faGear} size="m" style={{ marginRight: '15px' }} />
            Settings
          </Link>
          <Link to="/dashboard" className={`${styles.link}`}>
            <FontAwesomeIcon icon={faMoon} size="m" style={{ marginRight: '15px' }} />
            Dark Mode
          </Link>
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
