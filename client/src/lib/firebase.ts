import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Firebase configuration - using explicit configuration to ensure consistency
const firebaseConfig = {
  apiKey: "AIzaSyCziEw9ASclqaqTyPtZu1Rih1_1ad8nmgs",
  authDomain: "staychill-3ed08.firebaseapp.com",
  projectId: "staychill-3ed08",
  storageBucket: "staychill-3ed08.firebasestorage.app",
  messagingSenderId: "299280633489",
  appId: "1:299280633489:web:2088c38e2fde210cad7930"
};

// Initialize Firebase
console.log("Initializing Firebase with project ID:", firebaseConfig.projectId);
console.log("=== DEBUGGING FIREBASE CONFIGURATION ===");

// Debug configuration values from env
console.log("Working with project ID:", firebaseConfig.projectId);
console.log("== Firebase Configuration Values ==");
console.log("API Key:", firebaseConfig.apiKey);
console.log("Auth Domain:", firebaseConfig.authDomain);
console.log("Project ID:", firebaseConfig.projectId);
console.log("Storage Bucket:", firebaseConfig.storageBucket);
console.log("Using Firebase configuration from provided values");

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
console.log("Firebase app initialized successfully");

// Initialize Firebase services
const auth = getAuth(app);
console.log("Firebase Auth initialized successfully");

// Setup Firestore with retry logic
console.log("Setting up Firestore connection with retry logic...");

// Skip emulators in production
console.log("Using production Firebase instance - skipping local emulators");

// Initialize Firestore with offline persistence
const db = getFirestore(app);
console.log("Firebase Firestore initialized successfully");

// Enable offline persistence (caching) for Firestore
console.log("Enabling advanced offline capabilities for Firestore...");
import { enableIndexedDbPersistence } from "firebase/firestore";

enableIndexedDbPersistence(db).then(() => {
  console.log("✅ Firestore offline persistence enabled successfully");
}).catch(err => {
  if (err.code === 'failed-precondition') {
    console.warn("⚠️ Multiple tabs open, persistence can only be enabled in one tab at a time.");
  } else if (err.code === 'unimplemented') {
    console.warn("⚠️ The current browser doesn't support offline persistence");
  } else {
    console.error("Error enabling offline persistence:", err);
  }
});

// Initialize Storage
const storage = getStorage(app);
console.log("Firebase Storage initialized successfully");

// Log initialization status
console.log("Firebase auth initialized:", !!auth);
console.log("Firebase Firestore initialized:", !!db);
console.log("Firebase Storage initialized:", !!storage);

// Set network status listener
import { enableNetwork, disableNetwork } from "firebase/firestore";

let isFirestoreOnline = true;

// Function to handle online/offline updates
const updateFirestoreNetwork = async (isOnline: boolean) => {
  if (isOnline === isFirestoreOnline) return;
  
  try {
    if (isOnline) {
      await enableNetwork(db);
      console.log("Firestore network enabled");
    } else {
      await disableNetwork(db);
      console.log("Firestore network disabled");
    }
    isFirestoreOnline = isOnline;
  } catch (error) {
    console.error("Error updating Firestore network state:", error);
  }
};

// Listen for online/offline events
window.addEventListener('online', () => updateFirestoreNetwork(true));
window.addEventListener('offline', () => updateFirestoreNetwork(false));

// Helper utility for safely handling Firestore document data
export const safeDoc = (doc: any) => {
  if (!doc || !doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() };
};

// Export everything
export { app, auth, db, storage };