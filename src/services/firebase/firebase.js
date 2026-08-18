import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/*
 * Which env var backs each config field, so the error can name the ones that
 * are actually missing. "Firebase is not configured" on its own sent us
 * hunting through a Vercel dashboard with no idea which of the six was empty.
 */
const ENV_VAR_FOR_FIELD = {
  apiKey: "VITE_FIREBASE_API_KEY",
  authDomain: "VITE_FIREBASE_AUTH_DOMAIN",
  projectId: "VITE_FIREBASE_PROJECT_ID",
  storageBucket: "VITE_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "VITE_FIREBASE_MESSAGING_SENDER_ID",
  appId: "VITE_FIREBASE_APP_ID",
};

export const missingFirebaseEnvVars = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([field]) => ENV_VAR_FOR_FIELD[field]);

export const isFirebaseConfigured = missingFirebaseEnvVars.length === 0;

/*
 * Vite inlines VITE_* at build time, so on a hosted deploy the fix is in the
 * host's environment variables followed by a REBUILD — telling someone to
 * "restart the dev server" is useless advice on Vercel.
 */
export const firebaseConfigurationError = isFirebaseConfigured
  ? ""
  : `Firebase is not configured. Missing: ${missingFirebaseEnvVars.join(", ")}. ` +
    `Set these where the app is built (locally in .env and restart the dev ` +
    `server; on Vercel in Settings > Environment Variables, then redeploy).`;

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export default app;
