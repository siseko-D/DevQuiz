import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TOPIC_LINKS = {
  // Frontend
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
  typescript: {
    tutorial: "https://www.w3schools.com/typescript/",
    documentation: "https://www.typescriptlang.org/docs/",
    examples: "https://www.typescriptlang.org/play/"
  },
  vuejs: {
    tutorial: "https://vuejs.org/guide/introduction.html",
    documentation: "https://vuejs.org/api/",
    examples: "https://vuejs.org/examples/"
  },
  // Backend
  nodejs: {
    tutorial: "https://www.w3schools.com/nodejs/",
    documentation: "https://nodejs.org/en/docs/",
    examples: "https://nodejs.org/en/docs/guides/"
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
  },
  php: {
    tutorial: "https://www.w3schools.com/php/",
    documentation: "https://www.php.net/docs.php",
    examples: "https://www.w3schools.com/php/php_examples.asp"
  },
  ruby: {
    tutorial: "https://www.w3schools.com/ruby/",
    documentation: "https://ruby-doc.org/",
    examples: "https://www.ruby-lang.org/en/documentation/quickstart/"
  },
  go: {
    tutorial: "https://go.dev/doc/tutorial/",
    documentation: "https://go.dev/doc/",
    examples: "https://go.dev/play/"
  },
  // Databases
  sql: {
    tutorial: "https://www.w3schools.com/sql/",
    documentation: "https://learn.microsoft.com/en-us/sql/sql-server/",
    examples: "https://www.w3schools.com/sql/sql_examples.asp"
  },
  mongodb: {
    tutorial: "https://www.mongodb.com/docs/manual/tutorial/",
    documentation: "https://www.mongodb.com/docs/",
    examples: "https://www.mongodb.com/developer/products/mongodb/cheat-sheet/"
  },
  postgresql: {
    tutorial: "https://www.postgresql.org/docs/tutorial.html",
    documentation: "https://www.postgresql.org/docs/",
    examples: "https://www.postgresqltutorial.com/"
  },
  mysql: {
    tutorial: "https://www.w3schools.com/mysql/",
    documentation: "https://dev.mysql.com/doc/",
    examples: "https://www.mysqltutorial.org/"
  },
  firebase: {
    tutorial: "https://firebase.google.com/docs",
    documentation: "https://firebase.google.com/docs/reference",
    examples: "https://firebase.google.com/docs/samples"
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
    const links = TOPIC_LINKS[lower] || {
      tutorial: "#",
      documentation: "#",
      examples: "#"
    };
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