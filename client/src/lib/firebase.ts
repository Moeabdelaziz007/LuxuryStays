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
  enableIndexedDbPersistence,
  enableNetwork,
  disableNetwork,
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
    
    // تكوين إعدادات إضافية للتعامل مع مشاكل الاتصال
    console.log("Setting up Firestore connection with retry logic...");
    
    // محاولة تحسين الاتصال بـ Firestore عند التشغيل
    // لكن تخطي المحاكي المحلي في بيئة الإنتاج
    if (import.meta.env.DEV) {
      try {
        console.log("Development environment detected. Trying local emulator...");
        if (db) {
          connectFirestoreEmulator(db, "localhost", 8080);
          console.log("Connected to Firestore local emulator");
        }
      } catch (emulatorError) {
        console.warn("Could not connect to Firestore emulator:", emulatorError);
      }
    }
    
    // تمكين التخزين المحلي لدعم الوضع غير المتصل (استخدام وعد للتعامل مع الخطأ)
    if (db) {
      console.log("Enabling offline persistence for Firestore...");
      
      // استخدام وعد للتمكن من معالجة الخطأ دون تعطيل التطبيق
      enableIndexedDbPersistence(db)
        .then(() => {
          console.log("✅ Firestore offline persistence enabled successfully");
        })
        .catch((persistenceError: any) => {
          console.warn("⚠️ Could not enable Firestore offline persistence:", persistenceError);
          
          if (persistenceError.code === 'failed-precondition') {
            console.warn("Multiple tabs open. Persistence can only be enabled in one tab at a time.");
          } else if (persistenceError.code === 'unimplemented') {
            console.warn("Browser doesn't support IndexedDB or is in private mode.");
          }
        });
      
      // إختبار الاتصال عن طريق إيقاف وتمكين الشبكة
      enableNetwork(db).then(() => {
        console.log("Firestore network enabled");
      }).catch(networkError => {
        console.error("Error enabling Firestore network:", networkError);
      });
    }
    
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

// Helper function to safely handle Firestore operations with advanced error handling and retry logic
// This ensures we don't crash the app if Firestore is unavailable
export const safeDoc = async (operation: () => Promise<any>, fallback: any = null, maxRetries = 3): Promise<any> => {
  if (!db) {
    console.error("Firestore not initialized, operation skipped");
    return fallback;
  }

  let retriesLeft = maxRetries;
  let lastError: any = null;

  while (retriesLeft > 0) {
    try {
      // Check network status before trying the operation
      if (window.navigator.onLine === false) {
        console.warn("Browser reports device is offline. Attempting operation anyway as Firestore has offline capabilities...");
      }

      // Try to re-enable network if it might have been disabled
      try {
        await enableNetwork(db);
      } catch (networkError) {
        console.warn("Failed to ensure network is enabled:", networkError);
        // Continue anyway, the operation might work with offline persistence
      }

      // Attempt the operation
      const result = await operation();
      if (retriesLeft < maxRetries) {
        console.log(`✅ Operation succeeded after ${maxRetries - retriesLeft} retries`);
      }
      return result;
    } catch (error: any) {
      lastError = error;
      
      // Detailed error information
      console.error(`Error accessing Firestore (${maxRetries - retriesLeft + 1}/${maxRetries} attempts):`, error);
      
      // Handle different error types with specific recovery strategies
      if (error.code === "unavailable" || error.code === "resource-exhausted") {
        console.warn(`Firestore is currently unavailable (${error.code}). Retrying in 2 seconds...`);
        
        // Implement exponential backoff
        const backoffTime = Math.min(1000 * Math.pow(1.5, maxRetries - retriesLeft), 10000);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        
        // Try re-enabling network before next retry
        try {
          await enableNetwork(db);
          console.log("Successfully re-enabled Firestore network connection");
        } catch (networkError) {
          console.warn("Failed to re-enable network:", networkError);
        }
      } else if (error.code === "permission-denied") {
        console.error("Permission denied by Firestore security rules. Check your authentication status and security rules.");
        // No retry for permission issues, they won't resolve themselves
        break;
      } else if (error.code === "not-found") {
        console.warn("Document or collection not found in Firestore.");
        // No retry for missing documents, they won't appear magically
        break;
      } else if (error.code === "aborted" || error.code === "cancelled") {
        // These errors can be transient, worth retrying
        console.warn(`Operation ${error.code}, will retry...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // For unknown errors, add a small delay but keep retrying
        console.error(`Unexpected Firestore error (${error.code}):`, error.message);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      retriesLeft--;
    }
  }
  
  // If all retries failed, log additional diagnostic information
  if (lastError) {
    console.error("All Firestore operation attempts failed:", lastError);
    
    // Display specific guidance based on error type
    if (lastError.code === "unavailable") {
      console.warn("✋ GUIDANCE: Firestore is currently unavailable. This usually indicates:");
      console.warn("1. Network connectivity issues");
      console.warn("2. Firebase project may be experiencing issues");
      console.warn("3. Security rules might be blocking access");
      
      if (window.navigator.onLine === false) {
        console.warn("🔴 You appear to be offline. Please check your internet connection.");
      } else {
        console.warn("🟡 Your device appears to be online, but cannot reach Firestore.");
        console.warn("   - Check Firebase console for service disruptions");
        console.warn("   - Verify your Firebase project ID and configuration");
        console.warn("   - Ensure your security rules allow the operation");
      }
    }
  }
  
  return fallback;
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
