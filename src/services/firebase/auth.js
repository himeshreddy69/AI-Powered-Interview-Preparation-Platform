import {
  browserLocalPersistence,
  browserPopupRedirectResolver,
  createUserWithEmailAndPassword,
  getAuth,
  initializeAuth,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
} from "firebase/auth";

import app, {
  firebaseConfigurationError,
  isFirebaseConfigured,
} from "./firebase";


/*
 * Keep the session in localStorage instead of Firebase's default IndexedDB.
 * The IndexedDB store refuses to open while the tab is hidden and throws a raw
 * "Database is closing/hidden" — which is exactly what the Google popup does:
 * the opener tab loses visibility while the credential is being written, and
 * the user gets that string dumped on the login form. localStorage has no
 * hidden/closing state, so the whole failure mode goes away.
 *
 * initializeAuth rather than getAuth, because persistence is then set when the
 * instance is built; setPersistence is async and races the first sign-in call.
 * This module is imported at startup, so the bare getAuth() calls in Profile
 * resolve to this same configured instance.
 */
function createAuth() {

  try {

    return initializeAuth(app, {
      persistence: browserLocalPersistence,
      popupRedirectResolver: browserPopupRedirectResolver,
    });

  } catch {

    /*
     * Already initialized — Vite HMR re-evaluating this module in dev. The
     * existing instance keeps whatever persistence it was built with, so
     * re-assert localStorage rather than silently handing back an
     * IndexedDB-backed instance and reintroducing the bug in dev only.
     */
    const existing = getAuth(app);

    setPersistence(existing, browserLocalPersistence).catch(() => {});

    return existing;

  }

}


export const auth = isFirebaseConfigured
  ? createAuth()
  : null;



const googleProvider = new GoogleAuthProvider();



function requireFirebaseConfiguration() {

  if (!isFirebaseConfigured) {

    // Carry a code so getAuthErrorMessage passes the full text through
    // instead of flattening it to the generic fallback.
    const error = new Error(firebaseConfigurationError);

    error.code = "auth/configuration-missing";

    throw error;

  }

}



// EMAIL LOGIN

export const loginWithEmail = async (email, password) => {

  requireFirebaseConfiguration();

  return signInWithEmailAndPassword(
    auth,
    email,
    password
  );

};



// EMAIL SIGNUP

export const signupWithEmail = async (email, password) => {

  requireFirebaseConfiguration();

  return createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

};



// GOOGLE LOGIN

export const loginWithGoogle = async () => {

  requireFirebaseConfiguration();

  return signInWithPopup(
    auth,
    googleProvider
  );

};



// LOGOUT

export const logoutUser = async () => {

  requireFirebaseConfiguration();

  return signOut(auth);

};



// FORGOT PASSWORD

export const resetPassword = async (email) => {

  requireFirebaseConfiguration();

  return sendPasswordResetEmail(
    auth,
    email
  );

};



// FIREBASE ERROR HANDLER

export function getAuthErrorMessage(error) {

  const messages = {


    "auth/email-already-in-use":

      "An account already exists with this email.",



    "auth/configuration-not-found":

      "Firebase Authentication is not configured.",



    "auth/invalid-email":

      "Enter a valid email address.",



    "auth/user-not-found":

      "No account found with this email.",



    "auth/wrong-password":

      "Incorrect password.",



    "auth/invalid-credential":

      "Incorrect email or password.",



    "auth/weak-password":

      "Password must contain at least 6 characters.",



    "auth/popup-closed-by-user":

      "Google login popup was closed.",



    "auth/popup-blocked":

      "Google popup was blocked by browser.",



    /*
     * Firebase only allows sign-in from domains on its authorised list, and
     * Vercel mints a fresh hostname for every deployment — so this fires on
     * preview URLs while production works fine. Naming the exact hostname
     * saves squinting at the address bar to work out what to paste.
     */
    "auth/unauthorized-domain":

      `This site's domain (${
        typeof window !== "undefined" ? window.location.hostname : "unknown"
      }) is not authorised in Firebase. Add it under Authentication > ` +
      `Settings > Authorized domains, or open the app on your main domain.`,



    "auth/account-exists-with-different-credential":

      "Account already exists using another login method.",


  };


  if (messages[error?.code]) {

    return messages[error.code];

  }


  /*
   * Only an auth/* code is a real, user-facing auth failure worth quoting.
   * Anything else is an SDK internal ("Database is closing/hidden", IndexedDB
   * and network plumbing) whose wording means nothing to someone looking at a
   * login form — log it for us, show them something actionable.
   */
  if (typeof error?.code === "string" && error.code.startsWith("auth/")) {

    return error.message;

  }


  console.error("Unhandled auth error:", error);

  return "Something went wrong. Please try again.";

}