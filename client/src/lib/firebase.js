import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const hasFirebaseConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId);

export const app = hasFirebaseConfig ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  if (!auth) return { uid: "demo-user", email: "demo@projectinsight.ai", displayName: "Demo User" };
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function loginWithEmail(email, password, mode = "login") {
  if (!auth) return { uid: "demo-user", email, displayName: email.split("@")[0] };

  const action = mode === "signup" ? createUserWithEmailAndPassword : signInWithEmailAndPassword;
  const result = await action(auth, email, password);
  return result.user;
}

export async function logout() {
  if (auth) await signOut(auth);
}
