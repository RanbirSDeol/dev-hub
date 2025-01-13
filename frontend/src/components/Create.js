import React, { useState } from "react";
import Navbar from "./Navbar";
import styles from "./styles/Create.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const Create = () => {
  const [formData, setFormData] = useState({
    title: "",
    initial_value: 0,
    current_value: 0,
    target_value: "",
    unit: "",
    priority: "Low",
    status: "Uncompleted",
    due_date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value); // Log for debugging
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken"); // Get the token from local storage

    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Goal created successfully!");
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
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create goal.");
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.goalContainer}>
        <form onSubmit={handleSubmit}>
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
              placeholder="Enter goal"
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

          <label className={styles.header}>Priority Value:</label>
          <select
            type="text"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={styles.inputString}
            placeholder="Priority"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <label className={styles.header}>Status Value:</label>
          <select
            type="text"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={styles.inputString}
            placeholder="Status"
          >
            <option value="Uncompleted">Uncompleted</option>
            <option value="Completed">Completed</option>
          </select>

          <label>Due Date:</label>
          <input
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className={styles.inputDate}
            placeholder="Due Date"
          />

          <button type="submit">Create Goal</button>
        </form>
      </div>
    </div>
  );
};

export default Create;
