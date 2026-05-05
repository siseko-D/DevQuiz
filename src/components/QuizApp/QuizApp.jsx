/**
 * QuizApp - Main Component
 * Orchestrates all the quiz screens and logic
 *
 * This file is now much smaller because it delegates to:
 * - useQuizLogic (state and game logic)
 * - useSaveScore (database operations)
 * - Individual screen components
 */

import React, { useState } from "react";
import { useQuizLogic } from "./useQuizLogic";
import { useSaveScore } from "./useSaveScore";
import StartScreen from "./StartScreen";
import TopicSelection from "./TopicSelection";
import DifficultySelection from "./DifficultySelection";
import QuizQuestion from "./QuizQuestion";
import QuizResults from "./QuizResults";
import UsernameModal from "./UsernameModal";
import ExplanationModal from "./ExplanationModal";
import LoadingSkeleton from "./LoadingSkeleton";
import ConfirmModal from "./ConfirmModal";
import TimerSettingsModal from "./TimerSettingsModal";

const QuizApp = () => {
  // Get all quiz logic from custom hook
  const {
    showStartScreen,
    setShowStartScreen,
    showTopicSelection,
    setShowTopicSelection,
    showDifficultySelection,
    setShowDifficultySelection,
    quizStarted,
    selectedTopic,
    setSelectedTopic,
    selectedDifficulty,
    setSelectedDifficulty,
    currentQuestionIndex,
    score,
    showResults,
    timer,
    selectedAnswer,
    userAnswers,
    questions,
    isLoading,
    error,
    notice,
    showUsernamePrompt,
    setShowUsernamePrompt,
    tempUsername,
    setTempUsername,
    showExplanationModal,
    setShowExplanationModal,
    explanationData,
    setExplanationData,
    topics,
    difficulties,
    generateQuestions,
    handleAnswerClick,
    restartQuiz,
    timerProgress,
    // Timer settings
    timerDuration,
    timerSettingsOpen,
    openTimerSettings,
    closeTimerSettings,
    setTimerAndClose,
  } = useQuizLogic();

  // Get save function from custom hook
  const { saveQuizResult } = useSaveScore();

  // Local state for save status message
  const [saveStatus, setSaveStatus] = useState(null);
  
  // State for confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  /**
   * Handles saving the score with the entered username
   */
  const handleSaveScore = async () => {
    if (tempUsername && tempUsername.trim()) {
      const quizData = {
        selectedTopic,
        selectedDifficulty,
        score,
        questions,
        timerDuration,
      };
      const result = await saveQuizResult(tempUsername.trim(), quizData);
      if (result.success) {
        setSaveStatus(result.message);
      } else {
        setSaveStatus(result.message);
      }
      setShowUsernamePrompt(false);
      setTempUsername("");
      setTimeout(() => setSaveStatus(null), 4000);
    } else {
      setSaveStatus("Please enter a username");
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  /**
   * Handles restart with confirmation
   * Only shows confirmation if quiz is in progress
   */
  const handleRestartWithConfirm = () => {
    // Only show confirmation if quiz has progress
    if (quizStarted || showResults || score > 0 || questions.length > 0) {
      setShowConfirmModal(true);
    } else {
      restartQuiz();
    }
  };

  const confirmRestart = () => {
    setShowConfirmModal(false);
    restartQuiz();
  };

  /**
   * Placeholder for generating detailed explanation (to be implemented with Groq)
   */
  const generateDetailedExplanation = async (
    question,
    correctAnswer,
    userAnswer,
    explanation,
  ) => {
    // For now, just show the existing explanation from the quiz
    setExplanationData({
      question,
      correctAnswer,
      userAnswer,
      explanation:
        explanation ||
        `${correctAnswer} is correct because it is the standard/expected answer for this question.`,
      isLoading: false,
    });
    setShowExplanationModal(true);
  };

  // Get current question (if quiz is active)
  const currentQuestion =
    questions.length > 0 && currentQuestionIndex < questions.length
      ? questions[currentQuestionIndex]
      : null;

  return (
    <>
      <div className="quiz-wrapper">
        {/* Show loading skeleton while generating questions */}
        {isLoading && <LoadingSkeleton selectedTopic={selectedTopic} />}

        {/* Show error message if something failed */}
        {error && !isLoading && (
          <div className="error-screen">
            <p>{error}</p>
            <button onClick={restartQuiz} className="restart-button">
              Try Again
            </button>
          </div>
        )}

        {/* Show notice/info messages */}
        {notice && <div className="notice">{notice}</div>}

        {/* Show the appropriate screen based on state */}
        {!isLoading && !error && (
          <>
            {showStartScreen && (
              <StartScreen
                setShowStartScreen={setShowStartScreen}
                setShowTopicSelection={setShowTopicSelection}
                groqApiKey={process.env.REACT_APP_GROQ_API_KEY}
                openTimerSettings={openTimerSettings}
                timerDuration={timerDuration}
              />
            )}

            {showTopicSelection && !quizStarted && (
              <TopicSelection
                topics={topics}
                setSelectedTopic={setSelectedTopic}
                setShowTopicSelection={setShowTopicSelection}
                setShowDifficultySelection={setShowDifficultySelection}
                restartQuiz={handleRestartWithConfirm}
              />
            )}

            {showDifficultySelection && !quizStarted && (
              <DifficultySelection
                difficulties={difficulties}
                selectedTopic={selectedTopic}
                setSelectedDifficulty={setSelectedDifficulty}
                setShowDifficultySelection={setShowDifficultySelection}
                setShowTopicSelection={setShowTopicSelection}
                generateQuestions={generateQuestions}
              />
            )}

            {quizStarted && !showResults && currentQuestion && (
              <QuizQuestion
                currentQuestion={currentQuestion}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                selectedTopic={selectedTopic}
                selectedDifficulty={selectedDifficulty}
                timer={timer}
                timerProgress={timerProgress}
                selectedAnswer={selectedAnswer}
                handleAnswerClick={handleAnswerClick}
              />
            )}

            {showResults && (
              <QuizResults
                score={score}
                totalQuestions={questions.length}
                userAnswers={userAnswers}
                saveStatus={saveStatus}
                setShowUsernamePrompt={setShowUsernamePrompt}
                restartQuiz={handleRestartWithConfirm}
                setShowExplanationModal={setShowExplanationModal}
                setExplanationData={setExplanationData}
              />
            )}
          </>
        )}
      </div>

      {/* Timer Settings Modal */}
      <TimerSettingsModal
        isOpen={timerSettingsOpen}
        onClose={closeTimerSettings}
        onSelect={setTimerAndClose}
        currentDuration={timerDuration}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onConfirm={confirmRestart}
        onCancel={() => setShowConfirmModal(false)}
        title="Restart Quiz?"
        message="Your current quiz progress will be lost. Are you sure you want to restart?"
      />

      {/* Modals (popups) */}
      {showUsernamePrompt && (
        <UsernameModal
          tempUsername={tempUsername}
          setTempUsername={setTempUsername}
          handleSaveScore={handleSaveScore}
          setShowUsernamePrompt={setShowUsernamePrompt}
        />
      )}

      {showExplanationModal && (
        <ExplanationModal
          explanationData={explanationData}
          setShowExplanationModal={setShowExplanationModal}
          generateDetailedExplanation={generateDetailedExplanation}
        />
      )}
    </>
  );
};

export default QuizApp;