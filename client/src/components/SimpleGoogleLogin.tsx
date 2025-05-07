import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { login, handleRedirect } from '@/lib/firebase-auth';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SimpleGoogleLoginProps {
  redirectPath?: string;
  className?: string;
  buttonText?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export default function SimpleGoogleLogin({
  redirectPath = '/customer',
  className = '',
  buttonText = 'تسجيل الدخول باستخدام Google',
  size = 'default',
  variant = 'outline'
}: SimpleGoogleLoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [_, navigate] = useLocation();

  // Check for redirect result on component mount
  useEffect(() => {
    async function checkRedirectResult() {
      try {
        console.log("[DEBUG] تحقق من نتيجة تسجيل الدخول مع Google");
        const result = await handleRedirect();
        
        if (result.success && result.user) {
          // Successfully signed in with Google
          console.log("تم تسجيل الدخول بنجاح بعد إعادة التوجيه من Google");
          toast({
            title: "تم تسجيل الدخول بنجاح",
            description: "مرحبًا بعودتك!",
            variant: "default",
          });
          
          // Navigate to the redirect path if successful
          navigate(redirectPath);
        } else if (result.errorCode) {
          // Handle specific error codes
          let errorMessage = "حدث خطأ أثناء تسجيل الدخول مع Google.";
          
          if (result.errorCode === 'auth/account-exists-with-different-credential') {
            errorMessage = "هذا البريد الإلكتروني مسجل بطريقة تسجيل دخول أخرى.";
          } else if (result.errorCode === 'auth/popup-closed-by-user') {
            errorMessage = "تم إغلاق نافذة تسجيل الدخول قبل إكمال العملية.";
          } else if (result.errorCode === 'auth/popup-blocked') {
            errorMessage = "تم حظر النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة وإعادة المحاولة.";
          } else if (result.errorCode === 'auth/cancelled-popup-request') {
            // This is normal, don't show an error
            return;
          } else if (result.errorCode === 'auth/network-request-failed') {
            errorMessage = "فشل طلب الشبكة. تحقق من اتصالك بالإنترنت.";
          }
          
          setError(errorMessage);
          toast({
            title: "خطأ في تسجيل الدخول",
            description: errorMessage,
            variant: "destructive",
          });
        } else {
          console.log("لا توجد نتيجة إعادة توجيه من Google");
        }
      } catch (err) {
        console.error("خطأ أثناء التحقق من نتيجة إعادة التوجيه:", err);
      }
    }
    
    checkRedirectResult();
  }, [navigate, redirectPath, toast]);

  const handleGoogleLogin = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the redirect method from firebase-auth.ts
      await login();
      
      // The page will reload after redirect returns
      // We handle the result in the useEffect above
    } catch (err: any) {
      console.error("خطأ في بدء تسجيل الدخول مع Google:", err);
      
      let errorMessage = "حدث خطأ أثناء بدء تسجيل الدخول مع Google. يرجى المحاولة مرة أخرى.";
      
      if (err.code === 'auth/unauthorized-domain') {
        errorMessage = "هذا النطاق غير مصرح به لتسجيل الدخول مع Google. يرجى التواصل مع المسؤول.";
      }
      
      setError(errorMessage);
      toast({
        title: "خطأ في تسجيل الدخول",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${className} space-y-2`}>
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

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}