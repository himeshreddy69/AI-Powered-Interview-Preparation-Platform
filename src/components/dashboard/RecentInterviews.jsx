import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserInterviewHistory } from "../../services/supabase/interviewResults";
import "../../assets/styles/RecentInterviews.css";

function RecentInterviews({ onViewDetails, onViewAll }) {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      const data = await getUserInterviewHistory(user?.uid);
      if (cancelled) return;
      setHistory(data || []);
      setLoading(false);
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const displayList = history.slice(0, 4);

  return (
    <section className="recent-interviews dashboard-card">
      <div className="recent-header">
        <div>
          <span className="recent-label">PRACTICE HISTORY</span>
          <h2>Recent Interviews</h2>
        </div>

        {onViewAll && history.length > 0 && (
          <button type="button" className="view-all-btn" onClick={onViewAll}>
            View All <span>→</span>
          </button>
        )}
      </div>

      {!loading && history.length === 0 && (
        <p className="recent-empty">
          You have not completed any interviews yet. Your finished sessions will
          appear here.
        </p>
      )}

      <div className="interview-list">
        {displayList.map((item, index) => {
          const score = item.overallScore || 0;
          const scoreColor = score >= 80 ? "#10b981" : score >= 65 ? "#f59e0b" : "#ef4444";
          const formattedDate = item.createdAt && item.createdAt.includes("T")
            ? new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })
            : item.createdAt || "Recent";

          return (
            <div className="interview-item" key={item.id || index} style={{ cursor: onViewDetails ? "pointer" : "default" }} onClick={() => onViewDetails && onViewDetails(item)}>
              <div className="interview-info">
                <div className="company-icon" style={{ background: "#eff6ff", color: "#2563eb", fontWeight: "700" }}>
                  {(item.category || "I").charAt(0)}
                </div>

                <div>
                  <h3>{item.role || "Software Developer"}</h3>
                  <p>
                    {item.category || "Mock Interview"} <span>·</span> {formattedDate}
                  </p>
                </div>
              </div>

              <div className="interview-score">
                <strong style={{ color: scoreColor }}>{score}%</strong>
                <span>{item.verdict || "Score"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default RecentInterviews;