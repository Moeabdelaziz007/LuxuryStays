import React from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/Logo';
import SimpleGoogleLogin from '@/components/SimpleGoogleLogin';

/**
 * صفحة تسجيل دخول بسيطة تحتوي فقط على زر تسجيل الدخول باستخدام Google
 */
export default function BasicLoginPage() {
  const { user } = useAuth();
  const [_, navigate] = useLocation();

  // إذا كان المستخدم مسجل الدخول بالفعل، قم بتوجيهه إلى الصفحة المناسبة
  if (user) {
    // توجيه المستخدم إلى لوحة التحكم المناسبة بناءً على دوره
    navigate(user.role === 'SUPER_ADMIN' ? '/super-admin' : user.role === 'PROPERTY_ADMIN' ? '/property-admin' : '/customer');
    return null;
  }

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
            {/* مكون تسجيل الدخول بسيط مع Google فقط */}
            <SimpleGoogleLogin />
            
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