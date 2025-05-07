import React from 'react';
import { useLocation, Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { loginAsGuest } from '@/lib/firebase-auth';
import SimpleGoogleLogin from '@/components/SimpleGoogleLogin';
import Logo from '@/components/Logo';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function SimplifiedLogin() {
  const [isGuestLoading, setGuestLoading] = React.useState(false);
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  
  // Get the redirect path from URL query params
  const getRedirectPath = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('redirect') || '/customer';
  };
  
  const redirectPath = getRedirectPath();
  
  // Handle guest login
  const handleGuestLogin = async () => {
    setGuestLoading(true);
    
    try {
      await loginAsGuest();
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "تم تسجيل دخولك كضيف",
      });
      navigate(redirectPath);
    } catch (error: any) {
      console.error("خطأ في تسجيل الدخول كضيف:", error);
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "حدث خطأ أثناء تسجيل الدخول كضيف. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setGuestLoading(false);
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <div className="relative hidden flex-1 lg:block overflow-hidden">
        {/* جانب الشعار والخلفية للشاشات الكبيرة */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzOUZGMTQiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMCAzaDR2MWgtNHYtMXptMCAzaDR2MWgtNHYtMXptLTYtNmg0djFoLTR2LTF6bTAgM2g0djFoLTR2LTF6bTAgM2g0djFoLTR2LTF6bS02LTZoNHYxaC00di0xem0wIDNoNHYxaC00di0xem0wIDNoNHYxaC00di0xem0wLTl2MWgtM1YzMWgzem0wIDNoLTN2MWgzdi0xem0wIDNoLTN2MWgzdi0xeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
        
        {/* تأثيرات وأضواء */}
        <div className="absolute top-1/4 left-1/4 w-60 h-60 bg-[#39FF14] rounded-full opacity-[0.03] blur-[100px]"></div>
        <div className="absolute bottom-1/3 right-1/5 w-40 h-40 bg-[#39FF14] rounded-full opacity-[0.02] blur-[80px]"></div>
        
        {/* محتوى */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
          <Logo size="xl" variant="neon" withText withAnimation className="mb-8" />
          
          <div className="max-w-md text-center space-y-4">
            <h2 className="text-3xl font-bold">بوابة الإقامة الفاخرة</h2>
            <p className="text-gray-400">
              الحل الأمثل لإدارة العقارات وحجز الإقامات الفاخرة
              في الساحل الشمالي وراس الحكمة
            </p>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-md mx-auto flex items-center justify-center p-6">
        <Card className="w-full max-w-sm bg-gray-900 border-gray-800 shadow-2xl">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4 lg:hidden">
              <Logo size="lg" variant="neon" withText withAnimation />
            </div>
            <CardTitle className="text-xl text-white">تسجيل الدخول</CardTitle>
            <CardDescription>اختر طريقة تسجيل الدخول المناسبة لك</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <SimpleGoogleLogin 
              redirectPath={redirectPath} 
              buttonText="تسجيل الدخول بحساب Google" 
            />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-800"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-900 px-2 text-gray-500">أو</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full border-gray-700 hover:bg-gray-800"
              onClick={handleGuestLogin}
              disabled={isGuestLoading}
            >
              {isGuestLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              الدخول كضيف
            </Button>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-gray-500">
              بالضغط على تسجيل الدخول، أنت توافق على 
              <Link href="/terms">
                <span className="text-[#39FF14] hover:underline cursor-pointer"> شروط الاستخدام </span>
              </Link>
              و
              <Link href="/privacy">
                <span className="text-[#39FF14] hover:underline cursor-pointer"> سياسة الخصوصية</span>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}