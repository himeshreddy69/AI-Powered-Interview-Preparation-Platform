import supabase from "./supabase";
import { localKeys, readLocal, writeLocal } from "../../utils/localStore";

/**
 * User profiles, stored in the Supabase `profiles` table.
 * `user_id` is the Firebase UID — see supabase/schema.sql.
 */

/** Database row (snake_case) -> app object (camelCase). */
function fromRow(row) {
  if (!row) return null;
  return {
    uid: row.user_id,
    name: row.name || "",
    email: row.email || "",
    photoUrl: row.photo_url || "",
    role: row.role || "user",
    defaultTargetRole: row.default_target_role || "Software Engineer",
    defaultQuestionCount: row.default_question_count ?? 5,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** App object (camelCase) -> database row (snake_case). */
function toRow(uid, profile) {
  const row = { user_id: uid };

  if (profile.name !== undefined) row.name = profile.name;
  if (profile.email !== undefined) row.email = profile.email;
  if (profile.photoUrl !== undefined) row.photo_url = profile.photoUrl;
  if (profile.role !== undefined) row.role = profile.role;
  if (profile.defaultTargetRole !== undefined) {
    row.default_target_role = profile.defaultTargetRole;
  }
  if (profile.defaultQuestionCount !== undefined) {
    row.default_question_count = Number(profile.defaultQuestionCount);
  }

  row.updated_at = new Date().toISOString();
  return row;
}

/**
 * Create or update a user's profile.
 * Called on registration, and again whenever settings change.
 */
export async function saveUserProfile(uid, profile = {}) {
  if (!uid) throw new Error("User ID is missing.");

  // Always keep a local copy first so the UI has something to show even if
  // the network call below fails.
  const existingLocal = readLocal(localKeys.profile(uid), {}) || {};
  const merged = { ...existingLocal, ...profile, uid };
  writeLocal(localKeys.profile(uid), merged);

  if (!supabase) return merged;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .upsert(toRow(uid, profile), { onConflict: "user_id" })
      .select()
      .single();

    if (error) throw error;

    const saved = fromRow(data);
    writeLocal(localKeys.profile(uid), saved);
    return saved;
  } catch (error) {
    console.warn("Could not save profile to Supabase, kept local copy:", error);
    return merged;
  }
}

/**
 * Called once when a new account is created.
 * Kept as a separate name because Register.jsx reads better this way.
 */
export async function createUserProfile({ uid, name, email }) {
  return saveUserProfile(uid, { name, email, role: "user" });
}

/** Read a user's profile. Falls back to the local copy on any failure. */
export async function getUserProfile(uid) {
  const local = readLocal(localKeys.profile(uid), null);

  if (!supabase || !uid) return local;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", uid)
      .maybeSingle();

    if (error) throw error;
    if (!data) return local;

    const profile = fromRow(data);
    writeLocal(localKeys.profile(uid), profile);
    return profile;
  } catch (error) {
    console.warn("Could not read profile from Supabase, using local copy:", error);
    return local;
  }
}
