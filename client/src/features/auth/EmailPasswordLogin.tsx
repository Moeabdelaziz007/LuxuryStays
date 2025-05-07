import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, KeyRound, LockKeyhole } from 'lucide-react';
import Logo from '@/components/Logo';
import FallbackLoginButton from '@/components/FallbackLoginButton';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

/**
 * مكون تسجيل الدخول البسيط باستخدام البريد الإلكتروني وكلمة المرور
 * لا يعتمد على مصادقة Google أو الخدمات الخارجية
 */
export default function EmailPasswordLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const auth = getAuth();

  // معالجة تسجيل الدخول
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "يرجى إدخال البريد الإلكتروني وكلمة المرور.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("محاولة تسجيل الدخول باستخدام البريد وكلمة المرور...");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("تم تسجيل الدخول بنجاح:", userCredential.user);
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحبًا بك مرة أخرى!",
      });
      
      // إعادة التوجيه إلى الصفحة المناسبة
      navigate('/customer');
    } catch (error: any) {
      console.error("خطأ في تسجيل الدخول:", error);
      
      let errorMessage = "فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.";
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "تم تقييد الوصول بسبب محاولات كثيرة. حاول مرة أخرى لاحقًا.";
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "تم تعطيل هذا الحساب. يرجى التواصل مع الدعم.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "البريد الإلكتروني غير صالح.";
      }
      
      toast({
        title: "خطأ في تسجيل الدخول",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // معالجة التسجيل الجديد
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "خطأ في التسجيل",
        description: "يرجى إدخال البريد الإلكتروني وكلمة المرور.",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "كلمة المرور قصيرة جدًا",
        description: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("محاولة إنشاء حساب جديد...");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("تم إنشاء الحساب بنجاح:", userCredential.user);
      
      toast({
        title: "تم التسجيل بنجاح!",
        description: "تم إنشاء حسابك الجديد. مرحبًا بك!",
      });
      
      // إعادة التوجيه إلى لوحة تحكم العميل
      navigate('/customer');
    } catch (error: any) {
      console.error("خطأ في التسجيل:", error);
      
      let errorMessage = "فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "هذا البريد الإلكتروني مستخدم بالفعل. يرجى استخدام بريد إلكتروني آخر أو تسجيل الدخول.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "البريد الإلكتروني غير صالح.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "كلمة المرور ضعيفة جدًا. يرجى استخدام كلمة مرور أقوى.";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "تسجيل المستخدمين باستخدام البريد الإلكتروني وكلمة المرور غير مفعل. يرجى التواصل مع المسؤول.";
      }
      
      toast({
        title: "خطأ في التسجيل",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // معالجة إعادة تعيين كلمة المرور
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال البريد الإلكتروني.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("إرسال طلب إعادة تعيين كلمة المرور إلى:", resetEmail);
      await sendPasswordResetEmail(auth, resetEmail);
      
      toast({
        title: "تم إرسال رابط إعادة تعيين كلمة المرور",
        description: "يرجى التحقق من بريدك الإلكتروني.",
      });
      
      setShowResetForm(false);
    } catch (error: any) {
      console.error("خطأ في إعادة تعيين كلمة المرور:", error);
      
      let errorMessage = "فشل إرسال رابط إعادة تعيين كلمة المرور.";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "لم يتم العثور على حساب مرتبط بهذا البريد الإلكتروني.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "البريد الإلكتروني غير صالح.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "تم تقييد الوصول بسبب نشاط غير عادي. حاول مرة أخرى لاحقًا.";
      }
      
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="absolute top-6 left-6">
        <Logo size="md" variant="neon" withText linkToHome />
      </div>
      
      <Card className="bg-gray-800/80 backdrop-blur-lg border-gray-700 w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-white">
            {activeTab === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            {activeTab === 'login' 
              ? 'أدخل بياناتك للوصول إلى حسابك' 
              : 'سجل للاستمتاع بتجربة StayX الفاخرة'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="register">حساب جديد</TabsTrigger>
            </TabsList>
            
            {/* نموذج تسجيل الدخول */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      placeholder="أدخل بريدك الإلكتروني"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-gray-700 border-gray-600 text-white"
                      autoComplete="email"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">كلمة المرور</Label>
                    <Button 
                      type="button" 
                      variant="link" 
                      className="px-0 text-[#39FF14] text-xs"
                      onClick={() => setShowResetForm(true)}
                    >
                      نسيت كلمة المرور؟
                    </Button>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      placeholder="كلمة المرور"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-gray-700 border-gray-600 text-white"
                      autoComplete="current-password"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#39FF14] hover:bg-[#39FF14]/90 text-black"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      جاري تسجيل الدخول...
                    </>
                  ) : (
                    'تسجيل الدخول'
                  )}
                </Button>
              </form>
              
              {showResetForm && (
                <div className="mt-6 p-4 border border-gray-700 rounded-lg">
                  <h3 className="text-white font-medium mb-2">إعادة تعيين كلمة المرور</h3>
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">البريد الإلكتروني</Label>
                      <Input
                        id="reset-email"
                        placeholder="أدخل بريدك الإلكتروني"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button 
                        type="submit" 
                        className="bg-[#39FF14] hover:bg-[#39FF14]/90 text-black"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            جاري الإرسال...
                          </>
                        ) : (
                          'إرسال رابط التعيين'
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setShowResetForm(false)}
                      >
                        إلغاء
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </TabsContent>
            
            {/* نموذج التسجيل الجديد */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-email"
                      placeholder="أدخل بريدك الإلكتروني"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-gray-700 border-gray-600 text-white"
                      autoComplete="email"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password">كلمة المرور</Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-password"
                      placeholder="أدخل كلمة مرور (6 أحرف على الأقل)"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-gray-700 border-gray-600 text-white"
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#39FF14] hover:bg-[#39FF14]/90 text-black"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      جاري التسجيل...
                    </>
                  ) : (
                    'إنشاء حساب'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-600"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-800 px-2 text-gray-400">أو</span>
              </div>
            </div>
            
            <div className="mt-6">
              {/* تسجيل الدخول كضيف */}
              <FallbackLoginButton 
                redirectPath="/customer"
                buttonText="الدخول كضيف"
                variant="outline"
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center p-6 border-t border-gray-700">
          <Button 
            variant="link" 
            className="text-sm text-gray-400 hover:text-[#39FF14]"
            onClick={() => navigate('/')}
          >
            العودة إلى الصفحة الرئيسية
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}