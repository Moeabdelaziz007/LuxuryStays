import { useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "./contexts/auth-context";
import { useEffect } from "react";
import { UserRole } from "./features/auth/types";
import Header from "./components/layout/Header";
import SmartHeader from "./components/layout/SmartHeader";
import Footer from "./components/layout/Footer";
import { getAuth, getRedirectResult } from "firebase/auth";
import AppRoutes from "./routes";

function RedirectHandler() {
  const { user, loading } = useAuth();
  const [location, setLocation] = useLocation();
  
  useEffect(() => {
    console.log("[DEBUG] RedirectHandler in App.tsx:", { user, loading, pathname: location });
    
    // سنقوم فقط بتوجيه المستخدم المسجل إذا كان في صفحة تسجيل الدخول أو التسجيل
    if (!loading && user) {
      const authPages = ['/login', '/signup'];
      
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
        
        console.log(`[DEBUG] Redirecting authenticated user to dashboard: ${dashboardPath}`);
        setLocation(dashboardPath);
      }
    }
  }, [user, loading, location, setLocation]);

  return null;
}

function App() {
  const [location] = useLocation();
  const showHeaderFooter = !location.includes('/super-admin') && 
                           !location.includes('/property-admin') && 
                           !location.includes('/customer');
  const auth = getAuth();
  
  // Handle redirect from Google sign-in
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const { user } = result;
          console.log("Google sign-in successful", {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            isRedirect: true
          });
          
          // يمكن أن نعرض رسالة ترحيب للمستخدم هنا باستخدام toast
          // لكن هذا سيتم معالجته في سياق المصادقة
        }
      } catch (error: any) {
        console.error("Google redirect error:", error);
        
        // معالجة أنواع مختلفة من الأخطاء
        if (error.code === 'auth/account-exists-with-different-credential') {
          console.warn("حساب موجود بالفعل بنفس البريد الإلكتروني ولكن بطريقة تسجيل دخول مختلفة");
        } else if (error.code === 'auth/user-cancelled') {
          console.warn("تم إلغاء عملية تسجيل الدخول من قبل المستخدم");
        } else if (error.code === 'auth/user-not-found') {
          console.warn("لم يتم العثور على المستخدم");
        } else if (error.code === 'auth/invalid-credential') {
          console.warn("بيانات الاعتماد غير صالحة");
        }
      }
    };
    
    // معالجة نتيجة إعادة التوجيه مباشرة بعد تحميل الصفحة
    handleRedirectResult();
  }, [auth]);

  return (
    <TooltipProvider>
      <Toaster />
      <RedirectHandler />
      {showHeaderFooter && <SmartHeader />}
      <AppRoutes />
      {showHeaderFooter && <Footer />}
    </TooltipProvider>
  );
}

export default App;