import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously, 
  updateProfile, 
  Auth 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth as firebaseAuth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  onError?: (error: any) => void;
  className?: string;
  redirectPath?: string;
}

export default function GoogleLoginButton({ 
  onSuccess, 
  onError, 
  className,
  redirectPath 
}: GoogleLoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const auth = firebaseAuth;

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      if (!auth) {
        throw new Error("خدمات Firebase غير متوفرة");
      }
      
      // حفظ مسار إعادة التوجيه إذا كان موجودًا
      if (redirectPath) {
        localStorage.setItem('googleAuthRedirectPath', redirectPath);
      }
      
      // إنشاء مزود المصادقة لـ Google مع نطاقات الوصول المطلوبة
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      // تسجيل الدخول باستخدام النافذة المنبثقة
      console.log("محاولة تسجيل الدخول عبر Google باستخدام النافذة المنبثقة...");
      const result = await signInWithPopup(auth, provider);
      
      // الحصول على بيانات المستخدم من Google
      const user = result.user;
      console.log("✅ تم تسجيل الدخول بنجاح باستخدام Google:", user.displayName);
      
      // في حالة نجاح تسجيل الدخول، إضافة أو تحديث معلومات المستخدم في Firestore
      if (db) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userRef);
          
          if (!userSnapshot.exists()) {
            // المستخدم جديد، إنشاء وثيقة مستخدم في Firestore
            const userData = {
              uid: user.uid,
              email: user.email,
              name: user.displayName || 'مستخدم Google',
              role: "CUSTOMER", // الدور الافتراضي للمستخدمين الجدد
              createdAt: new Date().toISOString(),
              photoURL: user.photoURL,
              isGoogleAccount: true
            };
            
            await setDoc(userRef, userData);
            console.log("تم حفظ معلومات المستخدم في Firestore بنجاح");
          } else {
            // المستخدم موجود بالفعل، تحديث البيانات
            await setDoc(userRef, {
              email: user.email,
              name: user.displayName || userSnapshot.data().name,
              photoURL: user.photoURL,
              lastLogin: new Date().toISOString()
            }, { merge: true });
            console.log("تم تحديث معلومات المستخدم في Firestore");
          }
        } catch (firestoreError) {
          console.warn("تعذر حفظ معلومات المستخدم في Firestore:", firestoreError);
          // استمر حتى لو فشل Firestore
        }
      }
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً بك ${user.displayName || 'مستخدم Google'}!`,
        variant: "default",
        className: "bg-gradient-to-r from-green-900/80 to-green-800/80 border-green-600/50 text-white",
      });
      
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      console.error("خطأ في تسجيل الدخول باستخدام Google:", error);
      
      // معالجة خطأ النطاق غير المصرح به
      if (error.code === 'auth/unauthorized-domain') {
        console.error("النطاق غير مصرح به في Firebase:", window.location.hostname);
        toast({
          title: "مشكلة في مصادقة Google",
          description: "النطاق الحالي غير مصرح به في إعدادات Firebase. جاري تسجيل الدخول كضيف بدلاً من ذلك.",
          variant: "destructive",
        });
        
        // محاولة تسجيل الدخول كضيف بدلاً من ذلك
        try {
          if (!auth) return;
          
          const guestCred = await signInAnonymously(auth);
          
          // تحديث الملف الشخصي للضيف
          await updateProfile(guestCred.user, {
            displayName: "ضيف StayX",
            photoURL: "https://ui-avatars.com/api/?name=StayX&background=39FF14&color=000000"
          });
          
          // حفظ معلومات الضيف في Firestore
          if (db) {
            const guestData = {
              uid: guestCred.user.uid,
              email: null,
              name: "ضيف StayX",
              role: "CUSTOMER",
              createdAt: new Date().toISOString(),
              isGuestAccount: true
            };
            
            await setDoc(doc(db, "users", guestCred.user.uid), guestData);
          }
          
          toast({
            title: "تم تسجيل الدخول كضيف",
            description: "تم تسجيل دخولك كضيف بنجاح.",
            variant: "default",
            className: "bg-gradient-to-r from-amber-900/80 to-amber-800/80 border-amber-600/50 text-white",
          });
          
          if (onSuccess) onSuccess();
        } catch (guestError) {
          console.error("فشل تسجيل الدخول كضيف:", guestError);
          toast({
            title: "فشل تسجيل الدخول",
            description: "حدث خطأ أثناء محاولة تسجيل الدخول. الرجاء المحاولة مرة أخرى.",
            variant: "destructive",
          });
          
          if (onError) onError(error);
        }
      } else if (error.code === 'auth/popup-closed-by-user') {
        toast({
          title: "تم إغلاق نافذة تسجيل الدخول",
          description: "تم إغلاق نافذة تسجيل الدخول قبل إكمال العملية. الرجاء المحاولة مرة أخرى.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: error.message || "حدث خطأ أثناء محاولة تسجيل الدخول. الرجاء المحاولة مرة أخرى.",
          variant: "destructive",
        });
      }
      
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleGoogleLogin}
      disabled={loading}
      className={`relative group ${className || ''}`}
    >
      <div className="relative z-10 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-bold py-4 rounded-lg w-full text-center flex items-center justify-center gap-3 transition-all border border-gray-700 hover:border-[#39FF14]/50 overflow-hidden group-hover:shadow-[0_0_15px_rgba(57,255,20,0.3)]">
        <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_25%,rgba(57,255,20,0.1)_50%,transparent_75%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-x-[-100%] group-hover:translate-x-[100%]"></div>
        {loading ? (
          <Loader2 className="h-5 w-5 mr-2 animate-spin text-[#39FF14]" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
        )}
        <span>
          {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول باستخدام Google'}
        </span>
      </div>
      
      {/* Neon effect border on hover */}
      <div className="absolute inset-0 rounded-lg bg-transparent border border-transparent group-hover:border-[#39FF14]/20 group-hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
    </button>
  );
}