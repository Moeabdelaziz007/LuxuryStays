import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { onAuthStateChanged } from 'firebase/auth';
// استخدام الإعدادات الجديدة الموحدة
import { auth, login, loginAsGuest, handleRedirect } from '@/lib/firebase-client';

interface SimpleGoogleLoginProps {
  redirectPath?: string;
  className?: string;
  onLoginSuccess?: () => void;
  size?: 'default' | 'sm' | 'lg';
  showGuestOption?: boolean;
}

/**
 * مكون مبسط لتسجيل الدخول باستخدام Google
 * نسخة محسنة مع معالجة أفضل للأخطاء وتجربة أكثر سلاسة
 */
export default function SimpleGoogleLogin({
  redirectPath = '/customer',
  className = '',
  onLoginSuccess,
  size = 'default',
  showGuestOption = true
}: SimpleGoogleLoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState(false);
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  // Check for redirect result on mount
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await handleRedirect();
        if (result.success && result.user) {
          console.log("تم تسجيل الدخول بنجاح من خلال إعادة التوجيه:", result.user.displayName);
          handleSuccessfulLogin(result.user);
        }
      } catch (err) {
        console.error("فشل في معالجة نتيجة إعادة التوجيه:", err);
      }
    };

    checkRedirectResult();
    
    // Listen for auth state changes for more responsive UI
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !authSuccess) {
        handleSuccessfulLogin(user);
      }
    });
    
    return () => unsubscribe();
  }, []);

  const handleSuccessfulLogin = (user: any) => {
    setAuthSuccess(true);
    setAuthError(null);
    
    // تأخير قصير لعرض حالة النجاح قبل إعادة التوجيه
    setTimeout(() => {
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        // عرض رسالة نجاح
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: `مرحبًا ${user.displayName || "بكم"}!`,
          variant: "default"
        });
        
        // الانتقال إلى الصفحة المحددة
        setLocation(redirectPath);
      }
    }, 500);
  };

  const handleGoogleLogin = async () => {
    if (isLoading) return;
    setAuthError(null);
    
    try {
      setIsLoading(true);
      
      // استخدام وظيفة تسجيل الدخول المحسنة من مكتبة firebase-auth
      const result = await login();
      console.log("تم تسجيل الدخول بنجاح:", result.user.displayName);
      
      handleSuccessfulLogin(result.user);
    } catch (err: any) {
      console.error("خطأ في تسجيل الدخول باستخدام Google:", err);
      
      let errorMessage = "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.";
      
      if (err.message === "domain_unauthorized") {
        errorMessage = "هذا الموقع غير مصرح له للمصادقة. يرجى استخدام خيار الدخول كضيف بدلاً من ذلك.";
        setAuthError(errorMessage);
        
        // عرض رسالة توصية بتسجيل الدخول كضيف تلقائيًا
        toast({
          title: "تعذر تسجيل الدخول مع Google",
          description: "جرّب الدخول كضيف للوصول إلى التطبيق",
          variant: "default",
        });
      } else if (err.code === 'auth/popup-blocked') {
        errorMessage = "تم حظر النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة لهذا الموقع والمحاولة مرة أخرى.";
        setAuthError(errorMessage);
      } else if (err.code === 'auth/popup-closed-by-user') {
        // لا نعرض رسالة خطأ عند إغلاق المستخدم للنافذة
        setAuthError(null);
        setIsLoading(false);
        return;
      } else {
        setAuthError(errorMessage);
      }
      
      toast({
        title: "خطأ في تسجيل الدخول",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    if (isGuestLoading) return;
    setAuthError(null);
    
    try {
      setIsGuestLoading(true);
      
      // تسجيل الدخول كضيف باستخدام Firebase مع التعامل المحسن للأخطاء
      const result = await loginAsGuest();
      console.log("تم تسجيل الدخول كضيف بنجاح", result.user.uid);
      
      // معاملة خاصة للدخول كضيف - نعرض رسالة أخرى
      setAuthSuccess(true);
      
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        toast({
          title: "تم تسجيل الدخول كضيف بنجاح",
          description: "يمكنك الآن استكشاف التطبيق والحجز",
        });
        
        // تأخير قصير قبل الانتقال
        setTimeout(() => {
          setLocation(redirectPath);
        }, 300);
      }
    } catch (err: any) {
      console.error("خطأ في تسجيل الدخول كضيف:", err);
      
      setAuthError("تعذر تسجيل الدخول كضيف. يرجى المحاولة مرة أخرى.");
      
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "تعذر تسجيل الدخول كضيف. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsGuestLoading(false);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* عرض رسالة خطأ إذا وجدت */}
      {authError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg flex items-start space-x-2 rtl:space-x-reverse animate-pulse">
          <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{authError}</p>
        </div>
      )}
      
      {/* عرض رسالة نجاح */}
      {authSuccess && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-lg flex items-start space-x-2 rtl:space-x-reverse">
          <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p className="text-sm">تم تسجيل الدخول بنجاح! جاري تحويلك...</p>
        </div>
      )}
      
      <Button
        variant="outline"
        size={size}
        className="w-full flex items-center justify-center gap-2 border border-gray-500/50 hover:border-[#39FF14]/50 hover:bg-black/30 transition-all duration-300"
        onClick={handleGoogleLogin}
        disabled={isLoading || authSuccess}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FcGoogle className="h-5 w-5" />
        )}
        تسجيل الدخول باستخدام Google
      </Button>

      {showGuestOption && (
        <Button
          variant="secondary"
          size={size}
          className={`w-full transition-all duration-300 ${
            authError?.includes('غير مصرح') 
              ? 'bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-white' 
              : 'bg-opacity-20 hover:bg-opacity-30'
          }`}
          onClick={handleGuestLogin}
          disabled={isGuestLoading || authSuccess}
        >
          {isGuestLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          الدخول كضيف
        </Button>
      )}
    </div>
  );
}