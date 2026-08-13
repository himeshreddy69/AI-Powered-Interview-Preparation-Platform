import supabase from "./supabase";

export async function saveInterviewResult(userId, result) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const row = {
    user_id: userId,
    category: result.category || "",
    role: result.role || "",
    questions_count: Number(result.questionsCount) || 0,

    overall_score: Number(result.overallScore) || 0,
    technical_score: Number(result.technicalScore) || 0,
    communication_score: Number(result.communicationScore) || 0,
    problem_solving_score: Number(result.problemSolvingScore) || 0,

    verdict: result.verdict || "",
    summary: result.summary || "",
    feedback: result.feedback || "",

    strengths: result.strengths || [],
    weaknesses: result.weaknesses || [],
    improvements: result.improvements || [],
    recommendations: result.recommendations || [],

    question_feedback: result.questionFeedback || [],
    qna_list: result.qnaList || [],

    completed_automatically:
      Boolean(result.completedAutomatically),

    created_at: result.createdAt || new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("interview_results")
    .insert([row])
    .select()
    .single();

  if (error) {
    console.error("Supabase save interview result error:", error);
    throw error;
  }

  return data;
}


export async function getUserInterviewHistory(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { data, error } = await supabase
    .from("interview_results")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Supabase get interview history error:",
      error
    );

    throw error;
  }

  return data || [];
}


export async function getInterviewResult(resultId) {
  if (!resultId) {
    throw new Error("Result ID is required");
  }

  const { data, error } = await supabase
    .from("interview_results")
    .select("*")
    .eq("id", resultId)
    .single();

  if (error) {
    console.error(
      "Supabase get interview result error:",
      error
    );

    throw error;
  }

  return data;
}