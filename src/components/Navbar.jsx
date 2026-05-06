import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleNavigation = (path) => {
    setMenuOpen(false);
    navigate(path); // ❌ removed timeout (THIS WAS BREAKING THINGS)
  };

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">

          <div className="logo" onClick={() => handleNavigation("/")}>
            <span className="icon">{`</>`}</span>
            <span>DevQuiz</span>
          </div>

          {/* HAMBURGER */}
          <button
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle Menu"
          >
            <span className="hamburger-box">
              <span className="hamburger-inner"></span>
            </span>
          </button>

          {/* NAV LINKS */}
          <div
            className={`nav-links ${menuOpen ? "open" : ""}`}
            ref={menuRef}
          >
            <button onClick={() => handleNavigation("/")}>🏠 Home</button>
            <button onClick={() => handleNavigation("/study")}>📚 Study</button>
            <button onClick={() => handleNavigation("/leaderboard")}>🏆 Leaderboard</button>
            <button onClick={() => handleNavigation("/about")}>ℹ️ About</button>
          </div>

        </div>
      </nav>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;