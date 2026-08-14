/**
 * Utility functions for analyzing score telemetry and user progress
 */

export function calculateAverageScore(interviewHistory = []) {
  if (!Array.isArray(interviewHistory) || interviewHistory.length === 0) {
    return 0;
  }

  const validScores = interviewHistory
    .map((item) => Number(item?.overallScore))
    .filter((score) => Number.isFinite(score));

  if (validScores.length === 0) {
    return 0;
  }

  const total = validScores.reduce(
    (sum, score) => sum + score,
    0
  );

  return Math.round(total / validScores.length);
}

export function getPerformanceBadge(score = 0) {
  const numericScore = Number(score) || 0;

  if (numericScore >= 90) {
    return {
      label: "Expert",
      color: "#10b981",
      badge: "🏆"
    };
  }

  if (numericScore >= 80) {
    return {
      label: "Advanced",
      color: "#3b82f6",
      badge: "🌟"
    };
  }

  if (numericScore >= 70) {
    return {
      label: "Intermediate",
      color: "#f59e0b",
      badge: "📈"
    };
  }

  if (numericScore >= 50) {
    return {
      label: "Developing",
      color: "#ec4899",
      badge: "🌱"
    };
  }

  return {
    label: "Beginner",
    color: "#6b7280",
    badge: "🎯"
  };
}

export function formatPerformanceChartData(
  interviewHistory = []
) {
  if (
    !Array.isArray(interviewHistory) ||
    interviewHistory.length === 0
  ) {
    return [];
  }

  return interviewHistory
    .map((session, index) => {
      const overallScore = Number(session?.overallScore);

      const score = Number.isFinite(overallScore)
        ? overallScore
        : 0;

      const technicalScore = Number(
        session?.technicalScore
      );

      const communicationScore = Number(
        session?.communicationScore
      );

      const problemSolvingScore = Number(
        session?.problemSolvingScore
      );

      let dateLabel = `Session ${index + 1}`;

      if (session?.createdAt) {
        const date = session.createdAt?.toDate
          ? session.createdAt.toDate()
          : new Date(session.createdAt);

        if (!Number.isNaN(date.getTime())) {
          dateLabel = date.toLocaleDateString(
            undefined,
            {
              month: "short",
              day: "numeric"
            }
          );
        }
      }

      return {
        name: dateLabel,
        score: Math.max(0, Math.min(100, score)),

        technical: Number.isFinite(technicalScore)
          ? Math.max(
              0,
              Math.min(100, technicalScore)
            )
          : score,

        communication: Number.isFinite(
          communicationScore
        )
          ? Math.max(
              0,
              Math.min(100, communicationScore)
            )
          : score,

        problemSolving: Number.isFinite(
          problemSolvingScore
        )
          ? Math.max(
              0,
              Math.min(100, problemSolvingScore)
            )
          : score,

        category:
          session?.category ||
          session?.interviewType ||
          "General"
      };
    })
    .filter((item) => item !== null);
}