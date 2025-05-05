import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from "firebase/auth";
import { getFirestore, collection, getDocs, getDoc, doc, query, where, setDoc } from "firebase/firestore";
import { User, UserRole } from "../features/auth/types";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
});

// Authentication methods
export const loginUser = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if this is a new user
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      // Save new user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName || "Google User",
        email: user.email,
        role: UserRole.CUSTOMER,
        profileImage: user.photoURL,
        createdAt: new Date()
      });
    }
    
    return result;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const registerUser = async (email: string, password: string, name: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Set user data in Firestore
  await setDoc(doc(db, "users", userCredential.user.uid), {
    name,
    email,
    role: UserRole.CUSTOMER,
    createdAt: new Date()
  });
  
  return userCredential;
};

export const logoutUser = () => {
  return signOut(auth);
};

// Firestore methods
export const getUserData = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return { uid, ...userDoc.data() } as User;
    }
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

export const getProperties = async (limit = 3) => {
  try {
    const propertiesRef = collection(db, "properties");
    const q = query(propertiesRef, where("featured", "==", true));
    const querySnapshot = await getDocs(q);
    
    const properties = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return properties.slice(0, limit);
  } catch (error) {
    console.error("Error getting properties:", error);
    return [];
  }
};

export const getServices = async (limit = 2) => {
  try {
    const servicesRef = collection(db, "services");
    const q = query(servicesRef, where("status", "==", "active"));
    const querySnapshot = await getDocs(q);
    
    const services = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return services.slice(0, limit);
  } catch (error) {
    console.error("Error getting services:", error);
    return [];
  }
};

export const getComingSoonServices = async (limit = 3) => {
  try {
    const servicesRef = collection(db, "services");
    const q = query(servicesRef, where("status", "==", "coming_soon"));
    const querySnapshot = await getDocs(q);
    
    const services = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return services.slice(0, limit);
  } catch (error) {
    console.error("Error getting coming soon services:", error);
    return [];
  }
};
