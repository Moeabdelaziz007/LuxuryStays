import { createContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, getUserData, loginUser, registerUser, logoutUser, signInWithGoogle } from "@/lib/firebase";
import { User, AuthState, LoginCredentials, RegisterCredentials } from "../types";
import { useToast } from "@/hooks/use-toast";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  loginWithGoogle: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get additional user data from Firestore
          const userData = await getUserData(firebaseUser.uid);
          setState({ 
            user: userData, 
            loading: false, 
            error: null 
          });
        } else {
          setState({ user: null, loading: false, error: null });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        setState({ user: null, loading: false, error: errorMessage });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setState({ ...state, loading: true, error: null });
      await loginUser(credentials.email, credentials.password);
      toast({
        title: "Login successful",
        description: "Welcome back to StayX!",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      setState({ ...state, loading: false, error: errorMessage });
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setState({ ...state, loading: true, error: null });
      await registerUser(credentials.email, credentials.password, credentials.name);
      toast({
        title: "Registration successful",
        description: "Your account has been created. Welcome to StayX!",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed";
      setState({ ...state, loading: false, error: errorMessage });
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: errorMessage,
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      setState({ ...state, loading: true, error: null });
      await logoutUser();
      setState({ user: null, loading: false, error: null });
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Logout failed";
      setState({ ...state, loading: false, error: errorMessage });
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: errorMessage,
      });
    }
  };

  const loginWithGoogle = async () => {
    try {
      setState({ ...state, loading: true, error: null });
      await signInWithGoogle();
      toast({
        title: "Login successful",
        description: "Welcome to StayX!",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Google login failed";
      setState({ ...state, loading: false, error: errorMessage });
      toast({
        variant: "destructive",
        title: "Google login failed",
        description: errorMessage,
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        login,
        loginWithGoogle,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
