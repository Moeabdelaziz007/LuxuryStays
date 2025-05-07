import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAuth, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { googleOAuthConfig } from '@/lib/oauth-config';

interface GoogleLoginRedirectProps {
  redirectPath?: string;
  className?: string;
  onLoginSuccess?: () => void;
  buttonText?: string;
  showErrorMessage?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

/**
 * مكون زر تسجيل الدخول مع Google باستخدام نهج إعادة التوجيه
 * يستخدم بيانات اعتماد OAuth المحسنة لتقليل أخطاء "نطاق غير مصرح به"
 */
export default function GoogleLoginRedirect({
  redirectPath = '/customer',
  className = '',
  onLoginSuccess,
  buttonText = 'تسجيل الدخول باستخدام Google',
  showErrorMessage = true,
  size = 'default',
  variant = 'outline'
}: GoogleLoginRedirectProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const auth = getAuth();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("محاولة تسجيل الدخول باستخدام Google (طريقة إعادة التوجيه)...");
      console.log("النطاق الحالي:", window.location.origin);
      
      // حفظ مسار إعادة التوجيه المطلوب في التخزين المحلي
      if (redirectPath) {
        localStorage.setItem('googleAuthRedirectPath', redirectPath);
        console.log("تم حفظ مسار إعادة التوجيه:", redirectPath);
      }
      
      // إنشاء مزود مصادقة Google
      const provider = new GoogleAuthProvider();
      
      // إضافة نطاقات لطلب المعلومات
      provider.addScope('email');
      provider.addScope('profile');
      
      // تعيين إعدادات خاصة للمزود باستخدام معلومات OAuth المحدثة
      provider.setCustomParameters({
        'login_hint': 'الرجاء اختيار حساب Google الخاص بك',
        'prompt': 'select_account',
        'client_id': googleOAuthConfig.clientId,
        'redirect_uri': `${window.location.origin}/auth/google/callback`,
        'origin': window.location.origin
      });
      
      console.log("بدء عملية تسجيل الدخول باستخدام إعادة التوجيه...");
      console.log("عنوان URI المستخدم للإعادة التوجيه:", `${window.location.origin}/auth/google/callback`);
      console.log("معرف العميل المستخدم:", googleOAuthConfig.clientId);
      
      // استخدام طريقة إعادة التوجيه بدلاً من النافذة المنبثقة
      await signInWithRedirect(auth, provider);
      
      // لن يتم تنفيذ الكود التالي نظرًا لإعادة التوجيه
      console.log("لن يتم تنفيذ هذا الكود بعد إعادة التوجيه");
      
    } catch (err: any) {
      console.error("خطأ في تسجيل الدخول باستخدام Google:", err);
      
      let errorMessage = "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.";
      
      if (err.code === 'auth/unauthorized-domain') {
        errorMessage = `هذا النطاق (${window.location.origin}) غير مصرح به في إعدادات Firebase. يرجى إضافته في وحدة تحكم Firebase في قسم "Authorized domains".`;
      } else if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = "تم إغلاق نافذة تسجيل الدخول.";
      } else if (err.code === 'auth/cancelled-popup-request') {
        errorMessage = "تم إلغاء طلب النافذة المنبثقة.";
      } else if (err.code === 'auth/popup-blocked') {
        errorMessage = "تم حظر النافذة المنبثقة من قبل المتصفح.";
      } else if (err.code === 'auth/redirect-operation-pending') {
        errorMessage = "هناك عملية إعادة توجيه قيد التنفيذ بالفعل. يرجى الانتظار.";
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = "فشل طلب الشبكة. تحقق من اتصالك بالإنترنت.";
      }
      
      setError(errorMessage);
      
      if (showErrorMessage) {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <Button
        variant={variant}
        size={size}
        className="w-full flex items-center justify-center gap-2"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FcGoogle className="h-5 w-5" />
        )}
        {buttonText}
      </Button>

      {error && showErrorMessage && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}