import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Firebase Admin
let firebaseApp: admin.app.App;

try {
  // First check for existing app
  const apps = admin.apps || [];
  if (apps.length > 0) {
    firebaseApp = admin.app();
    console.log('Using existing Firebase Admin app');
  } else {
    // Try to load from the service account file
    try {
      // List of potential service account file locations
      const potentialServiceAccountPaths = [
        './service-account.json',
        './staychill-3ed08-firebase-adminsdk-fbsvc-768c550a2b.json',
        './attached_assets/staychill-3ed08-firebase-adminsdk-fbsvc-768c550a2b.json',
        './attached_assets/staychill-3ed08-firebase-adminsdk-fbsvc-0cfd3bd1d5.json'
      ];
      
      let serviceAccountPath = null;
      let serviceAccount = null;
      
      // Find the first valid service account file
      for (const path of potentialServiceAccountPaths) {
        if (fs.existsSync(path)) {
          try {
            const fileContent = fs.readFileSync(path, 'utf8');
            // Verify it's a valid JSON
            const parsedContent = JSON.parse(fileContent);
            if (parsedContent.private_key && parsedContent.client_email) {
              serviceAccountPath = path;
              serviceAccount = parsedContent;
              console.log('Found valid service account at:', path);
              break;
            }
          } catch (parseError) {
            console.error(`Error parsing service account at ${path}:`, parseError);
          }
        }
      }
      
      if (serviceAccount) {
        firebaseApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: 'staychill-3ed08'
        });
        console.log('Initialized Firebase Admin with service account');
      } else {
        // Fallback to app-only initialization
        firebaseApp = admin.initializeApp({
          projectId: 'staychill-3ed08'
        });
        console.log('Initialized Firebase Admin with project ID only - no valid service account found');
      }
    } catch (error) {
      console.error('Error initializing Firebase Admin with service account:', error);
      // Last resort - initialize without any options
      firebaseApp = admin.initializeApp();
      console.log('Initialized Firebase Admin with default options');
    }
  }
} catch (error) {
  console.error('Failed to initialize Firebase Admin:', error);
  throw error;
}

// Initialize services
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

// Export the initialized services
export const app = firebaseApp;
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