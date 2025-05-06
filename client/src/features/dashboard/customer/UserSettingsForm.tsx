import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const settingsFormSchema = z.object({
  language: z.enum(["ar", "en"]),
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  darkMode: z.boolean().default(true),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }).optional().or(z.literal("")),
  confirmPassword: z.string().optional().or(z.literal("")),
}).refine(data => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function UserSettingsForm() {
  const { user, updateUserInfo } = useAuth();
  const [changePassword, setChangePassword] = useState(false);
  
  // Default values based on user's existing preferences or defaults
  const userPreferences = user?.preferences || { language: "ar", emailNotifications: true, smsNotifications: false, darkMode: true };
  
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      language: userPreferences.language || "ar",
      emailNotifications: userPreferences.emailNotifications ?? true,
      smsNotifications: userPreferences.smsNotifications ?? false,
      darkMode: userPreferences.darkMode ?? true,
      password: "",
      confirmPassword: "",
    },
  });
  
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: SettingsFormValues) => {
      if (!user?.uid || !db) {
        throw new Error("يجب تسجيل الدخول لتحديث الإعدادات");
      }
      
      // Prepare updated preferences
      const updatedPreferences = {
        language: data.language,
        emailNotifications: data.emailNotifications,
        smsNotifications: data.smsNotifications,
        darkMode: data.darkMode,
      };
      
      // Update user document in Firestore
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        preferences: updatedPreferences,
        updatedAt: new Date()
      });
      
      // TODO: Handle password change if needed
      // This would typically be a separate Firebase Auth API call
      
      // Update local user state
      updateUserInfo({
        ...user,
        preferences: updatedPreferences
      });
      
      return updatedPreferences;
    },
    onSuccess: () => {
      toast({
        title: "تم تحديث الإعدادات",
        description: "تم تحديث إعدادات حسابك بنجاح.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "حدث خطأ",
        description: error.message || "فشل في تحديث الإعدادات. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  });
  
  function onSubmit(data: SettingsFormValues) {
    updateSettingsMutation.mutate(data);
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          {/* Language Setting */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg font-medium text-[#39FF14] mb-4">اللغة والواجهة</h3>
            
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel className="text-white">اللغة</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4 rtl:space-x-reverse"
                    >
                      <FormItem className="flex items-center space-x-2 rtl:space-x-reverse">
                        <FormControl>
                          <RadioGroupItem value="ar" />
                        </FormControl>
                        <FormLabel className="font-normal text-white">
                          العربية
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 rtl:space-x-reverse">
                        <FormControl>
                          <RadioGroupItem value="en" />
                        </FormControl>
                        <FormLabel className="font-normal text-white">
                          English
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="darkMode"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel className="text-white">الوضع الداكن</FormLabel>
                    <FormDescription className="text-gray-400">
                      تفعيل المظهر الداكن للواجهة.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-[#39FF14]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          {/* Notifications Setting */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg font-medium text-[#39FF14] mb-4">الإشعارات</h3>
            
            <FormField
              control={form.control}
              name="emailNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between mb-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-white">إشعارات البريد الإلكتروني</FormLabel>
                    <FormDescription className="text-gray-400">
                      تلقي إشعارات عبر البريد الإلكتروني حول الحجوزات والعروض.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-[#39FF14]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="smsNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel className="text-white">إشعارات الرسائل النصية</FormLabel>
                    <FormDescription className="text-gray-400">
                      تلقي إشعارات عبر الرسائل النصية SMS.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-[#39FF14]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          {/* Security Settings */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-[#39FF14]">الأمان</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-white border-gray-600 hover:bg-gray-700"
                onClick={() => setChangePassword(!changePassword)}
              >
                {changePassword ? "إلغاء" : "تغيير كلمة المرور"}
              </Button>
            </div>
            
            {changePassword && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">كلمة المرور الجديدة</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="bg-gray-800 border-gray-700 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">تأكيد كلمة المرور</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="bg-gray-800 border-gray-700 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-[#39FF14] text-black hover:bg-[#50FF30]"
            disabled={updateSettingsMutation.isPending}
          >
            {updateSettingsMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جارٍ الحفظ...
              </>
            ) : "حفظ الإعدادات"}
          </Button>
        </div>
      </form>
    </Form>
  );
}