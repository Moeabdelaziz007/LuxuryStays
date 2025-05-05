import { Route, Switch } from "wouter";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import CustomerDashboard from "@/pages/dashboard/customer";
import PropertyAdminDashboard from "@/pages/dashboard/property-admin";
import SuperAdminDashboard from "@/pages/dashboard/super-admin";
import RoleGuard from "@/lib/RoleGuard";
import { UserRole } from "@shared/schema";

export default function AppRoutes() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      
      {/* Protected Routes with RoleGuard */}
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
      
      {/* 404 Route */}
      <Route component={NotFound} />
    </Switch>
  );
}