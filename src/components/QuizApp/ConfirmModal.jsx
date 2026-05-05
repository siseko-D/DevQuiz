/**
 * ConfirmModal Component
 * Shows a confirmation dialog before restarting quiz
 * Prevents accidental loss of progress
 */

import React from "react";

const ConfirmModal = ({ isOpen, onConfirm, onCancel, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-content"
        style={{ maxWidth: "400px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{title || "Confirm Action"}</h3>
          <button className="modal-close" onClick={onCancel}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <p>{message || "Are you sure you want to proceed?"}</p>
        </div>
        <div
          className="modal-footer"
          style={{ display: "flex", gap: "10px", justifyContent: "center" }}
        >
          <button onClick={onCancel} style={{ background: "#555" }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ background: "#f44336" }}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
