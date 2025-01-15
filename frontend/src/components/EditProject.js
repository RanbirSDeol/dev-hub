import { useState, useEffect } from "react";
import styles from "./styles/EditProject.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleNotch,
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";

const CreateProject = (obj) => {
  const [visible, setVisible] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: obj.goal.title,
    date_created: obj.goal.date_created,
    image: obj.goal.image,
    link: obj.goal.link,
  });

  const updateImagePreview = () => {
    console.log(obj.goal.image); // Check if this is the correct image URL or value
    setImagePreview(`http://localhost:5000/uploads/${obj.goal.image}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "image") {
      const file = e.target.files[0];

      // Set the file object for the image
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));

      // Preview the image if one is selected
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result); // Store the preview URL
        };
        reader.readAsDataURL(file); // Read the image file as a data URL
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // FIXME: Implement the updateImagePreview function
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check required fields
    const requiredFields = ["title", "link", "date_created"];
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
    console.log("formData:", formData);

    try {
      const response = await fetch(
        `http://localhost:5000/projects/${obj.goal.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formPayload,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setFormData({
          title: "",
          date_created: "",
          image: "",
          link: "",
        });

        localStorage.setItem("successMessage", "Project Updated");
        setTimeout(() => {
          localStorage.removeItem("successMessage"); // Remove successMessage from localStorage
        }, 1000);

        window.location.reload();
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update project.");
    }
  };

  useEffect(() => {
    // Run updateImagePreview only on initial render
    updateImagePreview();
  }, []);

  return (
    <>
      {visible && (
        <div className={styles.container}>
          <div className={styles.projectContainer}>
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

              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className={styles.inputString}
                placeholder="Project Link"
              />

              <div className={styles.values}>
                <label className={styles.header}>Creation Date:</label>
                <input
                  type="date"
                  name="date_created"
                  value={formData.date_created}
                  onChange={handleChange}
                  className={styles.inputDate}
                />
              </div>

              <label className={styles.header}>Image:</label>
              <div className={styles.imageContainer}>
                <input
                  type="file"
                  id="fileInput"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className={styles.inputFile}
                />
                <label
                  htmlFor="fileInput"
                  className={styles.inputFileLabel}
                ></label>

                {imagePreview && (
                  <div className={styles.imagePreviewContainer}>
                    <img
                      src={imagePreview}
                      alt=""
                      className={styles.imagePreview}
                    />
                  </div>
                )}
              </div>

              <button className={styles.button} type="submit">
                Update Project
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateProject;
