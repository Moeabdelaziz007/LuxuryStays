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

// دالة مساعدة لتخزين بيانات المستخدم في التخزين المحلي
const cacheUserData = (user: FirebaseUser) => {
  if (!user) return;
  
  try {
    // حفظ بيانات المستخدم الأساسية في localStorage لتحسين الأداء
    localStorage.setItem('cached_user', JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastUpdated: new Date().toISOString()
    }));
  } catch (err) {
    console.warn('فشل في تخزين بيانات المستخدم:', err);
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pathname] = useLocation();

  useEffect(() => {
    console.log("[DEBUG] تحقق من حالة المصادقة");
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // تخزين بيانات المستخدم في التخزين المحلي
        cacheUserData(firebaseUser);
        
        // تحويل مستخدم Firebase إلى كائن المستخدم المخصص
        const userToSave: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          role: 'CUSTOMER', // دور افتراضي، سيتم تحديثه من Firestore في تطبيق حقيقي
          emailVerified: firebaseUser.emailVerified,
          isAnonymous: firebaseUser.isAnonymous,
          isAdmin: false, // قيمة افتراضية
        };

        // في تطبيق حقيقي، سنجلب بيانات مستخدم إضافية من Firestore
        console.log('[DEBUG] حالة سياق المصادقة:', {
          user: userToSave,
          loading: false,
          isAuthenticated: true,
          pathname,
        });

        setUser(userToSave);
      } else {
        console.log('[DEBUG] حالة سياق المصادقة:', {
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