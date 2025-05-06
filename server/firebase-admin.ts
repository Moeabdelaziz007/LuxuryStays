import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Initializes Firebase Admin SDK for server-side operations
 * Uses service account credentials to authenticate with Firebase
 */

// Initialize variables for Firebase services
let adminApp: admin.app.App;
let db: FirebaseFirestore.Firestore;
let auth: admin.auth.Auth;
let storage: admin.storage.Storage;

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
      const tempFile = path.join(__dirname, 'temp-service-account.json');
      fs.writeFileSync(tempFile, process.env.FIREBASE_SERVICE_ACCOUNT);
      console.log('Using service account from environment variable');
      return tempFile;
    } catch (err) {
      console.error('Failed to write service account from env var:', err);
    }
  }
  
  // Look for the service account file in different possible locations
  const possiblePaths = [
    path.join(__dirname, '../attached_assets/staychill-3ed08-firebase-adminsdk-fbsvc-768c550a2b.json'),
    path.join(__dirname, '../staychill-3ed08-firebase-adminsdk-fbsvc-768c550a2b.json'),
    path.join(process.cwd(), 'staychill-3ed08-firebase-adminsdk-fbsvc-768c550a2b.json')
  ];
  
  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      console.log('Found service account at:', filePath);
      return filePath;
    }
  }
  
  throw new Error('Firebase Admin service account file not found');
};

try {
  // Get the appropriate Firebase project ID
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || 'staychill-3ed08';
  
  // Find service account file
  const serviceAccountPath = getServiceAccountPath();
  console.log('Using service account from:', serviceAccountPath);
  
  // Initialize Firebase Admin
  if (admin.apps.length === 0) {
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
      projectId,
      storageBucket: `${projectId}.appspot.com`
    });
  } else {
    adminApp = admin.app();
  }
  
  // Initialize services
  db = getFirestore();
  auth = getAuth();
  storage = getStorage();
  
  console.log('Firebase Admin initialized successfully with project ID:', projectId);
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  
  // Create fallback initialization to prevent crashes
  if (admin.apps.length === 0) {
    try {
      const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || 'staychill-3ed08';
      adminApp = admin.initializeApp({
        projectId
      });
      console.warn('Firebase Admin initialized in limited mode with project ID:', projectId);
    } catch (initError) {
      console.error('Failed to initialize Firebase Admin even in limited mode:', initError);
    }
  } else {
    adminApp = admin.app();
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

// Export the admin namespace for access to types
export default admin;