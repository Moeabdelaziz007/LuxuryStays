import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useTranslation } from "@/features/i18n/hooks/useTranslation";
import { AlertCircle } from "lucide-react";

// Create a form schema with Zod
const formSchema = z.object({
  email: z.string().email({ message: "يرجى إدخال بريد إلكتروني صالح" }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" })
});

type FormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setAuthError(null);
      setIsLoading(true);
      await login({
        email: data.email,
        password: data.password
      });
      onSuccess?.();
    } catch (error: any) {
      console.error("Login error:", error);
      // Handle Firebase auth errors with user-friendly messages
      if (error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found') {
        setAuthError("البريد الإلكتروني غير صحيح أو غير مسجل");
      } else if (error.code === 'auth/wrong-password') {
        setAuthError("كلمة المرور غير صحيحة");
      } else if (error.code === 'auth/too-many-requests') {
        setAuthError("لقد أجريت الكثير من المحاولات. يرجى المحاولة لاحقًا");
      } else if (error.code === 'auth/network-request-failed') {
        setAuthError("خطأ في الاتصال بالشبكة. تحقق من اتصالك بالإنترنت");
      } else {
        setAuthError(error.message || "حدث خطأ أثناء تسجيل الدخول");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      setAuthError(null);
      setIsGoogleLoading(true);
      await loginWithGoogle();
      onSuccess?.();
    } catch (error: any) {
      console.error("Google login error:", error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        setAuthError("تم إغلاق نافذة تسجيل الدخول");
      } else if (error.code === 'auth/unauthorized-domain') {
        setAuthError("هذا الموقع غير مصرح له باستخدام تسجيل الدخول عبر Google");
      } else {
        setAuthError(error.message || "حدث خطأ أثناء تسجيل الدخول باستخدام Google");
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Authentication error display */}
        {authError && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-lg shadow-inner animate-pulse flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{authError}</span>
          </div>
        )}
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">{t('auth.email')}</FormLabel>
              <FormControl>
                <Input 
                  placeholder="you@example.com" 
                  {...field} 
                  className="bg-black/60 border-gray-700 focus:border-[#39FF14] focus:ring-[#39FF14]/30 text-white placeholder:text-gray-500"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel className="text-gray-300">{t('auth.password')}</FormLabel>
                <a href="#" className="text-[#39FF14] text-sm hover:underline hover:text-[#39FF14]/80 transition-colors">
                  {t('auth.forgotPassword')}
                </a>
              </div>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  {...field} 
                  className="bg-black/60 border-gray-700 focus:border-[#39FF14] focus:ring-[#39FF14]/30 text-white placeholder:text-gray-500"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-[#39FF14] hover:bg-[#39FF14]/90 text-black font-medium transition-all relative overflow-hidden group"
          disabled={isLoading}
        >
          <span className="relative z-10">
            {isLoading ? t('common.loading') : t('auth.login')}
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-[#39FF14]/0 via-white/20 to-[#39FF14]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
        </Button>
        
        <div className="relative flex justify-center text-xs uppercase my-4">
          <span className="bg-black px-2 text-gray-500">
            {t('auth.orContinue')}
          </span>
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-800"></span>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4 rtl:space-x-reverse">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-12 h-12 rounded-full border-gray-700 hover:bg-[#39FF14]/10 hover:text-[#39FF14] hover:border-[#39FF14]/30 transition-all duration-300"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
