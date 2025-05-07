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
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* خلفية ديناميكية */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#39FF14]/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#39FF14]/5 to-transparent"></div>
        <div className="absolute top-20 left-10 w-60 h-60 bg-[#39FF14]/5 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#39FF14]/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* الشعار في الأعلى مع رسوم متحركة */}
      <div className="absolute top-6 left-6 z-10 animate-fadeIn">
        <Logo size="md" variant="neon" withText linkToHome withAnimation />
      </div>
      
      {/* عنصر الكارت مع رسوم متحركة */}
      <div className="w-full max-w-md z-10 animate-slideUpAndFade">
        <Card className="bg-gray-800/80 backdrop-blur-lg border-gray-700 shadow-xl shadow-[#39FF14]/5">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white animate-fadeIn" style={{ animationDelay: '200ms' }}>تسجيل الدخول</CardTitle>
            <CardDescription className="text-gray-400 animate-fadeIn" style={{ animationDelay: '400ms' }}>الرجاء تسجيل الدخول للوصول إلى حسابك</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* زر تسجيل الدخول مع Google مع تأثيرات محسّنة */}
            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-12 bg-white text-black hover:bg-gray-100 hover:scale-[1.02] border border-gray-300 flex items-center justify-center gap-2 transition-all duration-300 shadow-md animate-fadeIn"
              style={{ animationDelay: '600ms' }}
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
            <div className="text-center mt-4 animate-fadeIn" style={{ animationDelay: '800ms' }}>
              <a href="/" className="text-sm text-gray-400 hover:text-[#39FF14] transition-colors duration-300">
                العودة إلى الصفحة الرئيسية
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* معلومات SEO (غير مرئية للمستخدم) */}
      <div className="sr-only">
        <h1>StayX - تسجيل الدخول | منصة حجز العقارات الفاخرة</h1>
        <p>قم بتسجيل الدخول إلى StayX، المنصة الرائدة لحجز العقارات الفاخرة في الصيف. استمتع بتجربة حجز سلسة وخدمة عملاء متميزة.</p>
        <p>حجز العقارات الفاخرة، إيجارات الصيف الفاخرة، شاليهات فاخرة، فلل سياحية، استجمام فاخر</p>
      </div>
    </div>
  );
}