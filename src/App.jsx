import React from "react";
import { Routes, Route } from "react-router-dom";

// ============ IMPORT ALL CSS FILES ============
import "./styles/index.css";
import "./styles/App.css";
import "./styles/navbar.css";
import "./styles/hamburger.css";
import "./styles/footer.css";
import "./styles/quiz.css";
import "./styles/study.css";
import "./styles/about.css";
import "./styles/modal.css";
import "./styles/leaderboard.css";

// component imports
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import About from "./components/About";
import Study from "./components/Study";
import StudyTopic from "./components/StudyTopic";
import QuizApp from "./components/QuizApp/QuizApp";
import Leaderboard from "./components/Leaderboard";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<QuizApp />} />
          <Route path="/study" element={<Study />} />
          <Route path="/study/:topic" element={<StudyTopic />} />
          <Route path="/about" element={<About />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;