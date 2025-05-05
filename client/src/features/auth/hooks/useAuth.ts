import { useAuth as useAppAuth } from "@/contexts/auth-context";

// Re-export the useAuth hook from the main context
export const useAuth = useAppAuth;
