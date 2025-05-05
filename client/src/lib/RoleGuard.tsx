import { useAuth } from "@/contexts/auth-context";
import { Navigate } from "react-router-dom";

export default function RoleGuard({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) {
  const { user, role: userRole, loading } = useAuth();

  // Show loading state with Arabic text
  if (loading) {
    return <div className="p-6 flex justify-center text-white">⏳ جاري التحقق من الوصول...</div>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Allow super admin to access all routes
  if (userRole === "SUPER_ADMIN") {
    return <>{children}</>;
  }

  // Redirect unauthorized users
  if (!userRole || userRole !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render children if authentication and authorization pass
  return <>{children}</>;
}