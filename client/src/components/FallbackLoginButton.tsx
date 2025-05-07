import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { LogIn, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FallbackLoginButtonProps {
  redirectPath?: string;
  className?: string;
  onSuccess?: () => void;
  buttonText?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

/**
 * زر تسجيل دخول بديل يستخدم تسجيل الدخول المجهول
 * مفيد عندما تفشل طرق تسجيل الدخول الأخرى
 */
export default function FallbackLoginButton({
  redirectPath,
  className = '',
  onSuccess,
  buttonText = 'دخول سريع كضيف',
  size = 'default',
  variant = 'secondary'
}: FallbackLoginButtonProps) {
  const { loginAnonymously } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnonymousLogin = async () => {
    try {
      setIsLoading(true);
      
      await loginAnonymously(redirectPath);
      
      if (onSuccess) {
        onSuccess();
      }
      
      toast({
        title: 'تم تسجيل الدخول كضيف',
        description: 'يمكنك تصفح التطبيق والبحث عن العقارات بحرية!',
      });
      
    } catch (err: any) {
      console.error('Anonymous login error:', err);
      
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: err.message || 'حدث خطأ أثناء تسجيل الدخول. الرجاء المحاولة مرة أخرى لاحقًا.',
        variant: 'destructive'
      });
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAnonymousLogin}
      variant={variant}
      size={size}
      disabled={isLoading}
      className={`${className} gap-2 ${isLoading ? 'opacity-70' : ''}`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogIn className="h-4 w-4" />
      )}
      {buttonText}
    </Button>
  );
}