/**
 * TopicSelection Component
 * Lets user choose which technology to be tested on
 * Organized by categories
 */

import React, { useState } from "react";
import ConfirmModal from "./ConfirmModal";

const TopicSelection = ({ topics, setSelectedTopic, setShowTopicSelection, setShowDifficultySelection, restartQuiz }) => {
  const [showBackConfirm, setShowBackConfirm] = useState(false);

  // Organize topics by category
  const categories = {
    "🎨 Frontend": ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Vue.js"],
    "⚙️ Backend": ["Node.js", "Python", "Java", "PHP", "Ruby", "Go"],
    "🗄️ Databases": ["SQL", "MongoDB", "PostgreSQL", "MySQL", "Firebase"]
  };

  const handleBack = () => {
    setShowBackConfirm(true);
  };

  const confirmBack = () => {
    setShowBackConfirm(false);
    restartQuiz();
  };

  return (
    <>
      <div className="selection-screen">
        <h2>Select a Topic</h2>
        
        {Object.entries(categories).map(([category, categoryTopics]) => (
          <div key={category} style={{ marginBottom: "2rem" }}>
            <h3 style={{ 
              color: "#4caf50", 
              textAlign: "left", 
              marginBottom: "1rem",
              fontSize: "1.2rem",
              borderLeft: "3px solid #4caf50",
              paddingLeft: "1rem"
            }}>
              {category}
            </h3>
            <div className="options-grid">
              {categoryTopics.map((topic, index) => (
                <button 
                  key={index} 
                  onClick={() => {
                    setSelectedTopic(topic);
                    setShowTopicSelection(false);
                    setShowDifficultySelection(true);
                  }} 
                  className="option-button"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        ))}
        
        <button onClick={handleBack} className="restart-button" style={{ marginTop: "20px", background: "#333" }}>
          ← Back
        </button>
      </div>

      <ConfirmModal
        isOpen={showBackConfirm}
        onConfirm={confirmBack}
        onCancel={() => setShowBackConfirm(false)}
        title="Go Back?"
        message="This will take you to the start screen. Any unsaved progress will be lost. Continue?"
      />
    </>
  );
};

export default TopicSelection;