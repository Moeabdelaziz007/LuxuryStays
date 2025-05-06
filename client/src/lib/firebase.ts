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

// Use the correct Firebase configuration directly in the code
// for immediate effect

// تكوين Firebase - تأكد من أن جميع القيم صحيحة
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCziEw9ASclqaqTyPtZu1Rih1_1ad8nmgs",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "staychill-3ed08"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "staychill-3ed08",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "staychill-3ed08"}.firebasestorage.app`,
  messagingSenderId: "299280633489",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:299280633489:web:2088c38e2fde210cad7930"
};

// طباعة جميع قيم التكوين للتأكد من صحتها
console.log("== Firebase Configuration Values ==");
console.log("API Key:", firebaseConfig.apiKey);
console.log("Auth Domain:", firebaseConfig.authDomain);
console.log("Project ID:", firebaseConfig.projectId);
console.log("Storage Bucket:", firebaseConfig.storageBucket);

console.log("Using hardcoded Firebase configuration for immediate effect");

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

let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: Storage | null = null;

// Export Firebase services with error handling
if (app) {
  try {
    auth = getAuth(app);
    console.log("Firebase Auth initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase Auth:", error);
  }
  
  try {
    db = getFirestore(app);
    
    // Firestore configurations are handled internally
    // We are connected now, if any error happens will fallback to local data
    
    console.log("Firebase Firestore initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase Firestore:", error);
  }
  
  try {
    storage = getStorage(app);
    console.log("Firebase Storage initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase Storage:", error);
  }
}

// Helper function to safely handle Firestore operations
// This ensures we don't crash the app if Firestore is unavailable
export const safeDoc = async (operation: () => Promise<any>, fallback: any = null): Promise<any> => {
  if (!db) {
    console.error("Firestore not initialized, operation skipped");
    return fallback;
  }
  
  try {
    return await operation();
  } catch (error: any) {
    // Log detailed error information
    console.error("Error accessing Firestore:", error);
    
    if (error.code === "unavailable") {
      console.warn("Firestore is currently unavailable. This may be due to network issues or Firestore rules.");
      console.warn("Please check your internet connection and Firebase console settings.");
      
      // Check for common issues and provide guidance
      if (window.navigator.onLine === false) {
        console.warn("You appear to be offline. Please check your internet connection.");
      } else {
        console.warn("If you're using a development environment, ensure your Firebase project allows local testing.");
        console.warn("You might need to check your Firebase rules and allow reads/writes for your use case.");
      }
    }
    
    return fallback;
  }
};

export { auth, db, storage };

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
  
  // محاولة حفظ البيانات في Firestore مع معالجة الخطأ
  try {
    // create a reference to the user document
    const userRef = doc(db, "users", user.uid);
    
    // محاولة حفظ البيانات
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp()
    });
    
    console.log("User data saved successfully to Firestore:", userData);
  } catch (error) {
    // إظهار خطأ مفصل في حالة فشل حفظ البيانات
    console.error("Failed to save user data to Firestore:", error);
    console.warn("User was created in Firebase Auth but data couldn't be saved to Firestore");
    
    // يمكننا أن نعرض للمستخدم أن هناك مشكلة في حفظ البيانات ولكن التسجيل تم بنجاح
    // لن نرمي خطأ هنا لأن المستخدم تم إنشاؤه بنجاح في Firebase Auth
  }
  
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
  if (!db) {
    console.error("Firestore not initialized, returning default user data");
    // إذا كان المستخدم قد سجل الدخول، نعود ببيانات أساسية من Auth
    if (auth && auth.currentUser) {
      return {
        uid,
        name: auth.currentUser.displayName || "مستخدم",
        email: auth.currentUser.email || "",
        role: UserRole.CUSTOMER, // دور افتراضي
        createdAt: new Date().toISOString(),
      };
    }
    return null;
  }
  
  // استخدام وظيفة safeDoc للتعامل مع الأخطاء المحتملة
  return await safeDoc(async () => {
    const docRef = doc(db!, "users", uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as UserData;
      // تحويل الطابع الزمني من Firestore إلى سلسلة تاريخ إذا لزم الأمر
      if (data.createdAt && typeof data.createdAt !== 'string') {
        data.createdAt = new Date((data.createdAt as any).toDate()).toISOString();
      }
      console.log("Retrieved user data from Firestore:", data);
      return data;
    } else {
      // User document doesn't exist in Firestore
      // Create a basic user document with default values
      if (auth && auth.currentUser) {
        const basicUserData: UserData = {
          uid,
          name: auth.currentUser.displayName || "مستخدم",
          email: auth.currentUser.email || "",
          role: UserRole.CUSTOMER,
          createdAt: new Date().toISOString(),
        };
        
        console.log("Creating user document in Firestore for uid:", uid);
        
        // محاولة إنشاء مستند المستخدم مع الاهتمام برسائل الخطأ
        try {
          await setDoc(docRef, {
            ...basicUserData,
            createdAt: serverTimestamp()
          });
          console.log("Successfully created user document in Firestore");
        } catch (error) {
          console.error("Failed to create user document in Firestore:", error);
          console.warn("Continuing with basic user data from Auth");
        }
        
        return basicUserData;
      }
      return null;
    }
  }, null);
};
