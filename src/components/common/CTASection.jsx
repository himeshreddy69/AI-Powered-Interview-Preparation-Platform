import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../assets/styles/CTASection.css";

function CTASection() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStart = () => {
    navigate(user ? "/dashboard" : "/register");
  };

  return (
    <section className="cta">

      <h2>
        Ready to Crack Your Dream Interview?
      </h2>

      <p>
        Join thousands of students preparing with AI.
      </p>

      <button type="button" onClick={handleStart}>
        {user ? "Go to Dashboard" : "Start For Free"}
      </button>

    </section>
  );
}

export default CTASection;
