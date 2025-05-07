import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { useLocation } from 'wouter';
// استخدام الإعدادات الجديدة الموحدة لـ Firebase
import { auth } from '@/lib/firebase-client';

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
        // Almacenar datos del usuario en la caché para optimizar
        cacheCurrentUser(firebaseUser);
        
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

        // Obtener un token ID de usuario anticipadamente (cacheable)
        getUserIdToken(false).then(token => {
          if (token) {
            console.log('[DEBUG] Token de usuario obtenido con éxito');
          }
        }).catch(err => {
          console.error('Error al obtener token de usuario:', err);
        });

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