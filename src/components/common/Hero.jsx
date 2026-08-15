import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { scrollToSection } from "../../utils/scrollToSection";
import "../../assets/styles/Hero.css";

function Hero() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Already signed in? Skip the sign-up form and go straight to the app.
  const handleGetStarted = () => {
    navigate(user ? "/dashboard" : "/register");
  };

  const handleExploreFeatures = () => {
    scrollToSection("features");
  };

  return (
    <section className="hero">

      <div className="hero-content">

        <span className="hero-badge">
          🚀 AI Powered Interview Preparation Platform
        </span>

        <h1>
          Ace Your <span>Dream Interview</span> with AI
        </h1>

        <p>
          Build confidence with AI-powered resume analysis,
          personalized interview questions, mock interviews,
          voice recording, detailed feedback and performance tracking.
        </p>

        <div className="hero-buttons">

          <button
            type="button"
            className="primary-btn"
            onClick={handleGetStarted}
          >
            {user ? "Go to Dashboard" : "Get Started"}
          </button>

          <button
            type="button"
            className="secondary-btn"
            onClick={handleExploreFeatures}
          >
            Explore Features
          </button>

        </div>

        <div className="hero-stats">

          <div className="stat-card">
            <h2>1000+</h2>
            <p>Interview Questions</p>
          </div>

          <div className="stat-card">
            <h2>100+</h2>
            <p>Top Companies</p>
          </div>

          <div className="stat-card">
            <h2>24/7</h2>
            <p>AI Assistance</p>
          </div>

        </div>

      </div>

      <div className="hero-image">

        <img
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900"
          alt="AI Interview Preparation"
        />

      </div>

    </section>
  );
}

export default Hero;
