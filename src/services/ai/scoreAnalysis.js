/**
 * Utility functions for analyzing score telemetry and user progress
 */

export function calculateAverageScore(interviewHistory = []) {
  if (!interviewHistory || interviewHistory.length === 0) return 0;
  const total = interviewHistory.reduce((sum, item) => sum + (item.overallScore || 0), 0);
  return Math.round(total / interviewHistory.length);
}

export function getPerformanceBadge(score) {
  if (score >= 90) return { label: "Expert", color: "#10b981", badge: "🏆" };
  if (score >= 80) return { label: "Advanced", color: "#3b82f6", badge: "🌟" };
  if (score >= 70) return { label: "Intermediate", color: "#f59e0b", badge: "📈" };
  if (score >= 50) return { label: "Developing", color: "#ec4899", badge: "🌱" };
  return { label: "Beginner", color: "#6b7280", badge: "🎯" };
}

export function formatPerformanceChartData(interviewHistory = []) {
  if (!interviewHistory || interviewHistory.length === 0) {
    return [
      { name: "Session 1", score: 65, technical: 70, communication: 60, problemSolving: 65 },
      { name: "Session 2", score: 72, technical: 75, communication: 68, problemSolving: 73 },
      { name: "Session 3", score: 80, technical: 84, communication: 76, problemSolving: 80 },
      { name: "Session 4", score: 86, technical: 88, communication: 82, problemSolving: 88 },
      { name: "Session 5", score: 91, technical: 92, communication: 88, problemSolving: 93 },
    ];
  }

  return interviewHistory.map((session, index) => ({
    name: session.createdAt ? new Date(session.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : `Session ${index + 1}`,
    score: session.overallScore || 0,
    technical: session.technicalScore || session.overallScore || 0,
    communication: session.communicationScore || session.overallScore || 0,
    problemSolving: session.problemSolvingScore || session.overallScore || 0,
    category: session.category || "General",
  }));
}
