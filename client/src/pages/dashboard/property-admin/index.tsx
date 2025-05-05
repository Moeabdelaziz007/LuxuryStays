import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { UserRole } from "@/features/auth/types";
import { Button } from "@/components/ui/button";

export default function PropertyAdminDashboard() {
  const { user, loading, logout } = useAuth();
  const [_, setLocation] = useLocation();

  useEffect(() => {
    // Redirect if not logged in or not a property admin
    if (!loading && (!user || user.role !== UserRole.PROPERTY_ADMIN)) {
      setLocation("/");
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-2xl text-accent">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== UserRole.PROPERTY_ADMIN) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold font-poppins mb-2">
              Property Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {user.name}
            </p>
          </div>
          <Button
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-primary"
            onClick={() => logout()}
          >
            Logout
          </Button>
        </div>

        <div className="bg-card rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Properties</h2>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              You don't have any properties listed yet.
            </p>
            <Button className="mt-4 bg-accent text-primary hover:bg-accent/90">
              Add New Property
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-4">Booking Requests</h2>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              You have no pending booking requests.
            </p>
            <Button className="mt-4 bg-accent text-primary hover:bg-accent/90">
              View Booking History
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
