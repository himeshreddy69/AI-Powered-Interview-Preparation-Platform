import { createClient } from "@supabase/supabase-js";
import { auth } from "../firebase/auth";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabaseConfigurationError =
  "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env and restart the dev server.";

/**
 * This app logs users in with Firebase, but stores data in Supabase.
 *
 * To make that safe, we hand Supabase the user's Firebase ID token on every
 * request. Supabase verifies it (once you register Firebase as a Third-Party
 * Auth provider in the dashboard) and exposes its claims to Postgres, so row
 * level security policies can check `auth.jwt() ->> 'sub'`, which is the
 * Firebase UID.
 *
 * Without this, every request would be anonymous and RLS could not tell one
 * user from another. See supabase/schema.sql and SUPABASE_SETUP.md.
 *
 * Note: because `accessToken` is set, the `supabase.auth` namespace must not
 * be used. Firebase owns authentication.
 */
const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      accessToken: async () => {
        const currentUser = auth?.currentUser;
        if (!currentUser) return null;

        try {
          // getIdToken() caches the token and only refreshes it near expiry,
          // so calling this on every request is cheap.
          return await currentUser.getIdToken();
        } catch (error) {
          console.warn("Could not read Firebase ID token for Supabase:", error);
          return null;
        }
      },
    })
  : null;

if (!isSupabaseConfigured) {
  console.warn(supabaseConfigurationError);
}

export default supabase;
