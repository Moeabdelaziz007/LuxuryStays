import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { getLocalUser, localLogin, localLogout, initializeLocalUsers } from "@/lib/local-auth";

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
  const navigate = useNavigate();

  // Initialize local users
  useEffect(() => {
    initializeLocalUsers();
  }, []);

  // Check for local user first
  useEffect(() => {
    const localUser = getLocalUser();
    if (localUser) {
      console.log("Found local user:", localUser);
      setUser(localUser);
      setLoading(false);
      setUseLocalAuth(true);
      
      // Only redirect if we're on the login or home page
      const pathname = window.location.pathname;
      if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
        // Redirect based on role
        if (localUser.role === "CUSTOMER") navigate("/customer");
        else if (localUser.role === "PROPERTY_ADMIN") navigate("/property-admin");
        else if (localUser.role === "SUPER_ADMIN") navigate("/super-admin");
        else navigate("/unauthorized");
      }
    }
  }, [navigate]);

  // Monitor Firebase auth state as fallback
  useEffect(() => {
    // If we already have a local user, don't bother with Firebase
    if (user) return () => {};

    let isFirebaseError = false;
    
    const unsubscribe = onAuthStateChanged(auth, 
      async (firebaseUser) => {
        try {
          if (firebaseUser) {
            const docRef = doc(db, "users", firebaseUser.uid);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
              const userData = docSnap.data() as UserData;
              setUser(userData);

              // Only redirect if we're on the login or home page
              const pathname = window.location.pathname;
              if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
                // توجيه حسب الدور
                if (userData.role === "CUSTOMER") navigate("/customer");
                else if (userData.role === "PROPERTY_ADMIN") navigate("/property-admin");
                else if (userData.role === "SUPER_ADMIN") navigate("/super-admin");
                else navigate("/unauthorized");
              }
            } else {
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
          } else if (!isFirebaseError) {
            setUser(null);
          }
        } catch (err) {
          console.error("Auth state error:", err);
          isFirebaseError = true;
          
          // If Firebase fails, check for local user
          const localUser = getLocalUser();
          if (localUser) {
            console.log("Falling back to local user due to Firebase error");
            setUser(localUser);
            setUseLocalAuth(true);
          }
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Firebase auth observer error:", error);
        isFirebaseError = true;
        setLoading(false);
      }
    );
    
    // Set a timeout to switch to local auth if Firebase is taking too long
    const timeout = setTimeout(() => {
      if (loading) {
        console.log("Firebase auth timeout, checking for local user");
        const localUser = getLocalUser();
        if (localUser) {
          setUser(localUser);
          setUseLocalAuth(true);
        }
        setLoading(false);
      }
    }, 3000);
    
    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate, loading, user]);

  // Login with email/password
  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const { email, password } = credentials;
      
      // Try local auth first if previously we had Firebase issues
      if (useLocalAuth) {
        console.log("Using local authentication...");
        try {
          const localUser = await localLogin(email, password);
          console.log("Local login successful:", localUser);
          setUser(localUser);
          
          // Redirect based on role
          if (localUser.role === "SUPER_ADMIN") {
            navigate('/super-admin');
          } else if (localUser.role === "PROPERTY_ADMIN") {
            navigate('/property-admin');
          } else {
            navigate('/customer');
          }
          return;
        } catch (localErr) {
          console.error("Local login error:", localErr);
          throw new Error("فشل تسجيل الدخول محلياً");
        }
      }
      
      // Otherwise try Firebase
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Firebase login successful");
    } catch (err: any) {
      console.error("Login error:", err);
      
      // If Firebase error, try local auth as fallback
      if (err.code && err.code.includes('auth/') && !useLocalAuth) {
        try {
          console.log("Trying local auth as fallback");
          const localUser = await localLogin(email, password);
          setUser(localUser);
          setUseLocalAuth(true);
          
          // Redirect based on role
          if (localUser.role === "SUPER_ADMIN") {
            navigate('/super-admin');
          } else if (localUser.role === "PROPERTY_ADMIN") {
            navigate('/property-admin');
          } else {
            navigate('/customer');
          }
          return;
        } catch (localErr) {
          console.error("Local fallback login error:", localErr);
        }
      }
      
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

  // Login with Google
  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
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
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      if (useLocalAuth) {
        await localLogout();
      } else {
        await signOut(auth);
      }
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