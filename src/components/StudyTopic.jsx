import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TOPIC_LINKS = {
  // Frontend
  html: {
    tutorial: "https://www.w3schools.com/html/",
    documentation: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    examples: "https://www.w3schools.com/html/html_examples.asp"
  },
  css: {
    tutorial: "https://www.w3schools.com/css/",
    documentation: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    examples: "https://www.w3schools.com/css/css_examples.asp"
  },
  javascript: {
    tutorial: "https://www.w3schools.com/js/",
    documentation: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
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
  "vue.js": {
    tutorial: "https://www.w3schools.com/vue/",
    documentation: "https://vuejs.org/guide/introduction.html",
    examples: "https://www.w3schools.com/vue/vue_examples.php"
  },
  // Backend
  "node.js": {
    tutorial: "https://www.w3schools.com/nodejs/",
    documentation: "https://nodejs.org/en/docs/",
    examples: "https://www.w3schools.com/nodejs/nodejs_examples.asp"
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
    tutorial: "https://www.w3schools.com/mongodb/",
    documentation: "https://www.mongodb.com/docs/",
    examples: "https://www.mongodb.com/developer/products/mongodb/cheat-sheet/"
  },
  postgresql: {
    tutorial: "https://www.w3schools.com/postgresql/",
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
    const lowerTopic = topic.toLowerCase();
    const formattedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
    
    // Get links, with fallback for missing topics
    let links = TOPIC_LINKS[lowerTopic];
    
    // Handle special cases
    if (lowerTopic === "vue.js") {
      links = TOPIC_LINKS["vue.js"];
    } else if (lowerTopic === "node.js") {
      links = TOPIC_LINKS["node.js"];
    } else if (!links) {
      // Fallback for any missing topics
      links = {
        tutorial: `https://www.w3schools.com/${lowerTopic}/`,
        documentation: `https://developer.mozilla.org/en-US/docs/Web/${formattedTopic}`,
        examples: `https://www.w3schools.com/${lowerTopic}/${lowerTopic}_examples.asp`
      };
    }
    
    setTimeout(() => {
      setResources([
        { type: "📚 Tutorial", title: `${formattedTopic} Tutorial`, url: links.tutorial || "#" },
        { type: "📖 Documentation", title: `${formattedTopic} Documentation`, url: links.documentation || "#" },
        { type: "💻 Examples", title: `${formattedTopic} Code Examples`, url: links.examples || "#" }
      ]);
      setIsLoading(false);
    }, 300);
  }, [topic]);

  return (
    <div className="study-topic-container">
      <button onClick={() => navigate("/study")} className="back-button">
        <span>←</span> Back to Topics
      </button>
      <h1>{topic.charAt(0).toUpperCase() + topic.slice(1)} Study Resources</h1>
      <p style={{ color: "#ccc", marginBottom: "2rem" }}>
        Curated learning materials to master {topic}
      </p>
      
      {isLoading ? (
        <div className="loading-message">Loading resources...</div>
      ) : (
        <div className="resources-grid">
          {resources.map((resource, index) => (
            <a 
              key={index} 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="resource-card"
            >
              <div className="resource-type">{resource.type}</div>
              <h3>{resource.title}</h3>
              <p style={{ color: "#4caf50", marginTop: "10px", fontSize: "0.85rem" }}>
                Click to open →
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyTopic;