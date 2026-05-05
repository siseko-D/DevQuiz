/**
 * Custom hook that contains all quiz logic
 * Separates logic from UI components
 */

import { useState, useCallback, useEffect } from "react";
import Groq from "groq-sdk";

// ============ GROQ API SETUP ============
// Get API key from environment variables
const groqApiKey = process.env.REACT_APP_GROQ_API_KEY || "";
let groqClient = null;

// Only initialize Groq if we have an API key
if (groqApiKey) {
  groqClient = new Groq({
    apiKey: groqApiKey,
    dangerouslyAllowBrowser: true, // Allows running in browser (normally Node.js only)
  });
}

export const useQuizLogic = () => {
  // ============ SCREEN STATE ============
  // Controls which screen to show
  const [showStartScreen, setShowStartScreen] = useState(true); // Welcome screen
  const [showTopicSelection, setShowTopicSelection] = useState(false); // Topic picker
  const [showDifficultySelection, setShowDifficultySelection] = useState(false); // Difficulty picker
  const [quizStarted, setQuizStarted] = useState(false); // Quiz active
  const [showResults, setShowResults] = useState(false); // Results screen
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false); // Username popup
  const [showExplanationModal, setShowExplanationModal] = useState(false); // Explanation popup

  // ============ TIMER SETTINGS ============
  const [timerSettingsOpen, setTimerSettingsOpen] = useState(false);
  const [timerDuration, setTimerDuration] = useState(60);

  // Timer settings functions
  const openTimerSettings = () => {
    setTimerSettingsOpen(true);
  };

  const closeTimerSettings = () => {
    setTimerSettingsOpen(false);
  };

  const setTimerAndClose = (seconds) => {
    setTimerDuration(seconds);
    setTimerSettingsOpen(false);
    setTimer(seconds); // Reset current timer if quiz is active
  };

  // ============ QUIZ DATA ============
  const [selectedTopic, setSelectedTopic] = useState(null); // User's chosen topic
  const [selectedDifficulty, setSelectedDifficulty] = useState(null); // User's chosen difficulty
  const [questions, setQuestions] = useState([]); // Array of 5 question objects
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Which question user is on (0-4)
  const [score, setScore] = useState(0); // User's current score
  const [userAnswers, setUserAnswers] = useState([]); // Stores all answers for results screen
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Which option user just clicked
  const [timer, setTimer] = useState(60); // Countdown timer per question

  // ============ UI STATE ============
  const [isLoading, setIsLoading] = useState(false); // Loading spinner while generating questions
  const [error, setError] = useState(null); // Error message to display
  const [notice, setNotice] = useState(null); // Info message (e.g., "Questions generated")
  const [tempUsername, setTempUsername] = useState(""); // Temporary username before saving
  const [explanationData, setExplanationData] = useState({
    question: "",
    correctAnswer: "",
    userAnswer: "",
    explanation: "",
    isLoading: false,
  });

  // Available options for user to choose from
  const topics = [
  // Frontend
  "HTML", "CSS", "JavaScript", "React", "TypeScript", "Vue.js",
  // Backend  
  "Node.js", "Python", "Java", "PHP", "Ruby", "Go",
  // Databases
  "SQL", "MongoDB", "PostgreSQL", "MySQL", "Firebase"
];
  const difficulties = ["Easy", "Medium", "Hard"];

  /**
   * Generates 5 quiz questions using Groq AI
   * @param {string} topic - HTML, CSS, JavaScript, etc.
   * @param {string} difficulty - Easy, Medium, Hard
   */
  const generateQuestions = useCallback(async (topic, difficulty) => {
    setIsLoading(true);
    setError(null);

    if (!groqClient) {
      setError("Groq API not configured. Add REACT_APP_GROQ_API_KEY to .env");
      setIsLoading(false);
      return;
    }

    try {
      const randomSeed = Math.random().toString(36).substring(7);

      const completion = await groqClient.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a quiz generator. Return ONLY valid JSON. The correctAnswer MUST be the EXACT TEXT of the correct option, NOT a letter like 'A' or 'B'.",
          },
          {
            role: "user",
            content: `Generate 5 multiple choice questions about ${topic} at ${difficulty} level.

EXAMPLE FORMAT:
[
  {
    "question": "What does HTML stand for?",
    "options": ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyperlink Transfer Markup Language"],
    "correctAnswer": "Hyper Text Markup Language",
    "explanation": "HTML stands for Hyper Text Markup Language."
  }
]

RULES:
- correctAnswer MUST be the FULL TEXT of the correct option
- DO NOT use letters like "A", "B", "C", "D" as correctAnswer
- Use this seed for variety: ${randomSeed}

Generate 5 unique questions about ${topic} at ${difficulty} level. Return ONLY the JSON array.`,
          },
        ],
        model: "llama-3.1-8b-instant",
        temperature: 1.0, // Higher = more creative/varied questions
        max_tokens: 3000,
      });

      const responseText = completion.choices[0]?.message?.content || "";
      const cleanedText = responseText.replace(/```json|```/g, "").trim();
      let parsedQuestions = JSON.parse(cleanedText);

      // Fix: If AI returned letter answers (like "a", "b", "c", "d"), convert them to full text
      parsedQuestions = parsedQuestions.map((q) => {
        const letterToIndex = {
          a: 0,
          b: 1,
          c: 2,
          d: 3,
          A: 0,
          B: 1,
          C: 2,
          D: 3,
          1: 0,
          2: 1,
          3: 2,
          4: 3,
        };

        if (letterToIndex[q.correctAnswer] !== undefined) {
          const index = letterToIndex[q.correctAnswer];
          if (q.options && q.options[index]) {
            q.correctAnswer = q.options[index];
          }
        }

        return q;
      });

      if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
        setQuestions(parsedQuestions);
        setQuizStarted(true);
        setTimer(timerDuration);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Generation error:", err);
      setError(`Failed to generate questions: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [timerDuration]);

  /**
   * Moves to next question or shows results if quiz is complete
   */
  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex + 1 < questions.length) {
      // Move to next question
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimer(timerDuration); // Reset timer for new question
      setSelectedAnswer(null); // Clear selected answer for new question
    } else {
      // Quiz complete - show results screen
      setShowResults(true);
    }
  }, [currentQuestionIndex, questions.length, timerDuration]);

  /**
   * Handles when timer reaches 0 - marks as incorrect and moves on
   */
  const handleTimeOut = useCallback(() => {
    if (questions.length === 0) return;
    const q = questions[currentQuestionIndex];
    setUserAnswers((prev) => [
      ...prev,
      {
        question: q.question,
        userAnswer: "Time Out",
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        isCorrect: false,
      },
    ]);
    setTimeout(nextQuestion, 1500);
  }, [questions, currentQuestionIndex, nextQuestion]);

  /**
   * Timer countdown effect
   */
  useEffect(() => {
    if (quizStarted && !showResults && questions.length > 0) {
      const timerInterval = setInterval(() => {
        setTimer((prev) => {
          if (prev > 0) return prev - 1;
          clearInterval(timerInterval);
          handleTimeOut();
          return 0;
        });
      }, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [quizStarted, showResults, questions, handleTimeOut]);

  /**
   * Handles user clicking an answer option
   * @param {string} answer - The answer text the user clicked
   */
  const handleAnswerClick = (answer) => {
    if (selectedAnswer !== null) return; // Already answered this question

    setSelectedAnswer(answer);

    const isCorrect = answer === questions[currentQuestionIndex].correctAnswer;
    if (isCorrect) setScore((prev) => prev + 1);

    const q = questions[currentQuestionIndex];
    setUserAnswers((prev) => [
      ...prev,
      {
        question: q.question,
        userAnswer: answer,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        isCorrect,
      },
    ]);

    setTimeout(nextQuestion, 1500);
  };

  /**
   * Resets everything to start a new quiz
   */
  const restartQuiz = () => {
    setShowStartScreen(true);
    setShowTopicSelection(false);
    setShowDifficultySelection(false);
    setQuizStarted(false);
    setSelectedTopic(null);
    setSelectedDifficulty(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
    setTimer(timerDuration);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setQuestions([]);
    setError(null);
    setNotice(null);
    setShowUsernamePrompt(false);
    setTempUsername("");
  };

  // Calculate stroke dashoffset based on current timer AND timerDuration
  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = (timer / timerDuration) * circumference;

  // Return everything needed by components
  return {
    // State
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

    // Timer settings
    timerDuration,
    timerSettingsOpen,
    openTimerSettings,
    closeTimerSettings,
    setTimerAndClose,

    // Functions
    generateQuestions,
    handleAnswerClick,
    restartQuiz,
    timerProgress: {
      radius,
      circumference,
      strokeDashoffset,
    },
  };
};