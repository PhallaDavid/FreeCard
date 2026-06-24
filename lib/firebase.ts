import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import type { PortfolioData } from "./theme-presets";

export const isFirebaseConfigured = !!(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: any;
let auth: any = null;
let db: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    // Enable offline persistence so Firestore works even when briefly offline
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch (e: any) {
    // If persistence setup fails (e.g. already initialized), fall back to standard Firestore
    if (e?.code === "failed-precondition" || e?.message?.includes("already")) {
      try {
        const { getFirestore } = require("firebase/firestore");
        db = getFirestore(app);
      } catch (e2) {
        console.error("Firestore fallback init failed:", e2);
      }
    } else {
      console.error("Firebase initialization failed:", e);
    }
  }
} else {
  if (typeof window !== "undefined") {
    console.warn(
      "Firebase credentials are not configured in .env.local. Running in 'Mock Mode' using localStorage."
    );
  }
}

export { auth, db };

/**
 * Fetch portfolio by username from Firestore, falling back to localStorage.
 */
export async function getPortfolioByUsername(
  username: string
): Promise<PortfolioData | null> {
  const normalized = username.toLowerCase().trim();

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "portfolios", normalized);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as PortfolioData;
      }
    } catch (e: any) {
      console.warn("Firestore getPortfolioByUsername failed (offline?):", e?.message);
    }
  }

  // Fallback to localStorage
  if (typeof window !== "undefined") {
    const localData = localStorage.getItem("portfolio_data");
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (parsed.username && parsed.username.toLowerCase().trim() === normalized) {
          return parsed;
        }
      } catch (_) {}
    }
  }
  return null;
}

/**
 * Find a portfolio by owner UID from Firestore, falling back to localStorage.
 * Returns null if offline or not found — callers should treat null as "no existing portfolio".
 */
export async function getPortfolioByOwnerUid(
  uid: string
): Promise<PortfolioData | null> {
  // First check localStorage mirror (instant, works offline)
  if (typeof window !== "undefined") {
    const localData = localStorage.getItem("portfolio_data");
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (parsed.ownerUid && parsed.ownerUid === uid) {
          return parsed;
        }
      } catch (_) {}
    }
  }

  // Then try Firestore
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "portfolios"), where("ownerUid", "==", uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data() as PortfolioData;
      }
    } catch (e: any) {
      console.warn("Firestore getPortfolioByOwnerUid failed (offline?):", e?.message);
      // Return null so callers can proceed with a fresh profile creation
    }
  }
  return null;
}

/**
 * Write portfolio changes to Firestore and sync to localStorage mirror.
 * If Firestore is offline, data is saved to localStorage and will sync when back online
 * (Firestore offline persistence handles this automatically).
 */
export async function savePortfolio(
  username: string,
  data: PortfolioData
): Promise<boolean> {
  const normalized = username.toLowerCase().trim();

  // Always write to localStorage first (instant + offline-safe)
  if (typeof window !== "undefined") {
    localStorage.setItem("portfolio_data", JSON.stringify(data));
  }

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "portfolios", normalized);
      await setDoc(docRef, { ...data, username: normalized });
      return true;
    } catch (e: any) {
      console.warn("Firestore savePortfolio failed (offline?):", e?.message);
      // Data is already in localStorage; Firestore will sync when back online
      return false;
    }
  }
  return true;
}
