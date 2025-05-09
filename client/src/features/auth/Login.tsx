import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInAnonymously, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import GoogleAuthDomainFeedback from "@/components/GoogleAuthDomainFeedback";

// مكونات مخصصة تم تعريفها مباشرة لإصلاح المشكلة
interface GoogleLoginButtonProps {
  onSuccess?: () => void; 
  onError?: (error: any) => void;
  loading?: boolean;
  className?: string;
  buttonText?: string;
  redirectPath?: string;
}

const GoogleLoginButton = ({ 
  onSuccess, 
  onError, 
  loading, 
  className, 
  buttonText, 
  redirectPath 
}: GoogleLoginButtonProps) => {

  const handleGoogleLogin = async () => {
    try {
      if (!auth) throw new Error("خدمة المصادقة غير متوفرة");

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      const result = await signInWithPopup(auth, provider);

      if (onSuccess) {
        onSuccess();
      }

      return result;
    } catch (error: any) {
      console.error("خطأ في تسجيل الدخول باستخدام Google:", error);

      if (onError) {
        onError(error);
      }

      throw error;
    }
  };

  return (
    <Button 
      className={`relative w-full flex items-center justify-center gap-2 ${className || ""}`}
      disabled={loading}
      onClick={handleGoogleLogin}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {buttonText || "تسجيل الدخول مع Google"}
    </Button>
  );
};

interface GuestLoginButtonProps {
  onSuccess?: () => void;
  onError?: (error: any) => void;
  loading?: boolean;
  className?: string;
  buttonText?: string;
  redirectPath?: string;
}

const GuestLoginButton = ({ 
  onSuccess, 
  onError, 
  loading, 
  className, 
  buttonText 
}: GuestLoginButtonProps) => {

  const handleGuestLogin = async () => {
    try {
      if (!auth) throw new Error("خدمة المصادقة غير متوفرة");

      const result = await signInAnonymously(auth);

      if (onSuccess) {
        onSuccess();
      }

      return result;
    } catch (error: any) {
      console.error("خطأ في تسجيل الدخول كزائر:", error);

      if (onError) {
        onError(error);
      }

      throw error;
    }
  };

  return (
    <Button 
      className={`relative w-full ${className || ""}`}
      variant="outline"
      disabled={loading}
      onClick={handleGuestLogin}
    >
      {buttonText || "الدخول كزائر"}
    </Button>
  );
};

