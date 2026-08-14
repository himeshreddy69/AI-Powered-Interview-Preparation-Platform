import "../../assets/styles/Footer.css";
import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-container">

        {/* Company */}
        <div className="footer-column">
          <h2 className="footer-logo">DEBIC</h2>

          <p>
            AI Powered Interview Preparation Platform that helps students
            prepare for Technical, HR, Coding and Behavioral interviews using AI.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h3>Quick Links</h3>

          <p><a href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</a></p>
          <p><a href="#features" style={{ color: "inherit", textDecoration: "none" }}>Features</a></p>
          <p><a href="#companies" style={{ color: "inherit", textDecoration: "none" }}>Companies</a></p>
          <p><a href="/about" style={{ color: "inherit", textDecoration: "none" }}>About</a></p>
          <p><a href="#contact" style={{ color: "inherit", textDecoration: "none" }}>Contact</a></p>
          <p><a href="/login" style={{ color: "inherit", textDecoration: "none" }}>Login</a></p>
          <p><a href="/register" style={{ color: "inherit", textDecoration: "none" }}>Register</a></p>
        </div>

        {/* Interview Types */}
        <div className="footer-column">
          <h3>Interview Types</h3>

          <p>HR Interview</p>
          <p>Technical Interview</p>
          <p>Coding Interview</p>
          <p>Behavioral Interview</p>
          <p>Company Specific</p>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h3>Contact</h3>

          <p>
            <FaEnvelope /> reddyhimesh12@gmail.com
          </p>

          <p>
            <FaPhoneAlt /> +91 93925 80322
          </p>

          <p>
            <FaMapMarkerAlt /> Kerala, India
          </p>

          <div className="social-icons">
            <FaGithub />
            <FaLinkedin />
            <FaInstagram />
          </div>
        </div>

      </div>

      <hr />

      <div className="footer-bottom">
        <p>© 2026 DEBIC. All Rights Reserved.</p>

        <p>
          Made for <strong>DEBIC Data Artisans Private Limited</strong>
        </p>

        <p>
          Developed using React • Firebase • Gemini AI
        </p>
      </div>
    </footer>
  );
}

export default Footer;