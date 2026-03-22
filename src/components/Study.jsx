import React from "react";
import { useNavigate } from "react-router-dom";

const Study = () => {
  const navigate = useNavigate();
  const topics = ["HTML", "CSS", "JavaScript", "React", "Python", "Java"];

  const handleTopicSelect = (topic) => {
    navigate(`/study/${topic.toLowerCase()}`);
  };

  return (
    <div className="study-container">
      <h1>Study Resources</h1>
      <p className="study-intro">Select a topic to explore study materials and resources.</p>
      <div className="topics-list">
        {topics.map((topic, index) => (
          <div key={index} className="topic-card" onClick={() => handleTopicSelect(topic)}>
            <div className="topic-info">
              <span className="topic-icon">📚</span>
              <h3>{topic}</h3>
            </div>
            <span className="chevron-icon">→</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Study;