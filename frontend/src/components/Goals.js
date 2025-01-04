import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import styles from "./styles/Goals.module.css";

const Goals = () => {
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.dashboardContent}>
        <h1>Progress</h1>
        <div className={styles.goalsList}>
          {goals.map((goal) => {
            const progress = Math.round(
              (goal.current_value / goal.target_value) * 100
            );
            return (
              <button key={goal.id} className={styles.goalCard}>
                <div className={styles.goalHeader}>
                  {goal.title}
                  <h1>{goal.status}</h1>
                </div>
                <div className={styles.progressDetails}>
                  <div className={styles.progressDisplay}>
                    <p>
                      Due Date: <b>{goal.due_date}</b>
                    </p>
                    <p>
                      {goal.current_value} / {goal.target_value} {goal.unit}
                    </p>
                  </div>
                  <div
                    className={styles.progressBarContainer}
                    style={{ width: `100%` }}
                  >
                    <div
                      className={styles.progressBar}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Goals;
