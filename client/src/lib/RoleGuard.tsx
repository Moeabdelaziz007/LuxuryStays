import { useAuth } from "@/contexts/auth-context";
import { Redirect } from "wouter";

export default function RoleGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) {
  const { user, role, loading } = useAuth();

  // Show loading state
  if (loading) {
    return <div className="p-6 flex justify-center">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Redirect to="/" />;
  }

  // Redirect to home if role not allowed
  if (!role || !allowedRoles.includes(role)) {
    return <Redirect to="/" />;
  }

  // Render children if authentication and authorization pass
  return <>{children}</>;
}