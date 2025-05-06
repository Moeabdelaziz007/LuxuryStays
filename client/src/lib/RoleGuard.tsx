import { useAuth } from "@/contexts/auth-context";
import { Redirect } from "wouter";

export default function RoleGuard({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  // Show loading state with Arabic text
  if (loading) {
    return <div className="p-6 flex justify-center text-white">⏳ جاري التحقق من الوصول...</div>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Redirect to="/login" />;
  }

  // Allow super admin to access all routes
  if (user.role === "SUPER_ADMIN") {
    return <>{children}</>;
  }

  // Redirect unauthorized users
  if (!user.role || user.role !== role) {
    return <Redirect to="/unauthorized" />;
  }

  // Render children if authentication and authorization pass
  return <>{children}</>;
}