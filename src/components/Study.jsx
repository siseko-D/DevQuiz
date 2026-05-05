import React from "react";
import { useNavigate } from "react-router-dom";

const Study = () => {
  const navigate = useNavigate();
  
  const categories = {
    "🎨 Frontend": ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Vue.js"],
    "⚙️ Backend": ["Node.js", "Python", "Java", "PHP", "Ruby", "Go"],
    "🗄️ Databases": ["SQL", "MongoDB", "PostgreSQL", "MySQL", "Firebase"]
  };

  const handleTopicSelect = (topic) => {
    navigate(`/study/${topic.toLowerCase()}`);
  };

  return (
    <div className="study-container">
      <h1>Study Resources</h1>
      <p className="study-intro">Select a topic to explore study materials and resources.</p>
      
      {Object.entries(categories).map(([category, categoryTopics]) => (
        <div key={category} style={{ marginBottom: "2rem" }}>
          <h3 style={{ 
            color: "#4caf50", 
            marginBottom: "1rem",
            fontSize: "1.2rem",
            borderLeft: "3px solid #4caf50",
            paddingLeft: "1rem"
          }}>
            {category}
          </h3>
          <div className="topics-list">
            {categoryTopics.map((topic, index) => (
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
      ))}
    </div>
  );
};

export default Study;