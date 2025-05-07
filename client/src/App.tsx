import { useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "./contexts/auth-context";
import { useEffect } from "react";
import { UserRole } from "@shared/schema";
import SmartHeader from "./components/layout/SmartHeader";
import Footer from "./components/layout/Footer";
import { getAuth, getRedirectResult } from "firebase/auth";
import DatabaseConnectionStatus from "./components/DatabaseConnectionStatus";
import WelcomeMessage from "./components/WelcomeMessage";
import GoogleAuthDomainAlert from "./components/GoogleAuthDomainAlert";
import AppRoutes from "./routes";
import { useToast } from "@/hooks/use-toast";
import TechBackgroundLayout from "./components/layout/TechBackgroundLayout";

function RedirectHandler() {
  const { user, loading, updateUserInfo } = useAuth();
  const [location, setLocation] = useLocation();
  const auth = getAuth();
  const { toast } = useToast();
  
  // معالجة نتيجة تسجيل الدخول بواسطة Google
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        console.log("[DEBUG] تحقق من نتيجة تسجيل الدخول مع Google");
        
        // محاولة الحصول على نتيجة إعادة التوجيه من Firebase
        const result = await getRedirectResult(auth);
        
        // إذا كان هناك نتيجة، فهذا يعني أن عملية تسجيل الدخول نجحت
        if (result) {
          console.log("✅ تم تسجيل الدخول مع Google بنجاح!");
          console.log("البريد الإلكتروني:", result.user.email);
          console.log("الاسم:", result.user.displayName);
          
          // إضافة المستخدم إلى Firestore إذا لم يكن موجودًا
          if (result.user && updateUserInfo) {
            updateUserInfo({
              uid: result.user.uid,
              email: result.user.email || '',
              name: result.user.displayName || 'مستخدم Google',
              role: 'CUSTOMER',
              createdAt: new Date().toISOString(),
              photoURL: result.user.photoURL || ''
            });
          }
          
          // إظهار رسالة نجاح للمستخدم
          toast({
            title: "تم تسجيل الدخول بنجاح",
            description: "مرحبًا بك في تطبيق StayX!",
            variant: "default",
          });
          
          // توجيه المستخدم إلى لوحة التحكم المناسبة
          if (user && user.role) {
            switch (user.role) {
              case UserRole.CUSTOMER:
                setLocation('/customer');
                break;
              case UserRole.PROPERTY_ADMIN:
                setLocation('/property-admin');
                break;
              case UserRole.SUPER_ADMIN:
                setLocation('/super-admin');
                break;
              default:
                setLocation('/');
                break;
            }
          } else {
            // افتراضيًا نوجه إلى لوحة تحكم العميل
            setLocation('/customer');
          }
        } else {
          console.log("لا توجد نتيجة إعادة توجيه من Google");
        }
      } catch (error: any) {
        console.error("❌ خطأ في معالجة نتيجة إعادة التوجيه:", error);
        
        // عرض رسالة خطأ للمستخدم
        if (error.code === 'auth/unauthorized-domain') {
          console.error("النطاق غير مصرح به في إعدادات Firebase");
          toast({
            title: "خطأ في تسجيل الدخول",
            description: "هذا النطاق غير مصرح به في إعدادات Firebase. يرجى إضافته في لوحة تحكم Firebase.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "خطأ في تسجيل الدخول",
            description: "حدث خطأ أثناء تسجيل الدخول مع Google. يرجى المحاولة مرة أخرى.",
            variant: "destructive",
          });
        }
      }
    };
    
    // تنفيذ معالجة نتيجة إعادة التوجيه عند كل تحميل للصفحة
    handleRedirectResult();
  }, [auth, user, loading, setLocation, toast, updateUserInfo]);
  
  // توجيه المستخدم المصادق إلى لوحة التحكم المناسبة إذا حاول الوصول إلى صفحات تسجيل الدخول
  useEffect(() => {
    // سنقوم فقط بتوجيه المستخدم المسجل إذا كان في صفحة تسجيل الدخول أو التسجيل
    if (!loading && user) {
      const authPages = ['/login', '/signup', '/auth'];
      
      // قم بالتوجيه فقط إذا كان المستخدم على صفحة مصادقة ولديه صلاحيات
      if (authPages.includes(location) && user.role) {
        let dashboardPath;
        
        switch (user.role) {
          case UserRole.CUSTOMER:
            dashboardPath = '/customer';
            break;
          case UserRole.PROPERTY_ADMIN:
            dashboardPath = '/property-admin';
            break;
          case UserRole.SUPER_ADMIN:
            dashboardPath = '/super-admin';
            break;
          default:
            dashboardPath = '/';
            break;
        }
        
        console.log(`[DEBUG] توجيه المستخدم المصادق إلى لوحة التحكم: ${dashboardPath}`);
        setLocation(dashboardPath);
      }
    }
  }, [user, loading, location, setLocation]);

  return null;
}

function App() {
  const [location] = useLocation();
  const { loading } = useAuth();
  
  // نعرض Header و Footer فقط في الصفحات العامة
  const showHeaderFooter = !location.includes('/super-admin') && 
                           !location.includes('/property-admin') && 
                           !location.includes('/customer') &&
                           !location.includes('/splash');

  return (
    <TooltipProvider>
      <Toaster />
      <RedirectHandler />
      <DatabaseConnectionStatus />
      <GoogleAuthDomainAlert />
      <WelcomeMessage />
      <TechBackgroundLayout>
        {showHeaderFooter && <SmartHeader />}
        <AppRoutes />
        {showHeaderFooter && <Footer />}
      </TechBackgroundLayout>
    </TooltipProvider>
  );
}

export default App;