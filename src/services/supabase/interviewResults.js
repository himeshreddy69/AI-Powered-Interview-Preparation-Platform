import supabase from "./supabase";
import { localKeys, readLocal, writeLocal } from "../../utils/localStore";

/**
 * Completed mock interview sessions, stored in the Supabase
 * `interview_results` table. Many rows per user, newest first.
 */

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function fromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    category: row.category || "",
    role: row.role || "",
    questionsCount: row.questions_count || 0,
    overallScore: row.overall_score || 0,
    technicalScore: row.technical_score || 0,
    communicationScore: row.communication_score || 0,
    problemSolvingScore: row.problem_solving_score || 0,
    verdict: row.verdict || "",
    summary: row.summary || "",
    strengths: asArray(row.strengths),
    improvements: asArray(row.improvements),
    questionFeedback: asArray(row.question_feedback),
    qnaList: asArray(row.qna_list),
    createdAt: row.created_at,
  };
}

function toRow(uid, result) {
  return {
    user_id: uid,
    category: result.category || "",
    role: result.role || "",
    questions_count: result.questionsCount || 0,
    overall_score: Math.round(result.overallScore || 0),
    technical_score: Math.round(result.technicalScore || 0),
    communication_score: Math.round(result.communicationScore || 0),
    problem_solving_score: Math.round(result.problemSolvingScore || 0),
    verdict: result.verdict || "",
    summary: result.summary || "",
    strengths: asArray(result.strengths),
    improvements: asArray(result.improvements),
    question_feedback: asArray(result.questionFeedback),
    qna_list: asArray(result.qnaList),
  };
}

/**
 * Save one completed interview session.
 * Always writes a local copy so results are never lost if the network fails.
 */
export async function saveInterviewResult(uid, resultData = {}) {
  const localCopy = { ...resultData, createdAt: new Date().toISOString() };

  const key = localKeys.interviews(uid);
  const existing = asArray(readLocal(key, []));
  writeLocal(key, [localCopy, ...existing]);

  if (!supabase || !uid) return localCopy;

  try {
    const { data, error } = await supabase
      .from("interview_results")
      .insert(toRow(uid, resultData))
      .select()
      .single();

    if (error) throw error;
    return fromRow(data);
  } catch (error) {
    console.warn("Could not save interview to Supabase, kept local copy:", error);
    return localCopy;
  }
}

/**
 * Read a user's interview history, newest first.
 * Falls back to the local copy on any failure.
 */
export async function getUserInterviewHistory(uid) {
  const local = asArray(readLocal(localKeys.interviews(uid), []));

  if (!supabase || !uid) return local;

  try {
    const { data, error } = await supabase
      .from("interview_results")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const history = asArray(data).map(fromRow);

    // If the database has nothing but this browser does, the local sessions
    // were saved while offline — keep showing them rather than losing them.
    return history.length > 0 ? history : local;
  } catch (error) {
    console.warn("Could not read interviews from Supabase, using local copy:", error);
    return local;
  }
}

/** Delete one saved session. */
export async function deleteInterviewResult(uid, id) {
  const key = localKeys.interviews(uid);
  const existing = asArray(readLocal(key, []));
  writeLocal(key, existing.filter((item) => item.id !== id));

  if (!supabase || !uid || !id) return;

  try {
    const { error } = await supabase
      .from("interview_results")
      .delete()
      .eq("user_id", uid)
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.warn("Could not delete interview from Supabase:", error);
  }
}
