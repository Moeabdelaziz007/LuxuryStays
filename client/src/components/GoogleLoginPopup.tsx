import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { loginWithPopup } from '@/lib/firebase-auth';

interface GoogleLoginPopupProps {
  redirectPath?: string;
  className?: string;
  onLoginSuccess?: () => void;
  buttonText?: string;
  showErrorMessage?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

/**
 * مكون زر تسجيل الدخول مع Google باستخدام النافذة المنبثقة
 * بديل لطريقة إعادة التوجيه في حالة وجود مشكلات مع إعادة التوجيه
 */
export default function GoogleLoginPopup({
  redirectPath = '/customer',
  className = '',
  onLoginSuccess,
  buttonText = 'تسجيل الدخول باستخدام Google (نافذة منبثقة)',
  showErrorMessage = true,
  size = 'default',
  variant = 'outline'
}: GoogleLoginPopupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("محاولة تسجيل الدخول باستخدام Google (طريقة النافذة المنبثقة)...");
      console.log("النطاق الحالي:", window.location.origin);
      
      // استخدام وظيفة تسجيل الدخول المُحسنة
      const result = await loginWithPopup();
      console.log("تم تسجيل الدخول بنجاح:", result.user.displayName);
      
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      
      // عرض رسالة نجاح
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحبًا ${result.user.displayName || "بكم"}!`,
      });
      
      // الانتقال إلى الصفحة المحددة
      if (redirectPath) {
        console.log("جاري الانتقال إلى:", redirectPath);
        setLocation(redirectPath);
      }
      
    } catch (err: any) {
      console.error("خطأ في تسجيل الدخول باستخدام Google:", err);
      
      let errorMessage = "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.";
      
      if (err.code === 'auth/unauthorized-domain') {
        errorMessage = `هذا النطاق (${window.location.origin}) غير مصرح به للاستخدام. مع ذلك، طريقة النافذة المنبثقة يجب أن تعمل. قد تحتاج إلى تعطيل حاظر النوافذ المنبثقة في متصفحك.`;
      } else if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = "تم إغلاق نافذة تسجيل الدخول.";
      } else if (err.code === 'auth/cancelled-popup-request') {
        errorMessage = "تم إلغاء طلب النافذة المنبثقة.";
      } else if (err.code === 'auth/popup-blocked') {
        errorMessage = "تم حظر النافذة المنبثقة من قبل المتصفح. يرجى تعطيل حاظر النوافذ المنبثقة والمحاولة مرة أخرى.";
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