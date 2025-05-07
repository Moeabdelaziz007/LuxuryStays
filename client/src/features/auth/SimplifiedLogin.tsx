import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import SimpleGoogleLogin from '@/components/SimpleGoogleLogin';

export default function SimplifiedLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="absolute inset-0 overflow-hidden">
        {/* Neural grid for tech effect */}
        <div className="absolute inset-0 tech-circuit opacity-10"></div>
        
        {/* Animated green nebula effect */}
        <div 
          className="absolute opacity-20 w-full h-full"
          style={{
            background: "radial-gradient(circle at 30% 70%, rgba(57, 255, 20, 0.1), transparent 50%)",
            animation: "pulse-very-slow 15s infinite"
          }}
        ></div>
        
        {/* Scanner beam effect */}
        <div 
          className="absolute h-[2px] top-[30%] left-[-100%] right-0 bg-gradient-to-r from-transparent via-[#39FF14]/20 to-transparent" 
          style={{animation: "glitchScan 8s ease-in-out infinite"}}
        ></div>
      </div>
      
      <Card className="w-full max-w-md bg-black/70 backdrop-blur-lg border-[#39FF14]/20 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl mb-2">
            <span className="text-[#39FF14] animate-text-pulse">StayX</span>
            <span className="text-white"> | تسجيل الدخول</span>
          </CardTitle>
          <CardDescription>
            اختر طريقة تسجيل الدخول المفضلة لديك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SimpleGoogleLogin />
          
          <div className="mt-4 text-xs text-center text-gray-500">
            بالضغط على تسجيل الدخول، فإنك توافق على <a href="/terms" className="text-[#39FF14] hover:underline">شروط الخدمة</a> و <a href="/privacy" className="text-[#39FF14] hover:underline">سياسة الخصوصية</a>.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}