import { generateJSONResponse } from "./gemini";
import { ANSWER_EVALUATION_PROMPT } from "./promptTemplates";

/**
 * Fallback feedback calculation when Gemini API key is unavailable
 */
function getFallbackEvaluation({ category, role, qnaList = [] }) {
  const answeredCount = qnaList.filter((item) => item.userAnswer && item.userAnswer.trim().length > 10).length;
  const totalCount = qnaList.length || 1;
  const completionRatio = answeredCount / totalCount;

  const baseScore = Math.round(50 + completionRatio * 40);
  const overallScore = Math.min(95, Math.max(45, baseScore));

  const questionFeedback = qnaList.map((item, idx) => {
    const hasAnswer = item.userAnswer && item.userAnswer.trim().length > 10;
    const len = item.userAnswer ? item.userAnswer.trim().length : 0;
    const itemScore = hasAnswer ? Math.min(96, 60 + Math.floor(len / 8)) : 30;

    return {
      questionId: item.id || idx + 1,
      question: item.question,
      userAnswer: item.userAnswer || "(No answer submitted)",
      score: itemScore,
      feedback: hasAnswer
        ? "Good initial attempt. Your response addresses the main question, but expanding with specific code or real-world project examples will make it significantly stronger."
        : "No answer provided. In actual interviews, try attempting an answer using first-principles reasoning or asking clarifying questions.",
      idealAnswer: item.hints && item.hints.length
        ? `To score high on this question: ${item.hints.join(" ")} Structure your answer clearly using key technical terminology.`
        : `An ideal response for ${role} should clearly explain concepts, trade-offs, and practical implementations.`
    };
  });

  return {
    overallScore,
    technicalScore: Math.min(100, overallScore + 3),
    communicationScore: Math.max(50, overallScore - 2),
    problemSolvingScore: Math.max(50, overallScore + 1),
    verdict: overallScore >= 80 ? "Hire" : overallScore >= 65 ? "Strong Consider" : "Needs Practice",
    summary: `Candidate completed ${answeredCount} out of ${totalCount} questions in the ${category} session for ${role}. Overall performance demonstrated good technical foundation with opportunity to deepen real-world examples.`,
    strengths: [
      "Good familiarity with core conceptual terminology",
      "Logical structure in direct technical responses",
      "Active engagement across the session"
    ],
    improvements: [
      "Elaborate more on practical project trade-offs and edge cases",
      "Utilize the STAR method (Situation, Task, Action, Result) for behavioral questions",
      "Include concrete code snippets or architecture details when answering technical questions"
    ],
    questionFeedback
  };
}

/**
 * Evaluate Candidate Interview Session
 */
export async function evaluateInterviewSession({
  category = "Technical Interview",
  role = "Software Engineer",
  qnaList = []
}) {
  const fallback = getFallbackEvaluation({ category, role, qnaList });

  const prompt = ANSWER_EVALUATION_PROMPT({
    category,
    role,
    qnaList
  });

  try {
    const evaluation = await generateJSONResponse(prompt, fallback);

    if (evaluation && typeof evaluation.overallScore === "number") {
      return {
        ...evaluation,
        questionFeedback: evaluation.questionFeedback || fallback.questionFeedback
      };
    }
    return fallback;
  } catch (error) {
    console.warn("Using fallback evaluation due to API error:", error);
    return fallback;
  }
}
