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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Loader2, BellOff, Bell } from "lucide-react";

const settingsFormSchema = z.object({
  language: z.enum(["ar", "en"]),
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  theme: z.enum(["system", "light", "dark"]),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function UserSettingsForm() {
  const { user, updateUserInfo } = useAuth();
  
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      language: user?.settings?.language || "ar",
      emailNotifications: user?.settings?.emailNotifications ?? true,
      smsNotifications: user?.settings?.smsNotifications ?? false,
      marketingEmails: user?.settings?.marketingEmails ?? true,
      theme: user?.settings?.theme || "system",
    },
  });
  
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: SettingsFormValues) => {
      if (!user?.uid || !db) {
        throw new Error("يجب تسجيل الدخول لتحديث الإعدادات");
      }
      
      // Update user document in Firestore
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        "settings.language": data.language,
        "settings.emailNotifications": data.emailNotifications,
        "settings.smsNotifications": data.smsNotifications,
        "settings.marketingEmails": data.marketingEmails,
        "settings.theme": data.theme,
        updatedAt: new Date()
      });
      
      // Update local user state
      updateUserInfo({
        ...user,
        settings: {
          ...user.settings,
          ...data
        }
      });
      
      return data;
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Language */}
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">اللغة</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="اختر اللغة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-gray-400">
                  لغة الواجهة الرئيسية للتطبيق
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Theme */}
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">سمة التطبيق</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="اختر سمة التطبيق" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="system">تلقائي (حسب النظام)</SelectItem>
                    <SelectItem value="light">فاتح</SelectItem>
                    <SelectItem value="dark">داكن</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-gray-400">
                  اختر سمة التطبيق المفضلة لديك
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[#39FF14]">إعدادات الإشعارات</h3>
          
          {/* Email Notifications */}
          <FormField
            control={form.control}
            name="emailNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg bg-gray-800 p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base text-white">
                    إشعارات البريد الإلكتروني
                  </FormLabel>
                  <FormDescription className="text-sm text-gray-400">
                    استلام إشعارات عن الحجوزات والعروض عبر البريد الإلكتروني
                  </FormDescription>
                </div>
                <FormControl>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    {field.value ? (
                      <Bell className="h-4 w-4 text-[#39FF14]" />
                    ) : (
                      <BellOff className="h-4 w-4 text-gray-400" />
                    )}
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-[#39FF14]"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          
          {/* SMS Notifications */}
          <FormField
            control={form.control}
            name="smsNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg bg-gray-800 p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base text-white">
                    إشعارات الرسائل النصية
                  </FormLabel>
                  <FormDescription className="text-sm text-gray-400">
                    استلام إشعارات عن الحجوزات والتأكيدات عبر الرسائل النصية
                  </FormDescription>
                </div>
                <FormControl>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    {field.value ? (
                      <Bell className="h-4 w-4 text-[#39FF14]" />
                    ) : (
                      <BellOff className="h-4 w-4 text-gray-400" />
                    )}
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-[#39FF14]"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          
          {/* Marketing Emails */}
          <FormField
            control={form.control}
            name="marketingEmails"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg bg-gray-800 p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base text-white">
                    رسائل تسويقية وعروض
                  </FormLabel>
                  <FormDescription className="text-sm text-gray-400">
                    استلام عروض خاصة وتحديثات عن أحدث العقارات والخدمات
                  </FormDescription>
                </div>
                <FormControl>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    {field.value ? (
                      <Bell className="h-4 w-4 text-[#39FF14]" />
                    ) : (
                      <BellOff className="h-4 w-4 text-gray-400" />
                    )}
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-[#39FF14]"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
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