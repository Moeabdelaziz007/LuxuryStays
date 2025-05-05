import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { useAuth } from "./contexts/auth-context";
import { useEffect } from "react";
import Home from "./pages/home";
import CustomerDashboard from "./pages/dashboard/customer";
import PropertyAdminDashboard from "./pages/dashboard/property-admin";
import SuperAdminDashboard from "./pages/dashboard/super-admin";
import { UserRole } from "./features/auth/types";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { getAuth, getRedirectResult } from "firebase/auth";

import RoleGuard from "./lib/RoleGuard";

function Router() {
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

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard/customer">
        <RoleGuard allowedRoles={[UserRole.CUSTOMER, UserRole.PROPERTY_ADMIN, UserRole.SUPER_ADMIN]}>
          <CustomerDashboard />
        </RoleGuard>
      </Route>
      <Route path="/dashboard/property-admin">
        <RoleGuard allowedRoles={[UserRole.PROPERTY_ADMIN, UserRole.SUPER_ADMIN]}>
          <PropertyAdminDashboard />
        </RoleGuard>
      </Route>
      <Route path="/dashboard/super-admin">
        <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
          <SuperAdminDashboard />
        </RoleGuard>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const location = useLocation()[0];
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
      {showHeaderFooter && <Header />}
      <Router />
      {showHeaderFooter && <Footer />}
    </TooltipProvider>
  );
}

export default App;
