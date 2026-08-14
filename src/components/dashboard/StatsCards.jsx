import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserInterviewHistory } from "../../services/supabase/interviewResults";
import { getUserResume } from "../../services/supabase/resumes";
import "../../assets/styles/StatsCards.css";

function StatsCards() {
  const { user } = useAuth();

  const [history, setHistory] = useState([]);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reads from Supabase, and falls back to this browser's saved copy if the
  // network or the security rules are not available yet.
  const loadStats = async () => {
    if (!user?.uid) {
      setHistory([]);
      setResume(null);
      setLoading(false);
      return;
    }

    try {
      const [interviewData, resumeData] = await Promise.all([
        getUserInterviewHistory(user.uid),
        getUserResume(user.uid),
      ]);

      setHistory(Array.isArray(interviewData) ? interviewData : []);
      setResume(resumeData || null);
    } catch (error) {
      console.error("Error loading dashboard data:", error);

      setHistory([]);
      setResume(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();

    const handleFocus = () => {
      loadStats();
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );
    };
  }, [user]);

  const totalInterviews = history.length;

  const validScores = history
    .map((item) => Number(item?.overallScore))
    .filter(
      (score) =>
        Number.isFinite(score) &&
        score >= 0
    );

  const averageScore =
    validScores.length > 0
      ? Math.round(
          validScores.reduce(
            (sum, score) => sum + score,
            0
          ) / validScores.length
        )
      : 0;

  const skills = Array.isArray(resume?.skills)
    ? resume.skills
    : [];

  const skillsCount = skills.length;

  const topSkill =
    skills.length > 0
      ? skills[0]
      : "No skill data";

  if (loading) {
    return (
      <section className="stats-card dashboard-card">
        <div className="stats-header">
          <div>
            <h2>Your Performance Telemetry</h2>
            <p>
              Loading your latest analytics...
            </p>
          </div>

          <span
            style={{
              fontSize: "11px",
              background: "#eff6ff",
              color: "#2563eb",
              padding: "4px 10px",
              borderRadius: "12px",
              fontWeight: "600"
            }}
          >
            Loading
          </span>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <h3>—</h3>
            <p>Interviews Completed</p>
          </div>

          <div className="stat-item">
            <h3>—</h3>
            <p>Average Score</p>
          </div>

          <div className="stat-item">
            <h3>—</h3>
            <p>Parsed Resume Skills</p>
          </div>

          <div className="stat-item">
            <h3>—</h3>
            <p>Top Domain Skill</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="stats-card dashboard-card">
      <div className="stats-header">
        <div>
          <h2>Your Performance Telemetry</h2>
          <p>
            Real-time analytics across your AI
            sessions
          </p>
        </div>

        <span
          style={{
            fontSize: "11px",
            background: "#eff6ff",
            color: "#2563eb",
            padding: "4px 10px",
            borderRadius: "12px",
            fontWeight: "600"
          }}
        >
          Live Stats
        </span>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <h3>{totalInterviews}</h3>
          <p>Interviews Completed</p>
        </div>

        <div className="stat-item">
          <h3>{averageScore}%</h3>
          <p>Average Score</p>
        </div>

        <div className="stat-item">
          <h3>{skillsCount}</h3>
          <p>Parsed Resume Skills</p>
        </div>

        <div className="stat-item">
          <h3
            style={{
              fontSize: "18px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap"
            }}
            title={topSkill}
          >
            {topSkill}
          </h3>

          <p>Top Domain Skill</p>
        </div>
      </div>
    </section>
  );
}

export default StatsCards;