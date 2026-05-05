/**
 * LoadingSkeleton Component
 * Shows a question-shaped skeleton while generating quiz
 * Much better UX than a simple spinner
 */

import React from "react";

const LoadingSkeleton = ({ selectedTopic }) => {
  return (
    <div className="skeleton-container">
      <div className="skeleton-header">
        <div className="skeleton-header-item"></div>
        <div className="skeleton-header-item"></div>
        <div className="skeleton-header-item"></div>
      </div>
      
      <div className="skeleton-question">
        <div className="skeleton-question-text"></div>
        <div className="skeleton-options">
          <div className="skeleton-option"></div>
          <div className="skeleton-option"></div>
          <div className="skeleton-option"></div>
          <div className="skeleton-option"></div>
        </div>
      </div>
      
      <p style={{ 
        textAlign: "center", 
        color: "#4caf50", 
        marginTop: "1rem",
        fontSize: "0.9rem"
      }}>
        Generating {selectedTopic} questions with Groq AI...
      </p>
    </div>
  );
};

export default LoadingSkeleton;