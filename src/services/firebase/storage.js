import { getStorage } from "firebase/storage";
import app, { isFirebaseConfigured } from "./firebase";

export const storage = isFirebaseConfigured ? getStorage(app) : null;
