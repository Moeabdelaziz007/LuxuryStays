import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "الاسم يجب أن يكون أكثر من حرفين" }),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
  profileImage: z.instanceof(FileList).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function UserProfileForm() {
  const { user, updateUserInfo } = useAuth();
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profileImage || null);
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      bio: user?.bio || "",
    },
  });
  
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      if (!user?.uid || !db) {
        throw new Error("يجب تسجيل الدخول لتحديث الملف الشخصي");
      }
      
      // Upload profile image if provided
      let profileImageUrl = user?.profileImage || "";
      if (data.profileImage && data.profileImage.length > 0) {
        setIsUploading(true);
        const file = data.profileImage[0];
        
        try {
          // Create a storage reference
          const storageRef = ref(storage!, `users/${user.uid}/profile/${Date.now()}_${file.name}`);
          
          // Upload the file
          const snapshot = await uploadBytes(storageRef, file);
          
          // Get download URL
          profileImageUrl = await getDownloadURL(snapshot.ref);
        } catch (error) {
          console.error("Error uploading profile image:", error);
          throw new Error("فشل في رفع الصورة الشخصية");
        } finally {
          setIsUploading(false);
        }
      }
      
      // Update user document in Firestore
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        name: data.name,
        phone: data.phone || null,
        address: data.address || null,
        bio: data.bio || null,
        profileImage: profileImageUrl,
        updatedAt: new Date()
      });
      
      // Update local user state
      updateUserInfo({
        ...user,
        name: data.name,
        phone: data.phone || null,
        address: data.address || null,
        bio: data.bio || null,
        profileImage: profileImageUrl
      });
      
      return {
        ...data,
        profileImage: profileImageUrl
      };
    },
    onSuccess: () => {
      toast({
        title: "تم تحديث الملف الشخصي",
        description: "تم تحديث معلومات ملفك الشخصي بنجاح.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "حدث خطأ",
        description: error.message || "فشل في تحديث الملف الشخصي. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  });
  
  // Handle image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  function onSubmit(data: ProfileFormValues) {
    updateProfileMutation.mutate(data);
  }
  
  const isPending = updateProfileMutation.isPending || isUploading;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">الاسم</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="أدخل اسمك الكامل" 
                      className="bg-gray-800 border-gray-700 text-white" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div>
            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">رقم الهاتف</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="أدخل رقم هاتفك" 
                      className="bg-gray-800 border-gray-700 text-white" 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">العنوان</FormLabel>
              <FormControl>
                <Input 
                  placeholder="أدخل عنوانك" 
                  className="bg-gray-800 border-gray-700 text-white" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Bio */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">نبذة عنك</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="أدخل نبذة قصيرة عنك" 
                  className="bg-gray-800 border-gray-700 text-white min-h-[100px]" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Profile Image */}
        <FormField
          control={form.control}
          name="profileImage"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel className="text-white">الصورة الشخصية</FormLabel>
              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                {previewUrl && (
                  <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-[#39FF14]/30">
                    <img 
                      src={previewUrl} 
                      alt="Profile preview" 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                )}
                <div className="flex-1">
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      {...field}
                      onChange={(e) => {
                        onChange(e.target.files);
                        handleImageChange(e);
                      }}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400 text-sm mt-1">
                    حجم الصورة المسموح به: 2 ميجابايت كحد أقصى. يفضل صورة مربعة.
                  </FormDescription>
                  <FormMessage />
                </div>
              </div>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-[#39FF14] text-black hover:bg-[#50FF30]"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جارٍ الحفظ...
              </>
            ) : "حفظ التغييرات"}
          </Button>
        </div>
      </form>
    </Form>
  );
}