import React, { useState, useCallback, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// API/key initialization (moved here from App.js)
const apiKey = process.env.REACT_APP_GOOGLE_API_KEY || "";
const hasApiKey = !!apiKey;
let genAI = null;
if (hasApiKey) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (e) {
    console.warn("Unable to initialize GoogleGenerativeAI client, API key may be invalid", e);
    genAI = null;
  }
}

// fallback question pools organized by topic (used when API is unavailable)
const FALLBACK_BY_TOPIC = {
  HTML: [
    {
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "Home Tool Markup Language",
        "Hyperlinks and Text Markup Language",
        "Hyperlink Transfer Markup Language"
      ],
      correctAnswer: "Hyper Text Markup Language",
      explanation: "HTML stands for Hyper Text Markup Language."
    },
    {
      question: "Which HTML tag is used for a hyperlink?",
      options: ["<link>", "<a>", "<href>", "<hyper>"],
      correctAnswer: "<a>",
      explanation: "The <a> tag defines a hyperlink."
    }
  ],
  CSS: [
    {
      question: "Which CSS property controls text size?",
      options: ["font-style", "text-size", "font-size", "text-style"],
      correctAnswer: "font-size",
      explanation: "The font-size property sets the size of the text."
    },
    {
      question: "What does CSS stand for?",
      options: [
        "Computer Style Sheets",
        "Creative Style System",
        "Cascading Style Sheets",
        "Colorful Style Sheets"
      ],
      correctAnswer: "Cascading Style Sheets",
      explanation: "CSS stands for Cascading Style Sheets."
    }
  ],
  JavaScript: [
    {
      question: "How do you create a function in JavaScript?",
      options: [
        "function = myFunction()",
        "function myFunction()",
        "def myFunction()",
        "create myFunction()"
      ],
      correctAnswer: "function myFunction()",
      explanation: "Use the 'function' keyword followed by the function name."
    }
  ],
  React: [
    {
      question: "Which company developed React?",
      options: ["Google", "Facebook", "Microsoft", "Apple"],
      correctAnswer: "Facebook",
      explanation: "React was originally developed by Facebook."
    }
  ],
  Python: [
    {
      question: "In Python, how do you start a for loop?",
      options: [
        "for i = 1 to 10:",
        "for i in range(10):",
        "for (i=0; i<10; i++)",
        "loop i from 0 to 9"
      ],
      correctAnswer: "for i in range(10):",
      explanation: "Python uses 'for ... in range()' syntax for loops."
    }
  ],
  Java: [
    {
      question: "What keyword starts a class definition in Java?",
      options: ["class", "def", "function", "module"],
      correctAnswer: "class",
      explanation: "Java uses the 'class' keyword to define a class."
    }
  ]
};

// simple in-place Fisher–Yates shuffle, returns new array
const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const getFallbackQuestions = (topic) => {
  const pool = FALLBACK_BY_TOPIC[topic] || [];
  if (pool.length === 0) {
    // if something went wrong, just flatten everything
    return shuffle(Object.values(FALLBACK_BY_TOPIC).flat()).slice(0, 5);
  }
  return shuffle(pool).slice(0, 5);
};

