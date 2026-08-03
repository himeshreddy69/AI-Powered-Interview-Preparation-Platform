import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import app, {
  firebaseConfigurationError,
  isFirebaseConfigured,
} from "./firebase";


export const auth = isFirebaseConfigured
  ? getAuth(app)
  : null;



const googleProvider = new GoogleAuthProvider();



function requireFirebaseConfiguration() {

  if (!isFirebaseConfigured) {

    throw new Error(firebaseConfigurationError);

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



    "auth/account-exists-with-different-credential":

      "Account already exists using another login method.",


  };


  return (
    messages[error.code] ||
    error.message ||
    "Something went wrong. Please try again."
  );

}