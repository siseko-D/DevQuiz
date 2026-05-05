/**
 * ExplanationModal Component
 * Popup that shows AI-generated explanation for an answer
 */

import React from "react";

const ExplanationModal = ({
  explanationData,
  setShowExplanationModal,
  generateDetailedExplanation,
}) => {
  return (
    <div
      className="modal-overlay"
      onClick={() => setShowExplanationModal(false)}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📚 Explanation</h3>
          <button
            className="modal-close"
            onClick={() => setShowExplanationModal(false)}
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-question">{explanationData.question}</div>
          <div className="modal-answers">
            <div className="modal-correct">
              ✓ Correct answer: {explanationData.correctAnswer}
            </div>
            <div className="modal-wrong">
              ✗ Your answer: {explanationData.userAnswer}
            </div>
          </div>
          {explanationData.explanation ? (
            <div className="modal-explanation">
              <strong>💡 Why this is correct:</strong>
              <p style={{ marginTop: "10px", lineHeight: "1.6" }}>
                {explanationData.explanation}
              </p>
            </div>
          ) : (
            <div className="modal-explanation" style={{ textAlign: "center" }}>
              <div className="spinner" style={{ margin: "20px auto" }}></div>
              <p>Generating explanation with AI...</p>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button onClick={() => setShowExplanationModal(false)}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExplanationModal;
