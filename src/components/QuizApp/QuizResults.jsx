/**
 * QuizResults Component
 * Shows final score, all answers, and buttons for explanations
 */

import React, { useEffect } from "react";
import confetti from "canvas-confetti";

const QuizResults = ({
  score,
  totalQuestions,
  userAnswers,
  saveStatus,
  setShowUsernamePrompt,
  restartQuiz,
  setShowExplanationModal,
  setExplanationData,
}) => {
  // Trigger confetti on perfect score (5/5)
  useEffect(() => {
    if (score === totalQuestions && totalQuestions > 0) {
      // Fire multiple confetti bursts
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        startVelocity: 20,
        colors: ['#4caf50', '#ffd700', '#ff9800', '#2196f3']
      });
      
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.5, x: 0.3 },
          startVelocity: 25,
        });
      }, 200);
      
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.5, x: 0.7 },
          startVelocity: 25,
        });
      }, 400);
    }
  }, [score, totalQuestions]);

  /**
   * Opens the explanation modal for a specific question
   */
  const openExplanation = (
    question,
    correctAnswer,
    userAnswer,
    explanation,
  ) => {
    setExplanationData({
      question,
      correctAnswer,
      userAnswer,
      explanation,
      isLoading: false,
    });
    setShowExplanationModal(true);
  };

  return (
    <div className="results-screen">
      <h2>Quiz Complete!</h2>
      
      {/* Perfect score celebration message */}
      {score === totalQuestions && totalQuestions > 0 && (
        <div className="perfect-score-banner">
          🎉 PERFECT SCORE! 🎉
        </div>
      )}
      
      <div className="score-display">
        <span className="score">{score}</span>
        <span>/</span>
        <span>{totalQuestions}</span>
      </div>

      {saveStatus && (
        <div
          className={
            saveStatus.includes("🎉") ? "saved-notice" : "login-notice"
          }
        >
          {saveStatus}
        </div>
      )}

      {/* List all questions with user's answers */}
      <div className="report">
        {userAnswers.map((ans, idx) => (
          <div
            key={idx}
            className={`report-item ${ans.isCorrect ? "correct" : "incorrect"}`}
          >
            <h3>
              Q{idx + 1}: {ans.question}
            </h3>
            <p>Your answer: {ans.userAnswer}</p>
            {!ans.isCorrect && <p>Correct answer: {ans.correctAnswer}</p>}
            {ans.explanation && (
              <p className="explanation">{ans.explanation}</p>
            )}
            <button
              onClick={() =>
                openExplanation(
                  ans.question,
                  ans.correctAnswer,
                  ans.userAnswer,
                  ans.explanation,
                )
              }
              className="explain-button"
            >
              🤔 Explain This Answer
            </button>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="results-actions">
        <button
          onClick={() => setShowUsernamePrompt(true)}
          className="start-button"
        >
          Save Score to Leaderboard
        </button>
        <button onClick={restartQuiz} className="restart-button">
          Restart Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizResults;