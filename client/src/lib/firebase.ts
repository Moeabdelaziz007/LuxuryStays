import { initializeApp, getApp, getApps } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
  connectAuthEmulator,
  Auth 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc,
  serverTimestamp,
  connectFirestoreEmulator,
  Firestore
} from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
type Storage = ReturnType<typeof getStorage>;
import { UserData, UserRole } from "@/features/auth/types";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Configure WebSocket for any database connections (needed for Neon DB)
if (typeof window === "undefined") {
  // Node.js environment
  neonConfig.webSocketConstructor = ws;
}

// Add extra initialization code to troubleshoot Firebase connection issues
console.log("Initializing Firebase with project ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase only once with error handling
let app;
try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    console.log("Firebase app initialized successfully");
  } else {
    app = getApp();
    console.log("Using existing Firebase app");
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
  // Don't throw here, let the app continue with local auth as fallback
  app = null;
}

// Export Firebase services with error handling
export const auth: Auth | null = app ? getAuth(app) : null;
export const db: Firestore | null = app ? getFirestore(app) : null;
export const storage: Storage | null = app ? getStorage(app) : null;

// Useful debug information for Firebase connection
if (app) {
  console.log("Firebase auth initialized:", !!auth);
  console.log("Firebase Firestore initialized:", !!db);
  console.log("Firebase Storage initialized:", !!storage);
}

// Firebase authentication functions

export const loginUser = async (email: string, password: string): Promise<UserCredential> => {
  if (!auth) throw new Error("Firebase Auth not initialized");
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerUser = async (email: string, password: string, name: string): Promise<UserData> => {
  if (!auth) throw new Error("Firebase Auth not initialized");
  if (!db) throw new Error("Firestore not initialized");
  
  // 1. Create the user in Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // 2. Create a document in Firestore with additional user data
  const userData: UserData = {
    uid: user.uid,
    name: name,
    email: email,
    role: UserRole.CUSTOMER, // Default role
    createdAt: new Date().toISOString(),
  };
  
  await setDoc(doc(db, "users", user.uid), {
    ...userData,
    createdAt: serverTimestamp()
  });
  
  return userData;
};

export const logoutUser = async (): Promise<void> => {
  if (!auth) throw new Error("Firebase Auth not initialized");
  return signOut(auth);
};

export const signInWithGoogle = async (): Promise<UserCredential> => {
  if (!auth) throw new Error("Firebase Auth not initialized");
  
  const provider = new GoogleAuthProvider();
  // Add the custom Web client ID
  provider.setCustomParameters({
    client_id: '299280633489-b75p2dj5j2vk4sfav3sird268o1oofeu.apps.googleusercontent.com',
    prompt: 'select_account'
  });
  return signInWithPopup(auth, provider);
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
  if (!db) throw new Error("Firestore not initialized");
  
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data() as UserData;
    // Convert Firestore timestamp to Date string if needed
    if (data.createdAt && typeof data.createdAt !== 'string') {
      data.createdAt = new Date((data.createdAt as any).toDate()).toISOString();
    }
    return data;
  } else {
    // User document doesn't exist in Firestore
    // Create a basic user document with default values
    if (auth && auth.currentUser) {
      const basicUserData: UserData = {
        uid,
        name: auth.currentUser.displayName || "User",
        email: auth.currentUser.email || "",
        role: UserRole.CUSTOMER,
        createdAt: new Date().toISOString(),
      };
      
      if (db) {
        await setDoc(doc(db, "users", uid), {
          ...basicUserData,
          createdAt: serverTimestamp()
        });
      }
      
      return basicUserData;
    }
    return null;
  }
};
