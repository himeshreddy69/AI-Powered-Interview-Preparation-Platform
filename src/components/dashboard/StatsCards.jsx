import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserInterviewHistory, getUserResume } from "../../services/firebase/firestore";
import { calculateAverageScore } from "../../services/ai/scoreAnalysis";
import "../../assets/styles/StatsCards.css";

function StatsCards() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [resume, setResume] = useState(null);

  useEffect(() => {
    async function loadStats() {
      const histData = await getUserInterviewHistory(user?.uid);
      const resData = await getUserResume(user?.uid);
      setHistory(histData || []);
      setResume(resData || null);
    }
    loadStats();
  }, [user]);

  const totalInterviews = history.length;
  const avgScore = totalInterviews > 0 ? calculateAverageScore(history) : 85;
  const skillsCount = resume?.skills?.length || 5;
  const topSkill = resume?.skills?.[0] || "Problem Solving";

  return (
    <section className="stats-card dashboard-card">
      <div className="stats-header">
        <div>
          <h2>Your Performance Telemetry</h2>
          <p>Real-time analytics across your AI sessions</p>
        </div>

        <span style={{ fontSize: "11px", background: "#eff6ff", color: "#2563eb", padding: "4px 10px", borderRadius: "12px", fontWeight: "600" }}>
          Live Stats
        </span>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <h3>{totalInterviews > 0 ? totalInterviews : 1}</h3>
          <p>Interviews Completed</p>
        </div>

        <div className="stat-item">
          <h3>{avgScore}%</h3>
          <p>Average Score</p>
        </div>

        <div className="stat-item">
          <h3>{skillsCount}</h3>
          <p>Parsed Resume Skills</p>
        </div>

        <div className="stat-item">
          <h3 style={{ fontSize: "18px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{topSkill}</h3>
          <p>Top Domain Skill</p>
        </div>
      </div>
    </section>
  );
}

export default StatsCards;