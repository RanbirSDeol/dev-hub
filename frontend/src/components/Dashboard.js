// Dashboard Component

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Topbar from "./Topbar";
import Create from "./Create";
import Confirmation from "./Confirmation";
import styles from "./styles/Dashboard.module.css";
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
  const [goals, setGoals] = useState([]); // State for goals
  const [loading, setLoading] = useState(true); // Goals status
  const [error, setError] = useState(null); // Error message
  const [statusMessage, setStatusMessage] = useState(""); // Message to display
  const [showStatus, setShowStatus] = useState(false); // Control visibility of the topbar
  const [sortBy, setSortBy] = useState("due"); // Sorting
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [toggleCompleted, setToggleCompleted] = useState("show"); // Default to 'show'
  const [showCreate, setShowCreate] = useState(false); // State to control visibility of the Create component
  const [showConfirmation, setShowConfirmation] = useState(false); // State to control modal visibility
  const [goalToDelete, setGoalToDelete] = useState(null);

  // Function to toggle the Create component visibility
  const toggleCreateForm = () => {
    setShowCreate((prev) => !prev);
  };

  // Function to calculate days remaining until the due date
  const calculateDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);

    // Strip out the time component by creating new date objects
    const todayWithoutTime = new Date(today.toDateString()); // Use toDateString to get the date without time
    const dueWithoutTime = new Date(due.toDateString()); // Use toDateString to get the date without time

    const timeDiff = dueWithoutTime - todayWithoutTime;

    // If the due date is today
    if (timeDiff === 0) {
      return "Due Today";
    }

    // Convert time difference to days
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    return daysLeft > 0 ? `${daysLeft} days left` : "Past Due";
  };

  // Function to format the day from the date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Convert the date to local time (America/New_York timezone)
    const localDate = new Date(
      date.toLocaleString("en-US", { timeZone: "America/New_York" })
    );

    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(localDate);
  };

  // Filter goals based on search query and toggleCompleted state
  const filteredGoals = goals.filter((goal) => {
    // Filter by search query
    const matchesSearch = goal.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    // Filter by toggleCompleted state
    const matchesCompletedToggle =
      toggleCompleted === "show" || goal.status !== "completed"; // Show completed or hide completed goals

    return matchesSearch && matchesCompletedToggle;
  });

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Handles search change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleToggleCompletedChange = (e) => {
    setToggleCompleted(e.target.value); // 'show' or 'hide'
  };

  const updateStatusMessage = (message) => {
    setStatusMessage(message);
  };

  const addGoal = (newGoal) => {
    setGoals((prevGoals) => [...prevGoals, newGoal]);
  };

  // Loading goals according to the ID
  useEffect(() => {
    const checkSuccessMessage = () => {
      const successMessage = localStorage.getItem("successMessage");

      // If a success message is found in localStorage
      if (successMessage) {
        setStatusMessage(successMessage); // Set the success message

        // Show the topbar with success message
        setShowStatus(true);

        // Auto-hide the status message after 3 seconds
        setTimeout(() => {
          setShowStatus(false);
          localStorage.removeItem("successMessage"); // Remove successMessage from localStorage
        }, 3000);
      }
    };

    checkSuccessMessage();

    const fetchGoals = async () => {
      // GET request to fetch goals
      try {
        const token = localStorage.getItem("authToken"); // Get the JWT token from localStorage (or wherever it's stored)
        const response = await fetch("http://localhost:5000/goals", {
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

        // Check if the data is in the expected format
        if (data && Array.isArray(data.goals)) {
          let sortedGoals = [...data.goals];

          // Move due date forward by 1 day | Error on backend
          sortedGoals = sortedGoals.map((goal) => {
            const dueDate = new Date(goal.due_date);
            dueDate.setDate(dueDate.getDate() + 1); // Add 1 day to the due date
            return { ...goal, due_date: dueDate.toISOString() };
          });

          // Sort the goals based on the selected option
          switch (sortBy) {
            case "new":
              sortedGoals.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
              );
              break;
            case "old":
              sortedGoals.sort(
                (a, b) => new Date(a.created_at) - new Date(b.created_at)
              );
              break;
            case "due":
              sortedGoals.sort(
                (a, b) => new Date(a.due_date) - new Date(b.due_date)
              );
              break;
            case "priority":
              const priorityOrder = { Low: 1, Medium: 2, High: 3 };
              sortedGoals.sort(
                (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
              );
              break;
            case "completed":
              const completionStatus = { uncompleted: 0, completed: 1 };
              sortedGoals.sort(
                (a, b) =>
                  completionStatus[b.completed] - completionStatus[a.completed]
              );
              break;
            default:
              break;
          }

          // Set the goals
          setGoals(sortedGoals);
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
    window.addEventListener("storage", checkSuccessMessage);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("storage", checkSuccessMessage);
    };
  }, [sortBy]); // Add sortBy as a dependency to re-fetch when it changes

  // Function to update the goal progress (+/-)
  const updateProgress = async (goalId, change) => {
    // Update the state immediately to reflect the progress change
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              current_value: Math.max(
                0, // Ensure progress doesn't go below 0
                Math.min(goal.target_value, goal.current_value + change)
              ),
              status:
                Math.max(0, goal.current_value + change) === goal.target_value
                  ? "completed"
                  : "uncompleted", // Update status accordingly
            }
          : goal
      )
    );

    // Now make the backend update to persist the change
    const updatedGoal = goals.find((goal) => goal.id === goalId);
    const newCurrentValue = Math.max(
      0,
      Math.min(updatedGoal.target_value, updatedGoal.current_value + change)
    );

    try {
      // Send a PUT request to update the goal in the backend
      const response = await fetch(`http://localhost:5000/goals/${goalId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updatedGoal,
          current_value: newCurrentValue, // Updated value
          status:
            newCurrentValue === updatedGoal.target_value
              ? "completed"
              : "uncompleted",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update goal");
      }

      // Optionally, update the local goal state to reflect the backend changes
      const data = await response.json();
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === goalId ? { ...goal, ...data } : goal
        )
      );
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  // Function to delete a specific goal with a confirmation prompt
  const deleteGoal = async (goalId) => {
    try {
      const response = await fetch(`http://localhost:5000/goals/${goalId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete goal");
      }

      setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));

      setShowConfirmation(false);

      // Show the topbar with success message
      setStatusMessage("Goal Deleted");
      setShowStatus(true);

      // Auto-hide the status message after 3 seconds
      setTimeout(() => setShowStatus(false), 3000);
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  // Function to handle delete button click
  const handleDeleteClick = (goalId) => {
    setGoalToDelete(goalId);
    setShowConfirmation(true); // Show the confirmation modal
  };

  // Function to handle cancel button click
  const handleCancelDelete = () => {
    setShowConfirmation(false); // Close the modal
    setGoalToDelete(null); // Clear the goal to delete
  };

  // Function to handle confirm delete button click
  const handleConfirmDelete = () => {
    deleteGoal(goalToDelete); // Proceed with deletion
    setGoalToDelete(null); // Clear the goal to delete
  };

  // Progression colors / style based on the progress
  const getProgressClass = (progress) => {
    if (progress <= 20) return styles.low;
    if (progress <= 40) return styles.mediumLow;
    if (progress <= 60) return styles.medium;
    if (progress <= 99) return styles.mediumHigh;
    return styles.high;
  };

  // Function to get the priority colors
  const getPriority = (priority) => {
    if (!priority) return styles.defaultPriority; // Fallback for undefined priority
    const priorityLower = priority.toLowerCase();

    switch (priorityLower) {
      case "low":
        return styles.lowPriority;
      case "medium":
        return styles.mediumPriority;
      case "high":
        return styles.highPriority;
      default:
        return styles.defaultPriority; // Fallback class for unexpected values
    }
  };

  // Display if there's a error loading the goals
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Dashboard Structure
  return (
    <div className={styles.container}>
      {showConfirmation && (
        <Confirmation
          message="Are you sure you want to delete this goal?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      {showStatus && (
        <div className={styles.statusTopbar}>
          <p>{statusMessage}</p>
        </div>
      )}

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
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className={styles.filters}>
            <div className={styles.dropdown}>
              <select
                id="sort-by"
                name="sort-by"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="due">Due Date</option>
                <option value="new">Newest Created</option>
                <option value="old">Oldest Created</option>
                <option value="priority">Priority</option>
                <option value="completed">Completed</option>
              </select>
              <select
                id="toggle-completed"
                name="toggle-completed"
                value={toggleCompleted}
                onChange={handleToggleCompletedChange}
              >
                <option value="show">Show Completed</option>
                <option value="hide">Hide Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.goalsList}>
          {filteredGoals.length === -1 ? (
            <p>No goals found</p>
          ) : (
            filteredGoals.map((goal) => {
              const progress = Math.round(
                (goal.current_value / goal.target_value) * 100
              );
              return (
                <div key={goal.id} className={styles.goalCard}>
                  <div className={styles.goalTopbar}>
                    <button className={styles.edit}>
                      <FontAwesomeIcon icon={faEllipsis} size="xl" />
                    </button>
                    <button
                      className={styles.trash}
                      onClick={() => handleDeleteClick(goal.id)}
                    >
                      <FontAwesomeIcon icon={faTrashCan} size="xl" />
                    </button>
                  </div>
                  <div className={styles.goalHeader}>
                    <p className={styles.goalTitle}>
                      {goal.title}{" "}
                      <FontAwesomeIcon
                        icon={
                          goal.status === "completed"
                            ? faCircleCheck
                            : faCircleXmark
                        }
                        size="s"
                        className={
                          goal.status === "completed"
                            ? styles.goalIcon
                            : styles.goalComplete
                        }
                      />
                    </p>
                  </div>
                  <div>
                    <p
                      className={`${styles.goalPercent} ${getProgressClass(
                        progress
                      )}`}
                    >
                      {progress}%
                    </p>
                    <div className={styles.numberDisplay}>
                      <div className={styles.currentValue}>
                        {goal.current_value} /
                      </div>
                      <div className={styles.endValue}>
                        {goal.target_value} {goal.unit}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${styles.progressContainer} ${getProgressClass(
                      progress
                    )}`}
                    style={{ width: `100%` }}
                  >
                    <button
                      className={styles.decrementButton}
                      onClick={() => updateProgress(goal.id, -1)}
                      disabled={goal.current_value > goal.target_value}
                    >
                      -
                    </button>

                    <div
                      className={`${styles.progressBar} ${getProgressClass(
                        progress
                      )}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                    <button
                      className={styles.incrementButton}
                      onClick={() => updateProgress(goal.id, 1)}
                      disabled={goal.current_value >= goal.target_value}
                    >
                      +
                    </button>
                  </div>
                  <p className={styles.goalCreated}>
                    Created @ {formatDate(goal.created_at)}
                  </p>
                  <p className={styles.priority}>
                    <FontAwesomeIcon
                      icon={faTriangleExclamation}
                      className={`${styles.priorityIcon} ${getPriority(
                        goal.priority
                      )}`}
                    />
                    {goal.priority} Priority
                  </p>
                  <p className={styles.goalDueDate}>
                    {formatDate(goal.due_date)}
                  </p>
                  <p
                    className={`${styles.goalDaysLeft} ${
                      calculateDaysLeft(goal.due_date) === "Past Due" &&
                      goal.status !== "completed"
                        ? styles.overdue
                        : ""
                    }`}
                  >
                    {goal.status === "completed"
                      ? `Was Completed on ${formatDate(goal.finished_date)}`
                      : calculateDaysLeft(goal.due_date)}
                  </p>
                </div>
              );
            })
          )}
          <button className={styles.goalCreateCard} onClick={toggleCreateForm}>
            <div>
              <FontAwesomeIcon icon={faPlus} size="xl" />
              <p>Create Goal</p>
            </div>
          </button>
          {showCreate && (
            <Create onGoalCreated={addGoal} onClose={toggleCreateForm} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
