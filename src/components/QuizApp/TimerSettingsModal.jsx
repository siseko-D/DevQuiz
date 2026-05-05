/**
 * TimerSettingsModal Component
 * Allows users to choose quiz timer duration (30, 60, or 90 seconds)
 */

import React from "react";

const TimerSettingsModal = ({ isOpen, onClose, onSelect, currentDuration }) => {
  if (!isOpen) return null;

  const timerOptions = [
    { seconds: 30, label: "30 seconds", icon: "⚡" },
    { seconds: 60, label: "60 seconds", icon: "⏱️" },
    { seconds: 90, label: "90 seconds", icon: "🐢" },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: "350px" }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>⏰ Timer Settings</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p style={{ marginBottom: "1rem", color: "#ccc" }}>
            Choose how much time you want per question:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {timerOptions.map((option) => (
              <button
                key={option.seconds}
                onClick={() => onSelect(option.seconds)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  backgroundColor: currentDuration === option.seconds ? "#4caf50" : "#333",
                  border: currentDuration === option.seconds ? "2px solid #4caf50" : "1px solid #444",
                  borderRadius: "12px",
                  cursor: "pointer",
                  color: "white",
                  fontSize: "1rem",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (currentDuration !== option.seconds) {
                    e.currentTarget.style.backgroundColor = "#444";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentDuration !== option.seconds) {
                    e.currentTarget.style.backgroundColor = "#333";
                  }
                }}
              >
                <span>
                  <span style={{ marginRight: "10px", fontSize: "1.2rem" }}>{option.icon}</span>
                  {option.label}
                </span>
                {currentDuration === option.seconds && (
                  <span style={{ fontSize: "1.2rem" }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default TimerSettingsModal;