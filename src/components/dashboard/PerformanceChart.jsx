import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "../../context/AuthContext";
import { getUserInterviewHistory } from "../../services/firebase/firestore";
import { calculateAverageScore, formatPerformanceChartData, getPerformanceBadge } from "../../services/ai/scoreAnalysis";
import "../../assets/styles/PerformanceChart.css";

function PerformanceChart() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getUserInterviewHistory(user?.uid);
      setHistory(data || []);
      setLoading(false);
    }
    loadData();
  }, [user]);

  const avgScore = calculateAverageScore(history) || 82;
  const badgeInfo = getPerformanceBadge(avgScore);
  const chartData = formatPerformanceChartData(history);

  return (
    <section className="performance-chart">
      <div className="performance-header">
        <div>
          <span className="performance-section-label">AI TELEMETRY & PROGRESS</span>
          <h2>Performance Analytics</h2>
          <p>Track your AI mock interview score trends over time.</p>
        </div>

        <div className="performance-icon">
          📊
        </div>
      </div>

      <div className="performance-summary">
        <div className="performance-score">
          <strong style={{ color: badgeInfo.color }}>{avgScore}%</strong>
          <span>Average Score {badgeInfo.badge}</span>
        </div>

        <div className="performance-improvement">
          <span style={{ color: badgeInfo.color }}>{badgeInfo.badge}</span>
          <div>
            <strong style={{ color: badgeInfo.color }}>{badgeInfo.label}</strong>
            <p>Mastery Level</p>
          </div>
        </div>
      </div>

      {chartData && chartData.length > 0 ? (
        <div style={{ width: "100%", height: 220, marginTop: "20px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#0f172a", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }}
              />
              <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#scoreColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="performance-bars">
          <p style={{ fontSize: "13px", color: "#94a3b8", textAlign: "center" }}>Complete your first interview to see visual performance trends.</p>
        </div>
      )}

      <div className="performance-footer">
        <span>Based on {history.length} completed practice session(s)</span>
      </div>
    </section>
  );
}

export default PerformanceChart;