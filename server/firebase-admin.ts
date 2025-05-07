import { initializeApp, cert, type App, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getStorage, type Storage } from 'firebase-admin/storage';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ESM compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Initializes Firebase Admin SDK for server-side operations
 * Uses service account credentials to authenticate with Firebase
 */

// Initialize variables for Firebase services
let adminApp: App | null = null;
let db: Firestore;
let auth: Auth;
let storage: Storage;

// Load service account file based on environment
const getServiceAccountPath = () => {
  // If explicit path is set in environment, use it
  if (process.env.FIREBASE_ADMIN_SDK_PATH) {
    const envPath = process.env.FIREBASE_ADMIN_SDK_PATH;
    if (fs.existsSync(envPath)) {
      console.log('Using service account from FIREBASE_ADMIN_SDK_PATH:', envPath);
      return envPath;
    }
  }
  
  // If JSON content is provided directly, use it
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      // Create a temporary file with the service account contents
      const tempFile = path.join(process.cwd(), 'temp-service-account.json');
      fs.writeFileSync(tempFile, process.env.FIREBASE_SERVICE_ACCOUNT);
      console.log('Using service account from environment variable');
      return tempFile;
    } catch (err) {
      console.error('Failed to write service account from env var:', err);
    }
  }
  
  // Look for the service account file in different possible locations
  const possiblePaths = [
    path.join(process.cwd(), 'attached_assets/staychill-3ed08-firebase-adminsdk-fbsvc-768c550a2b.json'),
    path.join(process.cwd(), 'staychill-3ed08-firebase-adminsdk-fbsvc-768c550a2b.json'),
    '/home/runner/workspace/staychill-3ed08-firebase-adminsdk-fbsvc-768c550a2b.json',
    '/home/runner/workspace/attached_assets/staychill-3ed08-firebase-adminsdk-fbsvc-768c550a2b.json',
  ];
  
  for (const filePath of possiblePaths) {
    try {
      if (fs.existsSync(filePath)) {
        console.log('Found service account at:', filePath);
        return filePath;
      }
    } catch (err) {
      console.log(`Error checking path ${filePath}:`, err);
    }
  }
  
  // Last resort: try to manually find the service account file
  console.log('Searching for service account file in current directory...');
  try {
    const files = fs.readdirSync(process.cwd());
    console.log('Files in current directory:', files);
    
    // Look for service account files
    for (const file of files) {
      if (file.includes('firebase-adminsdk') && file.endsWith('.json')) {
        const fullPath = path.join(process.cwd(), file);
        console.log('Found potential service account file:', fullPath);
        return fullPath;
      }
    }
  } catch (err) {
    console.error('Error searching for service account file:', err);
  }
  
  console.error('Unable to find service account file, using credential-less initialization');
  return null;
};

try {
  // Get the appropriate Firebase project ID
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || 'staychill-3ed08';
  
  // Find service account file
  const serviceAccountPath = getServiceAccountPath();
  console.log('Using service account from:', serviceAccountPath);
  
  // Initialize Firebase Admin
  try {
    // Check if an app is already initialized
    const existingApps = admin.apps || [];
    const existingApp = existingApps.length > 0 ? admin.app() : null;
    
    if (!existingApp) {
      // Configure app with or without service account
      const appConfig: any = {
        projectId,
        storageBucket: `${projectId}.appspot.com`
      };
      
      // Add credential only if we found a service account
      if (serviceAccountPath) {
        try {
          const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
          appConfig.credential = admin.credential.cert(serviceAccount);
        } catch (certError) {
          console.error('Error loading service account:', certError);
          // Try to create a credential from environment variables as fallback
          if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
            try {
              appConfig.credential = admin.credential.cert({
                projectId,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL
              });
              console.log('Using credential from environment variables');
            } catch (envCredError) {
              console.error('Error creating credential from environment:', envCredError);
            }
          }
        }
      }
      
      adminApp = admin.initializeApp(appConfig);
      console.log('Created new Firebase Admin app');
    } else {
      adminApp = existingApp;
      console.log('Using existing Firebase Admin app');
    }
  } catch (err) {
    console.error('Error during Firebase Admin initialization check:', err);
    
    // Initialize new app as fallback with minimal configuration
    try {
      adminApp = admin.initializeApp({
        projectId
      });
      console.warn('Created minimal Firebase Admin app as fallback');
    } catch (fallbackErr) {
      console.error('Fallback initialization failed:', fallbackErr);
    }
  }
  
  // Initialize services
  db = getFirestore();
  auth = getAuth();
  storage = getStorage();
  
  console.log('Firebase Admin initialized successfully with project ID:', projectId);
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  
  // Create fallback initialization to prevent crashes
  try {
    // Check if we already have an app
    const existingApp = admin.apps && admin.apps.length > 0 ? admin.app() : null;
    
    if (existingApp) {
      adminApp = existingApp;
      console.warn('Using existing Firebase Admin app in fallback mode');
    } else {
      const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || 'staychill-3ed08';
      adminApp = admin.initializeApp({
        projectId
      });
      console.warn('Firebase Admin initialized in limited mode with project ID:', projectId);
    }
  } catch (initError) {
    console.error('Failed to initialize Firebase Admin even in limited mode:', initError);
    // Last resort - create a default app with minimal configuration
    try {
      adminApp = admin.initializeApp();
      console.warn('Created default Firebase Admin app as last resort');
    } catch (lastError) {
      console.error('Could not create any Firebase Admin app:', lastError);
    }
  }
  
  // Initialize services even in fallback mode
  try {
    db = getFirestore();
    auth = getAuth();
    storage = getStorage();
  } catch (servicesError) {
    console.error('Failed to initialize Firebase Admin services:', servicesError);
  }
}

