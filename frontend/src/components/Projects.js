// Dashboard Component

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Topbar from "./Topbar";
import EditProject from "./EditProject";
import Confirmation from "./Confirmation";
import CreateProject from "./CreateProject";
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
import { data } from "react-router-dom";

const Dashboard = () => {
  // Vars
  const [project, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGoal, setSelectedProject] = useState(null);

  const [showCreate, setShowCreate] = useState(false); // State to control visibility of the Create component
  const [sortBy, setSortOption] = useState("new");

  // Function to toggle the Create component visibility
  const toggleCreateForm = () => {
    setShowEdit(false);
    setShowCreate((prev) => !prev);
  };

  const toggleEditForm = () => {
    setShowCreate(false);
    setShowEdit((prev) => !prev);
  };

  const setEditProject = (project) => {
    setSelectedProject(project);
    toggleEditForm();
  };

  const addProject = (newGoal) => {
    setProjects((prevGoals) => [...prevGoals, newGoal]);
  };

  // Function to handle delete button click
  const handleDeleteClick = (projectId) => {
    setProjectToDelete(projectId);
    setShowConfirmation(true); // Show the confirmation modal
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false); // Close the modal
    setProjectToDelete(null); // Clear the project to delete
  };

  // Function to handle confirm delete button click
  const handleConfirmDelete = () => {
    deleteProject(projectToDelete); // Proceed with deletion
    setProjectToDelete(null); // Clear the project to delete
  };

  const deleteProject = async (projectId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/projects/${projectId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== projectId)
      );

      setShowConfirmation(false);

      localStorage.setItem("successMessage", "Project Deleted");
      setTimeout(() => {
        localStorage.removeItem("successMessage"); // Remove successMessage from localStorage
      }, 1000);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Function to query / search using search bar
  const filteredProjects = project.filter((myProject) => {
    // Filter by search query
    const matchesSearch = myProject.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Load our projects from the API '/projects' endpoint
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Get the JWT token from localStorage (or wherever it's stored)
        const response = await fetch("http://localhost:5000/projects", {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the header
          },
        });

        // Make sure the response is valid
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();

        if (data && Array.isArray(data.projects)) {
          let sortedProjects = [...data.projects];

          // Sort the projects based on the selected option
          switch (sortBy) {
            case "new":
              sortedProjects.sort(
                (a, b) => new Date(b.date_created) - new Date(a.date_created)
              );
              break;
            case "old":
              sortedProjects.sort(
                (a, b) => new Date(a.date_created) - new Date(b.date_created)
              );
              break;
            default:
              break;
          }

          // Set the projects
          setProjects(sortedProjects);
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
  }, [sortBy]); // Dependency array for sortBy to trigger refetch and sorting

  // Dashboard Structure
  return (
    <div className={styles.container}>
      {showConfirmation && (
        <Confirmation
          message="Are you sure you want to delete this project?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardTopbar}>
          <input
            type="search"
            id="search"
            name="search"
            placeholder="Search..."
            className={styles.searchbar}
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className={styles.filters}>
            <div className={styles.dropdown}>
              <select
                id="sort-by"
                name="sort-by"
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="new">Newest Created</option>
                <option value="old">Oldest Created</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.projectsList}>
          {filteredProjects.length === 0 ? (
            <p>No projects found</p>
          ) : (
            filteredProjects.map((project) => (
              <div key={project.id} className={styles.projectCard}>
                <div className={styles.projectTopbar}>
                  <button className={styles.edit}>
                    <FontAwesomeIcon
                      icon={faEllipsis}
                      size="xl"
                      onClick={() => setEditProject(project)}
                    />
                  </button>
                  <button
                    className={styles.trash}
                    onClick={() => handleDeleteClick(project.id)}
                  >
                    <FontAwesomeIcon icon={faTrashCan} size="xl" />
                  </button>
                </div>
                <div className={styles.projectHeader}>
                  <img
                    src={`http://localhost:5000/uploads/${project.image}`}
                    alt="Project"
                    className={styles.projectImage}
                  />
                  <p className={styles.projectTitle}>{project.title}</p>
                  <a
                    className={styles.projectSource}
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source
                  </a>

                  <p className={styles.projectCreated}>
                    Created @ {project.date_created}
                  </p>
                </div>
              </div>
            ))
          )}
          <button
            className={styles.projectCreateCard}
            onClick={toggleCreateForm}
          >
            <div>
              <FontAwesomeIcon icon={faPlus} size="xl" />
              <p>Create Project</p>
            </div>
          </button>
          {showCreate && <CreateProject onClose={toggleCreateForm} />}
          {showEdit && (
            <EditProject
              goal={selectedGoal}
              onGoalCreated={addProject}
              onClose={toggleEditForm}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
