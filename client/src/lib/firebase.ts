import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc,
  serverTimestamp 
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { User, UserRole } from "@/features/auth/types";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Firebase authentication functions

export const loginUser = async (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerUser = async (email: string, password: string, name: string): Promise<User> => {
  // 1. Create the user in Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // 2. Create a document in Firestore with additional user data
  const userData: User = {
    uid: user.uid,
    name: name,
    email: email,
    role: UserRole.CUSTOMER, // Default role
    createdAt: new Date(),
  };
  
  await setDoc(doc(db, "users", user.uid), {
    ...userData,
    createdAt: serverTimestamp()
  });
  
  return userData;
};

export const logoutUser = async (): Promise<void> => {
  return signOut(auth);
};

export const signInWithGoogle = async (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const getUserData = async (uid: string): Promise<User | null> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data() as User;
    // Convert Firestore timestamp to Date
    if (data.createdAt && typeof data.createdAt !== 'string') {
      data.createdAt = (data.createdAt as any).toDate();
    }
    return data;
  } else {
    // User document doesn't exist in Firestore
    // Create a basic user document with default values
    if (auth.currentUser) {
      const basicUserData: User = {
        uid,
        name: auth.currentUser.displayName || "User",
        email: auth.currentUser.email || "",
        role: UserRole.CUSTOMER,
        createdAt: new Date(),
      };
      
      await setDoc(doc(db, "users", uid), {
        ...basicUserData,
        createdAt: serverTimestamp()
      });
      
      return basicUserData;
    }
    return null;
  }
};
