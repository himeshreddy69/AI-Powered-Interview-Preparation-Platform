import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import app, { firebaseConfigurationError, isFirebaseConfigured } from "./firebase";

export const db = isFirebaseConfigured ? getFirestore(app) : null;

export const createUserProfile = ({ uid, name, email }) => {
  if (!db) return Promise.reject(new Error(firebaseConfigurationError));

  return setDoc(doc(db, "users", uid), {
    uid,
    name,
    email,
    createdAt: serverTimestamp(),
  });
};
