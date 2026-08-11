import { generateJSONResponse } from "./gemini";
import { ANSWER_EVALUATION_PROMPT } from "./promptTemplates";

function getFallbackEvaluation({ category, role, qnaList = [] }) {
  const answeredCount = qnaList.filter(
    (item) =>
      item.userAnswer &&
      item.userAnswer.trim().length > 10
  ).length;

  const totalCount = qnaList.length || 1;
  const completionRatio = answeredCount / totalCount;

  const baseScore = Math.round(
    50 + completionRatio * 40
  );

  const overallScore = Math.min(
    95,
    Math.max(45, baseScore)
  );

  const questionFeedback = qnaList.map(
    (item, idx) => {
      const hasAnswer =
        item.userAnswer &&
        item.userAnswer.trim().length > 10;

      const len = item.userAnswer
        ? item.userAnswer.trim().length
        : 0;

      const itemScore = hasAnswer
        ? Math.min(
            96,
            60 + Math.floor(len / 8)
          )
        : 30;

      return {
        questionId: item.id || idx + 1,

        question: item.question,

        userAnswer:
          item.userAnswer ||
          "(No answer submitted)",

        score: itemScore,

        feedback: hasAnswer
          ? "Good initial attempt. Your response addresses the main question, but expanding with specific code or real-world project examples will make it stronger."
          : "No answer provided. Try attempting the question using first-principles reasoning or asking clarifying questions.",

        idealAnswer:
          item.hints &&
          item.hints.length
            ? `To score high on this question: ${item.hints.join(
                " "
              )} Structure your answer clearly using key technical terminology.`
            : `An ideal response for ${role} should clearly explain concepts, trade-offs, and practical implementations.`
      };
    }
  );

  return {
    overallScore,

    technicalScore: Math.min(
      100,
      overallScore + 3
    ),

    communicationScore: Math.max(
      50,
      overallScore - 2
    ),

    problemSolvingScore: Math.min(
      100,
      overallScore + 1
    ),

    verdict:
      overallScore >= 80
        ? "Hire"
        : overallScore >= 65
        ? "Strong Consider"
        : "Needs Practice",

    summary: `Candidate completed ${answeredCount} out of ${totalCount} questions in the ${category} session for ${role}. Overall performance demonstrated a good foundation with opportunities to improve practical examples and depth.`,

    strengths: [
      "Good familiarity with core conceptual terminology",
      "Logical structure in direct technical responses",
      "Active engagement across the session"
    ],

    improvements: [
      "Elaborate more on practical project trade-offs and edge cases",
      "Use the STAR method for behavioral questions",
      "Include concrete code or architecture details when answering technical questions"
    ],

    questionFeedback
  };
}

function isValidEvaluation(evaluation) {
  return (
    evaluation &&
    typeof evaluation === "object" &&
    typeof evaluation.overallScore === "number"
  );
}

export async function evaluateInterviewSession({
  category = "Technical Interview",
  role = "Software Engineer",
  qnaList = []
}) {
  const fallback = getFallbackEvaluation({
    category,
    role,
    qnaList
  });

  const prompt = ANSWER_EVALUATION_PROMPT({
    category,
    role,
    qnaList
  });

  try {
    /*
     * Give Gemini a maximum of 15 seconds.
     * If it takes longer, immediately use fallback scoring.
     */
    const evaluation = await Promise.race([
      generateJSONResponse(
        prompt,
        fallback
      ),

      new Promise((_, reject) => {
        setTimeout(() => {
          reject(
            new Error(
              "AI evaluation timed out"
            )
          );
        }, 15000);
      })
    ]);

    if (isValidEvaluation(evaluation)) {
      return {
        ...fallback,
        ...evaluation,

        questionFeedback:
          Array.isArray(
            evaluation.questionFeedback
          ) &&
          evaluation.questionFeedback.length > 0
            ? evaluation.questionFeedback
            : fallback.questionFeedback
      };
    }

    console.warn(
      "Invalid AI evaluation. Using fallback."
    );

    return fallback;
  } catch (error) {
    console.warn(
      "AI evaluation failed. Using fallback evaluation:",
      error
    );

    return fallback;
  }
}