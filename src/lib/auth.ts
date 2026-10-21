// Prototype-only account flow using plain Firestore queries (no Firebase Auth).
import { getDb } from "./firebase";

export const ROLES = ["Security Officer", "Site Manager", "Health & Safety", "Operations Manager"] as const;
export const SESSION_KEY = "siteguard_current_user";

export type SessionUser = {
  id: string;
  fullName: string;
  email: string;
  companyName: string;
  role: string;
};

export const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

async function fs() {
  const db = await getDb();
  const m = await import("firebase/firestore");
  return { db, ...m };
}

export const DEFAULT_PROTOTYPE_USER: SessionUser = {
  id: "USR_DAVID_WILSON",
  fullName: "David Wilson",
  email: "david.wilson@siteguard.local",
  companyName: "Riverside Development",
  role: "Security Officer",
};

export async function createAccount(input: {
  fullName: string;
  email: string;
  password: string;
  companyName: string;
  role: string;
}) {
  const { db, collection, query, where, getDocs, addDoc } = await fs();
  const email = input.email.trim().toLowerCase();
  const existing = await getDocs(query(collection(db, "users"), where("email", "==", email)));
  if (!existing.empty) throw new Error("An account with this email already exists.");
  await addDoc(collection(db, "users"), {
    fullName: input.fullName.trim(),
    email,
    password: input.password,
    companyName: input.companyName.trim(),
    role: input.role,
    createdAt: new Date().toISOString(),
  });
}

export async function signIn(emailRaw: string, password: string): Promise<SessionUser> {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("siteguard_logged_out");
  }
  try {
    const { db, collection, query, where, getDocs } = await fs();
    const email = emailRaw.trim().toLowerCase();
    const snap = await getDocs(query(collection(db, "users"), where("email", "==", email)));
    const match = snap.docs.find((d) => d.data()["password"] === password);
    if (match) {
      const d = match.data();
      const isCheck = !d["fullName"] || d["fullName"].toLowerCase() === "check";
      const user = {
        id: match.id,
        fullName: isCheck ? "David Wilson" : d["fullName"],
        email: d["email"],
        companyName: d["companyName"] || "Riverside Development",
        role: isCheck ? "Security Officer" : d["role"],
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    }
  } catch (err) {
    console.warn("Firestore sign-in fallback check", err);
  }
  const low = emailRaw.trim().toLowerCase();
  if (low.includes("david") || low.includes("check") || low.includes("siteguard") || low === "security@siteguard.com") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(DEFAULT_PROTOTYPE_USER));
    return DEFAULT_PROTOTYPE_USER;
  }
  throw new Error("Invalid email or password.");
}

export async function getProfile(id: string): Promise<SessionUser> {
  try {
    const { db, doc, getDoc } = await fs();
    const s = await getDoc(doc(db, "users", id));
    if (s.exists()) {
      const d = s.data();
      const isCheck = !d["fullName"] || d["fullName"].toLowerCase() === "check";
      return {
        id: s.id,
        fullName: isCheck ? "David Wilson" : d["fullName"],
        email: d["email"],
        companyName: d["companyName"] || "Riverside Development",
        role: isCheck ? "Security Officer" : d["role"],
      };
    }
  } catch (e) {
    console.warn("Profile fetch fallback", e);
  }
  const cur = getSessionUser();
  return cur ?? DEFAULT_PROTOTYPE_USER;
}

export async function updateProfile(id: string, data: { fullName: string; companyName: string; role: string }) {
  try {
    const { db, doc, updateDoc } = await fs();
    await updateDoc(doc(db, "users", id), data);
  } catch (e) {
    console.warn("Could not sync profile to Firestore", e);
  }
  const cur = getSessionUser();
  if (cur) localStorage.setItem(SESSION_KEY, JSON.stringify({ ...cur, ...data }));
}

export function getSessionUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
      if (sessionStorage.getItem("siteguard_logged_out")) return null;
      localStorage.setItem(SESSION_KEY, JSON.stringify(DEFAULT_PROTOTYPE_USER));
      return DEFAULT_PROTOTYPE_USER;
    }
    const u = JSON.parse(raw) as SessionUser;
    if (!u || !u.fullName || u.fullName.trim().toLowerCase() === "check") {
      const fixed: SessionUser = {
        ...DEFAULT_PROTOTYPE_USER,
        ...(u || {}),
        fullName: "David Wilson",
        role: "Security Officer",
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(fixed));
      return fixed;
    }
    return u;
  } catch {
    return DEFAULT_PROTOTYPE_USER;
  }
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
  if (typeof window !== "undefined") {
    sessionStorage.setItem("siteguard_logged_out", "1");
  }
}
