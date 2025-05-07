import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, cacheCurrentUser, getUserData, getUserIdToken } from '@/lib/firebase-auth';
import { useLocation } from 'wouter';

interface User {
  uid: string;
  email: string | null;
  name: string | null;
  role: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  createdAt?: string;
  updatedAt?: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  pathname: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  pathname: '/',
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pathname] = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Transform Firebase user to our custom user object
        const userToSave: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          role: 'CUSTOMER', // Default role, would be updated from Firestore in a real app
          emailVerified: firebaseUser.emailVerified,
          isAnonymous: firebaseUser.isAnonymous,
          isAdmin: false, // Default value
        };

        // In a real app, we would fetch additional user data from Firestore
        console.log('[DEBUG] Auth Context State:', {
          user: userToSave,
          loading: false,
          isAuthenticated: true,
          pathname,
        });

        setUser(userToSave);
      } else {
        console.log('[DEBUG] Auth Context State:', {
          user: null,
          loading: false,
          isAuthenticated: false,
          pathname,
        });
        
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        pathname,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};