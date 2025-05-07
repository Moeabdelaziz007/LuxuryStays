import { initializeApp, getApp, getApps } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signInAnonymously,
  sendPasswordResetEmail,
  signInWithCustomToken,
  linkWithPopup,
  updateProfile,
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
export const safeDoc = async (operation: () => Promise<any>, fallback: any = null, maxRetries = 3, cacheKey?: string): Promise<any> => {
  // أولاً، محاولة استرداد البيانات المخزنة مؤقتًا إذا كان هناك مفتاح تخزين مؤقت
  if (cacheKey) {
    try {
      const cachedData = getFirestoreCache(cacheKey);
      if (cachedData) {
        console.log(`✅ Using cached data for key: ${cacheKey}`);
        
        // محاولة تحديث البيانات في الخلفية بدون انتظار النتيجة
        setTimeout(() => {
          if (db) {
            operation().then(freshResult => {
              if (JSON.stringify(freshResult) !== JSON.stringify(cachedData)) {
                console.log(`ℹ️ Updating cache for key: ${cacheKey}`);
                cacheFirestoreData(cacheKey, freshResult);
              }
            }).catch(err => {
              console.warn(`ℹ️ Background refresh failed for key: ${cacheKey}`, err);
            });
          }
        }, 100);
        
        return cachedData;
      }
    } catch (cacheError) {
      console.warn("Error accessing cache:", cacheError);
    }
  }

  if (!db) {
    console.error("Firestore not initialized, operation skipped");
    return fallback;
  }

  let retriesLeft = maxRetries;
  let lastError: any = null;
  let isNetworkReset = false;

  while (retriesLeft > 0) {
    try {
      // Check network status before trying the operation
      if (window.navigator.onLine === false) {
        console.warn("Browser reports device is offline. Attempting operation anyway as Firestore has offline capabilities...");
      }

      // Try to re-enable network if it might have been disabled
      if (!isNetworkReset) {
        try {
          await enableNetwork(db);
          isNetworkReset = true;
          console.log("Firestore network enabled for operation");
        } catch (networkError) {
          console.warn("Failed to ensure network is enabled:", networkError);
          // Continue anyway, the operation might work with offline persistence
        }
      }

      // Attempt the operation
      const result = await operation();
      
      // Operation succeeded, save to cache if we have a key
      if (cacheKey && result) {
        cacheFirestoreData(cacheKey, result);
      }
      
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
        // تحسين استراتيجية التراجع الأسي - زيادة فترة الانتظار مع كل محاولة فاشلة مع وجود حد أقصى
        const baseDelay = 1000; // 1 ثانية كأساس
        const maxDelay = 15000; // 15 ثانية كحد أقصى
        const attemptNumber = maxRetries - retriesLeft;
        
        // استخدام صيغة jitter للتراجع الأسي لتقليل التصادمات عند وجود العديد من العملاء
        const randomFactor = 0.5 * Math.random(); // عامل عشوائي بين 0 و 0.5
        const exponentialPart = Math.pow(2, attemptNumber);
        const backoffTime = Math.min(baseDelay * exponentialPart * (1 + randomFactor), maxDelay);
        
        console.warn(`Firestore is currently unavailable (${error.code}). Attempt ${maxRetries - retriesLeft + 1}/${maxRetries}. Retrying in ${Math.round(backoffTime/1000)} seconds with jitter...`);
        
        // تنفيذ فترة انتظار قبل المحاولة التالية
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        
        // محاولة إعادة ضبط اتصال Firestore
        try {
          if (db) {
            // استراتيجية تعافي محسّنة - إعادة تفعيل الشبكة مباشرة
            // التأكد من أن db ليس null قبل استخدامه
            if (db) {
              const firestore = db; // Create a non-null reference to satisfy type checking
              await enableNetwork(firestore).catch(() => {
                // في حالة فشل تفعيل الشبكة مباشرةً، نجرب استراتيجية التعطيل ثم التفعيل
                return disableNetwork(firestore)
                  .then(() => new Promise(r => setTimeout(r, 1000)))
                  .then(() => enableNetwork(firestore));
              });
            }
            
            console.log("✅ Successfully reset Firestore network connection");
            isNetworkReset = true;
          }
        } catch (networkError) {
          console.warn("Failed to reset network connection:", networkError);
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
  
  // If all retries failed, log additional diagnostic information and try recovery
  if (lastError) {
    console.error("All Firestore operation attempts failed:", lastError);
    
    // محاولة استخدام البيانات الموجودة محليًا إذا أمكن
    let cachedData = null;
    
    // محاولة جلب البيانات المخزنة في localStorage
    try {
      // التحقق من وجود بيانات في localStorage مرتبطة بهذه العملية
      if (operation.toString().includes('getDoc') || operation.toString().includes('collection')) {
        // استخراج اسم المستند أو المجموعة المستهدفة إذا أمكن
        const match = operation.toString().match(/(?:doc|collection)\([\w\s,.]*["']([^"']+)["']/);
        const collectionName = match ? match[1] : null;
        
        if (collectionName) {
          const cacheKey = `firestore_cache_${collectionName}`;
          const cachedDataStr = localStorage.getItem(cacheKey);
          
          if (cachedDataStr) {
            try {
              cachedData = JSON.parse(cachedDataStr);
              console.log(`✅ Successfully retrieved cached data for ${collectionName}`);
              // استخدام البيانات المخزنة مؤقتًا حتى تتوفر Firestore مرة أخرى
              return cachedData;
            } catch (parseError) {
              console.warn(`Failed to parse cached data for ${collectionName}:`, parseError);
            }
          }
        }
      }
    } catch (cacheError) {
      console.warn("Error accessing cache:", cacheError);
    }
    
    // عرض إرشادات محددة بناءً على نوع الخطأ
    if (lastError.code === "unavailable") {
      console.warn("✋ GUIDANCE: Firestore is currently unavailable. This usually indicates:");
      console.warn("1. Network connectivity issues");
      console.warn("2. Firebase project may be experiencing issues");
      console.warn("3. Security rules might be blocking access");
      
      // التحقق من حالة الاتصال بالإنترنت وتقديم معلومات أكثر تفصيلاً
      if (window.navigator.onLine === false) {
        console.warn("🔴 You appear to be offline. Please check your internet connection.");
        
        // عرض رسالة توضيحية للمستخدم إذا كان التطبيق يستخدم عنصر واجهة مستخدم للتنبيهات
        if (typeof window !== 'undefined') {
          try {
            // التحقق إذا كان التطبيق يدعم العمل دون اتصال
            const appSettings = localStorage.getItem('app_settings');
            const supportOffline = appSettings ? JSON.parse(appSettings).offlineSupport : false;
            
            if (supportOffline) {
              console.info("🟢 Application supports offline mode. Basic functionality should still work.");
            } else {
              console.warn("⚠️ App is in offline mode with limited functionality. Please reconnect to use all features.");
            }
          } catch (e) {
            // تجاهل الأخطاء هنا
          }
        }
      } else {
        console.warn("🟡 Your device appears to be online, but cannot reach Firestore.");
        console.warn("   - Check Firebase console for service disruptions");
        console.warn("   - Verify your Firebase project ID and configuration");
        console.warn("   - Ensure your security rules allow the operation");
        
        // بدء آلية إعادة المحاولة بشكل سلس في الخلفية
        // مع عرض رسالة تنبيه للمستخدم بوجود مشكلة مؤقتة ومحاولة إعادة الاتصال
        setTimeout(() => {
          // التأكد من وجود كائن db قبل محاولة إعادة الاتصال
          if (db) {
            const firestore = db; // Create a non-null reference to satisfy type checking
            enableNetwork(firestore).catch(() => {
              // تجاهل أخطاء إعادة الاتصال هنا
            });
          } else {
            console.warn("⚠️ Cannot re-enable network: Firestore not initialized");
          }
        }, 5000);
      }
      
      // توفير معلومات تشخيصية إضافية للمطورين
      console.info("Additional diagnostic information:");
      console.info("- Firebase project ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);
      console.info("- Browser:", navigator.userAgent);
      console.info("- Timestamp:", new Date().toISOString());
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

// وظيفة جديدة لتخزين البيانات محليًا كنسخة احتياطية
export const cacheFirestoreData = (collectionName: string, data: any, id?: string) => {
  try {
    // Prefix all cache keys for easy recognition
    const cacheKey = id 
      ? `firestore_cache_${collectionName}_${id}` 
      : `firestore_cache_${collectionName}`;
    
    // تخزين مع إضافة طابع زمني للتمكن من التحقق من حداثة البيانات لاحقًا
    const cacheData = {
      data,
      timestamp: new Date().toISOString(),
      collection: collectionName,
      id: id || 'collection'
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    return true;
  } catch (error) {
    console.warn(`Failed to cache Firestore data for ${collectionName}:`, error);
    return false;
  }
};

// وظيفة لاسترجاع البيانات المخزنة محليًا
export const getFirestoreCache = (collectionName: string, id?: string) => {
  try {
    const cacheKey = id 
      ? `firestore_cache_${collectionName}_${id}` 
      : `firestore_cache_${collectionName}`;
    
    const cachedDataStr = localStorage.getItem(cacheKey);
    if (!cachedDataStr) return null;
    
    const cache = JSON.parse(cachedDataStr);
    
    // التحقق مما إذا كانت البيانات المخزنة قديمة (أكثر من 24 ساعة)
    const cacheTime = new Date(cache.timestamp).getTime();
    const now = new Date().getTime();
    const cacheAgeHours = (now - cacheTime) / (1000 * 60 * 60);
    
    if (cacheAgeHours > 24) {
      console.warn(`Cache for ${collectionName} is older than 24 hours (${cacheAgeHours.toFixed(1)} hours)`);
    }
    
    return cache.data;
  } catch (error) {
    console.warn(`Failed to retrieve cached data for ${collectionName}:`, error);
    return null;
  }
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
  if (!db) {
    console.error("Firestore not initialized, returning default user data");
    
    // محاولة استخدام البيانات المخزنة في localStorage
    const cachedUserData = getFirestoreCache('users', uid);
    if (cachedUserData) {
      console.log("⚡ Using cached user data:", cachedUserData);
      return cachedUserData as UserData;
    }
    
    // إذا لم توجد بيانات مخزنة وكان المستخدم قد سجل الدخول، نعود ببيانات أساسية من Auth
    if (auth && auth.currentUser) {
      const basicUserData = {
        uid,
        name: auth.currentUser.displayName || "مستخدم",
        email: auth.currentUser.email || "",
        role: UserRole.CUSTOMER, // دور افتراضي
        createdAt: new Date().toISOString(),
      };
      console.warn("⚠️ تم استخدام بيانات المستخدم الأساسية من Firebase Auth بدون Firestore");
      return basicUserData;
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
      
      // تخزين البيانات في localStorage كنسخة احتياطية
      cacheFirestoreData('users', data, uid);
      
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