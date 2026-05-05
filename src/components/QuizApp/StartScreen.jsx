/**
 * StartScreen Component
 * Shows the welcome screen with "Start Quiz" button
 * This is the first screen users see
 */

import React from "react";

const StartScreen = ({
  setShowStartScreen,
  setShowTopicSelection,
  groqApiKey,
  openTimerSettings,
  timerDuration,
}) => {
  // Format timer display
  const getTimerDisplay = () => {
    if (timerDuration === 30) return "⚡ 30s";
    if (timerDuration === 90) return "🐢 90s";
    return "⏱️ 60s";
  };

  return (
    <div className="start-screen">
      <h1>DevQuiz</h1>
      <p>Test your knowledge with AI-generated questions.</p>
      
      {/* Timer Settings Button */}
      <button
        onClick={openTimerSettings}
        style={{
          background: "#333",
          border: "1px solid #4caf50",
          borderRadius: "50px",
          padding: "8px 20px",
          marginBottom: "20px",
          cursor: "pointer",
          color: "#e0e0e0",
          fontSize: "0.9rem",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "#444"}
        onMouseLeave={(e) => e.currentTarget.style.background = "#333"}
      >
        <span>⏰</span> Timer: {getTimerDisplay()} <span>▼</span>
      </button>
      
      {!groqApiKey && (
        <div className="notice">⚠️ Add REACT_APP_GROQ_API_KEY to .env</div>
      )}
      <button
        onClick={() => {
          setShowStartScreen(false);
          setShowTopicSelection(true);
        }}
        className="start-button"
      >
        Start Quiz
      </button>
    </div>
  );
};

export default StartScreen;