import React from "react";

// simple footer, memoized for consistency with Navbar
const Footer = React.memo(() => (
  <footer className="footer">
    <div className="footer-container">
      <p>© 2026 DevQuiz. All rights reserved.</p>
    </div>
  </footer>
));

export default Footer;