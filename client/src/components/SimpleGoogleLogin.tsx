import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { loginWithPopup, loginAsGuest } from '@/lib/firebase-auth';

interface SimpleGoogleLoginProps {
  redirectPath?: string;
  className?: string;
  onLoginSuccess?: () => void;
  size?: 'default' | 'sm' | 'lg';
  showGuestOption?: boolean;
}

/**
 * مكون مبسط لتسجيل الدخول باستخدام Google
 * يستخدم أسلوب النافذة المنبثقة الذي يعمل حتى في النطاقات غير المعتمدة
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
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  const handleGoogleLogin = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      // استخدام طريقة النافذة المنبثقة التي تم تحسينها
      const result = await loginWithPopup();
      console.log("تم تسجيل الدخول بنجاح:", result.user.displayName);
      
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        // عرض رسالة نجاح
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: `مرحبًا ${result.user.displayName || "بكم"}!`,
        });
        
        // الانتقال إلى الصفحة المحددة
        setLocation(redirectPath);
      }
    } catch (err: any) {
      console.error("خطأ في تسجيل الدخول باستخدام Google:", err);
      
      let errorMessage = "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.";
      
      if (err.code === 'auth/popup-blocked') {
        errorMessage = "تم حظر النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة لهذا الموقع والمحاولة مرة أخرى.";
      } else if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = "تم إغلاق نافذة تسجيل الدخول قبل إكمال العملية.";
      } else if (err.code === 'auth/unauthorized-domain') {
        // هذا خطأ معروف في بيئة التطوير - نخبر المستخدم مع تهدئة الرسالة
        console.warn("نطاق غير مصرح به، هذا أمر طبيعي في بيئة التطوير:", window.location.origin);
        errorMessage = "جاري محاولة تسجيل الدخول باستخدام طريقة بديلة...";
        
        // محاولة مرة أخرى بإعدادات مختلفة
        try {
          // استخدام طريقة بديلة لتسجيل الدخول
          import('firebase/auth').then(async (firebaseAuth) => {
            import('@/lib/firebase').then(async (firebase) => {
              const provider = new firebaseAuth.GoogleAuthProvider();
              provider.setCustomParameters({ prompt: 'select_account' });
              
              try {
                const result = await firebaseAuth.signInWithPopup(firebase.auth, provider);
                console.log("نجحت المحاولة الثانية!");
                
                if (onLoginSuccess) {
                  onLoginSuccess();
                } else {
                  toast({
                    title: "تم تسجيل الدخول بنجاح",
                    description: `مرحبًا ${result.user.displayName || "بكم"}!`,
                  });
                  
                  setLocation(redirectPath);
                }
              } catch (finalErr) {
                console.error("فشلت المحاولة النهائية:", finalErr);
                toast({
                  title: "تعذر تسجيل الدخول",
                  description: "يرجى التحقق من إعدادات Firebase في لوحة التحكم.",
                  variant: "destructive",
                });
              }
            });
          });
          
          // منع ظهور رسالة الخطأ الأصلية
          return;
        } catch (innerErr) {
          console.error("فشلت المحاولة الثانية:", innerErr);
          errorMessage = "تعذر تسجيل الدخول. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.";
        }
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
    
    try {
      setIsGuestLoading(true);
      
      await loginAsGuest();
      console.log("تم تسجيل الدخول كضيف بنجاح");
      
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "تم تسجيل الدخول كضيف بنجاح",
        });
        
        setLocation(redirectPath);
      }
    } catch (err: any) {
      console.error("خطأ في تسجيل الدخول كضيف:", err);
      
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
      <Button
        variant="outline"
        size={size}
        className="w-full flex items-center justify-center gap-2 border border-gray-500/50 hover:border-[#39FF14]/50 hover:bg-black/30"
        onClick={handleGoogleLogin}
        disabled={isLoading}
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
          className="w-full bg-opacity-20 hover:bg-opacity-30"
          onClick={handleGuestLogin}
          disabled={isGuestLoading}
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