import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useTranslation } from "@/features/i18n/hooks/useTranslation";
import { passwordSchema } from "@/lib/passwordValidation";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import { Info } from "lucide-react";

// Create a schema for the form with Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "الاسم يجب أن يكون أطول من حرفين" }),
  email: z.string().email({ message: "يرجى إدخال بريد إلكتروني صالح" }),
  password: passwordSchema,
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"]
});

type FormValues = z.infer<typeof formSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register, loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [password, setPassword] = useState("");
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      await register({
        name: data.name,
        email: data.email,
        password: data.password
      });
      onSuccess?.();
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      await loginWithGoogle();
      onSuccess?.();
    } catch (error) {
      console.error("Google login error:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.name')}</FormLabel>
              <FormControl>
                <Input 
                  placeholder="الاسم الكامل" 
                  {...field} 
                  className="bg-black/60 border-gray-700 focus:border-[#39FF14] focus:ring-[#39FF14]/30"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.email')}</FormLabel>
              <FormControl>
                <Input 
                  placeholder="you@example.com" 
                  type="email"
                  {...field} 
                  className="bg-black/60 border-gray-700 focus:border-[#39FF14] focus:ring-[#39FF14]/30"
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
              <FormLabel>{t('auth.password')}</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  {...field} 
                  className="bg-black/60 border-gray-700 focus:border-[#39FF14] focus:ring-[#39FF14]/30"
                  onChange={e => {
                    field.onChange(e);
                    setPassword(e.target.value);
                  }}
                />
              </FormControl>
              <PasswordStrengthMeter password={password} />
              <div className="mt-2 bg-black/40 border border-gray-800 rounded-md p-2 text-xs text-gray-400">
                <div className="flex items-start space-x-1 rtl:space-x-reverse">
                  <Info size={14} className="mt-0.5 flex-shrink-0 text-gray-500" />
                  <div>
                    <p className="mb-1">كلمة المرور يجب أن تحتوي على:</p>
                    <ul className="space-y-1 list-disc list-inside rtl:mr-3">
                      <li>8 أحرف على الأقل</li>
                      <li>حرف كبير واحد على الأقل</li>
                      <li>حرف صغير واحد على الأقل</li>
                      <li>رقم واحد على الأقل</li>
                      <li>رمز خاص واحد على الأقل (!@#$%^&*)</li>
                    </ul>
                  </div>
                </div>
              </div>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.confirmPassword')}</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  {...field} 
                  className="bg-black/60 border-gray-700 focus:border-[#39FF14] focus:ring-[#39FF14]/30"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-[#39FF14] hover:bg-[#39FF14]/90 text-black font-medium"
          disabled={isLoading}
        >
          {isLoading ? t('common.loading') : t('auth.register')}
        </Button>
        
        <div className="relative flex justify-center text-xs uppercase my-4">
          <span className="bg-background px-2 text-muted-foreground">
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
            className="w-12 h-12 rounded-full border-gray-700 hover:bg-[#39FF14]/10 hover:text-[#39FF14] hover:border-[#39FF14]/30"
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