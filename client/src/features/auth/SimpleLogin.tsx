import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GoogleLoginRedirect from "@/components/GoogleLoginRedirect";
import GoogleLoginPopup from "@/components/GoogleLoginPopup";

// صفحة تسجيل الدخول البسيطة
export default function SimpleLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  // تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // التحقق من وجود البريد الإلكتروني وكلمة المرور
      if (!email || !password) {
        setError("يرجى إدخال البريد الإلكتروني وكلمة المرور");
        return;
      }

      // تسجيل الدخول باستخدام Firebase
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // إضافة المستخدم إلى Firestore إذا لم يكن موجودًا
      if (result.user && db) {
        const userRef = doc(db, "users", result.user.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            uid: result.user.uid,
            email: result.user.email,
            name: result.user.displayName || email.split('@')[0],
            role: "CUSTOMER",
            createdAt: new Date().toISOString()
          });
        }
      }
      
      // إظهار رسالة نجاح
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحبًا بك في تطبيق StayX",
        variant: "default",
      });

      // توجيه المستخدم إلى الصفحة الرئيسية
      navigate("/dashboard/customer");
    } catch (err: any) {
      // معالجة الأخطاء
      console.error("خطأ في تسجيل الدخول:", err);
      
      const errorMap: Record<string, string> = {
        'auth/invalid-email': "البريد الإلكتروني غير صالح",
        'auth/user-disabled': "هذا الحساب معطل",
        'auth/user-not-found': "لم يتم العثور على حساب بهذا البريد الإلكتروني",
        'auth/wrong-password': "كلمة المرور غير صحيحة",
        'auth/invalid-credential': "بيانات الاعتماد غير صالحة",
        'auth/too-many-requests': "تم تعطيل الوصول إلى هذا الحساب مؤقتًا بسبب العديد من محاولات تسجيل الدخول الفاشلة"
      };
      
      setError(errorMap[err.code] || err.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  // ملاحظة: تم استبدال دالة handleGoogleLogin بمكون GoogleLoginRedirect
  // الذي يوفر وظيفة مماثلة مع تحسينات لمعالجة مشكلات المجالات غير المصرح بها

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <Card className="w-[350px] bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-center text-[#39FF14]">تسجيل الدخول</CardTitle>
          <CardDescription className="text-center">
            أدخل بيانات حسابك للوصول إلى حسابك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                البريد الإلكتروني
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  كلمة المرور
                </label>
                <Link href="/auth/forgot-password" className="text-xs text-[#39FF14] hover:text-[#39FF14]/80">
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800 border-gray-700"
              />
            </div>
            
            {error && (
              <div className="text-sm text-red-500 bg-red-500/10 p-2 rounded-md border border-red-500/20">
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-[#39FF14] text-black hover:bg-[#39FF14]/90"
              disabled={loading}
            >
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
          
          <div className="my-4 flex items-center">
            <div className="flex-grow border-t border-gray-700"></div>
            <div className="mx-4 text-sm text-gray-400">أو</div>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>
          
          <Tabs defaultValue="popup" className="w-full mb-4">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="popup" className="text-xs">نافذة منبثقة</TabsTrigger>
              <TabsTrigger value="redirect" className="text-xs">إعادة توجيه</TabsTrigger>
            </TabsList>
            
            <TabsContent value="popup" className="m-0">
              <GoogleLoginPopup 
                redirectPath="/customer" 
                variant="outline"
                className="w-full"
                buttonText="تسجيل الدخول باستخدام Google"
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                يستخدم النافذة المنبثقة (مناسب للأجهزة المكتبية)
              </p>
            </TabsContent>
            
            <TabsContent value="redirect" className="m-0">
              <GoogleLoginRedirect 
                redirectPath="/customer" 
                variant="outline"
                className="w-full"
                buttonText="تسجيل الدخول باستخدام Google"
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                يستخدم إعادة التوجيه (مناسب للأجهزة المحمولة)
              </p>
            </TabsContent>
          </Tabs>
          
          <div className="flex flex-col items-center justify-center gap-2 mt-2">
            <Link href="/auth/test" className="text-xs text-[#39FF14] hover:text-[#39FF14]/80 block text-center">
              تجربة طرق متعددة للمصادقة مع Google
            </Link>
            <Link href="/auth/simple-test" className="text-xs text-[#39FF14] hover:text-[#39FF14]/80 block text-center">
              اختبار بسيط للمصادقة مع Google
            </Link>
          </div>
          
          {error && (error.includes("النطاق غير مصرح به") || error.includes("unauthorized-domain")) && (
            <div className="mt-4 text-center">
              <Link href="/auth/troubleshoot" className="text-[#39FF14] hover:text-[#39FF14]/80 text-sm">
                واجهت مشكلة في تسجيل الدخول؟ انقر هنا لتشخيص المشكلة وحلها
              </Link>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <div className="text-sm text-gray-400">
            ليس لديك حساب؟{" "}
            <Link href="/auth/signup" className="text-[#39FF14] hover:text-[#39FF14]/80">
              إنشاء حساب
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}