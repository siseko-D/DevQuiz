import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TOPIC_LINKS = {
  html: {
    tutorial: "https://www.w3schools.com/html/",
    documentation: "https://developer.mozilla.org/docs/Web/HTML",
    examples: "https://www.w3schools.com/html/html_examples.asp"
  },
  css: {
    tutorial: "https://www.w3schools.com/css/",
    documentation: "https://developer.mozilla.org/docs/Web/CSS",
    examples: "https://www.w3schools.com/css/css_examples.asp"
  },
  javascript: {
    tutorial: "https://www.w3schools.com/js/",
    documentation: "https://developer.mozilla.org/docs/Web/JavaScript",
    examples: "https://www.w3schools.com/js/js_examples.asp"
  },
  react: {
    tutorial: "https://www.w3schools.com/react/",
    documentation: "https://react.dev/learn",
    examples: "https://www.w3schools.com/react/react_examples.asp"
  },
  python: {
    tutorial: "https://www.w3schools.com/python/",
    documentation: "https://docs.python.org/3/",
    examples: "https://www.w3schools.com/python/python_examples.asp"
  },
  java: {
    tutorial: "https://www.w3schools.com/java/",
    documentation: "https://docs.oracle.com/javase/8/docs/",
    examples: "https://www.w3schools.com/java/java_examples.asp"
  }
};

const StudyTopic = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const lower = topic.toLowerCase();
    const formatted = topic.charAt(0).toUpperCase() + topic.slice(1);
    const links = TOPIC_LINKS[lower] || {};
    setTimeout(() => {
      setResources([
        { type: "Tutorial", title: `${formatted} Tutorial`, url: links.tutorial || "#" },
        { type: "Documentation", title: `${formatted} Reference`, url: links.documentation || "#" },
        { type: "Examples", title: `${formatted} Examples`, url: links.examples || "#" }
      ]);
      setIsLoading(false);
    }, 500);
  }, [topic]);

  return (
    <div className="study-topic-container">
      <button onClick={() => navigate("/study")} className="back-button">
        <span>←</span> Back to Topics
      </button>
      <h1>{topic.charAt(0).toUpperCase() + topic.slice(1)} Resources</h1>
      {isLoading ? (
        <div className="loading-message">Loading resources...</div>
      ) : (
        <div className="resources-grid">
          {resources.map((resource, index) => (
            <a key={index} href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-card">
              <div className="resource-type">{resource.type}</div>
              <h3>{resource.title}</h3>
              <p className="resource-url">{resource.url}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyTopic;