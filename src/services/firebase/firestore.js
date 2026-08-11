import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc
} from "firebase/firestore";

import app, {
  firebaseConfigurationError,
  isFirebaseConfigured
} from "./firebase";

export const db = isFirebaseConfigured ? getFirestore(app) : null;

export const createUserProfile = async ({ uid, name, email }) => {
  if (!db) {
    localStorage.setItem(
      `user_profile_${uid}`,
      JSON.stringify({
        uid,
        name,
        email,
        photo: "",
        role: "user"
      })
    );
    return;
  }

  await setDoc(
    doc(db, "users", uid),
    {
      uid,
      name,
      email,
      photo: "",
      role: "user",
      createdAt: serverTimestamp()
    },
    { merge: true }
  );
};

export const getUserProfile = async (uid) => {
  if (!uid) return null;

  const local = localStorage.getItem(`user_profile_${uid}`);
  const localData = local ? JSON.parse(local) : null;

  if (!db) return localData;

  try {
    const docSnap = await getDoc(doc(db, "users", uid));

    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (err) {
    console.warn("Error reading user profile:", err);
  }

  return localData;
};

export const updateUserProfile = async (uid, profileData) => {
  if (!uid) return null;

  const local = localStorage.getItem(`user_profile_${uid}`);
  const existingLocal = local ? JSON.parse(local) : {};

  const updatedData = {
    ...existingLocal,
    ...profileData,
    uid
  };

  localStorage.setItem(
    `user_profile_${uid}`,
    JSON.stringify(updatedData)
  );

  if (!db) return updatedData;

  try {
    await setDoc(
      doc(db, "users", uid),
      profileData,
      { merge: true }
    );

    return updatedData;
  } catch (err) {
    console.warn("Could not update user profile:", err);
    return updatedData;
  }
};

export const saveUserResume = async (uid, resumeData) => {
  const dataWithTime = {
    ...resumeData,
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem(
    `resume_data_${uid || "guest"}`,
    JSON.stringify(dataWithTime)
  );

  if (!db || !uid) return;

  try {
    await setDoc(
      doc(db, "resumes", uid),
      dataWithTime,
      { merge: true }
    );
  } catch (err) {
    console.warn(
      "Could not sync resume to Firestore:",
      err
    );
  }
};

export const getUserResume = async (uid) => {
  const local = localStorage.getItem(
    `resume_data_${uid || "guest"}`
  );

  const localData = local
    ? JSON.parse(local)
    : null;

  if (!db || !uid) return localData;

  try {
    const docSnap = await getDoc(
      doc(db, "resumes", uid)
    );

    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (err) {
    console.warn(
      "Error reading resume from Firestore:",
      err
    );
  }

  return localData;
};

export const saveInterviewResult = async (
  uid,
  resultData
) => {
  const formattedResult = {
    ...resultData,
    createdAt: new Date().toISOString()
  };

  const localKey = `interviews_${uid || "guest"}`;

  const existingLocal = JSON.parse(
    localStorage.getItem(localKey) || "[]"
  );

  existingLocal.unshift(formattedResult);

  localStorage.setItem(
    localKey,
    JSON.stringify(existingLocal)
  );

  if (!db || !uid) return formattedResult;

  try {
    const docRef = await addDoc(
      collection(db, "users", uid, "interviews"),
      {
        ...resultData,
        createdAt: serverTimestamp()
      }
    );

    return {
      ...formattedResult,
      id: docRef.id
    };
  } catch (err) {
    console.warn(
      "Could not save interview to Firestore:",
      err
    );

    return formattedResult;
  }
};

export const getUserInterviewHistory = async (uid) => {
  const localKey = `interviews_${uid || "guest"}`;

  const localHistory = JSON.parse(
    localStorage.getItem(localKey) || "[]"
  );

  if (!db || !uid) return localHistory;

  try {
    const q = query(
      collection(db, "users", uid, "interviews"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    const firestoreData = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      firestoreData.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()
          ? data.createdAt.toDate().toISOString()
          : data.createdAt
      });
    });

    return firestoreData.length > 0
      ? firestoreData
      : localHistory;

  } catch (err) {
    console.warn(
      "Error fetching interview history from Firestore:",
      err
    );

    return localHistory;
  }
};