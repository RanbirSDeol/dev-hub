import React, { useState } from "react";
import Navbar from "./Navbar";
import styles from "./styles/Dashboard.module.css";

const Create = () => {
  const [formData, setFormData] = useState({
    title: "",
    initial_value: "",
    current_value: "",
    target_value: "",
    unit: "",
    priority: "",
    status: "",
    due_date: "",
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
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />

        <label>Initial Value:</label>
        <input
          type="number"
          name="initial_value"
          value={formData.initial_value}
          onChange={handleChange}
        />

        <label>Current Value:</label>
        <input
          type="number"
          name="current_value"
          value={formData.current_value}
          onChange={handleChange}
        />

        <label>Target Value:</label>
        <input
          type="number"
          name="target_value"
          value={formData.target_value}
          onChange={handleChange}
        />

        <label>Unit:</label>
        <input
          type="text"
          name="unit"
          value={formData.unit}
          onChange={handleChange}
        />

        <label>Priority:</label>
        <input
          type="text"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        />

        <label>Status:</label>
        <input
          type="text"
          name="status"
          value={formData.status}
          onChange={handleChange}
        />

        <label>Due Date:</label>
        <input
          type="date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
        />

        <button type="submit">Create Goal</button>
      </form>
    </div>
  );
};

export default Create;
