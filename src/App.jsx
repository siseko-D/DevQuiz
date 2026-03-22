import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/App.css";

// component imports
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import About from "./components/About";
import Study from "./components/Study";
import StudyTopic from "./components/StudyTopic";
import QuizApp from "./components/QuizApp";


function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<QuizApp />} />
            <Route path="/study" element={<Study />} />
            <Route path="/study/:topic" element={<StudyTopic />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;


