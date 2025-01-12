import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar"; // Make sure the path is correct
import Topbar from "./Topbar";
import styles from "./styles/Dashboard.module.css"; // Optional styling for Dashboard

const Dashboard = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch("http://localhost:5000/goals");
        if (!response.ok) {
          throw new Error("Failed to fetch goals");
        }
        const data = await response.json();
        if (data && Array.isArray(data.goals)) {
          setGoals(data.goals);
        } else {
          throw new Error("Invalid data format: goals not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  // Function to determine progress bar color based on percentage
  const getProgressClass = (progress) => {
    console.log(progress);
    if (progress <= 20) return styles.low;
    if (progress <= 40) return styles.mediumLow;
    if (progress <= 60) return styles.medium;
    if (progress <= 80) return styles.mediumHigh;
    return styles.high;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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

        <div className={styles.goalsList}>
          {goals.map((goal) => {
            const progress = Math.round(
              (goal.current_value / goal.target_value) * 100
            );
            return (
              <div key={goal.id} className={styles.goalCard}>
                <button className={styles.edit}>...</button>
                <div className={styles.goalHeader}>
                  <p className={styles.goalTitle}>{goal.title}</p>
                  <p className={styles.goalStatus}>{goal.status}</p>
                </div>
                <div>
                  <p className={styles.goalPercent}>{progress}%</p>
                  <p>
                    {goal.current_value} / {goal.target_value} {goal.unit}
                  </p>
                </div>
                <div
                  className={`${styles.progressContainer} ${getProgressClass(
                    progress
                  )}`}
                  style={{ width: `100%` }}
                >
                  <div
                    className={`${styles.progressBar} ${getProgressClass(
                      progress
                    )}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
