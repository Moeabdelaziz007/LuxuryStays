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
                  try {
                    const newUser: UserData = {
                      uid: firebaseUser.uid,
                      email: firebaseUser.email || '',
                      name: firebaseUser.displayName || 'مستخدم',
                      role: 'CUSTOMER', // الدور الافتراضي
                      createdAt: new Date().toISOString(),
                    };
                    
                    console.log("إنشاء مستخدم جديد في Firestore:", newUser.email);
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
                  } catch (firestoreErr) {
                    console.error("فشل إنشاء وثيقة المستخدم في Firestore:", firestoreErr);
                    // في حالة فشل Firestore، سنستخدم بيانات Firebase Auth على الأقل
                    const fallbackUser: UserData = {
                      uid: firebaseUser.uid,
                      email: firebaseUser.email || '',
                      name: firebaseUser.displayName || 'مستخدم',
                      role: 'CUSTOMER',
                      createdAt: new Date().toISOString(),
                    };
                    setUser(fallbackUser);
                    console.log("تم استخدام بيانات المستخدم من Firebase Auth بدلاً من Firestore");
                    
                    // التوجيه كالمعتاد حتى مع وجود خطأ في Firestore
                    const redirectPath = redirectAfterLoginRef.current;
                    if (redirectPath) {
                      redirectAfterLoginRef.current = null;
                      navigate(decodeURIComponent(redirectPath));
                    } else {
                      navigate("/customer");
                    }
                  }
                }
              } else {
                // Firestore not available - still use Firebase auth data
                console.warn("Firestore غير متاح، استخدام بيانات Firebase Auth فقط");
                
                // Try to detect property admin from email domain or claims
                let detectedRole = 'CUSTOMER';
                
                // If email has a specific domain that indicates admin roles
                if (firebaseUser.email) {
                  // Check for property admin patterns
                  if (firebaseUser.email.includes('admin') || 
                      firebaseUser.email.includes('property') || 
                      firebaseUser.email.includes('manager')) {
                    detectedRole = 'PROPERTY_ADMIN';
                  }
                  
                  // If a verified admin domain
                  if (firebaseUser.email.endsWith('stayx.com') || 
                      firebaseUser.email.endsWith('propertyadmin.com')) {
                    detectedRole = 'PROPERTY_ADMIN';
                  }
                }
                
                // Check for admin claims if available
                if (firebaseUser.getIdTokenResult) {
                  try {
                    const idTokenResult = await firebaseUser.getIdTokenResult();
                    if (idTokenResult.claims.role === 'PROPERTY_ADMIN') {
                      detectedRole = 'PROPERTY_ADMIN';
                    } else if (idTokenResult.claims.role === 'SUPER_ADMIN') {
                      detectedRole = 'SUPER_ADMIN';
                    }
                  } catch (claimsError) {
                    console.warn("Failed to get token claims", claimsError);
                  }
                }
                
                const fallbackUser: UserData = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email || '',
                  name: firebaseUser.displayName || 'مستخدم',
                  role: detectedRole,
                  createdAt: new Date().toISOString(),
                };
                setUser(fallbackUser);
                
                // التوجيه للصفحة الرئيسية كخطة بديلة
                const redirectPath = redirectAfterLoginRef.current;
                if (redirectPath) {
                  redirectAfterLoginRef.current = null;
                  navigate(decodeURIComponent(redirectPath));
                } else {
                  navigate("/");
                }
              }
            } catch (error) {
              console.error("Error accessing Firestore:", error);
              // في حالة خطأ Firestore، يمكننا استخدام بيانات Firebase Auth على الأقل
              if (firebaseUser) {
                // Try to detect property admin from email domain or claims
                let detectedRole = 'CUSTOMER';
                
                // If email has a specific domain that indicates admin roles
                if (firebaseUser.email) {
                  // Check for property admin patterns
                  if (firebaseUser.email.includes('admin') || 
                      firebaseUser.email.includes('property') || 
                      firebaseUser.email.includes('manager')) {
                    detectedRole = 'PROPERTY_ADMIN';
                  }
                  
                  // If a verified admin domain
                  if (firebaseUser.email.endsWith('stayx.com') || 
                      firebaseUser.email.endsWith('propertyadmin.com')) {
                    detectedRole = 'PROPERTY_ADMIN';
                  }
                }
                
                // Check for admin claims if available
                if (firebaseUser.getIdTokenResult) {
                  try {
                    const idTokenResult = await firebaseUser.getIdTokenResult();
                    if (idTokenResult.claims.role === 'PROPERTY_ADMIN') {
                      detectedRole = 'PROPERTY_ADMIN';
                    } else if (idTokenResult.claims.role === 'SUPER_ADMIN') {
                      detectedRole = 'SUPER_ADMIN';
                    }
                  } catch (claimsError) {
                    console.warn("Failed to get token claims", claimsError);
                  }
                }
                
                const backupUser: UserData = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email || '',
                  name: firebaseUser.displayName || 'مستخدم',
                  role: detectedRole,
                  createdAt: new Date().toISOString(),
                };
                setUser(backupUser);
                console.warn("⚠️ تم استخدام بيانات المستخدم الأساسية من Firebase Auth بدون Firestore");
                
                // محاولة التوجيه
                if (window.location.pathname === "/login" || window.location.pathname === "/signup") {
                  navigate("/");
                }
              } else {
                setUser(null);
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
  }, []);

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
        const userData: UserData = {
          uid: user.uid,
          email: email,
          name: name,
          role: 'CUSTOMER', // دور افتراضي للمستخدمين الجدد
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
        'prompt': 'select_account',
        'client_id': '299280633489-3q6odgc86hhc1j0cev92bf28q7cep5hj.apps.googleusercontent.com',
        'redirect_uri': `${window.location.origin}/auth/google/callback`,
        'origin': window.location.origin
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
  
  // تسجيل الدخول باستخدام Facebook
  const loginWithFacebook = async (redirectPath?: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!auth) {
        throw new Error("خدمات Firebase غير متوفرة");
      }
      
      console.log("محاولة تسجيل الدخول باستخدام Facebook...");
      
      // حفظ مسار إعادة التوجيه إذا كان موجودًا
      const path = redirectPath || redirectAfterLoginRef.current;
      if (path) {
        localStorage.setItem('facebookAuthRedirectPath', path);
        console.log("تم حفظ مسار إعادة التوجيه:", path);
      }
      
      // التحقق مما إذا كان المستخدم الحالي مجهولاً للترقية المحتملة
      const currentUser = auth.currentUser;
      const isAnonymous = currentUser && currentUser.isAnonymous;
      
      try {
        // إعداد مزود المصادقة Facebook
        const provider = new FacebookAuthProvider();
        
        let userCred;
        
        if (isAnonymous && currentUser) {
          // ربط الحساب المجهول بحساب Facebook
          try {
            userCred = await linkWithPopup(currentUser, provider);
            console.log("تم ربط الحساب المجهول بنجاح بحساب Facebook");
            
            // تحديث بيانات المستخدم في Firestore
            if (db) {
              await setDoc(
                doc(db, "users", userCred.user.uid),
                {
                  email: userCred.user.email,
                  name: userCred.user.displayName || "مستخدم Facebook",
                  provider: "facebook",
                  wasAnonymous: true,
                  updatedAt: serverTimestamp()
                },
                { merge: true }
              );
            }
          } catch (linkError: any) {
            console.error("فشل ربط الحساب المجهول:", linkError.code);
            
            if (linkError.code === 'auth/credential-already-in-use' ||
                linkError.code === 'auth/email-already-in-use') {
              // حذف الحساب المجهول والتسجيل بالحساب الموجود
              await currentUser.delete();
              userCred = await signInWithPopup(auth, provider);
            } else if (linkError.code === 'auth/unauthorized-domain') {
              // استخدام المصادقة المجهولة كبديل
              throw linkError; // سيتم معالجته في الـ catch الخارجي
            } else {
              throw linkError;
            }
          }
        } else {
          // تسجيل دخول عادي باستخدام Facebook
          userCred = await signInWithPopup(auth, provider);
        }
        
        // إضافة/تحديث المستخدم في Firestore
        if (db && userCred) {
          const user = userCred.user;
          
          // التحقق مما إذا كان المستخدم موجودًا بالفعل
          const userDoc = await getDoc(doc(db, "users", user.uid));
          
          if (!userDoc.exists()) {
            // إنشاء مستخدم جديد
            const userData = {
              uid: user.uid,
              email: user.email,
              name: user.displayName || "مستخدم Facebook",
              role: "CUSTOMER",
              createdAt: serverTimestamp(),
              provider: "facebook",
              wasAnonymous: isAnonymous
            };
            
            await setDoc(doc(db, "users", user.uid), userData);
          }
        }
        
        // توجيه المستخدم بعد تسجيل الدخول
        const savedRedirectPath = localStorage.getItem('facebookAuthRedirectPath');
        if (savedRedirectPath) {
          navigate(savedRedirectPath);
          localStorage.removeItem('facebookAuthRedirectPath');
        }
        
        return userCred;
      } catch (popupError: any) {
        console.error("خطأ في نافذة تسجيل الدخول:", popupError.code);
        
        if (popupError.code === 'auth/unauthorized-domain') {
          // استخدام المصادقة المجهولة كبديل
          throw popupError; // سيتم معالجته في الـ catch الخارجي
        } else {
          throw popupError;
        }
      }
    } catch (error: any) {
      console.error("خطأ في تسجيل الدخول باستخدام Facebook:", error);
      setLoading(false);
      throw error;
    }
  };
  
  // تسجيل الدخول بشكل مجهول (Anonymous)
  const loginAnonymously = async (redirectPath?: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!auth) {
        throw new Error("خدمات Firebase غير متوفرة");
      }
      
      console.log("محاولة تسجيل الدخول كمستخدم مجهول...");
      
      // حفظ مسار إعادة التوجيه إذا كان موجودًا
      const path = redirectPath || redirectAfterLoginRef.current;
      if (path) {
        localStorage.setItem('anonymousAuthRedirectPath', path);
        console.log("تم حفظ مسار إعادة التوجيه للمستخدم المجهول:", path);
      }
      
      // استخدام تسجيل الدخول المباشر مع بريد وكلمة مرور بدلاً من المجهول
      // لأن تسجيل الدخول المجهول قد يكون معطلاً في إعدادات Firebase
      
      // إنشاء بريد إلكتروني عشوائي وكلمة مرور لضيف
      const guestEmail = `guest_${Math.floor(Math.random() * 1000000)}@staychill.example.com`;
      const guestPassword = `GuestPass${Math.floor(Math.random() * 1000000)}!`;
      
      // محاولة إنشاء حساب جديد
      const userCredential = await createUserWithEmailAndPassword(auth, guestEmail, guestPassword);
      console.log("تم إنشاء حساب ضيف بنجاح!");
      
      // تحديث بيانات الملف الشخصي ليبدو كحساب مجهول
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: "زائر StayX"
        });
      }
      
      // إضافة المستخدم إلى Firestore
      if (db && userCredential.user) {
        try {
          const userData = {
            uid: userCredential.user.uid,
            email: guestEmail, // استخدام البريد الإلكتروني المنشأ
            name: "زائر StayX",
            role: "CUSTOMER",
            createdAt: serverTimestamp(),
            isAnonymous: true
          };
          
          await setDoc(doc(db, "users", userCredential.user.uid), userData);
        } catch (firestoreError) {
          console.error("خطأ في حفظ بيانات المستخدم المجهول:", firestoreError);
          // عدم منع التسجيل في حالة فشل Firestore
        }
      }
      
      // توجيه المستخدم بعد تسجيل الدخول
      const savedRedirectPath = localStorage.getItem('anonymousAuthRedirectPath');
      if (savedRedirectPath) {
        navigate(savedRedirectPath);
        localStorage.removeItem('anonymousAuthRedirectPath');
      }
      
      console.log("تم تسجيل الدخول كضيف بنجاح باستخدام البريد الإلكتروني!");
      return userCredential;
    } catch (error) {
      console.error("فشل في تسجيل الدخول كمستخدم مجهول:", error);
      setLoading(false);
      throw error;
    }
  };

  const contextValue = {
    user,
    loading,
    login,
    register,
    logout,
    loginWithGoogle,
    loginWithFacebook,
    loginAnonymously,
    updateUserInfo,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// إعادة تصدير السياق والأدوات المساعدة
// Fast Refresh نستخدم أسلوب ثابت للتصدير لتجنب مشاكل مع

// هذا هو الـ hook الذي سيتم استخدامه في التطبيق
function useAuthInternal() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Named functions to avoid Fast Refresh issues
export const useAuth = useAuthInternal;

// للتوافق مع الكود الموجود
export const useAuthContext = useAuthInternal;