import React, { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useLocation } from "wouter";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signInAnonymously, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, setDoc, getDocs, collection, query, where } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import GoogleLoginWarning from "@/components/GoogleLoginWarning";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/auth-context";

// Simple login page without advanced form components
export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { loginWithGoogle, loginWithFacebook, loginAnonymously, loading: authLoading } = useAuth();
  const [showGoogleWarning, setShowGoogleWarning] = useState(false);
  
  // Helper function to get a unique ID for toast notifications
  // Helper function for toast styling - we don't actually need random IDs
  const getSuccessToast = (title: string, description: string) => ({
    title,
    description,
    variant: "default" as const,
    className: "bg-gradient-to-r from-green-900/80 to-green-800/80 border-green-600/50 text-white",
  });
  
  const getWarningToast = (title: string, description: string) => ({
    title,
    description,
    variant: "default" as const,
    className: "bg-gradient-to-r from-amber-900/80 to-amber-800/80 border-amber-600/50 text-white",
  });

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
      
      // عرض رسالة للمستخدم
      toast(getWarningToast(
        "تحتاج إلى تسجيل الدخول ⚠️",
        "يرجى تسجيل الدخول للوصول إلى الصفحة المطلوبة"
      ));
    }
    
    // التحقق من وجود معلمة reset=success (بعد عودة المستخدم من إعادة تعيين كلمة المرور)
    if (reset === 'success') {
      toast(getSuccessToast(
        "تم تغيير كلمة المرور بنجاح ✅",
        "يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة"
      ));
    }
  }, [toast]);
  
  // عرض رسالة ترحيبية مع معلومات حول إعادة التوجيه
  const renderRedirectMessage = () => {
    if (!redirectPath) return null;
    
    let pageName = "الصفحة المطلوبة";
    
    // تحديد نوع الصفحة بناءً على مسار إعادة التوجيه
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

  const handleLogin = async (e: React.FormEvent, email: string, password: string) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      console.log("جاري تسجيل الدخول باستخدام البريد الإلكتروني:", email);
      
      // التحقق من توفر Firebase
      if (!auth) {
        throw new Error("خدمة المصادقة غير متوفرة حالياً، الرجاء المحاولة لاحقاً");
      }
      
      // تنبيه (لكن لا تمنع) إذا كانت Firestore غير متاحة
      if (!db) {
        console.warn("خدمة Firestore غير متاحة - ستعمل المصادقة بدون تخزين بيانات المستخدم الكاملة");
      }
      
      // استخدام Firebase للمصادقة
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      
      // التحقق من وجود المستخدم في Firestore
      if (db) {
        try {
          const userRef = doc(db, "users", userCred.user.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            // إنشاء مستخدم جديد في Firestore إذا لم يكن موجودًا
            const userProfile = {
              uid: userCred.user.uid,
              email: userCred.user.email,
              name: userCred.user.displayName || email.split('@')[0] || 'مستخدم جديد',
              role: "CUSTOMER", // دور افتراضي
              createdAt: new Date().toISOString(),
              photoURL: userCred.user.photoURL || null,
            };
            
            console.log("إنشاء مستخدم جديد في Firestore:", userProfile.email);
            
            // محاولة حفظ البيانات في Firestore
            try {
              await setDoc(userRef, userProfile);
              console.log("تم حفظ بيانات المستخدم بنجاح في Firestore");
              toast(getSuccessToast(
                "تم تسجيل الدخول بنجاح",
                "مرحباً بك في منصة StayX!"
              ));
            } catch (firestoreError) {
              console.error("فشل حفظ بيانات المستخدم في Firestore:", firestoreError);
              toast(getWarningToast(
                "تم تسجيل الدخول لكن مع تحذير",
                "تم تسجيل دخولك بنجاح ولكن قد تكون هناك مشكلة في حفظ بياناتك. ستظل قادراً على استخدام الموقع."
              ));
            }
          } else {
            // تسجيل دخول مستخدم موجود
            toast(getSuccessToast(
              "تم تسجيل الدخول بنجاح",
              `مرحباً بعودتك!`
            ));
          }
        } catch (firestoreError) {
          console.error("خطأ في التفاعل مع Firestore:", firestoreError);
          toast(getWarningToast(
            "تم تسجيل الدخول مع تحذير",
            "تم تسجيل دخولك ولكن قد تكون هناك مشكلة في الوصول إلى بياناتك."
          ));
        }
      }
      
      // التوجيه بعد تسجيل الدخول
      setTimeout(() => {
        if (redirectPath) {
          navigate(redirectPath);
        } else {
          navigate("/");
        }
      }, 1000);
      
    } catch (err: any) {
      console.error("خطأ في تسجيل الدخول:", err);
      
      // رسائل خطأ مخصصة أكثر وضوحاً للمستخدم مع نصائح للمساعدة
      const errorMessages: Record<string, string> = {
        'auth/invalid-credential': "البريد الإلكتروني أو كلمة المرور غير صحيحة. الرجاء التحقق وإعادة المحاولة.",
        'auth/invalid-email': "يرجى إدخال بريد إلكتروني صالح.",
        'auth/user-not-found': "لم يتم العثور على حساب بهذا البريد الإلكتروني. هل ترغب في إنشاء حساب جديد؟",
        'auth/wrong-password': "كلمة المرور غير صحيحة. الرجاء التحقق منها والمحاولة مرة أخرى.",
        'auth/too-many-requests': "تم إجراء عدة محاولات خاطئة. الرجاء المحاولة بعد قليل أو استخدام خيار 'نسيت كلمة المرور'.",
        'auth/network-request-failed': "يبدو أن هناك مشكلة في الاتصال بالإنترنت. الرجاء التحقق من اتصالك والمحاولة مرة أخرى.",
        'auth/email-already-in-use': "هذا البريد الإلكتروني مستخدم بالفعل. الرجاء تسجيل الدخول أو استخدام بريد إلكتروني آخر.",
        'auth/weak-password': "كلمة المرور ضعيفة جدًا. الرجاء استخدام كلمة مرور أقوى تحتوي على 8 أحرف على الأقل.",
        'auth/operation-not-allowed': "تسجيل الدخول بهذه الطريقة غير مسموح به حاليًا. الرجاء التواصل مع الدعم الفني.",
        'auth/account-exists-with-different-credential': "يوجد حساب بهذا البريد الإلكتروني ولكن باستخدام طريقة تسجيل دخول مختلفة. حاول تسجيل الدخول بطريقة أخرى.",
        'auth/popup-closed-by-user': "تم إغلاق نافذة تسجيل الدخول قبل اكتمال العملية. الرجاء المحاولة مرة أخرى."
      };
      
      // عرض رسالة الخطأ المناسبة أو رسالة عامة إذا كان الخطأ غير معروف
      setError(errorMessages[err.code] || err.message || "حدث خطأ أثناء تسجيل الدخول، الرجاء المحاولة مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError("");
    setGuestLoading(true);
    
    if (!auth) {
      setError("تسجيل الدخول كزائر غير متاح حالياً. الرجاء المحاولة لاحقاً.");
      console.error("خدمة المصادقة غير متوفرة: لم يتم تهيئة Firebase Auth");
      setGuestLoading(false);
      return;
    }
    
    // إذا كانت Firestore غير متاحة، سنستمر لكن مع رسالة تحذير للمستخدم
    if (!db) {
      console.warn("خدمة Firestore غير متاحة: سيتم تسجيل الدخول كزائر بدون تخزين البيانات");
      toast(getWarningToast(
        "تنبيه:",
        "سيتم تسجيل الدخول كزائر، لكن بعض الميزات قد لا تعمل بشكل كامل"
      ));
    }
    
    try {
      console.log("بدء تسجيل الدخول كزائر...");
      const res = await signInAnonymously(auth);
      
      // إنشاء ملف بيانات للمستخدم الزائر
      if (db) {
        try {
          const guestRef = doc(db, "users", res.user.uid);
          const guestSnap = await getDoc(guestRef);
          
          if (!guestSnap.exists()) {
            // إنشاء مستخدم زائر جديد
            const guestProfile = {
              uid: res.user.uid,
              email: null,
              name: 'زائر',
              role: "CUSTOMER", // دور افتراضي
              createdAt: new Date().toISOString(),
              photoURL: null,
              isGuest: true
            };
            
            console.log("إنشاء حساب زائر جديد في Firestore");
            
            try {
              await setDoc(guestRef, guestProfile);
              console.log("تم حفظ بيانات المستخدم الزائر بنجاح");
              toast(getSuccessToast(
                "تم تسجيل الدخول كزائر",
                "مرحباً بك في منصة StayX! يمكنك تصفح المنصة بدون إنشاء حساب."
              ));
            } catch (firestoreError) {
              console.error("فشل حفظ بيانات المستخدم الزائر:", firestoreError);
              toast(getWarningToast(
                "تم تسجيل الدخول كزائر مع تحذير",
                "تم تسجيل دخولك بنجاح ولكن قد تكون هناك مشكلة في حفظ بياناتك."
              ));
            }
          }
        } catch (error) {
          console.error("خطأ في التفاعل مع Firestore:", error);
        }
      }
      
      // التوجيه بعد تسجيل الدخول
      setTimeout(() => {
        if (redirectPath) {
          navigate(redirectPath);
        } else {
          navigate("/");
        }
      }, 1000);
      
    } catch (err: any) {
      console.error("خطأ في تسجيل الدخول كزائر:", err);
      
      if (err.code === 'auth/operation-not-allowed') {
        setError("تسجيل الدخول كزائر غير مُفعل في هذا التطبيق.");
      } else if (err.code === 'auth/network-request-failed') {
        setError("فشل في الاتصال بالشبكة. الرجاء التحقق من اتصالك بالإنترنت.");
      } else {
        setError(err.message || "حدث خطأ أثناء تسجيل الدخول. الرجاء المحاولة مرة أخرى.");
      }
    } finally {
      setGuestLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      // Check if the current domain is in the list of authorized domains we know are configured
      // الحصول على النطاق الحالي باستخدام window.location.host
      const currentDomain = window.location.host;
      
      // قائمة النطاقات المصرح بها مسبقًا
      const knownAuthorizedDomains = [
        'localhost',
        'staychill-3ed08.firebaseapp.com',
        'staychill-3ed08.web.app',
        'f383ffdf-c47a-4c1b-883b-f090e022af0c-00-3o45tueo3kkse.spock.replit.dev',
        'luxury-stays-mohamedabdela18.replit.app',
        // إضافة النطاق الحالي تلقائيًا إذا كان مختلفًا
        currentDomain
      ];
      
      const isDomainAuthorized = knownAuthorizedDomains.includes(currentDomain);
      
      if (!isDomainAuthorized) {
        // If domain is not in our known list, show the warning dialog
        setShowGoogleWarning(true);
        setGoogleLoading(false);
        return;
      }
      
      // If domain is authorized, try to sign in with Google
      console.log("محاولة تسجيل الدخول باستخدام Google...");
      
      // Use auth context login method instead of direct Firebase call
      // The auth context will handle the redirect path automatically
      await loginWithGoogle();
      
      // Handle successful login
      toast(getSuccessToast(
        "تم تسجيل الدخول بنجاح",
        "مرحباً بك في منصة StayX!"
      ));
      
      // Navigation will be handled in the auth context after successful login
      
    } catch (error: any) {
      console.error("فشل تسجيل الدخول باستخدام Google:", error);
      
      // تحسين معالجة أخطاء تسجيل الدخول بـ Google
      const googleErrorMessages: Record<string, { title: string, description: string }> = {
        'auth/unauthorized-domain': {
          title: "نطاق غير مصرح به",
          description: "النطاق الحالي غير مصرح به في إعدادات Firebase. سيتم فتح نافذة المساعدة."
        },
        'auth/popup-blocked': {
          title: "تم حظر النافذة المنبثقة",
          description: "يرجى السماح بالنوافذ المنبثقة في متصفحك ثم المحاولة مرة أخرى"
        },
        'auth/popup-closed-by-user': {
          title: "تم إغلاق النافذة",
          description: "تم إغلاق نافذة تسجيل الدخول قبل إكمال العملية. حاول مرة أخرى."
        },
        'auth/network-request-failed': {
          title: "مشكلة في الاتصال",
          description: "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى"
        },
        'auth/cancelled-popup-request': {
          title: "تم إلغاء الطلب",
          description: "تم إلغاء عملية تسجيل الدخول. يرجى المحاولة مرة أخرى."
        },
        'auth/account-exists-with-different-credential': {
          title: "الحساب موجود بطريقة تسجيل دخول مختلفة",
          description: "يوجد حساب بهذا البريد الإلكتروني مرتبط بطريقة تسجيل دخول أخرى. حاول تسجيل الدخول بالطريقة المناسبة."
        },
        'auth/user-disabled': {
          title: "الحساب معطل",
          description: "تم تعطيل هذا الحساب. يرجى التواصل مع فريق الدعم للمساعدة."
        },
        'auth/operation-not-allowed': {
          title: "تسجيل الدخول غير مسموح",
          description: "تسجيل الدخول باستخدام Google غير مفعل حاليًا. يرجى استخدام طريقة أخرى للتسجيل."
        },
        'auth/timeout': {
          title: "انتهت مهلة الاتصال",
          description: "استغرقت العملية وقتًا طويلاً. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى."
        }
      };
      
      if (error.code === 'auth/unauthorized-domain') {
        // في حالة النطاق غير المصرح به، نعرض واجهة المساعدة الخاصة
        setShowGoogleWarning(true);
      } else {
        // استخدام قائمة رسائل الخطأ المحسنة
        const errorInfo = googleErrorMessages[error.code] || {
          title: "خطأ في تسجيل الدخول",
          description: error.message || "حدث خطأ غير متوقع أثناء تسجيل الدخول باستخدام Google"
        };
        
        toast({
          title: errorInfo.title,
          description: errorInfo.description,
          variant: "destructive",
        });
      }
    } finally {
      setGoogleLoading(false);
    }
  };
  
  // تسجيل الدخول باستخدام Facebook
  const handleFacebookLogin = async () => {
    setFacebookLoading(true);
    try {
      console.log("محاولة تسجيل الدخول باستخدام Facebook...");
      
      // استخدام دالة الـ context للتسجيل بواسطة Facebook
      await loginWithFacebook(redirectPath || undefined);
      
      // التعامل مع نجاح تسجيل الدخول
      toast(getSuccessToast(
        "تم تسجيل الدخول بنجاح",
        "مرحباً بك في منصة StayX!"
      ));
      
      // ستتم معالجة التوجيه في سياق المصادقة بعد تسجيل الدخول بنجاح
      
    } catch (error: any) {
      console.error("فشل تسجيل الدخول باستخدام Facebook:", error);
      
      // رسائل الخطأ المحتملة لـ Facebook
      const facebookErrorMessages: Record<string, { title: string, description: string }> = {
        'auth/popup-blocked': {
          title: "تم حظر النافذة المنبثقة",
          description: "يرجى السماح بالنوافذ المنبثقة في متصفحك ثم المحاولة مرة أخرى"
        },
        'auth/popup-closed-by-user': {
          title: "تم إغلاق النافذة",
          description: "تم إغلاق نافذة تسجيل الدخول قبل إكمال العملية. حاول مرة أخرى."
        },
        'auth/network-request-failed': {
          title: "مشكلة في الاتصال",
          description: "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى"
        },
        'auth/account-exists-with-different-credential': {
          title: "الحساب موجود بطريقة تسجيل دخول مختلفة",
          description: "يوجد حساب بهذا البريد الإلكتروني مرتبط بطريقة تسجيل دخول أخرى. حاول تسجيل الدخول بالطريقة المناسبة."
        },
        'auth/operation-not-allowed': {
          title: "تسجيل الدخول غير مسموح",
          description: "تسجيل الدخول باستخدام Facebook غير مفعل حاليًا. يرجى استخدام طريقة أخرى للتسجيل."
        }
      };
      
      // استخدام قائمة رسائل الخطأ المحسنة
      const errorInfo = facebookErrorMessages[error.code] || {
        title: "خطأ في تسجيل الدخول",
        description: error.message || "حدث خطأ غير متوقع أثناء تسجيل الدخول باستخدام Facebook"
      };
      
      toast({
        title: errorInfo.title,
        description: errorInfo.description,
        variant: "destructive",
      });
    } finally {
      setFacebookLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-0">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
        
        {/* Subtle Grid Lines */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: 'linear-gradient(to right, rgba(57, 255, 20, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(57, 255, 20, 0.2) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}></div>
        </div>
      </div>
      
      {/* Floating Neon Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[15%] right-[10%] w-32 h-32 rounded-full bg-[#39FF14]/10 blur-xl animate-neon-pulse"></div>
        <div className="absolute bottom-[20%] left-[15%] w-48 h-48 rounded-full bg-[#39FF14]/5 blur-xl animate-neon-pulse"></div>
        <div className="absolute top-[40%] left-[5%] w-24 h-24 rounded-full bg-[#39FF14]/10 blur-xl animate-neon-pulse"></div>
      </div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md px-4 sm:px-0">
        <div className="backdrop-blur-md bg-black/50 p-5 sm:p-8 rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.3)] border border-[#39FF14]/20 relative overflow-hidden">
          {/* Background glow effect */}
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-[#39FF14]/20 rounded-full blur-[80px] opacity-70"></div>
          
          {/* Logo */}
          <div className="text-center mb-8 relative">
            <h1 className="inline-block text-[40px] font-black relative mb-2">
              <span className="text-[#39FF14] animate-neon-pulse" 
                    style={{ textShadow: "0 0 5px rgba(57, 255, 20, 0.7), 0 0 10px rgba(57, 255, 20, 0.5)" }}>
                Stay
              </span>
              <span className="text-white">X</span>
            </h1>
            <p className="text-lg text-gray-300">مرحباً بعودتك 👋</p>
          </div>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-md mb-6 text-sm relative">
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
          
          {/* عرض رسالة إعادة التوجيه إذا كانت موجودة */}
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
                  className="w-full p-3 rounded-lg bg-black/60 border border-gray-700 text-white focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14]/50 transition-all" 
                  required
                  autoComplete="email"
                />
                <div className="absolute inset-0 rounded-lg transition-opacity opacity-0 group-focus-within:opacity-100 pointer-events-none" 
                     style={{ boxShadow: "0 0 8px rgba(57, 255, 20, 0.3)" }}></div>
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-400 mb-1.5 transition group-focus-within:text-[#39FF14]">كلمة المرور</label>
              <div className="relative">
                <input 
                  id="password-input"
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full p-3 rounded-lg bg-black/60 border border-gray-700 text-white focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14]/50 transition-all" 
                  required
                  autoComplete="current-password"
                  minLength={6}
                />
                <div className="absolute inset-0 rounded-lg transition-opacity opacity-0 group-focus-within:opacity-100 pointer-events-none" 
                     style={{ boxShadow: "0 0 8px rgba(57, 255, 20, 0.3)" }}></div>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="relative group w-full"
              disabled={loading}
            >
              <div className="relative z-10 bg-[#39FF14] text-black font-bold py-3 rounded-lg w-full text-center transform transition-all active:scale-[0.98] hover:scale-[1.01]">
                {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                {loading && (
                  <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-[#39FF14] blur-sm opacity-50 group-hover:opacity-70 rounded-lg transition-opacity"></div>
            </button>

            <div className="my-4 flex items-center">
              <div className="flex-1 border-t border-gray-700/50"></div>
              <span className="px-4 text-sm text-gray-500">أو</span>
              <div className="flex-1 border-t border-gray-700/50"></div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin} 
              className="relative flex items-center justify-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm text-white font-medium py-3 px-4 rounded-lg w-full hover:bg-white/10 transition-all active:scale-[0.98]"
              disabled={googleLoading}
            >
              {googleLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <span>جاري تسجيل الدخول</span>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <>
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>تسجيل الدخول بواسطة Google</span>
                </>
              )}
            </button>

            <button 
              type="button"
              onClick={handleGuestLogin} 
              className="relative group flex items-center justify-center gap-2 bg-transparent border border-[#39FF14]/30 backdrop-blur-sm text-white font-medium py-3 px-4 rounded-lg w-full hover:bg-[#39FF14]/10 transition-all active:scale-[0.98]"
              disabled={guestLoading}
            >
              {guestLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <span>جاري تسجيل الدخول</span>
                  <div className="animate-spin h-5 w-5 border-2 border-[#39FF14] border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <span>الدخول كزائر</span>
              )}
              <div className="absolute inset-0 bg-[#39FF14]/5 blur-sm opacity-0 group-hover:opacity-70 rounded-lg transition-opacity"></div>
            </button>

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
                    
                    // Ensure auth is not null before calling sendPasswordResetEmail
                    if (auth) {
                      sendPasswordResetEmail(auth, email)
                        .then(() => {
                          toast(getSuccessToast(
                            "تم إرسال رابط إعادة تعيين كلمة المرور",
                            "تفقد بريدك الإلكتروني واتبع التعليمات لإعادة تعيين كلمة المرور"
                          ));
                        })
                      .catch((error) => {
                        if (error.code === 'auth/user-not-found') {
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
                    } else {
                      // Handle case where auth is null
                      toast({
                        title: "خدمة المصادقة غير متوفرة",
                        description: "لا يمكن إعادة تعيين كلمة المرور حاليًا، الرجاء المحاولة لاحقًا",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  إعادة تعيين كلمة المرور
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Google Login Warning Dialog */}
      <Dialog open={showGoogleWarning} onOpenChange={setShowGoogleWarning}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white p-0 overflow-hidden">
          <GoogleLoginWarning />
        </DialogContent>
      </Dialog>
    </div>
  );
}