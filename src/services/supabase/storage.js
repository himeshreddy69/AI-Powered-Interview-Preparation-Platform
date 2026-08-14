import supabase from "./supabase";

/**
 * File uploads, stored in Supabase Storage.
 *
 * Every file goes into a folder named after the user's Firebase UID:
 *
 *   resumes/<uid>/1699999999.pdf
 *   profile-images/<uid>/1699999999.png
 *
 * The storage security rules in supabase/schema.sql check that first folder
 * name, so one user can never read or overwrite another user's files.
 */

/** Turn "My Resume (final).PDF" into a safe "pdf". */
function safeExtension(fileName, fallback) {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  return /^[a-z0-9]{1,5}$/.test(ext) ? ext : fallback;
}

function requireSupabase() {
  if (!supabase) {
    throw new Error(
      "File uploads need Supabase. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env."
    );
  }
}

/**
 * Upload the original resume file.
 *
 * Returns `{ path }`. There is deliberately no public URL: the `resumes`
 * bucket is private, so a public link would not load. Call getResumeUrl(path)
 * when you actually need to open the file.
 */
export async function uploadResume(file, uid) {
  if (!file) throw new Error("No file selected.");
  if (!uid) throw new Error("You must be logged in to upload a resume.");
  requireSupabase();

  const path = `${uid}/${Date.now()}.${safeExtension(file.name, "pdf")}`;

  const { data, error } = await supabase.storage
    .from("resumes")
    .upload(path, file, { upsert: true, contentType: file.type || undefined });

  if (error) throw error;
  return { path: data.path };
}

/**
 * Get a temporary link to a stored resume.
 * The bucket is private, so links are signed and expire.
 */
export async function getResumeUrl(path, expiresInSeconds = 300) {
  if (!path) return "";
  requireSupabase();

  const { data, error } = await supabase.storage
    .from("resumes")
    .createSignedUrl(path, expiresInSeconds);

  if (error) throw error;
  return data.signedUrl;
}

/** Delete a stored resume file. */
export async function deleteResume(path) {
  if (!path || !supabase) return;

  const { error } = await supabase.storage.from("resumes").remove([path]);
  if (error) console.warn("Could not delete old resume file:", error);
}

/**
 * Upload a profile picture.
 * This bucket is public, so it returns a permanent URL usable in <img src>.
 */
export async function uploadProfileImage(file, uid) {
  if (!file) throw new Error("No image selected.");
  if (!uid) throw new Error("You must be logged in to upload a picture.");
  requireSupabase();

  const path = `${uid}/${Date.now()}.${safeExtension(file.name, "png")}`;

  const { error } = await supabase.storage
    .from("profile-images")
    .upload(path, file, { upsert: true, contentType: file.type || undefined });

  if (error) throw error;

  const { data } = supabase.storage.from("profile-images").getPublicUrl(path);
  return data.publicUrl;
}
