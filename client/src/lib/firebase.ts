import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCziEw9ASclqaqTyPtZu1Rih1_1ad8nmgs",
  authDomain: "staychill-3ed08.firebaseapp.com",
  projectId: "staychill-3ed08",
  storageBucket: "staychill-3ed08.firebasestorage.app",
  messagingSenderId: "299280633489",
  appId: "1:299280633489:web:2088c38e2fde210cad7930"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

// Helper utility for safely handling Firestore document data
export const safeDoc = (doc: any) => {
  if (!doc || !doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() };
};

// Export everything
export { app, auth, db, storage };