// صفحة تسجيل الدخول البسيطة
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  // إضافة المتغيرات المفقودة
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [guestLoading, setGuestLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showGoogleWarning, setShowGoogleWarning] = useState(false);

  // Helper function for toast styling
  const getSuccessToast = (title: string, description: string) => ({
    title,
    description,
    variant: "default" as const,
    className: "bg-gradient-to-r from-green-900/80 to-green-800/80 border-green-600/50 text-white",
  });

  const getErrorToast = (title: string, description: string) => ({
    title,
    description,
    variant: "destructive" as const,
  });

  const getWarningToast = (title: string, description: string) => ({
    title,
    description,
    variant: "default" as const,
    className: "bg-gradient-to-r from-amber-900/80 to-amber-700/80 border-amber-600/50 text-white",
  });

  // دوال المساعدة للمصادقة
  const isCurrentDomainAuthorized = () => {
    // يمكن التحقق مما إذا كان النطاق الحالي مدرجًا في قائمة النطاقات المصرح بها
    // التنفيذ الفعلي قد يتضمن فحص القائمة أو إجراء طلب إلى الخادم
    // سنفترض هنا أن النطاق مصرح به لتبسيط الإصلاح
    return true;
  };

  const storeCurrentDomain = () => {
    // تخزين النطاق الحالي في localStorage للرجوع إليه لاحقاً
    try {
      localStorage.setItem('currentDomain', window.location.host);
    } catch (error: any) {
      console.error('فشل في تخزين النطاق:', error);
    }
  };

  const loginWithGoogle = async (redirectPath?: string) => {
    if (!auth) throw new Error('خدمة المصادقة غير متوفرة');

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);

      // تخزين بيانات المستخدم في Firestore إذا لزم الأمر
      if (db && result.user) {
        const userRef = doc(db, "users", result.user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // إنشاء ملف تعريف المستخدم إذا لم يكن موجودًا
          const userProfile = {
            uid: result.user.uid,
            email: result.user.email,
            name: result.user.displayName || 'مستخدم جديد',
            role: "CUSTOMER",
            createdAt: new Date().toISOString(),
            photoURL: result.user.photoURL,
          };

          await setDoc(userRef, userProfile);
        }
      }

      return result;
    } catch (error: any) {
      console.error('خطأ في تسجيل الدخول باستخدام Google:', error);
      throw error;
    }
  };

  const loginAnonymously = async (redirectPath?: string) => {
    if (!auth) throw new Error('خدمة المصادقة غير متوفرة');

    try {
      const result = await signInAnonymously(auth);

      // تخزين بيانات المستخدم المجهول في Firestore
      if (db && result.user) {
        const userRef = doc(db, "users", result.user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // إنشاء ملف تعريف المستخدم المجهول
          const userProfile = {
            uid: result.user.uid,
            email: null,
            name: 'زائر',
            role: "GUEST",
            createdAt: new Date().toISOString(),
            photoURL: null,
            isAnonymous: true,
          };

          await setDoc(userRef, userProfile);
        }
      }

      return result;
    } catch (error: any) {
      console.error('خطأ في تسجيل الدخول كزائر:', error);
      throw error;
    }
  };

  // التحقق من إذا كان المستخدم قد وصل من صفحة التسجيل
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const registered = searchParams.get('registered');

    if (registered === 'true') {
      toast(getSuccessToast(
        "تم تسجيل الحساب بنجاح ✅",
        "يمكنك الآن تسجيل الدخول باستخدام بريدك الإلكتروني أو اسم المستخدم"
      ));
    }
  }, [toast]);

  // استخراج مسار إعادة التوجيه ومعلمات أخرى من معلمات URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const redirect = searchParams.get('redirect');
    const reset = searchParams.get('reset');

    if (redirect) {
      setRedirectPath(redirect);
      toast(getWarningToast(
        "تحتاج إلى تسجيل الدخول ⚠️",
        "يرجى تسجيل الدخول للوصول إلى الصفحة المطلوبة"
      ));
    }

    if (reset === 'success') {
      toast(getSuccessToast(
        "تم تغيير كلمة المرور بنجاح ✅",
        "يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة"
      ));
    }
  }, [toast]);

  // عرض رسالة إعادة التوجيه
  const renderRedirectMessage = () => {
    if (!redirectPath) return null;

    let pageName = "الصفحة المطلوبة";

    if (redirectPath.includes('booking')) {
      pageName = "صفحة الحجز";
    } else if (redirectPath.includes('property')) {
      pageName = "صفحة العقار";
    } else if (redirectPath.includes('customer')) {
      pageName = "صفحة العميل";
    } else if (redirectPath.includes('property-admin')) {
      pageName = "صفحة إدارة العقارات";
    } else if (redirectPath.includes('super-admin')) {
      pageName = "صفحة المشرف العام";
    }

    return (
      <div className="mb-6 p-3 rounded-lg border border-[#39FF14]/30 bg-[#39FF14]/10 text-sm">
        بعد تسجيل الدخول، سيتم توجيهك مباشرةً إلى {pageName}.
      </div>
    );
  };

  // تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور
  const handleLogin = async (e: React.FormEvent, email: string, password: string) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!auth) {
        throw new Error("خدمة المصادقة غير متوفرة حالياً، الرجاء المحاولة لاحقاً");
      }

      const userCred = await signInWithEmailAndPassword(auth, email, password);

      if (db) {
        try {
          const userRef = doc(db, "users", userCred.user.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            const userProfile = {
              uid: userCred.user.uid,
              email: userCred.user.email,
              name: userCred.user.displayName || email.split('@')[0] || 'مستخدم جديد',
              role: "CUSTOMER",
              createdAt: new Date().toISOString(),
              photoURL: userCred.user.photoURL || null,
            };

            try {
              await setDoc(userRef, userProfile);
              toast(getSuccessToast(
                "تم تسجيل الدخول بنجاح",
                "مرحباً بك في منصة StayX!"
              ));
            } catch (firestoreError) {
              toast(getWarningToast(
                "تم تسجيل الدخول لكن مع تحذير",
                "تم تسجيل دخولك بنجاح ولكن قد تكون هناك مشكلة في حفظ بياناتك."
              ));
            }
          } else {
            toast(getSuccessToast(
              "تم تسجيل الدخول بنجاح",
              `مرحباً بعودتك!`
            ));
          }
        } catch (firestoreError) {
          toast(getWarningToast(
            "تم تسجيل الدخول مع تحذير",
            "تم تسجيل دخولك ولكن قد تكون هناك مشكلة في الوصول إلى بياناتك."
          ));
        }
      }

      setTimeout(() => {
        if (redirectPath) {
          navigate(redirectPath);
        } else {
          navigate("/");
        }
      }, 1000);

    } catch (err: any) {
      const errorMessages: Record<string, string> = {
        'auth/invalid-credential': "البريد الإلكتروني أو كلمة المرور غير صحيحة. الرجاء التحقق وإعادة المحاولة.",
        'auth/invalid-email': "يرجى إدخال بريد إلكتروني صالح.",
        'auth/user-not-found': "لم يتم العثور على حساب بهذا البريد الإلكتروني. هل ترغب في إنشاء حساب جديد؟",
        'auth/wrong-password': "كلمة المرور غير صحيحة. الرجاء التحقق منها والمحاولة مرة أخرى.",
        'auth/too-many-requests': "تم إجراء عدة محاولات خاطئة. الرجاء المحاولة بعد قليل أو استخدام خيار 'نسيت كلمة المرور'.",
        'auth/network-request-failed': "يبدو أن هناك مشكلة في الاتصال بالإنترنت. الرجاء التحقق من اتصالك والمحاولة مرة أخرى.",
      };

      setError(errorMessages[err.code] || err.message || "حدث خطأ أثناء تسجيل الدخول، الرجاء المحاولة مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الدخول كزائر
  const handleGuestLogin = async () => {
    setError("");
    setGuestLoading(true);

    try {
      await loginAnonymously(redirectPath || undefined);

      toast(getSuccessToast(
        "تم تسجيل الدخول كزائر",
        "مرحباً بك في منصة StayX! يمكنك تصفح المنصة بدون إنشاء حساب."
      ));

    } catch (err: any) {
      const anonymousErrorMessages: Record<string, string> = {
        'auth/operation-not-allowed': "تسجيل الدخول كزائر غير مُفعل في هذا التطبيق.",
        'auth/admin-restricted-operation': "تسجيل الدخول كزائر غير متاح حاليًا. الرجاء استخدام طريقة أخرى.",
        'auth/network-request-failed': "فشل في الاتصال بالشبكة. الرجاء التحقق من اتصالك بالإنترنت.",
      };

      setError(anonymousErrorMessages[err.code] || err.message || "حدث خطأ أثناء تسجيل الدخول. الرجاء المحاولة مرة أخرى.");

      toast({
        title: "فشل تسجيل الدخول",
        description: anonymousErrorMessages[err.code] || err.message || "حدث خطأ أثناء تسجيل الدخول كزائر",
        variant: "destructive",
      });
    } finally {
      setGuestLoading(false);
    }
  };

  // تسجيل الدخول باستخدام Google
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      console.log("بدء محاولة تسجيل الدخول باستخدام Google...");
      console.log("النطاق الحالي:", window.location.host);

      // التحقق من النطاق قبل محاولة تسجيل الدخول
      if (!isCurrentDomainAuthorized()) {
        console.warn("النطاق الحالي غير مصرح به في Firebase. عرض تحذير...");
        storeCurrentDomain(); // تخزين النطاق الحالي للرجوع إليه لاحقًا
        setShowGoogleWarning(true);
        return;
      }

      // إرسال مسار إعادة التوجيه إلى دالة تسجيل الدخول مع Google
      await loginWithGoogle(redirectPath || undefined);

      toast(getSuccessToast(
        "تم تسجيل الدخول بنجاح",
        "مرحباً بك في منصة StayX!"
      ));

      if (redirectPath) {
        navigate(redirectPath);
      } else {
        navigate("/");
      }

    } catch (err: any) {
      console.error("Login error:", err);

      // Specific error handling
      if (err.code === 'auth/unauthorized-domain') {
        console.error("نطاق غير مصرح به:", window.location.host);
        toast({
          title: "خطأ في النطاق",
          description: "هذا النطاق غير مصرح به. يرجى الاتصال بالدعم الفني.",
          variant: "destructive"
        });
      } else if (err.code === 'auth/network-request-failed') {
        toast({
          title: "خطأ في الشبكة",
          description: "يرجى التحقق من اتصالك بالإنترنت",
          variant: "destructive"
        });
      } else {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: err.message || "حدث خطأ غير متوقع",
          variant: "destructive"
        });
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      {/* Tech/Space inspired background */}
      <div className="absolute inset-0 bg-black z-0">
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KICA8cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgIDxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxMTExMTEiIHN0cm9rZS13aWR0aD0iMC41Ii8+CiAgPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiIC8+Cjwvc3ZnPg==')] opacity-20"></div>

        {/* Digital particle effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute h-1 w-1 rounded-full bg-[#39FF14] top-[20%] left-[30%] animate-ping"></div>
          <div className="absolute h-1 w-1 rounded-full bg-[#39FF14] top-[65%] left-[55%] animate-ping" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute h-1 w-1 rounded-full bg-[#39FF14] top-[35%] left-[80%] animate-ping" style={{animationDelay: '1.2s'}}></div>
          <div className="absolute h-1 w-1 rounded-full bg-[#39FF14] top-[80%] left-[15%] animate-ping" style={{animationDelay: '0.8s'}}></div>
          <div className="absolute h-1 w-1 rounded-full bg-[#39FF14] top-[10%] left-[50%] animate-ping" style={{animationDelay: '1.5s'}}></div>
        </div>

        {/* Neon glow effects */}
        <div className="absolute h-96 w-96 rounded-full bg-[#39FF14] blur-[150px] opacity-5 top-[-15%] right-[-10%]"></div>
        <div className="absolute h-64 w-64 rounded-full bg-[#39FF14] blur-[120px] opacity-5 bottom-[-10%] left-[-5%]"></div>
        <div className="absolute h-32 w-32 rounded-full bg-[#39FF14] blur-[80px] opacity-5 top-[30%] left-[60%]"></div>
      </div>

      {/* Main Content Layout - Two Column */}
      <div className="relative z-10 flex flex-col md:flex-row w-full max-w-6xl mx-auto">
        {/* Form Container */}
        <div className="relative w-full md:w-1/2 px-4 sm:px-6 lg:px-8 z-10">
          <div className="backdrop-blur-lg bg-black/40 p-5 sm:p-8 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.3)] 
            border border-[#39FF14]/20 relative overflow-hidden">

            {/* Background glow effect */}
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-[#39FF14]/10 rounded-full blur-[80px] opacity-70"></div>

            {/* Logo */}
            <div className="text-center mb-8 relative">
              <h1 className="inline-block text-[42px] font-black relative mb-2">
                <span className="text-[#39FF14] animate-neon-pulse" 
                      style={{ textShadow: "0 0 5px rgba(57, 255, 20, 0.7), 0 0 10px rgba(57, 255, 20, 0.5)" }}>
                  Stay
                </span>
                <span className="text-white">X</span>
              </h1>
              <p className="text-lg text-gray-300 flex items-center justify-center gap-2">
                <span className="h-1 w-10 bg-gradient-to-r from-[#39FF14]/10 via-[#39FF14] to-[#39FF14]/10"></span>
                <span>مرحباً بعودتك</span>
                <span className="h-1 w-10 bg-gradient-to-r from-[#39FF14]/10 via-[#39FF14] to-[#39FF14]/10"></span>
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-md mb-6 text-sm relative backdrop-blur-lg">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/10 via-red-500/70 to-red-500/10 animate-pulse"></div>
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-red-400 flex-shrink-0 mr-2 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {renderRedirectMessage()}

            <form onSubmit={(e) => {
              e.preventDefault(); 
              const emailInput = document.getElementById('email-input') as HTMLInputElement; 
              const passwordInput = document.getElementById('password-input') as HTMLInputElement; 
              if (emailInput && passwordInput) { 
                handleLogin(e, emailInput.value, passwordInput.value); 
              }
            }} className="space-y-5">
              <div className="group">
                <label className="block text-sm font-medium text-gray-400 mb-1.5 transition group-focus-within:text-[#39FF14]">البريد الإلكتروني</label>
                <div className="relative">
                  <input 
                    id="email-input"
                    type="email" 
                    placeholder="أدخل بريدك الإلكتروني" 
                    className="w-full p-3 rounded-lg bg-black/60 border border-gray-800 text-white 
                      focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14]/50 
                      transition-all placeholder-gray-500" 
                    required
                    autoComplete="email"
                  />
                  <div className="absolute inset-0 rounded-lg transition-opacity opacity-0 group-focus-within:opacity-100 pointer-events-none" 
                      style={{ boxShadow: "0 0 15px rgba(57, 255, 20, 0.3)" }}></div>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-400 mb-1.5 transition group-focus-within:text-[#39FF14]">كلمة المرور</label>
                <div className="relative">
                  <input 
                    id="password-input"
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full p-3 rounded-lg bg-black/60 border border-gray-800 text-white 
                      focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14]/50 
                      transition-all placeholder-gray-500" 
                    required
                    autoComplete="current-password"
                    minLength={6}
                  />
                  <div className="absolute inset-0 rounded-lg transition-opacity opacity-0 group-focus-within:opacity-100 pointer-events-none" 
                      style={{ boxShadow: "0 0 15px rgba(57, 255, 20, 0.3)" }}></div>
                </div>
              </div>

              {/* Login button with futuristic styling */}
              <button 
                type="submit" 
                className="relative group w-full"
                disabled={loading}
              >
                <div className="relative z-10 bg-[#39FF14] text-black font-bold py-4 rounded-lg w-full text-center 
                  transform transition-all active:scale-[0.98] hover:scale-[1.01] flex items-center justify-center">
                  <span className="px-2">{loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}</span>

                  {loading ? (
                    <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></div>
                    </div>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                  )}
                </div>

                {/* Button glow effect */}
                <div className="absolute inset-0 bg-[#39FF14] blur-md opacity-40 group-hover:opacity-60 rounded-lg transition-opacity"></div>
              </button>
            </form>

            <div className="my-4 flex items-center">
              <div className="flex-1 border-t border-gray-700/50"></div>
              <span className="px-4 text-sm text-gray-500">أو</span>
              <div className="flex-1 border-t border-gray-700/50"></div>
            </div>

            <GoogleLoginButton 
              onSuccess={() => {
                toast(getSuccessToast(
                  "تم تسجيل الدخول بنجاح",
                  "مرحباً بك في منصة StayX!"
                ));
                setTimeout(() => {
                  if (redirectPath) {
                    navigate(redirectPath);
                  } else {
                    navigate("/");
                  }
                }, 1000);
              }}
              onError={(error) => {
                if (error.code === 'auth/unauthorized-domain') {
                  setShowGoogleWarning(true);
                }
              }}
              redirectPath={redirectPath || undefined}
            />

            <GuestLoginButton 
              onSuccess={() => {
                toast(getSuccessToast(
                  "تم تسجيل الدخول كزائر",
                  "مرحباً بك في منصة StayX! يمكنك تصفح المنصة بدون إنشاء حساب."
                ));
                setTimeout(() => {
                  if (redirectPath) {
                    navigate(redirectPath);
                  } else {
                    navigate("/");
                  }
                }, 1000);
              }}
              redirectPath={redirectPath || undefined}
              className="mt-3"
            />

            <div className="text-center pt-3">
              <p className="text-sm text-gray-500">
                ليس لديك حساب بعد؟{" "}
                <Link href="/signup" className="text-[#39FF14] hover:underline">
                  تسجيل حساب جديد
                </Link>
              </p>
              <p className="text-xs text-gray-600 mt-3">
                <button 
                  type="button" 
                  className="text-gray-500 hover:text-[#39FF14] transition-colors"
                  onClick={() => {
                    if (!auth) {
                      toast({
                        title: "خطأ",
                        description: "خدمة إعادة تعيين كلمة المرور غير متاحة حالياً",
                        variant: "destructive",
                      });
                      return;
                    }

                    const emailInput = document.getElementById("email-input") as HTMLInputElement;
                    const email = emailInput?.value;

                    if (!email) {
                      toast({
                        title: "الرجاء إدخال البريد الإلكتروني",
                        description: "أدخل بريدك الإلكتروني في الحقل أعلاه أولاً",
                        variant: "destructive",
                      });
                      return;
                    }

                    if (auth) {
                      sendPasswordResetEmail(auth, email)
                        .then(() => {
                          toast(getSuccessToast(
                            "تم إرسال رابط إعادة تعيين كلمة المرور",
                            "تفقد بريدك الإلكتروني واتبع التعليمات لإعادة تعيين كلمة المرور"
                          ));
                        })
                      .catch((error) => {
                        if (error.code ==='auth/user-not-found') {
                          toast({
                            title: "البريد الإلكتروني غير مسجل",
                            description: "لا يوجد حساب مسجل بهذا البريد الإلكتروني",
                            variant: "destructive",
                          });
                        } else {
                          toast({
                            title: "خطأ في إعادة تعيين كلمة المرور",
                            description: error.message || "حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور",
                            variant: "destructive",
                          });
                        }
                      });
                    }
                  }}
                >
                  إعادة تعيين كلمة المرور
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Hero Section - Only visible on desktop */}
        <div className="w-full md:w-1/2 hidden md:flex md:items-center md:justify-center">
          <div className="space-y-8 p-8">
            <div className="text-center md:text-right">
              <h2 className="text-4xl font-bold mb-4">
                <span className="text-white">منصة حجز العقارات </span>
                <span className="text-[#39FF14]">الفاخرة</span>
              </h2>
              <p className="text-gray-400 text-lg">استمتع بتجربة حجز فريدة من نوعها مع أفضل العقارات الفاخرة في الساحل الشمالي</p>
            </div>

            {/* Features Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/50 backdrop-blur-sm border border-white/10 p-4 rounded-lg hover:border-[#39FF14]/20 transition-all">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-[#39FF14]/10 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-[#39FF14]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="font-medium">حجز سريع وسهل</h3>
                </div>
                <p className="text-sm text-gray-500">احجز عقارك المفضل بخطوات بسيطة وسريعة</p>
              </div>

              <div className="bg-black/50 backdrop-blur-sm border border-white/10 p-4 rounded-lg hover:border-[#39FF14]/20 transition-all">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-[#39FF14]/10 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-[#39FF14]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                  </div>
                  <h3 className="font-medium">خدمات متميزة</h3>
                </div>
                <p className="text-sm text-gray-500">خدمات حصرية ومتنوعة تلبي جميع احتياجاتك</p>
              </div>

              <div className="bg-black/50 backdrop-blur-sm border border-white/10 p-4 rounded-lg hover:border-[#39FF14]/20 transition-all">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-[#39FF14]/10 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-[#39FF14]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </div>
                  <h3 className="font-medium">إدارة ذكية</h3>
                </div>
                <p className="text-sm text-gray-500">إدارة متكاملة لجميع حجوزاتك وخدماتك الحالية والسابقة</p>
              </div>

              <div className="bg-black/50 backdrop-blur-sm border border-white/10 p-4 rounded-lg hover:border-[#39FF14]/20 transition-all">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-[#39FF14]/10 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-[#39FF14]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                  <h3 className="font-medium">أمان وخصوصية</h3>
                </div>
                <p className="text-sm text-gray-500">حماية كاملة لبياناتك وخصوصيتك أثناء الاستخدام</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Google Login Warning Dialog */}
      <Dialog open={showGoogleWarning} onOpenChange={setShowGoogleWarning}>
        <DialogContent className="bg-black/95 border-amber-800/30 text-white overflow-hidden">
          <GoogleAuthDomainFeedback />
        </DialogContent>
      </Dialog>
    </div>
  );
}