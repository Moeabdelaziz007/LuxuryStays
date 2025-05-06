import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, updateProfile, signInWithRedirect } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// صفحة التسجيل للمستخدمين الجدد
export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Helper functions for toast styling
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // التحقق من صحة الاسم
      if (!name || name.length < 3) {
        throw new Error("يجب أن يكون الاسم 3 أحرف على الأقل");
      }
      
      // التحقق من صحة اسم المستخدم
      if (!username || username.length < 3) {
        throw new Error("يجب أن يكون اسم المستخدم 3 أحرف على الأقل");
      }
      
      // التحقق من صحة كلمة المرور
      if (password.length < 6) {
        throw new Error("يجب أن تكون كلمة المرور 6 أحرف على الأقل");
      }
      
      if (!auth || !db) {
        throw new Error("خدمة المصادقة غير متوفرة حالياً، الرجاء المحاولة لاحقاً");
      }
      
      // التسجيل مباشرة باستخدام Firebase
      try {
        // إنشاء المستخدم في Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // تحديث الملف الشخصي للمستخدم
        await updateProfile(user, {
          displayName: name
        });
        
        // حفظ معلومات المستخدم في Firestore
        const userData = {
          uid: user.uid,
          email: email,
          name: name,
          username: username, // إضافة اسم المستخدم
          role: 'CUSTOMER', // دور افتراضي للمستخدمين الجدد
          createdAt: new Date().toISOString(),
          photoURL: user.photoURL || null,
        };
        
        // حفظ في Firestore
        await setDoc(doc(db, "users", user.uid), userData);
        
        console.log("تم حفظ بيانات المستخدم في Firestore:", userData);
        
        // عرض رسالة نجاح
        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "سيتم توجيهك للصفحة الرئيسية...",
        });
        
        // مباشرة توجيه المستخدم للصفحة الرئيسية بعد التسجيل، دون تسجيل الخروج
        setTimeout(() => {
          setLocation('/');
        }, 1500);
      } catch (authError: any) {
        console.error("خطأ في إنشاء المستخدم في Firebase Auth:", authError);
        throw authError;
      }
    } catch (err: any) {
      console.error("خطأ في التسجيل:", err);
      
      // عرض رسائل الخطأ المناسبة بناءً على نوع الخطأ
      if (err.code === 'auth/email-already-in-use') {
        setError("البريد الإلكتروني مستخدم بالفعل");
      } else if (err.code === 'auth/weak-password') {
        setError("كلمة المرور ضعيفة جداً، يجب أن تحتوي على 6 أحرف على الأقل");
      } else if (err.code === 'auth/invalid-email') {
        setError("البريد الإلكتروني غير صالح");
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("فشل إنشاء الحساب، يرجى المحاولة مرة أخرى");
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignup = async () => {
    setError("");
    setGoogleLoading(true);
    
    // التحقق من توفر خدمة Firebase
    if (!auth || !db) {
      setError("تسجيل الدخول عبر Google غير متاح حالياً. الرجاء استخدام البريد الإلكتروني وكلمة المرور.");
      console.error("خدمة Google غير متوفرة: لم يتم تهيئة خدمات Firebase");
      setGoogleLoading(false);
      return;
    }
    
    const provider = new GoogleAuthProvider();
    
    // تحسين الخبرة بإضافة الإعدادات المناسبة
    const customParams: { [key: string]: string } = {
      // طلب اختيار الحساب دائماً لتجنب التسجيل التلقائي بحساب خاطئ
      prompt: 'select_account'
    };
    
    // تحديد لغة الواجهة إلى العربية إذا كان المستخدم يستخدم واجهة عربية
    if (window.navigator.language.includes('ar')) {
      customParams.login_hint = 'ar';
    }
    
    provider.setCustomParameters(customParams);
    
    // إضافة نطاقات لجلب معلومات إضافية
    provider.addScope('profile');
    provider.addScope('email');
    
    try {
      console.log("بدء تسجيل الدخول باستخدام Google...");
      
      // استخدام طريقة إعادة التوجيه إذا فشلت النافذة المنبثقة في المرة الأولى
      let res;
      try {
        // محاولة استخدام النافذة المنبثقة أولاً (أفضل تجربة مستخدم)
        res = await signInWithPopup(auth, provider);
      } catch (popupError: any) {
        // التعامل مع أخطاء محددة لتحديد ما إذا كان يجب استخدام طريقة إعادة التوجيه
        if (['auth/popup-blocked', 'auth/popup-closed-by-user', 'auth/cancelled-popup-request'].includes(popupError.code)) {
          console.log("فشلت طريقة النافذة المنبثقة، جاري المحاولة بطريقة إعادة التوجيه...");
          setError("جاري فتح صفحة Google للمصادقة... الرجاء الانتظار...");
          
          try {
            // محاولة استخدام طريقة إعادة التوجيه بدلاً من النافذة المنبثقة
            await signInWithRedirect(auth, provider);
            // هذا الكود لن يتم تنفيذه مباشرة لأن إعادة التوجيه سيقطع تنفيذ البرنامج
            return;
          } catch (redirectError: any) {
            console.error("فشلت محاولة إعادة التوجيه:", redirectError);
            // إعادة إلقاء خطأ إعادة التوجيه للتعامل معه في جزء التعامل مع الأخطاء
            throw redirectError;
          }
        } else if (popupError.code === 'auth/unauthorized-domain') {
          // معالجة خاصة لخطأ النطاق غير المصرح به
          const domainOnly = window.location.host;
          console.error(`يرجى إضافة "${domainOnly}" (بدون https:// أو http://) إلى نطاقات Firebase المصرح بها`);
          console.error(`للإضافة، انتقل إلى لوحة تحكم Firebase > Authentication > Sign-in method > Authorized domains`);
          console.error(`يجب إضافة "${domainOnly}" فقط بدون بروتوكول`);
          
          // تقديم رسالة مفصلة للمستخدم
          toast(getWarningToast(
            "خطأ في نطاق المصادقة",
            "تم تعطيل تسجيل الدخول بحساب Google مؤقتًا. سنقوم بتسجيل دخولك باستخدام البريد الإلكتروني وكلمة المرور."
          ));
          
          setError(`يبدو أن هناك مشكلة في إعدادات المصادقة. الرجاء استخدام طريقة البريد الإلكتروني وكلمة المرور للتسجيل.`);
          setGoogleLoading(false);
          return;
        } else {
          // إعادة إلقاء الأخطاء الأخرى
          throw popupError;
        }
      }
      
      if (!res || !res.user) {
        throw new Error("لم يتم استلام بيانات المستخدم من Google");
      }
      
      // التحقق من وجود المستخدم في Firestore
      const userRef = doc(db, "users", res.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // إنشاء اسم مستخدم فريد بناءً على البريد الإلكتروني أو الاسم
        let autoUsername = '';
        
        if (res.user.email) {
          // استخراج الجزء قبل علامة @ من البريد الإلكتروني
          autoUsername = res.user.email.split('@')[0];
        } else if (res.user.displayName) {
          // استخدام الاسم كأساس إذا لم يكن هناك بريد إلكتروني
          // إزالة المسافات والحروف الخاصة
          autoUsername = res.user.displayName.toLowerCase().replace(/[^a-z0-9]/gi, '');
        } else {
          // إذا لم يكن هناك بريد إلكتروني أو اسم، استخدم اسم عشوائي
          autoUsername = 'user';
        }
        
        // إضافة مزيج من الحروف والأرقام العشوائية لضمان التفرد
        const randomSuffix = Math.random().toString(36).substring(2, 6);
        autoUsername += randomSuffix;
        
        // إنشاء مستخدم جديد بمعلومات كاملة
        const userProfile = {
          uid: res.user.uid,
          email: res.user.email,
          name: res.user.displayName || 'مستخدم جديد',
          username: autoUsername, // اسم المستخدم الفريد
          role: "CUSTOMER", // دور افتراضي
          createdAt: new Date().toISOString(),
          photoURL: res.user.photoURL || null,
          // بيانات إضافية تساعد في تحسين تجربة المستخدم
          lastLogin: new Date().toISOString(),
          provider: 'google',
          emailVerified: res.user.emailVerified,
        };
        
        // حفظ بيانات المستخدم في Firestore
        try {
          await setDoc(userRef, userProfile);
          console.log("تم حفظ بيانات المستخدم بنجاح في Firestore:", userProfile);
          
          // عرض إشعار للمستخدم مع اسم المستخدم الجديد
          toast(getSuccessToast(
            "تم إنشاء الحساب بنجاح ✅", 
            `مرحباً بك في StayX! اسم المستخدم الخاص بك هو: ${autoUsername}`
          ));
          
          // توجيه المستخدم بعد التسجيل بنجاح
          setTimeout(() => {
            setLocation("/"); // الانتقال للصفحة الرئيسية
          }, 1500);
        } catch (firestoreError) {
          console.error("حدث خطأ أثناء حفظ بيانات المستخدم:", firestoreError);
          setError("تم التسجيل بنجاح ولكن حدث خطأ في حفظ بياناتك. سيتم توجيهك للصفحة الرئيسية.");
          
          // رغم الخطأ، نوجه المستخدم للصفحة الرئيسية بعد فترة قصيرة
          setTimeout(() => {
            setLocation("/");
          }, 3000);
        }
      } else {
        // المستخدم موجود بالفعل - تحديث بيانات آخر تسجيل دخول
        const userData = userSnap.data();
        
        try {
          // تحديث تاريخ آخر تسجيل دخول
          await updateDoc(userRef, { 
            lastLogin: new Date().toISOString(),
            // تحديث الصورة الشخصية إذا تغيرت
            photoURL: res.user.photoURL || userData.photoURL
          });
          
          // عرض رسالة ترحيب للمستخدم العائد
          toast(getSuccessToast(
            "تم تسجيل الدخول بنجاح ✅", 
            `مرحباً بعودتك ${userData.name || 'مستخدم StayX'}!`
          ));
          
          // توجيه المستخدم بعد تسجيل الدخول بنجاح
          setTimeout(() => {
            setLocation("/"); // الانتقال للصفحة الرئيسية
          }, 1500);
        } catch (updateError) {
          console.warn("لم يتم تحديث بيانات آخر تسجيل دخول:", updateError);
          
          // رغم خطأ التحديث، نقوم بتسجيل دخول المستخدم وتوجيهه
          toast(getSuccessToast(
            "تم تسجيل الدخول بنجاح ✅", 
            `مرحباً بعودتك ${userData.name || 'مستخدم StayX'}!`
          ));
          
          setTimeout(() => {
            setLocation("/");
          }, 1500);
        }
      }
    } catch (err: any) {
      console.error("خطأ في تسجيل الدخول عبر Google:", err);
      
      // تحسين عرض رسائل الخطأ للمستخدم
      if (err.code === 'auth/unauthorized-domain') {
        setError("نأسف، هذا النطاق غير مسموح به للمصادقة عبر Google. الرجاء استخدام البريد الإلكتروني وكلمة المرور بدلاً من ذلك.");
        console.error(`يرجى إضافة ${window.location.origin} إلى نطاقات Firebase المصرح بها في لوحة تحكم Firebase`);
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError("تم إغلاق نافذة تسجيل الدخول. الرجاء المحاولة مرة أخرى.");
      } else if (err.code === 'auth/cancelled-popup-request') {
        // هذا خطأ عادي عند إلغاء الطلب، لا نحتاج لعرضه للمستخدم
      } else if (err.code === 'auth/popup-blocked') {
        setError("تم حظر النافذة المنبثقة. الرجاء السماح بالنوافذ المنبثقة والمحاولة مرة أخرى أو استخدم طريقة تسجيل الدخول بالبريد الإلكتروني.");
      } else if (err.code === 'auth/network-request-failed') {
        setError("فشل في الاتصال بالشبكة. الرجاء التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError("هناك حساب موجود بالفعل بنفس البريد الإلكتروني ولكن بطريقة تسجيل دخول مختلفة. حاول تسجيل الدخول بطريقة أخرى.");
      } else if (err.code === 'auth/user-disabled') {
        setError("تم تعطيل هذا الحساب. الرجاء التواصل مع الدعم الفني.");
      } else if (err.code === 'auth/user-token-expired') {
        setError("انتهت صلاحية جلستك. الرجاء تسجيل الدخول مرة أخرى.");
      } else if (err.code === 'auth/web-storage-unsupported') {
        setError("متصفحك لا يدعم تخزين الجلسات. الرجاء تمكين ملفات تعريف الارتباط أو استخدام متصفح آخر.");
      } else {
        // رسالة عامة للأخطاء غير المعروفة
        setError(err.message || "حدث خطأ غير متوقع أثناء تسجيل الدخول باستخدام Google. الرجاء المحاولة لاحقاً أو استخدام طريقة أخرى للتسجيل.");
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
        <div className="absolute top-[15%] right-[15%] w-32 h-32 rounded-full bg-[#39FF14]/10 blur-xl animate-neon-pulse"></div>
        <div className="absolute bottom-[15%] left-[10%] w-48 h-48 rounded-full bg-[#39FF14]/5 blur-xl animate-neon-pulse"></div>
        <div className="absolute top-[40%] left-[5%] w-24 h-24 rounded-full bg-[#39FF14]/10 blur-xl animate-neon-pulse"></div>
      </div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md px-4 sm:px-0">
        <div className="backdrop-blur-md bg-black/50 p-5 sm:p-8 rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.3)] border border-[#39FF14]/20 relative overflow-hidden">
          {/* Background glow effect */}
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-[#39FF14]/20 rounded-full blur-[80px] opacity-70"></div>
          
          {/* Logo */}
          <div className="text-center mb-6 relative">
            <h1 className="inline-block text-[40px] font-black relative mb-2">
              <span className="text-[#39FF14] animate-neon-pulse" 
                    style={{ textShadow: "0 0 5px rgba(57, 255, 20, 0.7), 0 0 10px rgba(57, 255, 20, 0.5)" }}>
                Stay
              </span>
              <span className="text-white">X</span>
            </h1>
            <p className="text-lg text-gray-300">انضم إلينا اليوم ✨</p>
          </div>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-md mb-6 text-sm animate-pulse">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="group">
              <label className="block text-sm font-medium text-gray-400 mb-1.5 transition group-focus-within:text-[#39FF14]">الاسم الكامل</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="أدخل اسمك الكامل" 
                  className="w-full p-3 rounded-lg bg-black/60 border border-gray-700 text-white focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14]/50 transition-all" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  minLength={3}
                />
                <div className="absolute inset-0 rounded-lg transition-opacity opacity-0 group-focus-within:opacity-100 pointer-events-none" 
                     style={{ boxShadow: "0 0 8px rgba(57, 255, 20, 0.3)" }}></div>
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-400 mb-1.5 transition group-focus-within:text-[#39FF14]">اسم المستخدم</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="أدخل اسم المستخدم الخاص بك" 
                  className="w-full p-3 rounded-lg bg-black/60 border border-gray-700 text-white focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14]/50 transition-all" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  minLength={3}
                />
                <div className="absolute inset-0 rounded-lg transition-opacity opacity-0 group-focus-within:opacity-100 pointer-events-none" 
                     style={{ boxShadow: "0 0 8px rgba(57, 255, 20, 0.3)" }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">سيتم استخدام اسم المستخدم هذا لتسجيل الدخول</p>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-400 mb-1.5 transition group-focus-within:text-[#39FF14]">البريد الإلكتروني</label>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="أدخل بريدك الإلكتروني" 
                  className="w-full p-3 rounded-lg bg-black/60 border border-gray-700 text-white focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14]/50 transition-all" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
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
                  type="password" 
                  placeholder="أدخل كلمة مرور قوية" 
                  className="w-full p-3 rounded-lg bg-black/60 border border-gray-700 text-white focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14]/50 transition-all" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  minLength={6}
                />
                <div className="absolute inset-0 rounded-lg transition-opacity opacity-0 group-focus-within:opacity-100 pointer-events-none" 
                     style={{ boxShadow: "0 0 8px rgba(57, 255, 20, 0.3)" }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">يجب أن تكون كلمة المرور 6 أحرف على الأقل</p>
            </div>
            
            <button 
              type="submit" 
              className="relative group w-full mt-6"
              disabled={loading}
            >
              <div className="relative z-10 bg-[#39FF14] text-black font-bold py-3 rounded-lg w-full text-center transform transition-all active:scale-[0.98] hover:scale-[1.01]">
                {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
                {loading && (
                  <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-[#39FF14] blur-sm opacity-50 group-hover:opacity-70 rounded-lg transition-opacity"></div>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              بالتسجيل، أنت توافق على <span className="text-[#39FF14]">شروط الخدمة</span> و <span className="text-[#39FF14]">سياسة الخصوصية</span>
            </p>
          </div>
          
          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700/30"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-black/50 px-4 text-sm text-gray-500 backdrop-blur-md">أو</span>
            </div>
          </div>
          
          <button 
            onClick={handleGoogleSignup} 
            className="relative flex items-center justify-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm text-white font-medium py-3 px-4 rounded-lg w-full hover:bg-white/10 transition-all active:scale-[0.98] mt-6"
            disabled={googleLoading}
          >
            {googleLoading ? (
              <div className="flex items-center justify-center gap-3">
                <span>جاري التسجيل</span>
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
                <span>التسجيل باستخدام Google</span>
              </>
            )}
          </button>
          
          <p className="text-sm mt-6 text-center text-gray-400">
            هل لديك حساب بالفعل؟{" "}
            <Link to="/login" className="text-[#39FF14] hover:text-white transition-colors">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}