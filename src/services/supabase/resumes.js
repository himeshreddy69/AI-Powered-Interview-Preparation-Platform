import supabase from "./supabase";
import { localKeys, readLocal, writeLocal } from "../../utils/localStore";

/**
 * Parsed resume profiles, stored in the Supabase `resumes` table.
 * One row per user — uploading a new resume replaces the old one.
 */

function fromRow(row) {
  if (!row) return null;
  return {
    fileName: row.file_name || "",
    filePath: row.file_path || "",
    jobTitle: row.job_title || "",
    experienceLevel: row.experience_level || "",
    skills: Array.isArray(row.skills) ? row.skills : [],
    summary: row.summary || "",
    rawText: row.raw_text || "",
    updatedAt: row.updated_at,
  };
}

function toRow(uid, resume) {
  return {
    user_id: uid,
    file_name: resume.fileName || "",
    file_path: resume.filePath || "",
    job_title: resume.jobTitle || "",
    experience_level: resume.experienceLevel || "",
    skills: Array.isArray(resume.skills) ? resume.skills : [],
    summary: resume.summary || "",
    // The full resume text can be long; the AI prompts only ever use the
    // first few thousand characters, so cap it before it hits the database.
    raw_text: (resume.rawText || "").slice(0, 8000),
    updated_at: new Date().toISOString(),
  };
}

/** Save (or replace) the user's parsed resume. */
export async function saveUserResume(uid, resumeData = {}) {
  const withTime = { ...resumeData, updatedAt: new Date().toISOString() };

  // Local copy first, so the dashboard updates instantly.
  writeLocal(localKeys.resume(uid), withTime);

  if (!supabase || !uid) return withTime;

  try {
    const { data, error } = await supabase
      .from("resumes")
      .upsert(toRow(uid, resumeData), { onConflict: "user_id" })
      .select()
      .single();

    if (error) throw error;

    const saved = fromRow(data);
    writeLocal(localKeys.resume(uid), saved);
    return saved;
  } catch (error) {
    console.warn("Could not save resume to Supabase, kept local copy:", error);
    return withTime;
  }
}

/** Read the user's resume. Falls back to the local copy on any failure. */
export async function getUserResume(uid) {
  const local = readLocal(localKeys.resume(uid), null);

  if (!supabase || !uid) return local;

  try {
    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", uid)
      .maybeSingle();

    if (error) throw error;
    if (!data) return local;

    const resume = fromRow(data);
    writeLocal(localKeys.resume(uid), resume);
    return resume;
  } catch (error) {
    console.warn("Could not read resume from Supabase, using local copy:", error);
    return local;
  }
}
