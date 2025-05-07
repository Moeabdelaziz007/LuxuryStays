import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithRedirect, 
  GoogleAuthProvider, 
  getRedirectResult,
  signInAnonymously
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Add scopes for Google OAuth
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Login with Google using redirect (most reliable)
export function login() {
  return signInWithRedirect(auth, googleProvider);
}

// Login anonymously
export function loginAsGuest() {
  return signInAnonymously(auth);
}

// Handle the redirect result
export async function handleRedirect() {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      // This gives you a Google Access Token. You can use it to access Google APIs.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      // The signed-in user info.
      const user = result.user;
      
      // Success - return user
      return { success: true, user, token };
    }
    return { success: false, message: "No redirect result" };
  } catch (error: any) {
    console.error("Error handling redirect:", error);
    // Handle Errors here.
    return { 
      success: false, 
      errorCode: error.code,
      errorMessage: error.message,
      email: error.customData?.email,
      credential: GoogleAuthProvider.credentialFromError(error)
    };
  }
}

export { auth };