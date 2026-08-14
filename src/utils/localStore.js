/**
 * Small wrapper around localStorage.
 *
 * The app keeps a local copy of everything it saves to Supabase, so it still
 * works when Supabase is unreachable or not configured yet. localStorage can
 * throw (private browsing, quota exceeded), so every call is guarded.
 */

export function readLocal(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn(`Could not read "${key}" from localStorage:`, error);
    return fallback;
  }
}

export function writeLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Could not write "${key}" to localStorage:`, error);
    return false;
  }
}

export function removeLocal(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Could not remove "${key}" from localStorage:`, error);
  }
}

/** Keys are namespaced per user so two accounts on one browser stay separate. */
export const localKeys = {
  profile: (uid) => `profile_${uid || "guest"}`,
  resume: (uid) => `resume_data_${uid || "guest"}`,
  interviews: (uid) => `interviews_${uid || "guest"}`,
};
