import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

/**
 * مكون تسجيل دخول بسيط باستخدام Google
 * يوفر زر واحد لتسجيل الدخول باستخدام Google
 */
export default function SimpleGoogleLogin() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [_, navigate] = useLocation();

  const handleGoogleLogin = async () => {
    setLoading(true);
    
    try {
      const provider = new GoogleAuthProvider();
      // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول بحساب Google
      await signInWithPopup(auth, provider);
      // تتم إدارة حالة المستخدم تلقائيًا من خلال مزود السياق auth-context
      
      // قم بالتنقل إلى الصفحة الرئيسية أو لوحة التحكم بعد تسجيل الدخول بنجاح
      navigate('/');
    } catch (error: any) {
      console.error('خطأ في تسجيل الدخول مع Google:', error);
      
      // عرض رسالة خطأ
      toast({
        title: "فشل تسجيل الدخول",
        description: error.message || "حدث خطأ أثناء تسجيل الدخول باستخدام Google",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full max-w-sm h-12 bg-white text-black hover:bg-gray-100 border border-gray-300 flex items-center justify-center gap-2 transition-colors duration-300"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
        ) : (
          <>
            <FcGoogle className="h-5 w-5" />
            <span>تسجيل الدخول باستخدام Google</span>
          </>
        )}
      </Button>
    </div>
  );
}