import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { signInAnonymously, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth as firebaseAuth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface GuestLoginButtonProps {
  onSuccess?: () => void;
  onError?: (error: any) => void;
  className?: string;
  redirectPath?: string;
}

export default function GuestLoginButton({ 
  onSuccess, 
  onError, 
  className,
  redirectPath 
}: GuestLoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const auth = firebaseAuth;

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      if (!auth) {
        throw new Error("خدمات Firebase غير متوفرة");
      }
      
      // حفظ مسار إعادة التوجيه إذا كان موجودًا
      if (redirectPath) {
        localStorage.setItem('guestAuthRedirectPath', redirectPath);
      }
      
      // استخدام المصادقة المجهولة
      console.log("محاولة تسجيل الدخول كضيف...");
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
        console.log("تم حفظ معلومات المستخدم الضيف في Firestore بنجاح");
      }
      
      console.log("✅ تم تسجيل الدخول كضيف بنجاح!");
      
      toast({
        title: "تم تسجيل الدخول كضيف",
        description: "تم تسجيل دخولك كضيف بنجاح. يمكنك تحويل حسابك إلى حساب دائم في أي وقت.",
        variant: "default",
        className: "bg-gradient-to-r from-amber-900/80 to-amber-800/80 border-amber-600/50 text-white",
      });
      
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      console.error("خطأ في تسجيل الدخول كضيف:", error);
      
      toast({
        title: "فشل تسجيل الدخول",
        description: error.message || "حدث خطأ أثناء محاولة تسجيل الدخول كضيف. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
      
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleGuestLogin}
      disabled={loading}
      className={`relative group ${className || ''}`}
    >
      <div className="relative z-10 bg-gradient-to-r from-black to-gray-900 hover:from-gray-900 hover:to-black text-gray-300 font-medium py-4 rounded-lg w-full text-center flex items-center justify-center gap-3 transition-all border border-gray-800 hover:border-[#39FF14]/30 overflow-hidden group-hover:shadow-[0_0_10px_rgba(57,255,20,0.2)]">
        <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_25%,rgba(57,255,20,0.05)_50%,transparent_75%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-x-[-100%] group-hover:translate-x-[100%]"></div>
        {loading ? (
          <Loader2 className="h-5 w-5 mr-2 animate-spin text-[#39FF14]" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        )}
        <span>
          {loading ? 'جاري تسجيل الدخول...' : 'الدخول كضيف'}
        </span>
      </div>
      
      {/* Subtle border on hover */}
      <div className="absolute inset-0 rounded-lg bg-transparent border border-transparent group-hover:border-gray-700 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
    </button>
  );
}