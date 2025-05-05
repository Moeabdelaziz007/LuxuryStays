import { useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "./contexts/auth-context";
import { useEffect } from "react";
import { UserRole } from "./features/auth/types";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { getAuth, getRedirectResult } from "firebase/auth";
import AppRoutes from "./routes";

function RedirectHandler() {
  const { user, role, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && user && role) {
      // Redirect based on user role if user is on the home page
      if (location.pathname === '/') {
        switch (role) {
          case UserRole.CUSTOMER:
            navigate('/customer');
            break;
          case UserRole.PROPERTY_ADMIN:
            navigate('/property-admin');
            break;
          case UserRole.SUPER_ADMIN:
            navigate('/super-admin');
            break;
        }
      }
    }
  }, [user, role, loading, location, navigate]);

  return null;
}

function App() {
  const location = useLocation();
  const showHeaderFooter = !location.pathname.includes('/super-admin') && 
                           !location.pathname.includes('/property-admin') && 
                           !location.pathname.includes('/customer');
  const auth = getAuth();
  
  // Handle redirect from Google sign-in
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log("Google sign-in successful");
        }
      } catch (error) {
        console.error("Google redirect error:", error);
      }
    };
    
    handleRedirectResult();
  }, [auth]);

  return (
    <TooltipProvider>
      <Toaster />
      <RedirectHandler />
      {showHeaderFooter && <Header />}
      <AppRoutes />
      {showHeaderFooter && <Footer />}
    </TooltipProvider>
  );
}

export default App;