import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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

  // تسجيل الدخول باستخدام Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // إضافة المستخدم إلى Firestore إذا لم يكن موجودًا
      if (result.user && db) {
        const userRef = doc(db, "users", result.user.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            uid: result.user.uid,
            email: result.user.email,
            name: result.user.displayName || "مستخدم Google",
            role: "CUSTOMER",
            createdAt: new Date().toISOString(),
            photoURL: result.user.photoURL
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
      console.error("خطأ في تسجيل الدخول باستخدام Google:", err);
      
      if (err.code === 'auth/popup-closed-by-user') {
        setError("تم إغلاق نافذة تسجيل الدخول");
      } else if (err.code === 'auth/unauthorized-domain') {
        setError("هذا النطاق غير مصرح به للمصادقة. يرجى المحاولة بطريقة أخرى.");
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
          
          <Button 
            type="button" 
            className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 flex items-center justify-center space-x-2"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
              <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970142 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
              <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
              <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
            </svg>
            <span>تسجيل الدخول باستخدام Google</span>
          </Button>
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