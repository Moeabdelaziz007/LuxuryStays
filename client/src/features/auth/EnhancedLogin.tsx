import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, CheckCircle, LockKeyhole, KeyRound, Mail } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import Logo from '@/components/Logo';
import CombinedGoogleLogin from '@/components/CombinedGoogleLogin';
import GoogleLoginRedirect from '@/components/GoogleLoginRedirect';
import GoogleLoginPopup from '@/components/GoogleLoginPopup';
import DirectGoogleLogin from '@/components/DirectGoogleLogin';
import FallbackLoginButton from '@/components/FallbackLoginButton';

/**
 * صفحة تسجيل الدخول المحسنة مع العديد من خيارات المصادقة
 */
export default function EnhancedLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { login, register, resetPassword, user } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();

  // التحقق مما إذا كان المستخدم قد سجل الدخول بالفعل
  if (user) {
    // إعادة توجيه المستخدم المصادق إلى صفحته الرئيسية بناءً على دوره
    navigate(user.role === 'SUPER_ADMIN' ? '/super-admin' : 
            user.role === 'PROPERTY_ADMIN' ? '/property-admin' : 
            '/customer');
    return null;
  }

  // معالجة تسجيل الدخول التقليدي
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
      await login(email, password);
      // ستتم إعادة التوجيه تلقائيًا من خلال auth-context
    } catch (error: any) {
      console.error("خطأ في تسجيل الدخول:", error);
      
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message || "فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.",
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
    
    setIsLoading(true);
    
    try {
      await register(email, password);
      
      toast({
        title: "تم التسجيل بنجاح!",
        description: "تم إنشاء حسابك بنجاح.",
        variant: "default",
      });
      
      // ستتم إعادة التوجيه تلقائيًا من خلال auth-context
    } catch (error: any) {
      console.error("خطأ في التسجيل:", error);
      
      toast({
        title: "خطأ في التسجيل",
        description: error.message || "فشل التسجيل. يرجى المحاولة مرة أخرى.",
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
      await resetPassword(resetEmail);
      
      toast({
        title: "تم إرسال رابط إعادة تعيين كلمة المرور",
        description: "يرجى التحقق من بريدك الإلكتروني.",
        variant: "default",
      });
      
      setShowResetForm(false);
    } catch (error: any) {
      console.error("خطأ في إعادة تعيين كلمة المرور:", error);
      
      toast({
        title: "خطأ",
        description: error.message || "فشل إرسال رابط إعادة تعيين كلمة المرور.",
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
      
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* قسم الترحيب والمعلومات */}
        <div className="hidden md:flex flex-col space-y-6 p-6">
          <h1 className="text-4xl font-bold text-white">
            مرحبًا بك في <span className="text-[#39FF14]">StayX</span>
          </h1>
          <p className="text-xl text-gray-300">
            منصة الإقامة الفاخرة التي تقدم تجربة فريدة للعطلات والإجازات
          </p>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 space-y-4 mt-6">
            <div className="flex items-start space-x-4 rtl:space-x-reverse">
              <div className="bg-[#39FF14]/20 p-2 rounded-full">
                <CheckCircle className="h-6 w-6 text-[#39FF14]" />
              </div>
              <div>
                <h3 className="font-semibold text-white">تصفح العقارات الفاخرة</h3>
                <p className="text-gray-400">اكتشف مجموعة من العقارات الفاخرة في أفضل المواقع</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 rtl:space-x-reverse">
              <div className="bg-[#39FF14]/20 p-2 rounded-full">
                <CheckCircle className="h-6 w-6 text-[#39FF14]" />
              </div>
              <div>
                <h3 className="font-semibold text-white">احجز بسهولة</h3>
                <p className="text-gray-400">إجراءات حجز بسيطة وسريعة مع تأكيد فوري</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 rtl:space-x-reverse">
              <div className="bg-[#39FF14]/20 p-2 rounded-full">
                <CheckCircle className="h-6 w-6 text-[#39FF14]" />
              </div>
              <div>
                <h3 className="font-semibold text-white">خدمة متميزة</h3>
                <p className="text-gray-400">استمتع بخدمات متكاملة وفريق دعم متاح على مدار الساعة</p>
              </div>
            </div>
          </div>
          
          <div className="relative mt-8 overflow-hidden rounded-xl border border-gray-800 h-60">
            <img 
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&w=1200&q=80" 
              alt="Luxury Villa" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-xl font-bold text-white">اكتشف فخامة الإقامة</h3>
              <p className="text-gray-300">تجربة لا تُنسى تنتظرك</p>
            </div>
          </div>
        </div>
        
        {/* قسم تسجيل الدخول */}
        <div>
          <Card className="bg-gray-800/80 backdrop-blur-lg border-gray-700 w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-white">
                {activeTab === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
              </CardTitle>
              <CardDescription className="text-center text-gray-400">
                {activeTab === 'login' 
                  ? 'أدخل بياناتك للوصول إلى حسابك' 
                  : 'سجل للاستمتاع بمزايا حصرية'}
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
                          placeholder="أدخل كلمة مرور (8 أحرف على الأقل)"
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
                
                <div className="mt-6 space-y-4">
                  {/* تسجيل الدخول مع Google */}
                  <DirectGoogleLogin 
                    redirectPath="/customer"
                    buttonText="تسجيل الدخول باستخدام Google"
                  />
                  
                  {/* تسجيل الدخول كضيف */}
                  <FallbackLoginButton 
                    redirectPath="/customer"
                    buttonText="الدخول كضيف"
                    variant="ghost"
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
          
          <div className="mt-6 px-4">
            <Alert className="bg-yellow-900/30 border-yellow-800 text-yellow-200">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>هل تواجه مشاكل في تسجيل الدخول؟</AlertTitle>
              <AlertDescription>
                إذا كنت تواجه صعوبة في تسجيل الدخول مع Google، جرب{' '}
                <Link href="/auth/troubleshoot" className="text-[#39FF14] underline">
                  أدوات تشخيص المصادقة
                </Link>{' '}
                أو استخدم الخيارات المتعددة للمصادقة في{' '}
                <Link href="/auth/advanced" className="text-[#39FF14] underline">
                  صفحة المصادقة المتقدمة
                </Link>.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
}