const QuizApp = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [showTopicSelection, setShowTopicSelection] = useState(false);
  const [showDifficultySelection, setShowDifficultySelection] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(60);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const topics = ["HTML", "CSS", "JavaScript", "React", "Python", "Java"];
  const difficulties = ["Easy", "Medium", "Hard"];

  const generateQuestions = useCallback(async (topic, difficulty) => {
    setIsLoading(true);
    setError(null);
    setNotice(null);

    const seed = Math.random().toString(36).substring(2);
    console.log("generateQuestions seed", seed, topic, difficulty);

    // if client isn't usable, fallback
    if (!genAI) {
      const reason = hasApiKey ? "API key invalid or unauthorized" : "no API key provided";
      setNotice(`${reason}; using built-in sample questions.`);
      const questionsFallback = getFallbackQuestions(topic);
      setQuestions(questionsFallback);
      setQuizStarted(true);
      setTimer(60);
      setIsLoading(false);
      return;
    }

    try {
      // Use the correct model name format - no "models/" prefix needed
      // attempt each model in turn until a generation succeeds
      const possibleModels = [
        "gemini-2.5-flash",
        "gemini-2.5-pro",
        "gemini-2.0-flash",
        "gemini-2.0-flash-001",
        "gemini-2.0-flash-lite-001",
        "gemini-2.5-flash-lite"
      ];
      let parsedQuestions = null;
      let selectedModel = null;

      for (const m of possibleModels) {
        try {
          const model = genAI.getGenerativeModel({ model: m });
          console.log("trying generation with model", m);

          const result = await model.generateContent(`Generate 5 multiple choice questions about ${topic} at ${difficulty} level. ` +
            `Ensure the questions are different from any you previously generated for this topic and difficulty; randomize wording and order. ` +
            `Include this seed string to encourage variation: ${seed}.\n\n` +
            `Return ONLY a JSON array in this exact format, nothing else:\n` +
            `[{
  "question": "Question text",
  "options": ["Option1","Option2","Option3","Option4"],
  "correctAnswer": "Option1",
  "explanation": "Brief explanation"
}]`);

          const response = await result.response;
          const text = await response.text();
          console.log("AI response text (", m, "):", text);
          const cleanedText = text.replace(/```json|```/g, "").trim();
          const arr = JSON.parse(cleanedText);
          if (Array.isArray(arr) && arr.length > 0) {
            parsedQuestions = arr;
            selectedModel = m;
            break;
          } else {
            console.warn("model", m, "returned invalid payload");
          }
        } catch (e) {
          console.warn("generation failed with model", m, e.message || e);
          // try next model
        }
      }

      if (!parsedQuestions) {
        throw new Error("All models failed to generate content");
      }

      setQuestions(parsedQuestions);
      setNotice("Questions generated via AI (" + selectedModel + ").");
      setQuizStarted(true);
      setTimer(60);
      setTimeout(() => setNotice(null), 5000);
    } catch (err) {
      console.error("Generation error:", err);
      // fallback, include short message so user knows why
      const msg = err && err.message ? err.message : "unknown error";
      setNotice(`Using fallback questions due to generation error: ${msg}`);
      const questionsFallback = getFallbackQuestions(topic);
      setQuestions(questionsFallback);
      setQuizStarted(true);
      setTimer(60);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimer(60);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
    }
  }, [currentQuestionIndex, questions.length]);

  const handleTimeOut = useCallback(() => {
    if (questions.length === 0) return;
    const q = questions[currentQuestionIndex];
    setUserAnswers(prev => [...prev, {
      question: q.question,
      userAnswer: "Time Out",
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      isCorrect: false
    }]);
    setTimeout(nextQuestion, 1500);
  }, [questions, currentQuestionIndex, nextQuestion]);

  useEffect(() => {
    if (quizStarted && !showResults && questions.length > 0) {
      const timerInterval = setInterval(() => {
        setTimer(prev => {
          if (prev > 0) return prev - 1;
          clearInterval(timerInterval);
          handleTimeOut();
          return 0;
        });
      }, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [quizStarted, showResults, questions, handleTimeOut]);

  // clear error after quiz starts so fallback messages don't block
  useEffect(() => {
    if (error && quizStarted) {
      const clearTimer = setTimeout(() => setError(null), 5000);
      return () => clearTimer && clearTimeout(clearTimer);
    }
  }, [error, quizStarted]);

  const handleAnswerClick = (answer) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    
    const isCorrect = answer === questions[currentQuestionIndex].correctAnswer;
    if (isCorrect) setScore(prev => prev + 1);
    const q = questions[currentQuestionIndex];
    
    setUserAnswers(prev => [...prev, {
      question: q.question,
      userAnswer: answer,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      isCorrect
    }]);
    
    setTimeout(nextQuestion, 1500);
  };

  const restartQuiz = () => {
    setQuizStarted(false);
    setShowTopicSelection(false);
    setShowDifficultySelection(false);
    setSelectedTopic(null);
    setSelectedDifficulty(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
    setTimer(60);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setQuestions([]);
    setError(null);
    setNotice(null);
  };

  return (
    <div className="quiz-wrapper">
      {!quizStarted && !showTopicSelection && !showDifficultySelection && (
        <div className="start-screen">
          <h1>Web Dev Quiz</h1>
          <p>Test your knowledge with AI-generated questions.</p>
          {!hasApiKey && (
            <div className="notice">
              No API key detected. Create a <code>.env</code> file with <code>REACT_APP_GOOGLE_API_KEY</code> and restart to enable AI generation.
            </div>
          )}
          {hasApiKey && !genAI && (
            <div className="notice">
              API key appears invalid or lacks required permissions; quiz will use sample questions.
            </div>
          )}
          <button onClick={() => setShowTopicSelection(true)} className="start-button">
            <span className="icon">▶</span> Start Quiz
          </button>
        </div>
      )}

      {showTopicSelection && (
        <div className="selection-screen">
          <h2>Select a Topic</h2>
          <div className="options-grid">
            {topics.map((topic, index) => (
              <button key={index} onClick={() => {
                setSelectedTopic(topic);
                setShowTopicSelection(false);
                setShowDifficultySelection(true);
              }} className="option-button" disabled={isLoading}>
                {topic}
              </button>
            ))}
          </div>
        </div>
      )}

      {showDifficultySelection && (
        <div className="selection-screen">
          <h2>Select Difficulty</h2>
          <div className="options-grid">
            {difficulties.map((difficulty, index) => (
              <button key={index} onClick={() => {
                setSelectedDifficulty(difficulty);
                setShowDifficultySelection(false);
                generateQuestions(selectedTopic, difficulty);
              }} className="option-button" disabled={isLoading}>
                {difficulty}
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="loading-screen">
          <p>Generating questions...</p>
          <div className="spinner"></div>
        </div>
      )}

      {notice && (
        <div className="notice">
          {notice}
        </div>
      )}

      {/* show the error screen only if quiz hasn't started yet */}
      {error && !quizStarted && (
        <div className="error-screen">
          <p>{error}</p>
          <button onClick={restartQuiz} className="restart-button">Try Again</button>
        </div>
      )}

      {quizStarted && !showResults && questions.length > 0 && (
        <div className="question-container">
          <div className="question-header">
            <span>Question {currentQuestionIndex + 1}/{questions.length}</span>
            <div className="topic-difficulty">{selectedTopic} • {selectedDifficulty}</div>
            <div className="timer">⏱️ {timer}s</div>
          </div>

          <div className="question-card">
            <h2>{questions[currentQuestionIndex].question}</h2>
            <div className="options-grid">
              {questions[currentQuestionIndex].options.map((option, index) => {
                let cls = "option-button";
                if (selectedAnswer !== null) {
                  if (option === questions[currentQuestionIndex].correctAnswer) {
                    cls += " correct";
                  } else if (option === selectedAnswer) {
                    cls += " incorrect";
                  }
                }
                return (
                  <button key={index} onClick={() => handleAnswerClick(option)} disabled={selectedAnswer !== null} className={cls}>
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showResults && (
        <div className="results-screen">
          <h2>Quiz Complete!</h2>
          <div className="score-display">
            <span className="score">{score}</span><span>/</span><span>{questions.length}</span>
          </div>
          <div className="report">
            {userAnswers.map((ans, idx) => (
              <div key={idx} className={`report-item ${ans.isCorrect ? 'correct' : 'incorrect'}`}>
                <h3>Q{idx + 1}: {ans.question}</h3>
                <p>Your answer: {ans.userAnswer}</p>
                {!ans.isCorrect && <p>Correct answer: {ans.correctAnswer}</p>}
                {ans.explanation && <p className="explanation">{ans.explanation}</p>}
              </div>
            ))}
          </div>
          <div className="results-actions">
            <button onClick={restartQuiz} className="restart-button">Restart Quiz</button>
            <button onClick={() => window.print()} className="download-button">Download PDF</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizApp;