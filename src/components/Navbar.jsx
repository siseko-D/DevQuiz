import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// memoize to avoid unnecessary re-renders when parent state changes
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
          <span className="icon">&lt;&gt;</span>
          <span>Web Dev Quiz</span>
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