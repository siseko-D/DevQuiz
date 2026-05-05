/**
 * UsernameModal Component
 * Popup that asks for username before saving score to leaderboard
 */

import React from "react";

const UsernameModal = ({
  tempUsername,
  setTempUsername,
  handleSaveScore,
  setShowUsernamePrompt,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "400px" }}>
        <div className="modal-header">
          <h3>🏆 Save Your Score</h3>
        </div>
        <div className="modal-body">
          <p style={{ marginBottom: "1rem" }}>
            Enter a username to appear on the leaderboard:
          </p>
          <input
            type="text"
            placeholder="Username"
            value={tempUsername}
            onChange={(e) => setTempUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#333",
              border: "1px solid #4caf50",
              borderRadius: "8px",
              color: "white",
              fontSize: "1rem",
            }}
            autoFocus
          />
        </div>
        <div
          className="modal-footer"
          style={{ display: "flex", gap: "10px", justifyContent: "center" }}
        >
          <button
            onClick={() => setShowUsernamePrompt(false)}
            style={{ background: "#555" }}
          >
            Cancel
          </button>
          <button onClick={handleSaveScore}>Save Score</button>
        </div>
      </div>
    </div>
  );
};

export default UsernameModal;
