import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useLocation } from 'wouter';

interface DirectGoogleLoginProps {
  redirectPath?: string;
  className?: string;
  onLoginSuccess?: () => void;
  buttonText?: string;
  showErrorMessage?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

/**
 * مكون تسجيل الدخول باستخدام Google مباشرة
 * يستخدم واجهة Google Sign-In مباشرة ثم يوثق مع Firebase
 */
export default function DirectGoogleLogin({
  redirectPath = '/customer',
  className = '',
  onLoginSuccess,
  buttonText = 'تسجيل الدخول باستخدام Google',
  showErrorMessage = true,
  size = 'default',
  variant = 'outline'
}: DirectGoogleLoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const auth = getAuth();

  // إعداد مكتبة Google Sign-In عند تحميل المكون
  useEffect(() => {
    // تحميل مكتبة Google Sign-In
    const loadGoogleScript = () => {
      // التحقق مما إذا كان السكريبت محملًا بالفعل
      if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        console.log('تم تحميل مكتبة Google Sign-In بنجاح');
      };

      script.onerror = () => {
        console.error('فشل في تحميل مكتبة Google Sign-In');
        setError('فشل في تحميل مكتبة تسجيل الدخول من Google');
      };
    };

    loadGoogleScript();
  }, []);

  // تكوين اتصال Google OAuth
  const googleOAuthConfig = {
    client_id: "299280633489-3q6odgc86hhc1j0cev92bf28q7cep5hj.apps.googleusercontent.com",
    callback: async (response: any) => {
      try {
        setIsLoading(true);
        console.log("تم الحصول على استجابة من Google Sign-In:", response);

        if (response.credential) {
          // إنشاء اعتماد Firebase من رمز ID الخاص بـ Google
          const credential = GoogleAuthProvider.credential(response.credential);

          // تسجيل الدخول إلى Firebase باستخدام الاعتماد
          await signInWithCredential(auth, credential);
          console.log("تم تسجيل الدخول بنجاح باستخدام اعتماد Google");

          // إعادة التوجيه أو استدعاء دالة النجاح
          if (onLoginSuccess) {
            onLoginSuccess();
          } else {
            navigate(redirectPath);
          }
        } else {
          throw new Error("لم يتم الحصول على اعتماد من Google");
        }
      } catch (err: any) {
        console.error("خطأ أثناء تسجيل الدخول باستخدام Google:", err);
        
        let errorMessage = "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.";
        
        if (err.code === 'auth/account-exists-with-different-credential') {
          errorMessage = "هذا البريد الإلكتروني مرتبط بطريقة تسجيل دخول أخرى.";
        } else if (err.code === 'auth/invalid-credential') {
          errorMessage = "بيانات الاعتماد غير صالحة. يرجى المحاولة مرة أخرى.";
        } else if (err.code === 'auth/operation-not-allowed') {
          errorMessage = "تسجيل الدخول باستخدام Google غير مفعل. يرجى التواصل مع المسؤول.";
        } else if (err.code === 'auth/user-disabled') {
          errorMessage = "تم تعطيل هذا الحساب. يرجى التواصل مع المسؤول.";
        } else if (err.code === 'auth/user-not-found') {
          errorMessage = "لم يتم العثور على المستخدم.";
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
    }
  };

  const handleGoogleLogin = () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // التحقق من تحميل مكتبة Google Sign-In
      if (typeof window !== 'undefined' && window.google && window.google.accounts) {
        // تهيئة Google Sign-In
        window.google.accounts.id.initialize({
          client_id: googleOAuthConfig.client_id,
          callback: googleOAuthConfig.callback,
          auto_select: false,
          cancel_on_tap_outside: true
        });
        
        // إظهار واجهة تسجيل الدخول
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log("سبب عدم عرض واجهة Google:", notification.getNotDisplayedReason() || notification.getSkippedReason());
            
            // إظهار نافذة منبثقة بدلاً من ذلك
            // TypeScript non-null assertion operator because we already checked if window.google exists
            window.google!.accounts.id.renderButton(
              document.getElementById('google-signin-button-container') || document.createElement('div'),
              { theme: 'outline', size: 'large', width: 250 }
            );
            
            // محاكاة النقر على الزر المعروض
            const googleButton = document.querySelector('[aria-labelledby="button-label"]');
            if (googleButton) {
              (googleButton as HTMLElement).click();
            } else {
              setError("تعذر عرض نافذة تسجيل الدخول من Google. يرجى المحاولة مرة أخرى.");
            }
          }
          setIsLoading(false);
        });
      } else {
        setError("مكتبة Google Sign-In غير محملة. يرجى تحديث الصفحة والمحاولة مرة أخرى.");
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error("خطأ في تهيئة Google Sign-In:", err);
      setError("حدث خطأ أثناء تهيئة Google Sign-In. يرجى المحاولة مرة أخرى.");
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

      {/* حاوية زر Google Sign-In (مخفية) */}
      <div id="google-signin-button-container" style={{ display: 'none' }}></div>

      {error && showErrorMessage && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}

// إضافة تعريف النوع لـ window.google
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, options: any) => void;
        };
      };
    };
  }
}