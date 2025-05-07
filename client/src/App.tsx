import { useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "./contexts/auth-context";
import { useEffect, useState } from "react";
import { UserRole } from "./features/auth/types";
import Header from "./components/layout/Header";
import SmartHeader from "./components/layout/SmartHeader";
import Footer from "./components/layout/Footer";
import { getAuth, getRedirectResult } from "firebase/auth";
import DatabaseConnectionStatus from "./components/DatabaseConnectionStatus";
import WelcomeMessage from "./components/WelcomeMessage";
import GoogleAuthDomainAlert from "./components/GoogleAuthDomainAlert";
import AppRoutes from "./routes";

function RedirectHandler() {
  const { user, loading, updateUserInfo } = useAuth();
  const [location, setLocation] = useLocation();
  const auth = getAuth();
  
  // Handle redirect result from Google sign-in
  useEffect(() => {
    const handleRedirectResult = async () => {
      // التحقق من وجود معلمات طلب Google Oauth في المسار الحالي
      const currentUrl = new URL(window.location.href);
      const hasOauthParams = currentUrl.search.includes('oauth') || 
                            currentUrl.search.includes('google') || 
                            currentUrl.search.includes('firebaseui');
      
      // التحقق من وجود مؤشر لعملية مصادقة معلقة
      const pendingAuth = localStorage.getItem('pendingGoogleAuth') === 'true';
      
      try {
        console.log("[DEBUG] RedirectHandler in App.tsx:", { user, loading, pathname: location });
        console.log("Checking for redirect result from Google sign-in...");
        
        // إعداد متغيرات للتعامل مع نتيجة إعادة التوجيه
        let authResult = null;
        
        // تنفيذ التحقق من نتيجة إعادة التوجيه
        try {
          // استخدام authDomain من Firebase Hosting
          const customAuthConfig = {
            // استخدام نطاق Firebase المعتمد بصرف النظر عن النطاق الحالي
            authDomain: 'staychill-3ed08.firebaseapp.com'
          };
          
          // محاولة الحصول على نتيجة إعادة التوجيه
          authResult = await getRedirectResult(auth);
        } catch (redirectError) {
          console.error("Error getting redirect result:", redirectError);
          
          if (redirectError.code === 'auth/unauthorized-domain') {
            console.error(`Firebase domain error: "${window.location.host}" not in authorized domains!`);
            console.error("Using alternative Firebase hosting domain for authentication");
            
            // قم بعرض تنبيه للمستخدم ليعرف لماذا سيتم نقله إلى نطاق آخر
            if (pendingAuth || hasOauthParams) {
              console.log("Detected pending auth or OAuth parameters - preparing for Firebase domain auth");
            }
          }
          
          // لا حاجة للتوقف هنا - سنعود إلى النطاق المعتمد
          authResult = null;
        }
        
        // التعامل مع نتيجة إعادة التوجيه الناجحة
        if (authResult) {
          console.log("✅ Google redirect sign-in successful!");
          console.log("User signed in:", authResult.user.email);
          console.log("Display name:", authResult.user.displayName);
          console.log("User ID:", authResult.user.uid);
          
          // استرجاع مسار إعادة التوجيه المحفوظ
          let savedRedirectPath = localStorage.getItem('googleAuthRedirectPath');
          
          // مسح متغير عملية المصادقة المعلقة
          localStorage.removeItem('pendingGoogleAuth');
          
          if (savedRedirectPath) {
            console.log("Redirecting to saved path after Google login:", savedRedirectPath);
            localStorage.removeItem('googleAuthRedirectPath'); // Clear it after use
            setLocation(savedRedirectPath);
          } else {
            // Redirect based on role if available in the token
            const idTokenResult = await authResult.user.getIdTokenResult();
            const role = idTokenResult.claims.role;
            
            if (role) {
              console.log("User role from token:", role);
              if (role === UserRole.SUPER_ADMIN) {
                setLocation('/super-admin');
              } else if (role === UserRole.PROPERTY_ADMIN) {
                setLocation('/property-admin');
              } else {
                setLocation('/customer');
              }
            } else {
              // Default to homepage if no specific role or redirect
              setLocation('/');
            }
          }
        } else {
          console.log("No redirect result found");
        }
      } catch (error: any) {
        console.error("❌ Error handling Google redirect result:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        
        if (error.code === 'auth/unauthorized-domain') {
          console.error("Unauthorized domain. Please add current domain to Firebase Auth settings");
        }
      }
    };
    
    // Always check for redirect results since the page could have loaded from a redirect
    handleRedirectResult();
  }, [auth, user, loading, setLocation, location]);
  
  // Regular auth state redirect handling
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
            dashboardPath = '/dashboard/customer';
            break;
          case UserRole.PROPERTY_ADMIN:
            dashboardPath = '/dashboard/property-admin';
            break;
          case UserRole.SUPER_ADMIN:
            dashboardPath = '/dashboard/super-admin';
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
  const [location, setLocation] = useLocation();
  const { loading } = useAuth();
  
  // نعرض Header و Footer فقط في الصفحات العامة
  const showHeaderFooter = !location.includes('/super-admin') && 
                           !location.includes('/property-admin') && 
                           !location.includes('/customer') &&
                           !location.includes('/splash');
  const auth = getAuth();
  
  // عند تحميل التطبيق لأول مرة، قم بالانتقال إلى صفحة البداية
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('visited');
    
    // تأكد من عدم الانتقال إلى صفحة البداية إذا كان المستخدم قد قام بتنقل يدوي بالفعل
    if (location === '/' && !loading && !hasVisited) {
      sessionStorage.setItem('visited', 'true');
      setLocation('/splash');
    }
  }, [location, loading, setLocation]);
  
  // نستخدم RedirectHandler للتعامل مع جميع عمليات إعادة التوجيه من مزودي المصادقة
  // تم إزالة معالجة إعادة التوجيه الإضافية هنا لتجنب التداخل والتكرار

  return (
    <TooltipProvider>
      <Toaster />
      <RedirectHandler />
      <DatabaseConnectionStatus />
      <GoogleAuthDomainAlert />
      <WelcomeMessage />
      {showHeaderFooter && <SmartHeader />}
      <AppRoutes />
      {showHeaderFooter && <Footer />}
    </TooltipProvider>
  );
}

export default App;