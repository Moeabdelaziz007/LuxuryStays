import React from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { signInWithPopup, GoogleAuthProvider, signInAnonymously } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2, User } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

/**
 * صفحة تسجيل دخول بسيطة تحتوي على زر تسجيل الدخول باستخدام Google وزر الدخول كضيف
 */
export default function SimpleLogin() {
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [guestLoading, setGuestLoading] = React.useState(false);

  // إذا كان المستخدم مسجل الدخول بالفعل، قم بتوجيهه إلى الصفحة المناسبة
  if (user) {
    // توجيه المستخدم إلى لوحة التحكم المناسبة بناءً على دوره
    navigate(user.role === 'SUPER_ADMIN' ? '/super-admin' : user.role === 'PROPERTY_ADMIN' ? '/property-admin' : '/customer');
    return null;
  }

  // تسجيل الدخول باستخدام Google
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    
    try {
      const provider = new GoogleAuthProvider();
      // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول بحساب Google
      await signInWithPopup(auth, provider);
      // تتم إدارة حالة المستخدم تلقائيًا من خلال مزود السياق auth-context
      
      // قم بالتنقل إلى الصفحة الرئيسية أو لوحة التحكم بعد تسجيل الدخول بنجاح
      navigate('/');
    } catch (error: any) {
      // عرض رسالة خطأ
      toast({
        title: "فشل تسجيل الدخول",
        description: error.message || "حدث خطأ أثناء تسجيل الدخول باستخدام Google",
        variant: "destructive",
      });
    } finally {
      setGoogleLoading(false);
    }
  };
  
  // تسجيل الدخول كضيف
  const handleGuestLogin = async () => {
    setGuestLoading(true);
    
    try {
      // تسجيل الدخول بشكل مجهول
      await signInAnonymously(auth);
      // تتم إدارة حالة المستخدم تلقائيًا من خلال مزود السياق auth-context
      
      // قم بالتنقل إلى الصفحة الرئيسية أو لوحة التحكم بعد تسجيل الدخول بنجاح
      navigate('/');
    } catch (error: any) {
      // عرض رسالة خطأ
      toast({
        title: "فشل تسجيل الدخول",
        description: error.message || "حدث خطأ أثناء تسجيل الدخول كضيف",
        variant: "destructive",
      });
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* خلفية ديناميكية متطورة مع خطوط نيون */}
      <div className="absolute inset-0 z-0">
        {/* شبكة متوهجة خلفية */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, #39FF1410 1px, transparent 1px),
            linear-gradient(to bottom, #39FF1410 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
        
        {/* خط نيون أفقي متحرك */}
        <div className="absolute top-1/4 left-0 right-0 h-[1px] bg-[#39FF14]/20">
          <div className="h-full w-20 bg-[#39FF14] animate-[glow_4s_ease-in-out_infinite] absolute"></div>
        </div>
        
        {/* خط نيون عمودي متحرك */}
        <div className="absolute bottom-0 top-0 left-1/3 w-[1px] bg-[#39FF14]/20">
          <div className="w-full h-20 bg-[#39FF14] animate-[glow_6s_ease-in-out_infinite] absolute"></div>
        </div>
        
        {/* توهجات مضيئة */}
        <div className="absolute top-20 left-10 w-80 h-80 bg-[#39FF14]/10 rounded-full filter blur-[100px] animate-pulse-slow opacity-70"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#39FF14]/5 rounded-full filter blur-[100px] animate-pulse-very-slow opacity-50" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full filter blur-[80px] animate-pulse-slow opacity-40" style={{ animationDelay: '1s' }}></div>
        
        {/* مكعبات صغيرة عائمة */}
        <div className="absolute top-1/5 left-1/4 w-2 h-2 bg-[#39FF14] rotate-45 animate-float opacity-70"></div>
        <div className="absolute top-2/3 right-1/3 w-3 h-3 bg-[#39FF14] rotate-45 animate-float opacity-50" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-1/3 left-2/3 w-1 h-1 bg-[#39FF14] rotate-45 animate-float opacity-90" style={{ animationDelay: '2.2s' }}></div>
      </div>
      
      {/* الشعار مع تأثير توهج */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10 animate-fadeIn">
        <Logo size="lg" variant="neon" withText linkToHome withAnimation />
        <div className="absolute -bottom-2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#39FF14]/80 to-transparent"></div>
      </div>
      
      {/* عنصر الكارت مع تأثيرات نيون معززة */}
      <div className="w-full max-w-md z-10 relative mt-24 animate-slideUpAndFade">
        {/* إطار خارجي متوهج */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#39FF14]/60 to-purple-500/60 rounded-2xl blur-lg group-hover:opacity-100 opacity-75 group-hover:blur transition duration-1000 animate-gradient-xy"></div>
        
        <Card className="bg-black/80 backdrop-blur-xl border border-[#39FF14]/20 rounded-xl shadow-xl shadow-[#39FF14]/10 relative overflow-hidden">
          {/* خطوط نيون على الزوايا */}
          <div className="absolute top-0 left-0 w-4 h-0.5 bg-[#39FF14]"></div>
          <div className="absolute top-0 left-0 w-0.5 h-4 bg-[#39FF14]"></div>
          <div className="absolute top-0 right-0 w-4 h-0.5 bg-[#39FF14]"></div>
          <div className="absolute top-0 right-0 w-0.5 h-4 bg-[#39FF14]"></div>
          <div className="absolute bottom-0 left-0 w-4 h-0.5 bg-[#39FF14]"></div>
          <div className="absolute bottom-0 left-0 w-0.5 h-4 bg-[#39FF14]"></div>
          <div className="absolute bottom-0 right-0 w-4 h-0.5 bg-[#39FF14]"></div>
          <div className="absolute bottom-0 right-0 w-0.5 h-4 bg-[#39FF14]"></div>
          
          {/* تأثير توهج داخلي */}
          <div className="absolute -left-20 top-[50%] w-40 h-40 bg-[#39FF14]/10 rounded-full filter blur-xl transform -translate-y-1/2 animate-pulse-slow"></div>
        
          <CardHeader className="text-center relative">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-[1px] bg-gradient-to-r from-transparent via-[#39FF14]/40 to-transparent"></div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#39FF14] to-[#B3FF5C] animate-fadeIn" style={{ animationDelay: '200ms' }}>
              تسجيل الدخول
            </CardTitle>
            <CardDescription className="text-gray-400 animate-fadeIn mt-1" style={{ animationDelay: '400ms' }}>
              استمتع بتجربة إقامة فاخرة لا مثيل لها
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 py-6">
            {/* زر تسجيل الدخول مع Google مع تأثيرات متقدمة */}
            <div className="relative group animate-fadeIn" style={{ animationDelay: '600ms' }}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#39FF14] to-[#B3FF5C] rounded-xl opacity-70 group-hover:opacity-100 blur group-hover:blur-md transition duration-1000 animate-gradient-xy"></div>
              <Button
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="relative w-full h-14 bg-black hover:bg-black/80 text-white rounded-lg border border-[#39FF14]/50 group-hover:border-[#39FF14] transition-all flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(57,255,20,0.3)] group-hover:shadow-[0_0_25px_rgba(57,255,20,0.5)]"
              >
                {googleLoading ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[#39FF14] font-medium">جاري تسجيل الدخول</span>
                    <Loader2 className="h-5 w-5 animate-spin text-[#39FF14]" />
                  </div>
                ) : (
                  <>
                    <div className="bg-white p-1 rounded-full">
                      <FcGoogle className="h-6 w-6" />
                    </div>
                    <span className="font-medium text-lg group-hover:text-[#39FF14] transition-colors">تسجيل الدخول بواسطة Google</span>
                  </>
                )}
              </Button>
            </div>
            
            {/* فاصل مع خط متوهج */}
            <div className="flex items-center gap-3 px-2 my-2 animate-fadeIn" style={{ animationDelay: '700ms' }}>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
              <span className="text-gray-500 text-sm">أو</span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
            </div>
            
            {/* زر تسجيل الدخول كضيف بتصميم محسن */}
            <Button
              onClick={handleGuestLogin}
              disabled={guestLoading}
              variant="outline"
              className="w-full h-14 flex items-center justify-center gap-3 border-gray-800 text-gray-300 hover:text-[#39FF14] hover:border-[#39FF14]/30 animate-fadeIn bg-black/60 transition-all hover:shadow-[0_0_15px_rgba(57,255,20,0.2)]"
              style={{ animationDelay: '800ms' }}
            >
              {guestLoading ? (
                <div className="flex items-center gap-2">
                  <span className="text-[#39FF14] font-medium">جاري تسجيل الدخول</span>
                  <Loader2 className="h-5 w-5 animate-spin text-[#39FF14]" />
                </div>
              ) : (
                <>
                  <User className="h-5 w-5 text-gray-400 group-hover:text-[#39FF14]" />
                  <span className="font-medium">استكشاف كضيف</span>
                </>
              )}
            </Button>
            
            {/* رابط للعودة إلى الصفحة الرئيسية مع تأثيرات متحسنة */}
            <div className="text-center mt-6 animate-fadeIn" style={{ animationDelay: '900ms' }}>
              <a 
                href="/" 
                className="text-sm text-gray-400 hover:text-[#39FF14] transition-colors duration-300 inline-flex items-center group"
              >
                <span className="inline-block w-0 group-hover:w-4 overflow-hidden transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 -ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <span>العودة إلى الصفحة الرئيسية</span>
              </a>
            </div>
          </CardContent>
        </Card>
        
        {/* مؤشر أسفل الكارت */}
        <div className="flex justify-center mt-6 animate-fadeIn" style={{ animationDelay: '1000ms' }}>
          <div className="text-[#39FF14]/60 text-xs flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-[#39FF14] animate-ping"></div>
            نضمن لك أمان بياناتك 100%
          </div>
        </div>
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