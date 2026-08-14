# Supabase Setup

This app uses **Firebase for login** and **Supabase for the database and file
storage**. This guide connects the two.

Do these steps once, in order.

---

## Step 1 — Create the tables

1. Open your Supabase project.
2. Go to **SQL Editor** → **New query**.
3. Copy everything in [`supabase/schema.sql`](supabase/schema.sql), paste it in, and click **Run**.

This creates three tables (`profiles`, `resumes`, `interview_results`), two
storage buckets (`resumes`, `profile-images`), and the security rules that stop
one user reading another user's data.

You can re-run this file any time. It will not delete your data.

---

## Step 2 — Put your keys in `.env`

In your Supabase project go to **Project Settings** → **API** and copy:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxx
```

Restart the dev server after editing `.env`. Vite only reads it at startup.

---

## Step 3 — Let Supabase trust your Firebase logins

This is the step that makes the security rules actually work.

1. In Supabase, go to **Authentication** → **Sign In / Providers** → **Third Party Auth**.
2. Click **Add integration** and pick **Firebase**.
3. Paste your **Firebase Project ID** (find it in Firebase Console → Project settings → General).
4. Save.

Now Supabase can read and verify the Firebase login tokens the app sends it.

### Step 3b — The `role` claim (important)

Supabase also needs each Firebase token to carry a custom claim
`role: "authenticated"`. Firebase does **not** add this by itself.

There are two ways to add it, and **both need the Firebase Blaze (pay-as-you-go)
plan.** Blaze has a free monthly allowance, so a student project normally costs
nothing — but it does require a card on file.

**Option A — Blocking function (easier).**
In Firebase Console → Authentication → Settings → Blocking functions, add a
`beforeUserCreated` / `beforeUserSignedIn` function that returns:

```js
exports.addRole = beforeUserSignedIn((event) => ({
  customClaims: { role: "authenticated" },
}));
```

**Option B — Admin SDK.**
Run a one-off script using the Firebase Admin SDK calling
`setCustomUserClaims(uid, { role: "authenticated" })` for existing users, plus an
`onCreate` Cloud Function to cover new sign-ups.

Full details: <https://supabase.com/docs/guides/auth/third-party/firebase-auth>

---

## If you skip Step 3

The app still runs. Reads and writes to Supabase will be rejected by the
security rules, and the app quietly falls back to storing your data in the
browser's `localStorage` instead. That is fine for local development and demos,
but the data lives only on that one computer and disappears if you clear your
browser storage.

**Do not remove the security rules to "make it work".** The publishable key is
inside your JavaScript bundle, so anyone visiting your site can read it. Without
the rules, anyone could read every user's resume and interview transcripts.

---

## Checking it worked

Open the app, log in, and complete one mock interview. Then in Supabase go to
**Table Editor** → `interview_results`. You should see one new row with your
Firebase UID in the `user_id` column.

If the table is empty, open your browser console and look for Supabase errors.
A message about "row level security" or "policy" means Step 3 is not finished.
