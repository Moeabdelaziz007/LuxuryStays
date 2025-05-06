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
import { getLocalUser, localLogin, localRegister, localLogout, initializeLocalUsers } from "@/lib/local-auth";

// Initialize test users for local auth
initializeLocalUsers();

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
  const [useLocalAuth, setUseLocalAuth] = useState(false);
  const firebaseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // On component mount, check if we already have a local user
  useEffect(() => {
    const localUser = getLocalUser();
    if (localUser) {
      setUser(localUser);
      setUseLocalAuth(true);
      setLoading(false);
    }
  }, []);

  // Monitor auth state with timeout
  useEffect(() => {
    let unsubscribe = () => {};
    
    // Set a timeout for Firebase connection
    firebaseTimeoutRef.current = setTimeout(() => {
      if (loading && !user) {
        console.warn("Firebase auth connection timeout, falling back to local auth");
        setUseLocalAuth(true);
        
        // Check for existing local user
        const localUser = getLocalUser();
        if (localUser) {
          setUser(localUser);
        }
        
        setLoading(false);
      }
    }, 5000); // 5 second timeout
    
    if (auth) {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        try {
          // Clear the timeout since Firebase responded
          if (firebaseTimeoutRef.current) {
            clearTimeout(firebaseTimeoutRef.current);
            firebaseTimeoutRef.current = null;
          }
          
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
                // Firestore not available, use local auth
                setUseLocalAuth(true);
                const localUser = getLocalUser();
                if (localUser) {
                  setUser(localUser);
                }
              }
            } catch (error) {
              console.error("Error accessing Firestore:", error);
              setUseLocalAuth(true);
              const localUser = getLocalUser();
              if (localUser) {
                setUser(localUser);
              }
            }
          } else {
            setUser(null);
          }
        } catch (err) {
          console.error("Auth state error:", err);
          setError("An authentication error occurred");
          setUseLocalAuth(true);
        } finally {
          setLoading(false);
        }
      });
    } else {
      // Firebase auth not available
      setUseLocalAuth(true);
      setLoading(false);
    }
    
    return () => {
      unsubscribe();
      if (firebaseTimeoutRef.current) {
        clearTimeout(firebaseTimeoutRef.current);
      }
    };
  }, [navigate]);

  // Login with email/password
  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const { email, password } = credentials;
      
      console.log("Attempting login with:", email);
      
      if (useLocalAuth || !auth) {
        console.log("Using local authentication...");
        try {
          const localUser = await localLogin(email, password);
          setUser(localUser);
          
          // Redirect based on role
          if (localUser.role === "CUSTOMER") navigate("/customer");
          else if (localUser.role === "PROPERTY_ADMIN") navigate("/property-admin");
          else if (localUser.role === "SUPER_ADMIN") navigate("/super-admin");
        } catch (localError) {
          console.error("Local login error:", localError);
          throw localError;
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        // Redirect will happen in the auth state change handler
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register new user
  const register = async (credentials: RegisterCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const { name, email, password } = credentials;
      
      if (useLocalAuth || !auth || !db) {
        console.log("Using local registration...");
        try {
          const localUser = await localRegister(name, email, password);
          setUser(localUser);
          
          // Redirect based on role
          if (localUser.role === "CUSTOMER") navigate("/customer");
          else if (localUser.role === "PROPERTY_ADMIN") navigate("/property-admin");
          else if (localUser.role === "SUPER_ADMIN") navigate("/super-admin");
        } catch (localError) {
          console.error("Local registration error:", localError);
          throw localError;
        }
      } else {
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
      }
    } catch (err) {
      console.error("Register error:", err);
      setError("Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!auth || !db || useLocalAuth) {
        console.error("Google login not available in local mode");
        throw new Error("Google login is not available right now");
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

  // Logout
  const logout = async () => {
    try {
      if (useLocalAuth || !auth) {
        await localLogout();
        setUser(null);
      } else {
        await signOut(auth);
      }
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