import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../assets/styles/DashboardPreview.css";

function DashboardPreview() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleViewDashboard = () => {
    navigate(user ? "/dashboard" : "/register");
  };

  return (
    <section className="dashboard">

      <div className="dashboard-left">

        <h2>Track Your Interview Performance</h2>

        <p>
          Monitor your communication,
          technical skills,
          grammar,
          confidence,
          and overall interview score.
        </p>

        <button type="button" onClick={handleViewDashboard}>
          {user ? "View Dashboard" : "Create Free Account"}
        </button>

      </div>

      <div className="dashboard-right">

        <div className="score-card">
          <h3>Communication</h3>
          <div className="progress">
            <div className="progress-fill one"></div>
          </div>
        </div>

        <div className="score-card">
          <h3>Technical</h3>
          <div className="progress">
            <div className="progress-fill two"></div>
          </div>
        </div>

        <div className="score-card">
          <h3>Grammar</h3>
          <div className="progress">
            <div className="progress-fill three"></div>
          </div>
        </div>

        <div className="score-card">
          <h3>Confidence</h3>
          <div className="progress">
            <div className="progress-fill four"></div>
          </div>
        </div>

      </div>

    </section>
  );
}

export default DashboardPreview;
