import React, { useState } from "react";
import styles from "./styles/Create.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleNotch,
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";

const CreateProject = () => {
  const [visible, setVisible] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    date_created: "",
    image: null, // File object for image
    link: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "image") {
      setFormData((prevData) => ({
        ...prevData,
        image: e.target.files[0], // Set the file object for image
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check required fields
    const requiredFields = ["title"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        setErrorMessage(
          `Please fill out the ${field.replace("_", " ")} field.`
        );
        return;
      }
    }

    setErrorMessage(""); // Clear error if valid

    const token = localStorage.getItem("authToken");
    if (!token) {
      setErrorMessage("No token found. Please log in.");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("title", formData.title);
    formPayload.append(
      "date_created",
      formData.date_created || new Date().toISOString()
    );
    formPayload.append("link", formData.link);
    if (formData.image) {
      formPayload.append("image", formData.image);
    }

    try {
      const response = await fetch("http://localhost:5000/projects", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formPayload,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Project created successfully!");
        setFormData({ title: "", date_created: "", image: null, link: "" });
        window.location.reload();
      } else {
        setErrorMessage(data.error || "Failed to create project.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Failed to create project. Please try again later.");
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
                  placeholder="Enter Project Title"
                />
              </div>

              <div className={styles.values}>
                <div>
                  <label className={styles.header}>Creation Date:</label>
                  <input
                    type="date"
                    name="date_created"
                    value={formData.date_created}
                    onChange={handleChange}
                    className={styles.inputDate}
                  />
                </div>
              </div>

              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className={styles.inputString}
                placeholder="Project Link"
              />

              <div>
                <label className={styles.header}>Image:</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className={styles.inputFile}
                />
              </div>

              <button className={styles.button} type="submit">
                Create Project
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateProject;
