/**
 * DifficultySelection Component
 * Lets user choose Easy, Medium, or Hard
 */

import React, { useState } from "react";
import ConfirmModal from "./ConfirmModal";

const DifficultySelection = ({
  difficulties,
  selectedTopic,
  setSelectedDifficulty,
  setShowDifficultySelection,
  setShowTopicSelection,
  generateQuestions,
}) => {
  const [showBackConfirm, setShowBackConfirm] = useState(false);

  const handleBack = () => {
    setShowBackConfirm(true);
  };

  const confirmBack = () => {
    setShowBackConfirm(false);
    setShowDifficultySelection(false);
    setShowTopicSelection(true);
  };

  return (
    <>
      <div className="selection-screen">
        <h2>Select Difficulty for {selectedTopic}</h2>
        <div className="options-grid">
          {difficulties.map((difficulty, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedDifficulty(difficulty);
                setShowDifficultySelection(false);
                generateQuestions(selectedTopic, difficulty);
              }}
              className="option-button"
            >
              {difficulty}
            </button>
          ))}
        </div>
        <button onClick={handleBack} className="restart-button" style={{ marginTop: "20px", background: "#333" }}>
          ← Back to Topics
        </button>
      </div>

      <ConfirmModal
        isOpen={showBackConfirm}
        onConfirm={confirmBack}
        onCancel={() => setShowBackConfirm(false)}
        title="Go Back?"
        message="This will take you back to topic selection. Your quiz progress will be lost. Continue?"
      />
    </>
  );
};

export default DifficultySelection;