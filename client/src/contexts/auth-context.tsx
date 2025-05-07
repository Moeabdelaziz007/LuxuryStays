import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  updateProfile,
  linkWithPopup,
  signInAnonymously,
  sendPasswordResetEmail,
  Auth
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, Firestore } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useLocation } from "wouter";
// استيراد محول المصادقة الجديد
import { firebaseUserToAppUser } from "@/lib/auth-adapters";
// استيراد أنواع المستخدم الموحدة
import { UserData, LoginCredentials, RegisterCredentials } from "@/features/auth/types";
import { UserRole } from "@shared/schema";

export interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginWithGoogle: (redirectPath?: string) => Promise<any>;
  loginWithFacebook: (redirectPath?: string) => Promise<any>;
  loginAnonymously: (redirectPath?: string) => Promise<any>;
  updateUserInfo: (userData: UserData) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  loginWithGoogle: async () => {},
  loginWithFacebook: async () => {},
  loginAnonymously: async () => {},
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
              // محاولة الحصول على بيانات إضافية من Firestore
              let firestoreData: Partial<UserData> | undefined = undefined;
              
              if (db) {
                try {
                  console.log("جاري جلب الخدمات النشطة من Firestore...");
                  const docRef = doc(db, "users", firebaseUser.uid);
                  const docSnap = await getDoc(docRef);
                  
                  if (docSnap.exists()) {
                    firestoreData = docSnap.data() as Partial<UserData>;
                  } else {
                    // المستخدم غير موجود في Firestore - سيتم إنشاؤه لاحقًا
                    console.log("لم يتم العثور على خدمات نشطة في Firestore");
                  }
                } catch (firestoreError) {
                  console.error("Error accessing Firestore:", firestoreError);
                }
              }
              
              // استخدام محول المصادقة لتحويل مستخدم Firebase إلى UserData
              // مع دمج البيانات من Firestore إذا كانت متوفرة
              const userData = firebaseUserToAppUser(firebaseUser, firestoreData);
              
              // تحديث حالة المستخدم في السياق
              setUser(userData);
              
              // في حالة عدم وجود بيانات Firestore، يمكن إضافتها الآن
              if (db && !firestoreData) {
                try {
                  // حفظ بيانات المستخدم في Firestore
                  console.log("إنشاء مستخدم جديد في Firestore:", userData?.email);
                  await setDoc(doc(db, "users", firebaseUser.uid), {
                    ...userData,
                    updatedAt: serverTimestamp(),
                  });
                } catch (createError) {
                  console.warn("⚠️ تم استخدام بيانات المستخدم الأساسية من Firebase Auth بدون Firestore");
                }
              }
              
              // التوجيه بناءً على الموقع الحالي
              const pathname = window.location.pathname;
              
              // إذا كنا على صفحة تسجيل الدخول أو التسجيل ولدينا مسار إعادة توجيه
              if (pathname === "/login" || pathname === "/signup") {
                const redirectPath = redirectAfterLoginRef.current;
                
                if (redirectPath) {
                  // إعادة تعيين المرجع بعد استخدامه
                  redirectAfterLoginRef.current = null;
                  navigate(decodeURIComponent(redirectPath));
                } else {
                  // توجيه تلقائي إلى لوحة التحكم المناسبة حسب الدور
                  if (userData?.role === UserRole.CUSTOMER) navigate("/customer");
                  else if (userData?.role === UserRole.PROPERTY_ADMIN) navigate("/property-admin");
                  else if (userData?.role === UserRole.SUPER_ADMIN) navigate("/super-admin");
                  else navigate("/unauthorized");
                }
              }
            } catch (error) {
              console.error("Error in authentication process:", error);
              
              // في حالة أي خطأ، نستخدم محول المصادقة مع بيانات Firebase فقط
              const basicUserData = firebaseUserToAppUser(firebaseUser);
              setUser(basicUserData);
              console.warn("⚠️ تم استخدام بيانات المستخدم الأساسية من Firebase Auth بدون Firestore");
              
              // محاولة التوجيه
              if (window.location.pathname === "/login" || window.location.pathname === "/signup") {
                navigate("/");
              }
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

  // إعادة تعيين كلمة المرور باستخدام البريد الإلكتروني
  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!auth) {
        throw new Error("خدمة المصادقة Firebase غير متوفرة");
      }
      
      console.log("إرسال رابط إعادة تعيين كلمة المرور إلى:", email);
      await sendPasswordResetEmail(auth, email);
      console.log("تم إرسال بريد إعادة تعيين كلمة المرور بنجاح");
    } catch (err: any) {
      console.error("خطأ في إعادة تعيين كلمة المرور:", err);
      
      if (err.code === 'auth/user-not-found') {
        setError("لا يوجد حساب بهذا البريد الإلكتروني");
      } else if (err.code === 'auth/invalid-email') {
        setError("البريد الإلكتروني غير صالح");
      } else {
        setError("حدث خطأ أثناء معالجة طلبك");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور (Firebase فقط)
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      
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
            const newUserData: Partial<UserData> = {
              uid: userCred.user.uid,
              email: userCred.user.email || '',
              name: userCred.user.displayName || 'مستخدم جديد',
              role: UserRole.CUSTOMER, // دور افتراضي
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
  const register = async (email: string, password: string, name: string = "") => {
    setLoading(true);
    setError(null);
    try {
      
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
        const userData: Partial<UserData> = {
          uid: user.uid,
          email: email,
          name: name,
          role: UserRole.CUSTOMER, // دور افتراضي للمستخدمين الجدد
          createdAt: new Date().toISOString(),
          photoURL: user.photoURL || null,
        };
        
        // حفظ المعلومات في قاعدة البيانات باستخدام معالجة أخطاء أفضل
        console.log("حفظ معلومات المستخدم في Firestore...");
        try {
          // استخدام آلية safeDoc لمعالجة الأخطاء والمحاولة مرة أخرى
          const userRef = doc(db, "users", user.uid);
          await setDoc(userRef, {
            ...userData,
            // استخدام التاريخ العادي بدلاً من serverTimestamp() لتجنب بعض مشاكل Firestore
            createdAt: new Date().toISOString()
          });
          console.log("تم حفظ معلومات المستخدم بنجاح في Firestore");
        } catch (firestoreError) {
          console.error("فشل في حفظ بيانات المستخدم في Firestore:", firestoreError);
          // لن نرمي خطأ هنا - المستخدم تم إنشاؤه بالفعل في Firebase Auth
          // فقط سنسجل هذا الخطأ ونستمر
        }
        
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

  // تسجيل الدخول باستخدام Google - باستخدام إعادة التوجيه بدلاً من النافذة المنبثقة
  const loginWithGoogle = async (redirectPath?: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!auth) {
        throw new Error("خدمات Firebase غير متوفرة");
      }
      
      // حفظ مسار إعادة التوجيه إذا كان موجودًا
      const path = redirectPath || redirectAfterLoginRef.current;
      if (path) {
        localStorage.setItem('googleAuthRedirectPath', path);
        console.log("تم حفظ مسار إعادة التوجيه:", path);
      }
      
      console.log("محاولة تسجيل الدخول باستخدام Google (طريقة إعادة التوجيه)...");
      console.log("النطاق الحالي:", window.location.origin);
      
      // إنشاء مزود مصادقة Google
      const googleProvider = new GoogleAuthProvider();
      
      // إضافة نطاقات لطلب المعلومات
      googleProvider.addScope('email');
      googleProvider.addScope('profile');
      
      // تعيين إعدادات خاصة لضمان عمل إعادة التوجيه بشكل صحيح
      googleProvider.setCustomParameters({
        'login_hint': 'الرجاء اختيار حساب Google الخاص بك',
        'prompt': 'select_account'
      });
      
      // استخدام signInWithRedirect بدلاً من signInWithPopup
      console.log("بدء عملية تسجيل الدخول باستخدام طريقة إعادة التوجيه...");
      await signInWithRedirect(auth, googleProvider);
      
      // ملاحظة: الكود التالي لن يتم تنفيذه بسبب إعادة التوجيه
      // عملية معالجة نتائج تسجيل الدخول ستتم في مكون RedirectHandler في App.tsx
      console.log("هذا الكود لن يتم تنفيذه بسبب إعادة التوجيه");
      
      return {}; // هذا لن يتم تنفيذه
    } catch (error: any) {
      console.error("خطأ في تسجيل الدخول باستخدام Google:", error);
      
      // محاولة تسجيل الدخول كضيف إذا فشلت محاولة Google
      try {
        console.log("محاولة تسجيل الدخول كضيف...");
        await loginAnonymously();
      } catch (guestError) {
        console.error("فشل تسجيل الدخول كضيف:", guestError);
        setError("فشل تسجيل الدخول. الرجاء المحاولة مرة أخرى لاحقًا.");
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الدخول باستخدام Facebook
  const loginWithFacebook = async (redirectPath?: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!auth) {
        throw new Error("خدمة المصادقة غير متوفرة");
      }

      // حفظ مسار إعادة التوجيه إذا كان موجودًا
      if (redirectPath) {
        redirectAfterLoginRef.current = redirectPath;
      }

      const facebookProvider = new FacebookAuthProvider();
      facebookProvider.addScope('email');
      facebookProvider.addScope('public_profile');

      const result = await signInWithPopup(auth, facebookProvider);
      
      // التحقق من وجود معلومات المستخدم في Firestore وإنشائها إذا لم تكن موجودة
      if (db) {
        try {
          const docRef = doc(db, "users", result.user.uid);
          const docSnap = await getDoc(docRef);
          
          if (!docSnap.exists()) {
            const userData: Partial<UserData> = {
              uid: result.user.uid,
              email: result.user.email || '',
              name: result.user.displayName || 'مستخدم Facebook',
              role: UserRole.CUSTOMER,
              createdAt: new Date().toISOString(),
              photoURL: result.user.photoURL
            };
            
            await setDoc(docRef, userData);
          }
        } catch (firestoreErr) {
          console.error("خطأ في الوصول إلى Firestore:", firestoreErr);
        }
      }
      
      // التوجيه سيتم من خلال مستمع تغير حالة المصادقة
      // ولكن يمكن أن نقوم بالتوجيه اليدوي هنا أيضًا
      if (redirectPath) {
        navigate(redirectPath);
      }
      
      return result;
    } catch (err: any) {
      console.error("خطأ في تسجيل الدخول باستخدام Facebook:", err);
      
      if (err.code === 'auth/account-exists-with-different-credential') {
        setError("هناك حساب موجود بنفس البريد الإلكتروني ولكن طريقة الدخول مختلفة");
      } else {
        setError("فشل تسجيل الدخول باستخدام Facebook");
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الدخول كضيف
  const loginAnonymously = async (redirectPath?: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!auth) {
        throw new Error("خدمة المصادقة غير متوفرة");
      }
      
      console.log("تسجيل الدخول كضيف...");
      const result = await signInAnonymously(auth);
      
      // إنشاء سجل مستخدم في Firestore للضيف
      if (db) {
        try {
          const guestData: Partial<UserData> = {
            uid: result.user.uid,
            email: `guest_${result.user.uid.substring(0, 5)}@guest.stayx.com`,
            name: `زائر`,
            role: UserRole.CUSTOMER,
            createdAt: new Date().toISOString(),
            isAnonymous: true
          };
          
          await setDoc(doc(db, "users", result.user.uid), guestData);
        } catch (firestoreErr) {
          console.error("خطأ في حفظ بيانات الضيف في Firestore:", firestoreErr);
        }
      }
      
      if (redirectPath) {
        navigate(redirectPath);
      }
      
      return result;
    } catch (err) {
      console.error("خطأ في تسجيل الدخول كضيف:", err);
      setError("حدث خطأ أثناء تسجيل الدخول كضيف");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الخروج - Firebase فقط
  const logout = async () => {
    try {
      if (!auth) {
        throw new Error("خدمة المصادقة غير متوفرة");
      }
      
      await signOut(auth);
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("خطأ في تسجيل الخروج:", err);
      setError("فشل تسجيل الخروج");
      throw err;
    }
  };

  // تحديث معلومات المستخدم
  const updateUserInfo = (userData: UserData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        resetPassword,
        loginWithGoogle,
        loginWithFacebook,
        loginAnonymously,
        updateUserInfo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// الدالة الأساسية لاستخدام سياق المصادقة
export const useAuth = () => useContext(AuthContext);

// تصدير الدالة بالاسم الذي تستخدمه المكونات الأخرى في التطبيق
export const useAuthContext = useAuth;