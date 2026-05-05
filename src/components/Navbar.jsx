import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = React.memo(() => {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("/");

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo" onClick={() => navigate("/")}> 
          <span className="icon">{`</>`}</span>
          <span>DevQuiz</span>
        </div>
        <div className="nav-links">
          <a
            href="/"
            className={activeLink === "/" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
              setActiveLink("/");
            }}
          >
            <span>Home</span>
          </a>
          <a
            href="/study"
            className={activeLink.startsWith("/study") ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              navigate("/study");
              setActiveLink("/study");
            }}
          >
            <span>Study</span>
          </a>
          <a
            href="/leaderboard"
            className={activeLink === "/leaderboard" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              navigate("/leaderboard");
              setActiveLink("/leaderboard");
            }}
          >
            <span>Leaderboard</span>
          </a>
          <a
            href="/about"
            className={activeLink === "/about" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              navigate("/about");
              setActiveLink("/about");
            }}
          >
            <span>About</span>
          </a>
        </div>
      </div>
    </nav>
  );
});

export default Navbar;