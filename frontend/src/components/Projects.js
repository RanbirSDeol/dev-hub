// Dashboard Component

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Topbar from "./Topbar";
import styles from "./styles/Projects.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faEllipsis,
  faEllipsisVertical,
  faPlus,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import {
  faTrashCan,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-regular-svg-icons";

const Dashboard = () => {
  // Vars
  const [project, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load our projects from the API '/projects' endpoint
  useEffect(() => {
    const fetchProjects = async () => {
      // GET request to fetch goals
      try {
        const token = localStorage.getItem("authToken"); // Get the JWT token from localStorage (or wherever it's stored)
        const response = await fetch("http://localhost:5000/projects", {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the header
          },
        });

        // Make sure the response is valid
        if (!response.ok) {
          throw new Error("Failed to fetch goals");
        }

        // Our goal data
        const data = await response.json();

        // Assuming goals are in the 'data' variable
        if (data && Array.isArray(data.projects)) {
          setProjects(data.projects);
        } else {
          throw new Error("Invalid data format: projects not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Dashboard Structure
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
              </select>
            </div>
          </div>
        </div>

        <div className={styles.goalsList}>
          {project.map((project) => (
            <div key={project.id} className={styles.goalCard}>
              <div className={styles.goalTopbar}>
                <button className={styles.edit}>
                  <FontAwesomeIcon icon={faEllipsis} size="xl" />
                </button>
                <button className={styles.trash}>
                  <FontAwesomeIcon icon={faTrashCan} size="xl" />
                </button>
              </div>
              <div className={styles.goalHeader}>
                <p className={styles.goalTitle}>{project.title}</p>
                <p className={styles.goalTitle}>{project.image}</p>
                <p className={styles.goalTitle}>{project.date_created}</p>
                <p className={styles.goalTitle}>{project.link}</p>
              </div>
            </div>
          ))}
          <button className={styles.goalCreateCard}>
            <div>
              <FontAwesomeIcon icon={faPlus} size="xl" />
              <p>Create Project</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