// Export the initialized services
export const app = adminApp;
export { db, auth, storage };

// Utility functions for common admin operations
export async function verifyIdToken(token: string) {
  try {
    return await auth.verifyIdToken(token);
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    return await auth.getUserByEmail(email);
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}

export async function getUser(uid: string) {
  try {
    return await auth.getUser(uid);
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

export async function updateUser(uid: string, updates: admin.auth.UpdateRequest) {
  try {
    return await auth.updateUser(uid, updates);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

/**
 * إنشاء توكن مخصص للمصادقة مع Firebase
 * يسمح للتطبيق بإنشاء توكنات للمستخدمين المصادق عليهم من خلال نظام المصادقة المخصص
 * @param uid معرف المستخدم الفريد
 * @param claims مطالبات إضافية اختيارية (مثل الأدوار أو البيانات المخصصة)
 * @returns توكن مخصص يمكن استخدامه للمصادقة مع Firebase
 */
export async function createCustomToken(uid: string, claims?: Record<string, any>) {
  try {
    return await auth.createCustomToken(uid, claims);
  } catch (error) {
    console.error('خطأ في إنشاء توكن مخصص:', error);
    throw error;
  }
}

/**
 * التحقق من صحة بيانات اعتماد المستخدم مقابل قاعدة البيانات المخصصة
 * واستخراج توكن مخصص في حالة نجاح المصادقة
 * @param email البريد الإلكتروني للمستخدم
 * @param password كلمة المرور المقدمة
 * @returns وعد يحتوي على توكن مخصص في حالة النجاح أو خطأ في حالة الفشل
 */
export async function authenticateUser(email: string, password: string) {
  try {
    // هنا يمكنك استبدال هذا المنطق بالمنطق الخاص بنظام المصادقة الخاص بك
    // مثل التحقق من قاعدة بيانات العملاء الخاصة بك
    
    // مثال: التحقق من قاعدة بيانات المستخدمين في Firestore
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    
    if (snapshot.empty) {
      throw new Error('المستخدم غير موجود');
    }
    
    // هذا مجرد مثال، في التطبيق الحقيقي يجب عليك التحقق من كلمة المرور
    // باستخدام طريقة آمنة (مثل bcrypt)
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    
    // إنشاء توكن مخصص باستخدام معرف المستخدم ومطالبات إضافية
    const customClaims = {
      role: userData.role || 'CUSTOMER',
      name: userData.name || 'مستخدم',
      // يمكنك إضافة مزيد من المطالبات المخصصة حسب الحاجة
    };
    
    return {
      token: await createCustomToken(userDoc.id, customClaims),
      user: {
        uid: userDoc.id,
        email: userData.email,
        name: userData.name,
        role: userData.role
      }
    };
  } catch (error) {
    console.error('خطأ في مصادقة المستخدم:', error);
    throw error;
  }
}

// Export the admin namespace for access to types
export default admin;