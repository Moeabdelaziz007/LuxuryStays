import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { useLocation } from "wouter";
import { auth, db, safeDoc } from "@/lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, getDocs, collection, query, where } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

// Simple login page without advanced form components
export default function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
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
  
  // استخراج مسار إعادة التوجيه من معلمات URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const redirect = searchParams.get('redirect');
    
    if (redirect) {
      setRedirectPath(redirect);
      
      // عرض رسالة للمستخدم
      toast(getWarningToast(
        "تحتاج إلى تسجيل الدخول ⚠️",
        "يرجى تسجيل الدخول للوصول إلى الصفحة المطلوبة"
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      console.log("جاري تسجيل الدخول باستخدام Firebase:", emailOrUsername);
      
      // التحقق من توفر Firebase
      if (!auth || !db) {
        throw new Error("خدمة المصادقة غير متوفرة حالياً، الرجاء المحاولة لاحقاً");
      }
      
      // التحقق مما إذا كان القيمة المدخلة هي بريد إلكتروني أو اسم مستخدم
      const isEmail = emailOrUsername.includes('@');
      
      if (isEmail) {
        // إذا كان بريد إلكتروني، استخدم تسجيل الدخول المباشر
        await signInWithEmailAndPassword(auth, emailOrUsername, password);
      } else {
        // إذا كان اسم مستخدم، ابحث عن المستخدم في Firestore أولاً
        try {
          // البحث عن المستخدم بواسطة اسم المستخدم
          // هذا يفترض وجود مجموعة "users" تحتوي على وثائق المستخدمين مع حقل "username"
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("username", "==", emailOrUsername));
          const querySnapshot = await getDocs(q);
          
          if (querySnapshot.empty) {
            throw { code: 'auth/user-not-found', message: 'لم يتم العثور على المستخدم' };
          }
          
          // استخدام البريد الإلكتروني المخزن لتسجيل الدخول
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          
          if (!userData.email) {
            throw { code: 'auth/invalid-user-data', message: 'بيانات المستخدم غير مكتملة' };
          }
          
          await signInWithEmailAndPassword(auth, userData.email, password);
        } catch (firestoreErr) {
          console.error("خطأ في البحث عن المستخدم:", firestoreErr);
          // إذا فشل البحث في Firestore، نحاول التسجيل بالطريقة العادية عن طريق البريد الإلكتروني
          try {
            await signInWithEmailAndPassword(auth, emailOrUsername, password);
          } catch (authErr) {
            // إذا فشل كلا الطريقتين، نعرض خطأ للمستخدم
            throw authErr;
          }
        }
      }
      
      // ستتم عملية التوجيه من خلال مراقب حالة المصادقة في AuthContext
      // دعنا نعطي بعض الوقت للمعالجة قبل إظهار رسالة خطأ إذا لم يتم التوجيه
      const redirectTimeout = setTimeout(() => {
        if (loading) {
          console.warn("لم يتم التوجيه بعد تسجيل الدخول بنجاح، قد تكون هناك مشكلة في قاعدة البيانات");
          setError("تم تسجيل الدخول بنجاح ولكن هناك مشكلة في استرجاع بيانات المستخدم");
          setLoading(false);
        }
      }, 5000);
      
      // سنقوم بتنظيف المؤقت إذا تم الانتقال للصفحة التالية
      return () => clearTimeout(redirectTimeout);
    } catch (err: any) {
      console.error("خطأ في تسجيل الدخول:", err);
      
      // رسائل خطأ مخصصة أكثر وضوحاً للمستخدم
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-email' || err.code === 'auth/user-not-found') {
        setError("اسم المستخدم/البريد الإلكتروني أو كلمة المرور غير صحيحة");
      } else if (err.code === 'auth/wrong-password') {
        setError("كلمة المرور غير صحيحة، الرجاء التحقق منها والمحاولة مرة أخرى");
      } else if (err.code === 'auth/too-many-requests') {
        setError("تم إجراء عدة محاولات خاطئة، الرجاء المحاولة بعد قليل");
      } else if (err.code === 'auth/network-request-failed') {
        setError("يبدو أن هناك مشكلة في الاتصال بالإنترنت، الرجاء التحقق من اتصالك");
      } else {
        setError(err.message || "حدث خطأ أثناء تسجيل الدخول، الرجاء المحاولة مرة أخرى");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    
    if (!auth || !db) {
      setError("تسجيل الدخول عبر Google غير متاح حالياً. الرجاء استخدام البريد الإلكتروني وكلمة المرور.");
      console.error("خدمة Google غير متوفرة: لم يتم تهيئة خدمات Firebase");
      setGoogleLoading(false);
      return;
    }
    
    const provider = new GoogleAuthProvider();
    // إضافة نطاقات إضافية للحصول على مزيد من المعلومات
    provider.addScope('profile');
    provider.addScope('email');
    
    try {
      console.log("بدء تسجيل الدخول باستخدام Google...");
      const res = await signInWithPopup(auth, provider);
      
      // التحقق من وجود المستخدم في Firestore ومحاولة حفظ البيانات بطريقة آمنة
      if (db) {
        try {
          const userRef = doc(db, "users", res.user.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            // إنشاء مستخدم جديد
            const userProfile = {
              uid: res.user.uid,
              email: res.user.email,
              name: res.user.displayName || 'مستخدم جديد',
              role: "CUSTOMER", // دور افتراضي
              createdAt: new Date().toISOString(),
              photoURL: res.user.photoURL || null,
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
            console.log("تسجيل دخول مستخدم موجود:", res.user.email);
            toast(getSuccessToast(
              "تم تسجيل الدخول بنجاح",
              `مرحباً بعودتك ${res.user.displayName || "عزيزي المستخدم"}!`
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
      
      // ستتم عملية التوجيه من خلال مراقب حالة المصادقة في AuthContext
      const redirectTimeout = setTimeout(() => {
        if (googleLoading) {
          console.warn("لم يتم التوجيه بعد تسجيل الدخول بنجاح، قد تكون هناك مشكلة في قاعدة البيانات");
          setError("تم تسجيل الدخول بنجاح ولكن هناك مشكلة في استرجاع بيانات المستخدم");
          setGoogleLoading(false);
        }
      }, 5000);
      
      // بعد تسجيل الدخول توجيه المستخدم للصفحة الرئيسية أو صفحة إعادة التوجيه بعد فترة زمنية
      setTimeout(() => {
        if (redirectPath) {
          setLocation(redirectPath); // الانتقال للصفحة التي كان يحاول الوصول إليها
        } else {
          setLocation("/"); // الانتقال للصفحة الرئيسية
        }
      }, 1000);
      
      return () => clearTimeout(redirectTimeout);
    } catch (err: any) {
      console.error("خطأ في تسجيل الدخول عبر Google:", err);
      
      if (err.code === 'auth/unauthorized-domain') {
        const domainOnly = window.location.host;
        console.error(`يرجى إضافة "${domainOnly}" (بدون https:// أو http://) إلى نطاقات Firebase المصرح بها`);
        console.error(`للإضافة، انتقل إلى لوحة تحكم Firebase > Authentication > Sign-in method > Authorized domains`);
        console.error(`يجب إضافة "${domainOnly}" فقط بدون بروتوكول`);
        
        // إخفاء زر جوجل وإظهار رسالة للمستخدم
        toast(getWarningToast(
          "تسجيل الدخول بحساب Google غير متاح",
          "هذه الميزة غير متاحة حالياً. الرجاء استخدام البريد الإلكتروني وكلمة المرور."
        ));
        
        // رسالة خطأ واضحة
        setError("نأسف، ميزة تسجيل الدخول بحساب Google غير متاحة حالياً. الرجاء استخدام البريد الإلكتروني وكلمة المرور بدلاً من ذلك.");
        
        // التركيز على حقل البريد الإلكتروني لتحسين تجربة المستخدم
        setTimeout(() => {
          const emailInput = document.querySelector('input[type="text"]') as HTMLInputElement;
          if (emailInput) {
            emailInput.focus();
          }
        }, 800);
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError("تم إغلاق نافذة تسجيل الدخول. الرجاء المحاولة مرة أخرى.");
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError("تم إلغاء طلب النافذة المنبثقة. الرجاء المحاولة مرة أخرى.");
      } else if (err.code === 'auth/popup-blocked') {
        setError("تم حظر النافذة المنبثقة. الرجاء السماح بالنوافذ المنبثقة والمحاولة مرة أخرى.");
      } else if (err.code === 'auth/network-request-failed') {
        setError("فشل في الاتصال بالشبكة. الرجاء التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
      } else {
        setError(err.message || "فشل تسجيل الدخول باستخدام Google، الرجاء المحاولة مرة أخرى.");
      }
    } finally {
      setGoogleLoading(false);
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
      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-md bg-black/50 p-8 rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.3)] border border-[#39FF14]/20 relative overflow-hidden">
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
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-md mb-6 text-sm animate-pulse">
              {error}
            </div>
          )}
          
          {/* عرض رسالة إعادة التوجيه إذا كانت موجودة */}
          {renderRedirectMessage()}
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="group">
              <label className="block text-sm font-medium text-gray-400 mb-1.5 transition group-focus-within:text-[#39FF14]">البريد الإلكتروني أو اسم المستخدم</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="أدخل بريدك الإلكتروني أو اسم المستخدم" 
                  className="w-full p-3 rounded-lg bg-black/60 border border-gray-700 text-white focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14]/50 transition-all" 
                  value={emailOrUsername} 
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  required
                  autoComplete="username email"
                />
                <div className="absolute inset-0 rounded-lg transition-opacity opacity-0 group-focus-within:opacity-100 pointer-events-none" 
                     style={{ boxShadow: "0 0 8px rgba(57, 255, 20, 0.3)" }}></div>
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-400 mb-1.5 transition group-focus-within:text-[#39FF14]">كلمة المرور</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full p-3 rounded-lg bg-black/60 border border-gray-700 text-white focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14]/50 transition-all" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
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
              <div className="relative z-10 bg-[#39FF14] text-black font-bold py-3 rounded-lg w-full text-center transform group-hover:scale-[1.01] transition-transform">
                {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </div>
              <div className="absolute inset-0 bg-[#39FF14] blur-sm opacity-50 group-hover:opacity-70 rounded-lg transition-opacity"></div>
            </button>
          </form>

          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-700/50"></div>
            <span className="px-4 text-sm text-gray-500">أو</span>
            <div className="flex-1 border-t border-gray-700/50"></div>
          </div>

          <button 
            onClick={handleGoogleLogin} 
            className="relative flex items-center justify-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm text-white font-medium py-3 px-4 rounded-lg w-full hover:bg-white/10 transition-colors"
            disabled={googleLoading}
          >
            {googleLoading ? (
              <span className="animate-pulse">جاري تسجيل الدخول...</span>
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
                <span>دخول باستخدام Google</span>
              </>
            )}
          </button>

          <p className="text-sm mt-6 text-center text-gray-400">
            ليس لديك حساب؟{" "}
            <Link to="/signup" className="text-[#39FF14] hover:text-white transition-colors">
              سجل الآن
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}