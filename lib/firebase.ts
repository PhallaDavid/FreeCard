import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
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

let app;
let auth: any = null;
let db: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (e) {
    console.error("Firebase initialization failed:", e);
  }
} else {
  if (typeof window !== "undefined") {
    console.warn("Firebase credentials are not configured in .env.local. Running in 'Mock Mode' using localStorage.");
  }
}

export { auth, db };

/**
 * Fetch portfolio configurations from Firestore or fallback to localStorage
 */
export async function getPortfolioByUsername(username: string): Promise<PortfolioData | null> {
  const normalized = username.toLowerCase().trim();
  
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "portfolios", normalized);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as PortfolioData;
      }
    } catch (e) {
      console.error("Error reading portfolio from Firestore:", e);
    }
  }
  
  // Fallback to local storage
  if (typeof window !== "undefined") {
    const localData = localStorage.getItem("portfolio_data");
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (parsed.username && parsed.username.toLowerCase().trim() === normalized) {
          return parsed;
        }
      } catch (e) {}
    }
  }
  return null;
}

/**
 * Find unique username associated with a creator's auth UID
 */
export async function getPortfolioByOwnerUid(uid: string): Promise<PortfolioData | null> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "portfolios"), where("ownerUid", "==", uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data() as PortfolioData;
      }
    } catch (e) {
      console.error("Error querying portfolio by owner Uid:", e);
    }
  }
  return null;
}

/**
 * Write portfolio changes to Firestore and sync to localStorage mirror
 */
export async function savePortfolio(username: string, data: PortfolioData): Promise<boolean> {
  const normalized = username.toLowerCase().trim();
  
  // Always mirror in localStorage for local state & offline loading speed
  if (typeof window !== "undefined") {
    localStorage.setItem("portfolio_data", JSON.stringify(data));
  }
  
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "portfolios", normalized);
      await setDoc(docRef, { ...data, username: normalized });
      return true;
    } catch (e) {
      console.error("Error saving portfolio to Firestore:", e);
      return false;
    }
  }
  return true;
}
