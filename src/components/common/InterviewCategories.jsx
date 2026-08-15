import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../assets/styles/InterviewCategories.css";

function InterviewCategories() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Carry the chosen category through to the dashboard so the interview
  // setup form opens already filled in. Logged-out visitors sign up first.
  const handleStartPractice = (categoryName) => {
    if (!user) {
      navigate("/register");
      return;
    }
    navigate("/dashboard", { state: { category: categoryName } });
  };

  const categories = [
    {
      name: "HR Interview",
      icon: "👤",
      description: "Practice HR and communication questions.",
    },
    {
      name: "Technical",
      icon: "💻",
      description: "Test your technical knowledge.",
    },
    {
      name: "Coding",
      icon: "⌨️",
      description: "Practice coding and problem solving.",
    },
    {
      name: "Behavioral",
      icon: "🧠",
      description: "Improve your behavioral responses.",
    },
    {
      name: "System Design",
      icon: "🏗️",
      description: "Practice system design interviews.",
    },
    {
      name: "Company Wise",
      icon: "🏢",
      description: "Prepare for company-specific interviews.",
    },
    {
      name: "Aptitude",
      icon: "📊",
      description: "Improve aptitude and reasoning skills.",
    },
    {
      name: "Group Discussion",
      icon: "👥",
      description: "Practice group discussion skills.",
    },
  ];

  return (
    <section className="category-section">
      <div className="category-header">
        <div>
          <span className="category-label">
            PRACTICE & PREPARE
          </span>

          <h2>Interview Categories</h2>

          <p>
            Choose an interview category and start practicing with AI.
          </p>
        </div>
      </div>

      <div className="category-grid">
        {categories.map((category) => (
          <div
            className="category-card"
            key={category.name}
          >
            <div className="category-icon">
              {category.icon}
            </div>

            <h3>{category.name}</h3>

            <p>{category.description}</p>

            <button
              type="button"
              className="category-btn"
              onClick={() => handleStartPractice(category.name)}
            >
              Start Practice
              <span>→</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default InterviewCategories;