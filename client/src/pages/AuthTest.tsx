import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GoogleLoginRedirect from '@/components/GoogleLoginRedirect';
import GoogleLoginPopup from '@/components/GoogleLoginPopup';
import TechBackground from '@/components/layout/TechBackground';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signInAnonymously } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { googleOAuthConfig } from '@/lib/oauth-config';
import { SiReplit } from 'react-icons/si';

/**
 * صفحة لاختبار طرق المصادقة المختلفة مع Google
 */
export default function AuthTest() {
  const [authMethod, setAuthMethod] = useState<string>('popup');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const auth = getAuth();

  const handleDirectPopupLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // إنشاء مزود مصادقة Google
      const provider = new GoogleAuthProvider();
      
      // إضافة نطاقات لطلب المعلومات
      provider.addScope('email');
      provider.addScope('profile');
      
      // محاولة تسجيل الدخول باستخدام النافذة المنبثقة مباشرة
      const result = await signInWithPopup(auth, provider);
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحبًا ${result.user.displayName || "بكم"}!`,
      });
      
    } catch (err: any) {
      console.error("خطأ في تسجيل الدخول:", err);
      setError(err.message);
      
      toast({
        title: "خطأ في تسجيل الدخول",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDirectRedirectLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // إنشاء مزود مصادقة Google
      const provider = new GoogleAuthProvider();
      
      // إضافة نطاقات لطلب المعلومات
      provider.addScope('email');
      provider.addScope('profile');
      
      // تعيين عنوان إعادة التوجيه
      localStorage.setItem('googleAuthRedirectPath', '/customer');
      
      // محاولة تسجيل الدخول باستخدام إعادة التوجيه مباشرة
      await signInWithRedirect(auth, provider);
      
      // لن يتم تنفيذ هذا الكود بسبب إعادة التوجيه
      
    } catch (err: any) {
      console.error("خطأ في تسجيل الدخول:", err);
      setError(err.message);
      
      toast({
        title: "خطأ في تسجيل الدخول",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // تسجيل الدخول كمستخدم مجهول
      const result = await signInAnonymously(auth);
      
      toast({
        title: "تم تسجيل الدخول كضيف",
        description: "تم تسجيل الدخول بنجاح كمستخدم مجهول.",
      });
      
    } catch (err: any) {
      console.error("خطأ في تسجيل الدخول:", err);
      setError(err.message);
      
      toast({
        title: "خطأ في تسجيل الدخول",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TechBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-gray-900 border-gray-800 shadow-[0_0_15px_rgba(57,255,20,0.3)]">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#39FF14]">
              اختبار طرق المصادقة مع Google
            </CardTitle>
            <CardDescription className="text-center">
              تجريب طرق مختلفة للمصادقة وتحديد الطريقة التي تعمل مع النطاق الحالي
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="text-[#39FF14] font-medium mb-2">معلومات النطاق الحالي:</h3>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">نطاق الموقع الكامل:</span>
                  <span className="text-white">{window.location.origin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">اسم المضيف:</span>
                  <span className="text-white">{window.location.hostname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">معرف عميل Google:</span>
                  <span className="text-white truncate max-w-[250px]">{googleOAuthConfig.clientId}</span>
                </div>
              </div>
            </div>
          
            <Tabs defaultValue="component" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger value="component">المكونات الجاهزة</TabsTrigger>
                <TabsTrigger value="direct">استدعاء مباشر</TabsTrigger>
              </TabsList>
              
              <TabsContent value="component" className="space-y-4 py-4">
                <div className="space-y-4">
                  <h3 className="text-white font-medium">تسجيل الدخول باستخدام المكونات الجاهزة:</h3>
                  
                  <div className="space-y-2">
                    <GoogleLoginRedirect 
                      redirectPath="/customer" 
                      buttonText="تسجيل الدخول باستخدام Google (إعادة التوجيه)"
                      showErrorMessage
                    />
                    
                    <GoogleLoginPopup 
                      redirectPath="/customer" 
                      buttonText="تسجيل الدخول باستخدام Google (نافذة منبثقة)"
                      showErrorMessage
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="direct" className="space-y-4 py-4">
                <div className="space-y-4">
                  <h3 className="text-white font-medium">تسجيل الدخول باستخدام الاستدعاء المباشر:</h3>
                  
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleDirectPopupLogin}
                      disabled={loading}
                    >
                      تسجيل الدخول مباشرة مع نافذة منبثقة
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleDirectRedirectLogin}
                      disabled={loading}
                    >
                      تسجيل الدخول مباشرة مع إعادة التوجيه
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleAnonymousLogin}
                      disabled={loading}
                    >
                      تسجيل الدخول كضيف
                    </Button>
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-900/20 border border-red-800 p-3 rounded-md text-red-300 text-sm">
                    <p className="font-medium mb-1">حدث خطأ أثناء تسجيل الدخول:</p>
                    <p>{error}</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Link href="/auth/troubleshoot">
              <Button variant="link" className="text-[#39FF14]">
                فحص النطاقات المصرح بها
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="ghost" className="text-gray-400 text-sm">
                العودة للصفحة الرئيسية
              </Button>
            </Link>
            
            <div className="text-xs text-gray-500 flex items-center justify-center mt-4">
              <SiReplit className="mr-1" />
              تم إنشاؤه على Replit
            </div>
          </CardFooter>
        </Card>
      </div>
    </TechBackground>
  );
}