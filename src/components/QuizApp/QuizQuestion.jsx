/**
 * QuizQuestion Component
 * Shows the current question, answer options, and circular timer
 */

import React from "react";

const QuizQuestion = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  selectedTopic,
  selectedDifficulty,
  timer,
  timerProgress,
  selectedAnswer,
  handleAnswerClick,
}) => {
  const { radius, circumference, strokeDashoffset } = timerProgress;

  return (
    <div className="question-container">
      <div className="question-header">
        <span>
          Question {currentQuestionIndex + 1}/{totalQuestions}
        </span>
        <div className="topic-difficulty">
          {selectedTopic} • {selectedDifficulty}
        </div>

        {/* Circular Timer - visual countdown */}
        <div className="circular-timer">
          <svg width="60" height="60" viewBox="0 0 60 60">
            {/* Background circle (gray) */}
            <circle
              cx="30"
              cy="30"
              r={radius}
              fill="none"
              stroke="#333"
              strokeWidth="4"
            />

            {/* Progress circle (changes color as time runs out) */}
            <circle
              cx="30"
              cy="30"
              r={radius}
              fill="none"
              stroke={
                timer < 10 ? "#f44336" : timer < 20 ? "#ffc107" : "#4caf50"
              }
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          {/* Timer text in center */}
          <div className="timer-text">{timer}s</div>
        </div>
      </div>

      <div className="question-card">
        <h2>{currentQuestion.question}</h2>
        <div className="options-grid">
          {currentQuestion.options.map((option, index) => {
            let cls = "option-button";
            // After answer is selected, highlight correct/incorrect
            if (selectedAnswer !== null) {
              if (option === currentQuestion.correctAnswer) {
                cls += " correct"; // Green for correct answer
              } else if (option === selectedAnswer) {
                cls += " incorrect"; // Red for wrong answer
              }
            }
            return (
              <button
                key={index}
                onClick={() => handleAnswerClick(option)}
                disabled={selectedAnswer !== null} // Can't change answer after clicking
                className={cls}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;
