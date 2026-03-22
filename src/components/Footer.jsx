import React from "react";

// simple footer, memoized for consistency with Navbar
const Footer = React.memo(() => (
  <footer className="footer">
    <div className="footer-container">
      <p>© 2026 Web Dev Quiz. All rights reserved.</p>
    </div>
  </footer>
));

export default Footer;