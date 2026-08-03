import {
  doc,
  getFirestore,
  serverTimestamp,
  setDoc
} from "firebase/firestore";

import app, {
  firebaseConfigurationError,
  isFirebaseConfigured
} from "./firebase";



export const db = isFirebaseConfigured
  ? getFirestore(app)
  : null;




export const createUserProfile = async ({
  uid,
  name,
  email
}) => {


  if (!db) {

    throw new Error(
      firebaseConfigurationError
    );

  }



  await setDoc(

    doc(
      db,
      "users",
      uid
    ),

    {

      uid,

      name,

      email,

      photo: "",

      role: "user",

      createdAt: serverTimestamp()

    }

  );


};