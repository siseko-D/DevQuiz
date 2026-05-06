import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigation = (path) => {
    console.log("Navigating to:", path);
    setMenuOpen(false); // Close menu first
    navigate(path);     // Then move to the new page
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="logo" onClick={() => handleNavigation("/")}>
            <span className="icon">{`</>`}</span>
            <span>DevQuiz</span>
          </div>

          <button 
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Navigation"
          >
            <span className="hamburger-box">
              <span className="hamburger-inner"></span>
            </span>
          </button>

          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            <div 
              onClick={() => handleNavigation("/")}
              className={location.pathname === "/" ? "active" : ""}
            >
              🏠 Home
            </div>
            <div 
              onClick={() => handleNavigation("/study")}
              className={location.pathname === "/study" ? "active" : ""}
            >
              📚 Study
            </div>
            <div 
              onClick={() => handleNavigation("/leaderboard")}
              className={location.pathname === "/leaderboard" ? "active" : ""}
            >
              🏆 Leaderboard
            </div>
            <div 
              onClick={() => handleNavigation("/about")}
              className={location.pathname === "/about" ? "active" : ""}
            >
              ℹ️ About
            </div>
          </div>
        </div>
      </nav>

      {/* This overlay must be behind the nav-links z-index wise */}
      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>}
    </>
  );
};

export default Navbar;