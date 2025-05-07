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
  const { user, loading, updateUserInfo } = useAuth();
  const [location, setLocation] = useLocation();
  const auth = getAuth();
  
  // Handle redirect result from Google sign-in
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        console.log("[DEBUG] RedirectHandler in App.tsx:", { user, loading, pathname: location });
        console.log("Checking for redirect result from Google sign-in...");
        
        // تحسين معالجة نتائج إعادة التوجيه من Google
        console.log("Current domains in Firebase that should be authorized:", window.location.host);
        const result = await getRedirectResult(auth).catch(error => {
          console.error("Error getting redirect result:", error);
          if (error.code === 'auth/unauthorized-domain') {
            console.error(`Please add "${window.location.host}" to Firebase authorized domains!`);
          }
          return null;
        });
        
        if (result) {
          console.log("✅ Google redirect sign-in successful!");
          console.log("User signed in:", result.user.email);
          console.log("Display name:", result.user.displayName);
          console.log("User ID:", result.user.uid);
          
          // Get saved redirect path if any
          const savedRedirectPath = localStorage.getItem('googleAuthRedirectPath');
          
          if (savedRedirectPath) {
            console.log("Redirecting to saved path after Google login:", savedRedirectPath);
            localStorage.removeItem('googleAuthRedirectPath'); // Clear it after use
            setLocation(savedRedirectPath);
          } else {
            // Redirect based on role if available in the token
            const idTokenResult = await result.user.getIdTokenResult();
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