import React from "react";
import Navbar from "../components/Navbar"; // Make sure the path is correct
import Topbar from "./Topbar";
import styles from "./styles/Dashboard.module.css"; // Optional styling for Dashboard

const Dashboard = () => {
  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <Topbar />
        <Navbar />
      </div>
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardTopbar}>
          <input
            type="search"
            id="search"
            name="search"
            placeholder="Search..."
            className={styles.searchbar}
          />
          <div className={styles.filters}>
            <div className={styles.dropdown}>
              <select id="sort-by" name="sort-by">
                <option value="new">Newest Created</option>
                <option value="old">Oldest Created</option>
                <option value="due">Due Date</option>
                <option value="priority">Priority</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
