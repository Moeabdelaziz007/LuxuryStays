import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import GoogleLoginRedirect from "@/components/GoogleLoginRedirect";

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

  // تسجيل الدخول باستخدام Google - مع إعدادات محسّنة لعنوان إعادة التوجيه
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      
      // إضافة نطاقات الوصول المطلوبة
      provider.addScope('email');
      provider.addScope('profile');
      
      // تعيين إعدادات خاصة للمزود لضمان عمل إعادة التوجيه بشكل صحيح
      provider.setCustomParameters({
        'login_hint': 'الرجاء اختيار حساب Google الخاص بك',
        'prompt': 'select_account',
        'client_id': '299280633489-3q6odgc86hhc1j0cev92bf28q7cep5hj.apps.googleusercontent.com',
        'origin': window.location.origin,
        'redirect_uri': `${window.location.origin}/login`
      });
      
      console.log("محاولة تسجيل الدخول باستخدام Google...");
      console.log("النطاق الحالي:", window.location.origin);
      console.log("عنوان URI المستخدم للإعادة التوجيه:", `${window.location.origin}/login`);
      
      // استخدام طريقة signInWithRedirect بدلاً من signInWithPopup لتجنب مشاكل النافذة المنبثقة
      // تذكر: هذا سيقوم بإعادة تحميل الصفحة، لذلك لن يتم تنفيذ أي كود بعده
      await signInWithRedirect(auth, provider);
      
      // ملاحظة: هذا الكود لن يتم تنفيذه بسبب إعادة التوجيه
      // سيتم معالجة نتيجة تسجيل الدخول في مكون RedirectHandler في App.tsx
      
    } catch (err: any) {
      console.error("خطأ في تسجيل الدخول باستخدام Google:", err);
      
      // عرض رسالة خطأ مناسبة للمستخدم
      if (err.code === 'auth/popup-closed-by-user') {
        setError("تم إغلاق نافذة تسجيل الدخول");
      } else if (err.code === 'auth/unauthorized-domain') {
        setError(`نطاق التطبيق غير مصرح به (${window.location.origin}). يرجى إضافته في إعدادات Firebase.`);
      } else if (err.code === 'auth/redirect-cancelled-by-user') {
        setError("تم إلغاء عملية تسجيل الدخول من قبل المستخدم");
      } else if (err.code === 'auth/redirect-operation-pending') {
        setError("هناك عملية تسجيل دخول جارية بالفعل");
      } else if (err.code === 'auth/network-request-failed') {
        setError("فشل في الاتصال بالشبكة. تحقق من اتصالك بالإنترنت.");
      } else {
        setError(err.message || "حدث خطأ أثناء تسجيل الدخول باستخدام Google");
      }
    } finally {
      setLoading(false);
    }
  };

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
          
          <GoogleLoginRedirect 
            redirectPath="/dashboard/customer" 
            variant="outline"
            className="w-full"
            buttonText="تسجيل الدخول باستخدام Google"
          />
        </CardContent>
        <CardFooter className="flex justify-center">
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