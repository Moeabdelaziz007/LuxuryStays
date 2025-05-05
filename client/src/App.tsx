import { useLocation } from "wouter";
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
  const [location, setLocation] = useLocation();
  
  useEffect(() => {
    if (!loading && user && role) {
      // Redirect based on user role if user is on the home page
      if (location === '/') {
        switch (role) {
          case UserRole.CUSTOMER:
            setLocation('/dashboard/customer');
            break;
          case UserRole.PROPERTY_ADMIN:
            setLocation('/dashboard/property-admin');
            break;
          case UserRole.SUPER_ADMIN:
            setLocation('/dashboard/super-admin');
            break;
        }
      }
    }
  }, [user, role, loading, location, setLocation]);

  return null;
}

function App() {
  const [location] = useLocation();
  const showHeaderFooter = !location.includes('/dashboard');
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