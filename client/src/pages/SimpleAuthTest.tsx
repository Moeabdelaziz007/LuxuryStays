import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import TechBackground from '@/components/layout/TechBackground';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { SiReplit } from 'react-icons/si';

/**
 * صفحة مبسطة لاختبار المصادقة مع Google
 * مصممة لتكون أكثر استقراراً من النسخة المعقدة
 */
export default function SimpleAuthTest() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();
  const auth = getAuth();

  const handlePopupLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      
      console.log("محاولة تسجيل الدخول باستخدام Google (طريقة النافذة المنبثقة)...");
      console.log("النطاق الحالي:", window.location.origin);
      
      // إنشاء مزود مصادقة Google
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      // محاولة تسجيل الدخول
      const authResult = await signInWithPopup(auth, provider);
      
      // عرض النتيجة
      setResult(`تم تسجيل الدخول بنجاح كـ ${authResult.user.displayName || authResult.user.email}`);
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحبًا ${authResult.user.displayName || "بكم"}!`,
      });
      
    } catch (err: any) {
      console.error("خطأ في تسجيل الدخول:", err);
      setError(err.message || "حدث خطأ أثناء تسجيل الدخول");
      
      toast({
        title: "خطأ في تسجيل الدخول",
        description: err.message || "حدث خطأ أثناء تسجيل الدخول",
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
      setResult(null);
      
      // تسجيل الدخول كمستخدم مجهول
      const authResult = await signInAnonymously(auth);
      
      setResult("تم تسجيل الدخول كضيف بنجاح");
      
      toast({
        title: "تم تسجيل الدخول كضيف",
        description: "تم تسجيل الدخول بنجاح كمستخدم مجهول.",
      });
      
    } catch (err: any) {
      console.error("خطأ في تسجيل الدخول:", err);
      setError(err.message || "حدث خطأ أثناء تسجيل الدخول");
      
      toast({
        title: "خطأ في تسجيل الدخول",
        description: err.message || "حدث خطأ أثناء تسجيل الدخول",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TechBackground>
      <div className="container min-h-screen py-16 flex flex-col items-center justify-center">
        <Card className="w-full max-w-lg bg-gray-900 border-gray-800 shadow-[0_0_15px_rgba(57,255,20,0.3)]">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#39FF14]">
              اختبار مبسط للمصادقة مع Google
            </CardTitle>
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
              </div>
            </div>
            
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handlePopupLogin}
                disabled={loading}
              >
                تسجيل الدخول باستخدام Google (نافذة منبثقة)
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
            
            {result && (
              <div className="bg-green-900/20 border border-green-700/20 p-3 rounded-md text-green-400 text-sm mt-4">
                {result}
              </div>
            )}
            
            {error && (
              <div className="bg-red-900/20 border border-red-700/20 p-3 rounded-md text-red-400 text-sm mt-4">
                <strong>خطأ:</strong> {error}
              </div>
            )}
            
            <div className="pt-4 flex justify-between items-center">
              <Link href="/auth/troubleshoot">
                <Button variant="link" className="text-[#39FF14] hover:text-[#39FF14]/80">
                  فحص النطاقات المصرح بها
                </Button>
              </Link>
              
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-400">
                  العودة للصفحة الرئيسية
                </Button>
              </Link>
            </div>
            
            <div className="text-xs text-gray-500 flex items-center justify-center mt-4">
              <SiReplit className="mr-1" />
              تم إنشاؤه على Replit
            </div>
          </CardContent>
        </Card>
      </div>
    </TechBackground>
  );
}