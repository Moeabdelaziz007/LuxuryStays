import { initializeApp, getApp, getApps } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signInAnonymously,
  sendPasswordResetEmail,
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
  setLogLevel,
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

// Add debugging to help troubleshoot environment variables
console.log("=== DEBUGGING FIREBASE CONFIGURATION ===");
console.log("Raw .env VITE_FIREBASE_PROJECT_ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);
console.log("Raw .env VITE_FIREBASE_API_KEY:", import.meta.env.VITE_FIREBASE_API_KEY);
console.log("Raw .env VITE_FIREBASE_APP_ID:", import.meta.env.VITE_FIREBASE_APP_ID);
console.log("Working with .env project ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);

// تكوين Firebase - استخدام القيم من متغيرات البيئة مع إصلاح للمشكلة
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// طباعة جميع قيم التكوين للتأكد من صحتها وتسهيل التصحيح
console.log("== Firebase Configuration Values ==");
console.log("API Key:", firebaseConfig.apiKey);
console.log("Auth Domain:", firebaseConfig.authDomain);
console.log("Project ID:", firebaseConfig.projectId);
console.log("Storage Bucket:", firebaseConfig.storageBucket);

console.log("Using Firebase configuration from environment variables");

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
    // Skip local emulators completely - we'll use the real Firebase instance
    console.log("Using production Firebase instance - skipping local emulators");
    
    // Improved error handling and connection robustness for Firestore
    try {
      // Set a longer timeout for Firestore operations (helps with slower connections)
      const firestoreSettings = {
        cacheSizeBytes: 50000000, // Increase cache size to 50MB
        ignoreUndefinedProperties: true // Ignore undefined properties to prevent errors
      };
    } catch (err) {
      console.warn("Could not set Firestore settings:", err);
    }
    
    // تكوين متقدم للتخزين المحلي وإدارة الشبكة لتحسين الأداء في كل الظروف
    if (db) {
      console.log("Enabling advanced offline capabilities for Firestore...");
      
      // تفعيل تخزين IndexedDB مع معالجة أفضل للأخطاء
      enableIndexedDbPersistence(db)
        .then(() => {
          console.log("✅ Firestore offline persistence enabled successfully");
          
          // إضافة مستمع لحالة الاتصال للتعامل بشكل أفضل مع تغييرات الاتصال
          window.addEventListener('online', () => {
            console.log("📶 Device came online. Re-enabling Firestore network...");
            if (db) {
              enableNetwork(db)
                .then(() => console.log("✅ Firestore network re-enabled after reconnection"))
                .catch(err => console.warn("⚠️ Failed to re-enable network after reconnection:", err));
            }
          });
          
          window.addEventListener('offline', () => {
            console.log("🔌 Device went offline. Firestore will use cached data.");
          });
        })
        .catch((persistenceError: any) => {
          console.warn("⚠️ Could not enable Firestore offline persistence:", persistenceError);
          
          if (persistenceError.code === 'failed-precondition') {
            console.warn("Multiple tabs open. Persistence is limited to one tab at a time.");
            console.warn("The application will still work, but offline capabilities might be limited.");
          } else if (persistenceError.code === 'unimplemented') {
            console.warn("This browser doesn't support IndexedDB or is in private/incognito mode.");
            console.warn("Please note: offline functionality will be limited in this browser.");
          } else {
            console.error("Unknown persistence error:", persistenceError);
          }
        });
      
      // تمكين إعادة المحاولة التلقائية للعمليات الفاشلة بسبب مشاكل الشبكة
      try {
        setLogLevel('error'); // تقليل كمية السجلات غير الضرورية
      } catch (error) {
        console.warn("Could not set log level:", error);
      }
      
      // إختبار الاتصال وتمكين الشبكة مع آلية إعادة المحاولة
      const attemptNetworkConnection = (retries = 3) => {
        if (db) {
          enableNetwork(db).then(() => {
            console.log("Firestore network enabled");
          }).catch(networkError => {
            console.error("Error enabling Firestore network:", networkError);
            if (retries > 0 && window.navigator.onLine) {
              console.log(`Retrying network connection (${retries} attempts left)...`);
              setTimeout(() => attemptNetworkConnection(retries - 1), 2000);
            }
          });
        }
      };
      
      attemptNetworkConnection();
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

/**
 * Helper function to safely handle Firestore operations with advanced error handling and retry logic
 * This ensures we don't crash the app if Firestore is unavailable
 */
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
  }
  
  return userData;
};

export const logoutUser = async (): Promise<void> => {
  if (!auth) throw new Error("Firebase Auth not initialized");
  return signOut(auth);
};

export const signInWithGoogle = async (): Promise<UserCredential> => {
  if (!auth) throw new Error("Firebase Auth not initialized");
  
  try {
    const provider = new GoogleAuthProvider();
    
    // تعديل إعدادات المزود (لا حاجة لتحديد client_id هنا، فهو موجود في إعدادات Firebase)
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    // إضافة نطاقات إضافية للحصول على مزيد من المعلومات من Google
    provider.addScope('profile');
    provider.addScope('email');
    
    console.log("محاولة تسجيل الدخول باستخدام Google...");
    
    // استخدام الواجهة المنبثقة بدلاً من إعادة التوجيه
    return await signInWithPopup(auth, provider);
  } catch (error: any) {
    console.error("فشل تسجيل الدخول باستخدام Google:", error);
    
    // معالجة أخطاء محددة
    if (error.code === 'auth/popup-blocked') {
      throw new Error("تم حظر النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة في متصفحك ثم المحاولة مرة أخرى.");
    } else if (error.code === 'auth/popup-closed-by-user') {
      throw new Error("تم إغلاق نافذة تسجيل الدخول قبل إكمال العملية. الرجاء المحاولة مرة أخرى.");
    } else if (error.code === 'auth/cancelled-popup-request') {
      throw new Error("تم إلغاء طلب النافذة المنبثقة. الرجاء المحاولة مرة أخرى.");
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error("فشل طلب الشبكة. يرجى التحقق من اتصال الإنترنت الخاص بك والمحاولة مرة أخرى.");
    } else {
      throw new Error(`فشل تسجيل الدخول باستخدام Google: ${error.message || "خطأ غير معروف"}`);
    }
  }
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