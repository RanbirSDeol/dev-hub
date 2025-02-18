import React, { useState } from "react";
import styles from "./styles/EditGoal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleNotch,
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";

const Create = (obj) => {
  const [visible, setVisible] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState(""); // Message to display
  const [showStatus, setShowStatus] = useState(false); // Control visibility of the topbar

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
  };

  const [formData, setFormData] = useState({
    title: obj.goal.title,
    initial_value: obj.goal.initial_value,
    current_value: obj.goal.current_value,
    target_value: obj.goal.target_value,
    unit: obj.goal.unit,
    priority: obj.goal.priority,
    status: obj.goal.status,
    due_date: obj.goal.due_date ? formatDate(obj.goal.due_date) : "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled out
    const requiredFields = [
      "title",
      "initial_value",
      "current_value",
      "target_value",
      "unit",
      "priority",
      "due_date",
    ];

    for (let field of requiredFields) {
      if (
        formData[field] === "" || // Check for empty string
        formData[field] === null || // Check for null
        (typeof formData[field] === "number" && isNaN(formData[field])) // Check for NaN (e.g., for numbers)
      ) {
        setErrorMessage(
          `Please fill out the ${field.replace("_", " ")} field.`
        );
        return;
      }
    }

    // Clear any previous error message if form is valid
    setErrorMessage("");

    const token = localStorage.getItem("authToken"); // Get the token from local storage

    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/goals/${obj.goal.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setFormData({
          title: "",
          initial_value: "",
          current_value: "",
          target_value: "",
          unit: "",
          priority: "",
          status: "",
          due_date: "",
        });

        localStorage.setItem("successMessage", "Goal Updated");
        setTimeout(() => {
          setShowStatus(false);
          localStorage.removeItem("successMessage"); // Remove successMessage from localStorage
        }, 1000);

        window.location.reload();
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create goal.");
    }
  };

  return (
    <>
      {visible && (
        <div className={styles.container}>
          <div className={styles.goalContainer}>
            <button
              onClick={() => setVisible(false)}
              className={styles.closeButton}
            >
              <FontAwesomeIcon icon={faSquareXmark} size="xl" />
            </button>
            <form className={styles.createForm} onSubmit={handleSubmit}>
              {errorMessage && (
                <p className={styles.errorMessage}>{errorMessage}</p>
              )}
              <div className={styles.mainInput}>
                <FontAwesomeIcon
                  icon={faCircleNotch}
                  className={styles.icon}
                  size="xl"
                />
                <input
                  type="text"
                  name="title"
                  onChange={handleChange}
                  value={formData.title}
                  className={styles.inputBig}
                  placeholder="Enter Goal"
                />
              </div>

              <div className={styles.values}>
                <div>
                  <label className={styles.header}>Initial Value:</label>
                  <input
                    type="number"
                    name="initial_value"
                    value={formData.initial_value}
                    onChange={handleChange}
                    className={styles.inputNum}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className={styles.header}>Current Value:</label>
                  <input
                    type="number"
                    name="current_value"
                    value={formData.current_value}
                    onChange={handleChange}
                    className={styles.inputNum}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className={styles.header}>Target Value:</label>
                  <input
                    type="number"
                    name="target_value"
                    value={formData.target_value}
                    onChange={handleChange}
                    className={styles.inputNum}
                    placeholder="0"
                  />
                </div>
              </div>

              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className={styles.inputString}
                placeholder="Unit"
              />

              <label className={styles.header}>Priority:</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={styles.inputString}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <label>Due Date:</label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className={styles.inputDate}
                placeholder="YYYY-MM-DD"
              />

              <button className={styles.button} type="submit">
                Update Goal
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Create;
