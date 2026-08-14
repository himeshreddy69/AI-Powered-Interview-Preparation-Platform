import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import { getUserInterviewHistory } from "../../services/supabase/interviewResults";
import {
  calculateAverageScore,
  getPerformanceBadge
} from "../../services/ai/scoreAnalysis";
import "../../assets/styles/PerformanceChart.css";

function PerformanceChart() {
  const { user } = useAuth();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      if (!user?.uid) {
        setHistory([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const data = await getUserInterviewHistory(user.uid);

        if (!mounted) return;

        setHistory(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.error(
          "Error loading performance data:",
          error
        );

        if (mounted) {
          setHistory([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [user]);

  const totalSessions = history.length;

  const getScore = (item) => {
    const possibleScores = [
      item?.overallScore,
      item?.score,
      item?.totalScore,
      item?.percentage
    ];

    const value = possibleScores.find(
      (score) =>
        score !== undefined &&
        score !== null &&
        score !== ""
    );

    const numericScore = Number(value);

    return Number.isFinite(numericScore)
      ? Math.round(numericScore)
      : 0;
  };

  const getDateLabel = (item, index) => {
    if (!item?.createdAt) {
      return `Test ${index + 1}`;
    }

    const date = new Date(item.createdAt);

    if (Number.isNaN(date.getTime())) {
      return `Test ${index + 1}`;
    }

    return date.toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "numeric"
      }
    );
  };

  const chartData = history
    .slice()
    .reverse()
    .slice(-10)
    .map((item, index) => ({
      name: getDateLabel(item, index),
      score: getScore(item)
    }));

  const avgScore =
    totalSessions > 0
      ? Math.round(
          calculateAverageScore(history)
        )
      : 0;

  const badgeInfo =
    getPerformanceBadge(avgScore);

  return (
    <section className="performance-chart">

      <div className="performance-header">
        <div>
          <span className="performance-section-label">
            AI TELEMETRY & PROGRESS
          </span>

          <h2>
            Performance Analytics
          </h2>

          <p>
            Track your AI mock interview score
            trends over time.
          </p>
        </div>

        <div className="performance-icon">
          📊
        </div>
      </div>

      {loading ? (
        <div
          style={{
            padding: "40px 10px",
            textAlign: "center",
            color: "#64748b",
            fontSize: "13px"
          }}
        >
          Loading performance analytics...
        </div>
      ) : (
        <>
          <div className="performance-summary">

            <div className="performance-score">

              <strong
                style={{
                  color:
                    totalSessions > 0
                      ? badgeInfo.color
                      : "#94a3b8"
                }}
              >
                {totalSessions > 0
                  ? `${avgScore}%`
                  : "—"}
              </strong>

              <span>
                {totalSessions > 0
                  ? `Average Score ${badgeInfo.badge}`
                  : "No scores yet"}
              </span>

            </div>

            <div className="performance-improvement">

              {totalSessions > 0 ? (
                <>
                  <span
                    style={{
                      color:
                        badgeInfo.color
                    }}
                  >
                    {badgeInfo.badge}
                  </span>

                  <div>
                    <strong
                      style={{
                        color:
                          badgeInfo.color
                      }}
                    >
                      {badgeInfo.label}
                    </strong>

                    <p>
                      Mastery Level
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <span
                    style={{
                      color: "#94a3b8"
                    }}
                  >
                    🎯
                  </span>

                  <div>
                    <strong
                      style={{
                        color: "#64748b"
                      }}
                    >
                      Not Available
                    </strong>

                    <p>
                      Complete an interview first
                    </p>
                  </div>
                </>
              )}

            </div>

          </div>

          {chartData.length > 0 ? (

            <div
              style={{
                width: "100%",
                height: 220,
                marginTop: "20px"
              }}
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0
                  }}
                >

                  <defs>
                    <linearGradient
                      id="performanceGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#2563eb"
                        stopOpacity={0.4}
                      />

                      <stop
                        offset="95%"
                        stopColor="#2563eb"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                  />

                  <YAxis
                    domain={[0, 100]}
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                  />

                  <Tooltip
                    formatter={(value) => [
                      `${value}%`,
                      "Score"
                    ]}
                    contentStyle={{
                      background: "#0f172a",
                      borderRadius: "8px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px"
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fill="url(#performanceGradient)"
                    fillOpacity={1}
                  />

                </AreaChart>
              </ResponsiveContainer>
            </div>

          ) : (

            <div className="performance-bars">

              <div
                style={{
                  padding: "35px 10px",
                  textAlign: "center"
                }}
              >
                <div
                  style={{
                    fontSize: "36px",
                    marginBottom: "10px"
                  }}
                >
                  📈
                </div>

                <h3
                  style={{
                    margin: "0 0 6px",
                    fontSize: "16px",
                    color: "#334155"
                  }}
                >
                  No performance data yet
                </h3>

                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    color: "#64748b"
                  }}
                >
                  Complete your first mock
                  interview to see your
                  score trends here.
                </p>

              </div>

            </div>

          )}

          <div className="performance-footer">

            <span>
              Based on{" "}
              {totalSessions} completed
              practice session
              {totalSessions === 1
                ? ""
                : "s"}
            </span>

          </div>
        </>
      )}

    </section>
  );
}

export default PerformanceChart;