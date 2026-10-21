import { createServerFn } from "@tanstack/react-start";

// Firebase web config sourced from environment variables.
export const getFirebaseConfig = createServerFn({ method: "GET" }).handler(async () => {
  return {
    apiKey: process.env["VITE_FIREBASE_API_KEY"] ?? process.env["GOOGLE_API_KEY"] ?? "",
    authDomain: process.env["VITE_FIREBASE_AUTH_DOMAIN"] ?? "",
    projectId: process.env["VITE_FIREBASE_PROJECT_ID"] ?? "",
    storageBucket: process.env["VITE_FIREBASE_STORAGE_BUCKET"] ?? "",
    messagingSenderId: process.env["VITE_FIREBASE_MESSAGING_SENDER_ID"] ?? "",
    appId: process.env["VITE_FIREBASE_APP_ID"] ?? "",
    measurementId: process.env["VITE_FIREBASE_MEASUREMENT_ID"] ?? process.env["GOOGLE_ANALYTICS_MEASUREMENT_ID"] ?? "",
  };
});
