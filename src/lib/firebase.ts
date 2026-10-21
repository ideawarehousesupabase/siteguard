// Firestore only. No Firebase Authentication is used anywhere in this project.
import type { Firestore } from "firebase/firestore";
import { getFirebaseConfig } from "./firebase-config.functions";

let dbPromise: Promise<Firestore> | null = null;

export function getDb(): Promise<Firestore> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const env = import.meta.env;
      const fromServer = await getFirebaseConfig().catch(() => ({}));
      const firebaseConfig = {
        apiKey: env["VITE_FIREBASE_API_KEY"] || fromServer?.apiKey || "",
        authDomain: env["VITE_FIREBASE_AUTH_DOMAIN"] || fromServer?.authDomain || "",
        projectId: env["VITE_FIREBASE_PROJECT_ID"] || fromServer?.projectId || "",
        storageBucket: env["VITE_FIREBASE_STORAGE_BUCKET"] || fromServer?.storageBucket || "",
        messagingSenderId: env["VITE_FIREBASE_MESSAGING_SENDER_ID"] || fromServer?.messagingSenderId || "",
        appId: env["VITE_FIREBASE_APP_ID"] || fromServer?.appId || "",
        measurementId: env["VITE_FIREBASE_MEASUREMENT_ID"] || fromServer?.measurementId || "",
      };
      const { initializeApp, getApps } = await import("firebase/app");
      const { getFirestore } = await import("firebase/firestore");
      const app = getApps()[0] ?? initializeApp(firebaseConfig);
      return getFirestore(app);
    })();
    dbPromise.catch(() => (dbPromise = null));
  }
  return dbPromise;
}
