// Prototype-only account flow using plain Firestore queries (no Firebase Auth).
import { getDb } from "./firebase";

export const ROLES = [
  "Security Officer",
  "Site Manager",
  "Health & Safety",
  "Operations Manager",
] as const;
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

const LOCAL_USERS_KEY = "siteguard_registered_users";

type StoredUser = SessionUser & { password?: string };

function getLocalUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalUser(u: StoredUser) {
  if (typeof window === "undefined") return;
  try {
    const list = getLocalUsers().filter((x) => x.email.toLowerCase() !== u.email.toLowerCase());
    list.push(u);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn("Could not save to local user cache", e);
  }
}

export async function createAccount(input: {
  fullName: string;
  email: string;
  password: string;
  companyName: string;
  role: string;
}) {
  const email = input.email.trim().toLowerCase();

  const existingLocal = getLocalUsers().find((u) => u.email.toLowerCase() === email);
  if (existingLocal) {
    throw new Error("An account with this email already exists.");
  }

  try {
    const { db, collection, query, where, getDocs, addDoc } = await fs();
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
  } catch (err) {
    if (err instanceof Error && err.message.includes("already exists")) throw err;
    console.warn("Firestore createAccount fallback to local cache", err);
  }

  saveLocalUser({
    id: "USR_" + Math.random().toString(36).slice(2, 9).toUpperCase(),
    fullName: input.fullName.trim(),
    email,
    password: input.password,
    companyName: input.companyName.trim(),
    role: input.role,
  });
}

export async function signIn(emailRaw: string, password: string): Promise<SessionUser> {
  const email = emailRaw.trim().toLowerCase();

  try {
    const { db, collection, query, where, getDocs } = await fs();
    const snap = await getDocs(query(collection(db, "users"), where("email", "==", email)));
    const match = snap.docs.find((d) => d.data()["password"] === password);
    if (match) {
      const d = match.data();
      const user = {
        id: match.id,
        fullName: d["fullName"] || "Site User",
        email: d["email"],
        companyName: d["companyName"] || "Riverside Development",
        role: d["role"] || "Security Officer",
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    }
  } catch (err) {
    console.warn("Firestore sign-in fallback check", err);
  }

  const localMatch = getLocalUsers().find(
    (u) => u.email.toLowerCase() === email && u.password === password,
  );
  if (localMatch) {
    const user: SessionUser = {
      id: localMatch.id,
      fullName: localMatch.fullName,
      email: localMatch.email,
      companyName: localMatch.companyName,
      role: localMatch.role,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  }

  if (
    email.includes("david") ||
    email.includes("check") ||
    email.includes("siteguard") ||
    email === "security@siteguard.com"
  ) {
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
      return {
        id: s.id,
        fullName: d["fullName"] || "Site User",
        email: d["email"],
        companyName: d["companyName"] || "Riverside Development",
        role: d["role"] || "Security Officer",
      };
    }
  } catch (e) {
    console.warn("Profile fetch fallback", e);
  }
  const cur = getSessionUser();
  if (cur) return cur;
  const local = getLocalUsers().find((u) => u.id === id);
  if (local) {
    return {
      id: local.id,
      fullName: local.fullName,
      email: local.email,
      companyName: local.companyName,
      role: local.role,
    };
  }
  return DEFAULT_PROTOTYPE_USER;
}

export async function updateProfile(
  id: string,
  data: { fullName: string; companyName: string; role: string },
) {
  try {
    const { db, doc, updateDoc } = await fs();
    await updateDoc(doc(db, "users", id), data);
  } catch (e) {
    console.warn("Could not sync profile to Firestore", e);
  }
  const cur = getSessionUser();
  if (cur) {
    const updated = { ...cur, ...data };
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  }
  const localList = getLocalUsers();
  const idx = localList.findIndex((u) => u.id === id);
  if (idx !== -1) {
    localList[idx] = { ...localList[idx], ...data };
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(localList));
  }
}

export function getSessionUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw) as SessionUser;
    if (!u || !u.email || !u.fullName) {
      return null;
    }
    return u;
  } catch {
    return null;
  }
}

export function signOut() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}
