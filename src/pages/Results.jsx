import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserInterviewHistory } from "../services/supabase/interviewResults";
import { getPerformanceBadge } from "../services/ai/scoreAnalysis";

function Results({ resultData, onRetake }) {
  const { user } = useAuth();
  const [activeResult, setActiveResult] = useState(resultData || null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function loadLatestResult() {
      if (resultData) {
        setActiveResult(resultData);
        return;
      }
      const hist = await getUserInterviewHistory(user?.uid);
      setHistory(hist);
      if (hist && hist.length > 0) {
        setActiveResult(hist[0]);
      }
    }
    loadLatestResult();
  }, [user, resultData]);

  if (!activeResult) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", background: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
        <h2 style={{ fontSize: "22px", color: "#0f172a" }}>No Interview Results Yet</h2>
        <p style={{ color: "#64748b", maxWidth: "450px", margin: "10px auto 24px" }}>
          Start an AI mock interview session from the Interview tab to receive detailed score evaluations and feedback reports.
        </p>
        {onRetake && (
          <button
            type="button"
            onClick={onRetake}
            style={{ padding: "11px 22px", borderRadius: "8px", background: "#2563eb", color: "#fff", border: "none", fontWeight: "600", cursor: "pointer" }}
          >
            Start Mock Interview →
          </button>
        )}
      </div>
    );
  }

  const score = activeResult.overallScore ?? 0;
  const badge = getPerformanceBadge(score);

  return (
    <div style={{ width: "100%", maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Banner */}
      <div style={{ padding: "28px", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", borderRadius: "16px", color: "#ffffff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <span style={{ fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#60a5fa", fontWeight: "700" }}>
            EVALUATION REPORT · {activeResult.category || "MOCK INTERVIEW"}
          </span>
          <h1 style={{ margin: "8px 0 6px", fontSize: "28px", fontWeight: "800" }}>
            {activeResult.role || "Interview"} Assessment
          </h1>
          <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px" }}>
            Completed on {activeResult.createdAt ? new Date(activeResult.createdAt).toLocaleDateString() : "Today"}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "36px", fontWeight: "800", color: badge.color }}>{score}%</div>
            <div style={{ fontSize: "12px", background: "rgba(255,255,255,0.1)", padding: "3px 10px", borderRadius: "12px", display: "inline-block", color: "#e2e8f0" }}>
              Verdict: <strong>{activeResult.verdict || "Not rated"}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-scores Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        <div style={{ padding: "20px", background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Technical Depth</span>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#2563eb", marginTop: "4px" }}>
            {activeResult.technicalScore ?? 0}%
          </div>
          <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "3px", marginTop: "10px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${activeResult.technicalScore ?? 0}%`, background: "#2563eb", borderRadius: "3px" }} />
          </div>
        </div>

        <div style={{ padding: "20px", background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Communication Clarity</span>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#10b981", marginTop: "4px" }}>
            {activeResult.communicationScore ?? 0}%
          </div>
          <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "3px", marginTop: "10px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${activeResult.communicationScore ?? 0}%`, background: "#10b981", borderRadius: "3px" }} />
          </div>
        </div>

        <div style={{ padding: "20px", background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Problem Solving</span>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#8b5cf6", marginTop: "4px" }}>
            {activeResult.problemSolvingScore ?? 0}%
          </div>
          <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "3px", marginTop: "10px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${activeResult.problemSolvingScore ?? 0}%`, background: "#8b5cf6", borderRadius: "3px" }} />
          </div>
        </div>
      </div>

      {/* Summary & Strengths Card */}
      <div style={{ padding: "24px", background: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
        <h3 style={{ margin: "0 0 12px", fontSize: "18px", color: "#0f172a" }}>AI Executive Summary</h3>
        <p style={{ color: "#475569", lineHeight: "1.6", fontSize: "14px", margin: "0 0 20px" }}>
          {activeResult.summary || "No written summary was generated for this session."}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{ padding: "16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px" }}>
            <strong style={{ color: "#166534", fontSize: "14px", display: "block", marginBottom: "8px" }}>
              🌱 Key Strengths
            </strong>
            {activeResult.strengths?.length ? (
              <ul style={{ margin: 0, paddingLeft: "18px", color: "#14532d", fontSize: "13px", lineHeight: "1.6" }}>
                {activeResult.strengths.map((st, i) => (
                  <li key={i}>{st}</li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: 0, fontSize: "13px", color: "#4d7c5f" }}>None listed for this session.</p>
            )}
          </div>

          <div style={{ padding: "16px", background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: "12px" }}>
            <strong style={{ color: "#9f1239", fontSize: "14px", display: "block", marginBottom: "8px" }}>
              🎯 Recommended Improvements
            </strong>
            {activeResult.improvements?.length ? (
              <ul style={{ margin: 0, paddingLeft: "18px", color: "#881337", fontSize: "13px", lineHeight: "1.6" }}>
                {activeResult.improvements.map((imp, i) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: 0, fontSize: "13px", color: "#9f6b78" }}>None listed for this session.</p>
            )}
          </div>
        </div>
      </div>

      {/* Question Feedback Breakdown */}
      <div style={{ padding: "24px", background: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: "18px", color: "#0f172a" }}>Detailed Question Breakdown</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {(activeResult.questionFeedback || []).map((item, idx) => (
            <div key={idx} style={{ padding: "18px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#2563eb" }}>
                  QUESTION {idx + 1}
                </span>
                <span style={{ fontSize: "13px", fontWeight: "700", color: (item.score ?? 0) >= 80 ? "#10b981" : "#f59e0b" }}>
                  Score: {item.score ?? 0}%
                </span>
              </div>

              <h4 style={{ margin: "0 0 12px", fontSize: "15px", color: "#0f172a" }}>{item.question}</h4>

              <div style={{ marginBottom: "12px", padding: "12px", background: "#ffffff", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", marginBottom: "4px", textTransform: "uppercase" }}>
                  Your Submitted Answer:
                </div>
                <p style={{ margin: 0, fontSize: "13px", color: "#334155", fontStyle: item.userAnswer ? "normal" : "italic" }}>
                  {item.userAnswer || "(No answer submitted)"}
                </p>
              </div>

              <div style={{ marginBottom: "12px", padding: "12px", background: "#eff6ff", borderRadius: "8px", border: "1px solid #bfdbfe" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#1d4ed8", marginBottom: "4px", textTransform: "uppercase" }}>
                  AI Feedback & Evaluation:
                </div>
                <p style={{ margin: 0, fontSize: "13px", color: "#1e40af", lineHeight: "1.5" }}>
                  {item.feedback}
                </p>
              </div>

              {item.idealAnswer && (
                <div style={{ padding: "12px", background: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "#166534", marginBottom: "4px", textTransform: "uppercase" }}>
                    💡 Model Answer Guide:
                  </div>
                  <p style={{ margin: 0, fontSize: "13px", color: "#14532d", lineHeight: "1.5" }}>
                    {item.idealAnswer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* History Selector if multiple sessions exist */}
      {history.length > 1 && (
        <div style={{ padding: "20px", background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
          <h4 style={{ margin: "0 0 10px", fontSize: "14px", color: "#475569" }}>Select Past Assessment Report:</h4>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {history.map((h, index) => (
              <button
                key={h.id || index}
                type="button"
                onClick={() => setActiveResult(h)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: activeResult === h ? "2px solid #2563eb" : "1px solid #cbd5e1",
                  background: activeResult === h ? "#eff6ff" : "#ffffff",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: activeResult === h ? "#2563eb" : "#475569",
                  cursor: "pointer"
                }}
              >
                {h.category || "Session"} - {h.overallScore}% ({h.createdAt ? new Date(h.createdAt).toLocaleDateString() : `#${index + 1}`})
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Results;