// ConfirmationModal.js
import React from "react";
import styles from "./styles/Confirmation.module.css";

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContainer}>
        <p>{message}</p>
        <div className={styles.modalActions}>
          <button onClick={onConfirm} className={styles.confirmBtn}>
            Yes
          </button>
          <button onClick={onCancel} className={styles.cancelBtn}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
