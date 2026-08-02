import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import app, { firebaseConfigurationError, isFirebaseConfigured } from "./firebase";

export const auth = isFirebaseConfigured ? getAuth(app) : null;

function requireFirebaseConfiguration() {
  if (!isFirebaseConfigured) throw new Error(firebaseConfigurationError);
}

export const loginWithEmail = async (email, password) => {
  requireFirebaseConfiguration();
  return signInWithEmailAndPassword(auth, email, password);
};

export const signupWithEmail = async (email, password) => {
  requireFirebaseConfiguration();
  return createUserWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => {
  requireFirebaseConfiguration();
  return signOut(auth);
};

export function getAuthErrorMessage(error) {
  const messages = {
    "auth/email-already-in-use": "An account already exists with this email address.",
    "auth/configuration-not-found": "Firebase Authentication is not configured for this project. Enable Email/Password sign-in in Firebase Console.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/user-not-found": "Incorrect email or password.",
    "auth/wrong-password": "Incorrect email or password.",
  };

  return messages[error.code] || error.message || "Something went wrong. Please try again.";
}
