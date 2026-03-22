import React from "react";

const About = () => {
  const features = [
    { icon: "💻", title: "Multiple Technologies", description: "Covering HTML, CSS, JavaScript, React, Python, and more." },
    { icon: "⏱️", title: "Timed Challenges", description: "60 seconds per question to test your quick thinking." },
    { icon: "📊", title: "Detailed Analytics", description: "Track your progress and identify weak areas." }
  ];

  return (
    <div className="about-container">
      <h1>About Web Dev Quiz</h1>
      <div className="about-content">
        <section className="mission-section">
          <h2>Our Mission</h2>
          <p>Web Dev Quiz is designed to help developers test and improve their knowledge of web development technologies through interactive, challenging quizzes.</p>
        </section>
        <section className="features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;