import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  Auth
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, Firestore } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useLocation } from "wouter";

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
  updateUserInfo: (userData: UserData) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  loginWithGoogle: async () => {},
  updateUserInfo: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const redirectAfterLoginRef = useRef<string | null>(null);
  const [location, navigate] = useLocation();

  // دالة مساعدة للحصول على مسار إعادة التوجيه من عنوان URL
  const getRedirectParam = (): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('redirect');
  };
  
  // تسجيل رسائل التصحيح للمساعدة في عملية التتبع
  useEffect(() => {
    console.log("[DEBUG] Auth Context State:", { 
      user, 
      loading, 
      isAuthenticated: !!user,
      pathname: window.location.pathname
    });
  }, [user, loading]);

  // حفظ مسار إعادة التوجيه في كل مرة يتغير المسار
  useEffect(() => {
    if (window.location.pathname === '/login') {
      const redirectParam = getRedirectParam();
      if (redirectParam) {
        console.log("[DEBUG] Stored redirect path:", redirectParam);
        redirectAfterLoginRef.current = redirectParam;
      }
    }
  }, [window.location.search, window.location.pathname]);

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
                  
                  // التوجيه بناءً على الموقع الحالي فقط لصفحات المصادقة
                  const pathname = window.location.pathname;
                  
                  // إذا كنا على صفحة تسجيل الدخول أو التسجيل ولدينا مسار إعادة توجيه
                  if (pathname === "/login" || pathname === "/signup") {
                    const redirectPath = redirectAfterLoginRef.current;
                    
                    if (redirectPath) {
                      // إعادة تعيين المرجع بعد استخدامه
                      redirectAfterLoginRef.current = null;
                      navigate(decodeURIComponent(redirectPath));
                    } else {
                      // توجيه تلقائي إلى لوحة التحكم المناسبة
                      if (userData.role === "CUSTOMER") navigate("/customer");
                      else if (userData.role === "PROPERTY_ADMIN") navigate("/property-admin");
                      else if (userData.role === "SUPER_ADMIN") navigate("/super-admin");
                      else navigate("/unauthorized");
                    }
                  }
                } else if (db) {
                  // المستخدم موجود في Firebase لكن ليس في Firestore
                  // إنشاء وثيقة مستخدم افتراضية
                  const newUser: UserData = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    name: firebaseUser.displayName || 'مستخدم',
                    role: 'CUSTOMER', // الدور الافتراضي
                    createdAt: new Date().toISOString(),
                  };
                  
                  await setDoc(doc(db, "users", firebaseUser.uid), newUser);
                  setUser(newUser);
                  
                  // التحقق من مسار إعادة التوجيه أولاً
                  const redirectPath = redirectAfterLoginRef.current;
                  if (redirectPath) {
                    redirectAfterLoginRef.current = null;
                    navigate(decodeURIComponent(redirectPath));
                  } else {
                    navigate("/customer");
                  }
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
  }, []);

  // تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور (Firebase فقط)
  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const { email, password } = credentials;
      
      console.log("محاولة تسجيل الدخول باستخدام Firebase:", email);
      
      if (!auth) {
        throw new Error("خدمة المصادقة Firebase غير متوفرة");
      }
      
      // استخدام Firebase فقط للمصادقة
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      
      // التحقق من وجود معلومات المستخدم في Firestore
      if (db) {
        try {
          const userDoc = await getDoc(doc(db, "users", userCred.user.uid));
          if (!userDoc.exists()) {
            // إنشاء وثيقة مستخدم جديد في Firestore إذا لم تكن موجودة
            console.log("إنشاء معلومات مستخدم في Firestore...");
            const newUserData = {
              uid: userCred.user.uid,
              email: userCred.user.email,
              name: userCred.user.displayName || 'مستخدم جديد',
              role: 'CUSTOMER', // دور افتراضي
              createdAt: new Date().toISOString(),
            };
            await setDoc(doc(db, "users", userCred.user.uid), newUserData);
          }
        } catch (firestoreErr) {
          console.error("خطأ في الوصول إلى بيانات المستخدم في Firestore:", firestoreErr);
          // نكمل عملية تسجيل الدخول حتى لو فشل الوصول إلى Firestore
        }
      }
      
      // سيتم التوجيه تلقائياً من خلال المراقب في useEffect
      console.log("تم تسجيل الدخول بنجاح، في انتظار التوجيه...");
    } catch (err: any) {
      console.error("خطأ في تسجيل الدخول:", err);
      if (err?.code === 'auth/invalid-credential' || err?.code === 'auth/user-not-found' || err?.code === 'auth/wrong-password') {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      } else if (err?.code === 'auth/too-many-requests') {
        setError("عدة محاولات فاشلة، يرجى المحاولة مرة أخرى بعد فترة");
      } else {
        setError("حدث خطأ أثناء تسجيل الدخول");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // تسجيل مستخدم جديد (Firebase فقط)
  const register = async (credentials: RegisterCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const { name, email, password } = credentials;
      
      if (!auth || !db) {
        throw new Error("خدمات Firebase غير متوفرة");
      }
      
      console.log("محاولة إنشاء حساب جديد:", email);
      
      // التحقق من وجود البريد الإلكتروني
      try {
        // إنشاء المستخدم في Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // إنشاء معلومات المستخدم في Firestore
        const userData: UserData = {
          uid: user.uid,
          email: email,
          name: name,
          role: 'CUSTOMER', // دور افتراضي للمستخدمين الجدد
          createdAt: new Date().toISOString(),
          photoURL: user.photoURL || null,
        };
        
        // حفظ المعلومات في قاعدة البيانات
        console.log("حفظ معلومات المستخدم في Firestore...");
        await setDoc(doc(db, "users", user.uid), userData);
        
        // تحديث بيانات المستخدم في Firebase Auth
        await updateProfile(user, {
          displayName: name
        });
        
        console.log("تم إنشاء المستخدم بنجاح!");
      } catch (authError) {
        console.error("خطأ في إنشاء المستخدم في Firebase Auth:", authError);
        throw authError; // نقوم بتمرير الخطأ للمعالجة في catch
      }
    } catch (err: any) {
      console.error("خطأ في التسجيل:", err);
      
      // معالجة مخصصة لأنواع الأخطاء المختلفة
      if (err.code === 'auth/email-already-in-use') {
        setError("البريد الإلكتروني مستخدم بالفعل، الرجاء استخدام بريد آخر أو تسجيل الدخول");
      } else if (err.code === 'auth/invalid-email') {
        setError("البريد الإلكتروني غير صالح، الرجاء التحقق من الصيغة");
      } else if (err.code === 'auth/weak-password') {
        setError("كلمة المرور ضعيفة، الرجاء استخدام كلمة مرور أقوى (6 أحرف على الأقل)");
      } else if (err.code === 'auth/network-request-failed') {
        setError("فشل في الاتصال بالشبكة، الرجاء التحقق من اتصالك بالإنترنت");
      } else {
        setError("فشل التسجيل، الرجاء المحاولة مرة أخرى لاحقًا");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الدخول باستخدام Google - Firebase فقط
  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!auth || !db) {
        throw new Error("خدمات Firebase غير متوفرة");
      }
      
      console.log("بدء تسجيل الدخول باستخدام Google...");
      
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // التحقق من وجود المستخدم في Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        // إنشاء وثيقة مستخدم جديد لتسجيل الدخول عبر Google
        const userData: UserData = {
          uid: user.uid,
          email: user.email || '',
          name: user.displayName || 'مستخدم Google',
          role: 'CUSTOMER', // دور افتراضي
          createdAt: new Date().toISOString(),
          photoURL: user.photoURL || null,
        };
        
        console.log("إنشاء مستخدم جديد من Google في Firestore:", userData.email);
        await setDoc(docRef, userData);
      } else {
        console.log("تسجيل دخول مستخدم موجود عبر Google:", user.email);
      }
      
      // ستتم عملية التوجيه عبر مراقب حالة المصادقة
    } catch (err: any) {
      console.error("خطأ في تسجيل الدخول عبر Google:", err);
      
      if (err.code === 'auth/unauthorized-domain') {
        console.error("يرجى إضافة", window.location.origin, "إلى نطاقات Firebase المصرح بها");
        setError("نأسف، هذا النطاق غير مسموح به للمصادقة عبر Google. الرجاء استخدام البريد الإلكتروني وكلمة المرور.");
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError("تم إغلاق نافذة تسجيل الدخول. الرجاء المحاولة مرة أخرى.");
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError("تم إلغاء طلب النافذة المنبثقة.");
      } else if (err.code === 'auth/popup-blocked') {
        setError("تم حظر النافذة المنبثقة. الرجاء السماح بالنوافذ المنبثقة والمحاولة مرة أخرى.");
      } else {
        setError("فشل تسجيل الدخول باستخدام Google. الرجاء المحاولة مرة أخرى.");
      }
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

  // تحديث معلومات المستخدم
  const updateUserInfo = (userData: UserData) => {
    setUser(userData);
  };

  const contextValue = {
    user,
    loading,
    login,
    register,
    logout,
    loginWithGoogle,
    updateUserInfo,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// إعادة تصدير السياق والأدوات المساعدة
// هذه الطريقة تساعد في تجنب مشاكل Fast Refresh
export const AuthConsumer = AuthContext.Consumer;
export const useAuthContext = () => useContext(AuthContext);

// هذا هو الـ hook الذي سيتم استخدامه في التطبيق
function useAuth() {
  return useContext(AuthContext);
}

export { useAuth };