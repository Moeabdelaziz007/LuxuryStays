import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  Auth
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, Firestore } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

interface UserData {
  uid: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  [key: string]: any;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  loginWithGoogle: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Monitor auth state - Firebase only
  useEffect(() => {
    let unsubscribe = () => {};
    
    if (auth) {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        try {
          
          if (firebaseUser) {
            try {
              if (db) {
                const docRef = doc(db, "users", firebaseUser.uid);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                  const userData = docSnap.data() as UserData;
                  setUser(userData);
                  
                  // Only redirect if we're on the login or home page
                  const pathname = window.location.pathname;
                  if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
                    if (userData.role === "CUSTOMER") navigate("/customer");
                    else if (userData.role === "PROPERTY_ADMIN") navigate("/property-admin");
                    else if (userData.role === "SUPER_ADMIN") navigate("/super-admin");
                    else navigate("/unauthorized");
                  }
                } else if (db) {
                  // User exists in Firebase but not in Firestore
                  // Create a default user document
                  const newUser: UserData = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    name: firebaseUser.displayName || 'User',
                    role: 'CUSTOMER', // Default role
                    createdAt: new Date().toISOString(),
                  };
                  
                  await setDoc(doc(db, "users", firebaseUser.uid), newUser);
                  setUser(newUser);
                  navigate("/customer");
                }
              } else {
                // Firestore not available
                console.error("Firestore is not available");
                setUser(null);
              }
            } catch (error) {
              console.error("Error accessing Firestore:", error);
              setUser(null);
            }
          } else {
            setUser(null);
          }
        } catch (err) {
          console.error("Auth state error:", err);
          setError("An authentication error occurred");
        } finally {
          setLoading(false);
        }
      });
    } else {
      // Firebase auth not available
      console.error("Firebase auth is not available");
      setLoading(false);
    }
    
    return () => {
      unsubscribe();
    };
  }, [navigate]);

  // Login with email/password - Firebase only
  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const { email, password } = credentials;
      
      console.log("Attempting login with Firebase:", email);
      
      if (!auth) {
        throw new Error("Firebase auth is not available");
      }
      
      // Use Firebase auth only
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect will happen in the auth state change handler
      
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register new user - Firebase only
  const register = async (credentials: RegisterCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const { name, email, password } = credentials;
      
      if (!auth || !db) {
        throw new Error("Firebase auth or Firestore is not available");
      }
      
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user document in Firestore
      const userData: UserData = {
        uid: user.uid,
        email: email,
        name: name,
        role: 'CUSTOMER', // Default role for new users
        createdAt: new Date().toISOString(),
      };
      
      await setDoc(doc(db, "users", user.uid), userData);
    } catch (err) {
      console.error("Register error:", err);
      setError("Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login with Google - Firebase only
  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!auth || !db) {
        throw new Error("Firebase auth or Firestore is not available");
      }
      
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user document exists
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        // Create new user document for Google sign-in
        const userData: UserData = {
          uid: user.uid,
          email: user.email || '',
          name: user.displayName || 'Google User',
          role: 'CUSTOMER', // Default role
          createdAt: new Date().toISOString(),
        };
        
        await setDoc(docRef, userData);
      }
    } catch (err: any) {
      console.error("Google login error:", err);
      
      if (err.code === 'auth/unauthorized-domain') {
        console.error("Please add", window.location.origin, "to Firebase authorized domains");
      }
      
      setError("Google login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout - Firebase only
  const logout = async () => {
    try {
      if (!auth) {
        throw new Error("Firebase auth is not available");
      }
      
      await signOut(auth);
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      setError("Logout failed");
      throw err;
    }
  };

  const contextValue = {
    user,
    loading,
    login,
    register,
    logout,
    loginWithGoogle,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);