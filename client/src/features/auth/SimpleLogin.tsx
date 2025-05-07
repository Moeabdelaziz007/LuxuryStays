import React from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

/**
 * صفحة تسجيل دخول بسيطة تحتوي فقط على زر تسجيل الدخول باستخدام Google
 */
export default function SimpleLogin() {
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  // إذا كان المستخدم مسجل الدخول بالفعل، قم بتوجيهه إلى الصفحة المناسبة
  if (user) {
    // توجيه المستخدم إلى لوحة التحكم المناسبة بناءً على دوره
    navigate(user.role === 'SUPER_ADMIN' ? '/super-admin' : user.role === 'PROPERTY_ADMIN' ? '/property-admin' : '/customer');
    return null;
  }

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
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      {/* الشعار في الأعلى */}
      <div className="absolute top-6 left-6">
        <Logo size="md" variant="neon" withText linkToHome />
      </div>
      
      <div className="w-full max-w-md">
        <Card className="bg-gray-800/80 backdrop-blur-lg border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">تسجيل الدخول</CardTitle>
            <CardDescription className="text-gray-400">الرجاء تسجيل الدخول للوصول إلى حسابك</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* زر تسجيل الدخول مع Google */}
            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-12 bg-white text-black hover:bg-gray-100 border border-gray-300 flex items-center justify-center gap-2 transition-colors duration-300"
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
            
            {/* رابط للعودة إلى الصفحة الرئيسية */}
            <div className="text-center mt-4">
              <a href="/" className="text-sm text-gray-400 hover:text-[#39FF14] transition-colors duration-300">
                العودة إلى الصفحة الرئيسية
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}