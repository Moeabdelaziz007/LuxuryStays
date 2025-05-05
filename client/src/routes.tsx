import { Route, Switch } from "wouter";
import NotFound from "@/pages/not-found";
import CustomerDashboard from "@/pages/dashboard/customer";
import PropertyAdminDashboard from "@/pages/dashboard/property-admin";
import SuperAdminDashboard from "@/pages/dashboard/super-admin";
import RoleGuard from "@/lib/RoleGuard";
import { UserRole } from "@shared/schema";
import HomePage from "@/features/home/HomePage";

export default function AppRoutes() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/">
        <HomePage />
      </Route>
      
      <Route path="/login">
        <HomePage />
      </Route>
      
      {/* Protected Routes with RoleGuard */}
      <Route path="/dashboard/customer">
        <RoleGuard role={UserRole.CUSTOMER}>
          <CustomerDashboard />
        </RoleGuard>
      </Route>
      
      <Route path="/dashboard/property-admin">
        <RoleGuard role={UserRole.PROPERTY_ADMIN}>
          <PropertyAdminDashboard />
        </RoleGuard>
      </Route>
      
      <Route path="/dashboard/super-admin">
        <RoleGuard role={UserRole.SUPER_ADMIN}>
          <SuperAdminDashboard />
        </RoleGuard>
      </Route>
      
      {/* 404 Route */}
      <Route component={NotFound} />
    </Switch>
  );
}