import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserInterviewHistory } from "../../services/supabase/interviewResults";
import "../../assets/styles/RecentInterviews.css";

function RecentInterviews({ onViewDetails }) {
  const { user } = useAuth();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reads from Supabase, and falls back to this browser's saved copy if the
  // network or the security rules are not available yet.
  const loadHistory = async () => {
    if (!user?.uid) {
      setHistory([]);
      setLoading(false);
      return;
    }

    try {
      const data = await getUserInterviewHistory(user.uid);

      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Error loading interview history:",
        error
      );

      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();

    const handleFocus = () => {
      loadHistory();
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

  const formatDate = (createdAt) => {
    if (!createdAt) {
      return "Recent";
    }

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
      return "Recent";
    }

    const now = new Date();
    const diffMs = now - date;

    const diffMinutes = Math.floor(
      diffMs / (1000 * 60)
    );

    const diffHours = Math.floor(
      diffMs / (1000 * 60 * 60)
    );

    const diffDays = Math.floor(
      diffMs / (1000 * 60 * 60 * 24)
    );

    if (diffMinutes < 1) {
      return "Just now";
    }

    if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    }

    if (diffHours < 24) {
      return `${diffHours} hr ago`;
    }

    if (diffDays === 1) {
      return "Yesterday";
    }

    if (diffDays < 7) {
      return `${diffDays} days ago`;
    }

    return date.toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !==
          now.getFullYear()
            ? "numeric"
            : undefined
      }
    );
  };

  const getScore = (item) => {
    const score = Number(
      item?.overallScore ??
        item?.score ??
        item?.totalScore ??
        item?.percentage ??
        0
    );

    return Number.isFinite(score)
      ? Math.round(score)
      : 0;
  };

  const getScoreColor = (score) => {
    if (score >= 80) {
      return "#10b981";
    }

    if (score >= 65) {
      return "#f59e0b";
    }

    return "#ef4444";
  };

  const displayList = history.slice(0, 4);

  return (
    <section className="recent-interviews dashboard-card">

      <div className="recent-header">
        <div>
          <span className="recent-label">
            PRACTICE HISTORY
          </span>

          <h2>
            Recent Interviews
          </h2>
        </div>

        {history.length > 0 &&
          onViewDetails && (
            <button
              type="button"
              className="view-all-btn"
              onClick={() =>
                onViewDetails(null)
              }
            >
              View All <span>→</span>
            </button>
          )}
      </div>

      {loading ? (
        <div
          className="interview-empty"
          style={{
            padding: "30px 10px",
            textAlign: "center",
            color: "#64748b"
          }}
        >
          Loading interview history...
        </div>
      ) : displayList.length === 0 ? (
        <div
          className="interview-empty"
          style={{
            padding: "35px 10px",
            textAlign: "center"
          }}
        >
          <div
            style={{
              fontSize: "34px",
              marginBottom: "10px"
            }}
          >
            🎤
          </div>

          <h3
            style={{
              margin: "0 0 6px",
              color: "#334155",
              fontSize: "16px"
            }}
          >
            No interviews yet
          </h3>

          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "13px"
            }}
          >
            Complete your first mock interview
            to see your practice history here.
          </p>
        </div>
      ) : (
        <div className="interview-list">

          {displayList.map(
            (item, index) => {
              const score =
                getScore(item);

              const scoreColor =
                getScoreColor(score);

              const category =
                item?.category ||
                item?.interviewType ||
                "Mock Interview";

              const role =
                item?.role ||
                item?.jobTitle ||
                item?.position ||
                "Software Developer";

              const verdict =
                item?.verdict ||
                item?.recommendation ||
                (score >= 80
                  ? "Strong"
                  : score >= 65
                  ? "Consider"
                  : "Needs Work");

              return (
                <div
                  className="interview-item"
                  key={
                    item.id ||
                    `${role}-${index}`
                  }
                  style={{
                    cursor:
                      onViewDetails
                        ? "pointer"
                        : "default"
                  }}
                  onClick={() =>
                    onViewDetails &&
                    onViewDetails(item)
                  }
                >

                  <div className="interview-info">

                    <div
                      className="company-icon"
                      style={{
                        background:
                          "#eff6ff",
                        color:
                          "#2563eb",
                        fontWeight:
                          "700"
                      }}
                    >
                      {category
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <h3>
                        {role}
                      </h3>

                      <p>
                        {category}
                        <span>
                          {" "}
                          ·{" "}
                        </span>
                        {formatDate(
                          item.createdAt
                        )}
                      </p>
                    </div>

                  </div>

                  <div className="interview-score">

                    <strong
                      style={{
                        color:
                          scoreColor
                      }}
                    >
                      {score}%
                    </strong>

                    <span>
                      {verdict}
                    </span>

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

    </section>
  );
}

export default RecentInterviews;