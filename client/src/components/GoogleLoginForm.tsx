import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GoogleLoginFormProps {
  redirectPath?: string;
  className?: string;
  onLoginSuccess?: () => void;
  buttonText?: string;
  showErrorMessage?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

/**
 * نموذج تسجيل الدخول باستخدام Google
 * يعرض زر تسجيل الدخول مع شعار Google ويتعامل مع الأخطاء
 */
export default function GoogleLoginForm({
  redirectPath,
  className = '',
  onLoginSuccess,
  buttonText = 'تسجيل الدخول باستخدام Google',
  showErrorMessage = true,
  size = 'default',
  variant = 'outline'
}: GoogleLoginFormProps) {
  const { loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await loginWithGoogle(redirectPath);
      
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      
      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: 'مرحبًا بك في StayX!',
      });
      
    } catch (err: any) {
      console.error('Google login error:', err);
      
      // رسائل خطأ مخصصة للاستجابات المختلفة
      if (err.code === 'auth/unauthorized-domain') {
        setError('هذا النطاق غير معتمد في إعدادات Firebase. سيتم تسجيل الدخول كضيف تلقائيًا.');
        toast({
          title: 'تنبيه بشأن النطاق',
          description: 'هذا النطاق غير معتمد في Firebase. سيتم تسجيل الدخول كضيف.',
          variant: 'destructive'
        });
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('تم إغلاق نافذة تسجيل الدخول.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('تم إلغاء طلب النافذة المنبثقة.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('تم حظر النافذة المنبثقة. الرجاء التحقق من إعدادات المتصفح.');
        toast({
          title: 'تم حظر النافذة المنبثقة',
          description: 'الرجاء تعطيل مانع النوافذ المنبثقة لهذا الموقع والمحاولة مرة أخرى.',
          variant: 'destructive'
        });
      } else if (err.code === 'auth/network-request-failed') {
        setError('فشل في الاتصال بالشبكة. الرجاء التحقق من اتصال الإنترنت والمحاولة مرة أخرى.');
      } else {
        setError(`حدث خطأ: ${err.message || 'خطأ غير معروف'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <Button
        onClick={handleGoogleLogin}
        variant={variant}
        size={size}
        disabled={isLoading}
        className={`w-full gap-2 ${isLoading ? 'opacity-70' : ''}`}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FcGoogle className="h-5 w-5" />
        )}
        {buttonText}
      </Button>
      
      {error && showErrorMessage && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}