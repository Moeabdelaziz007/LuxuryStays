import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast"; 
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";
import { 
  doc, 
  setDoc, 
  addDoc, 
  collection, 
  serverTimestamp 
} from "firebase/firestore";
import { db, storage, safeDoc } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";
import { insertPropertySchema } from "@shared/schema";

// نمد نموذج التحقق مع إضافة حقول خاصة بواجهة المستخدم
const propertyFormSchema = insertPropertySchema.extend({
  id: z.union([z.string(), z.number()]).optional(), // إضافة حقل الهوية كرقم أو نص اختياري
  imageFile: z.instanceof(FileList).optional(),
  featured: z.boolean().nullable().optional().transform(val => val === true) // معالجة قيم null لخاصية featured
}).superRefine((data, ctx) => {
  // إذا كان العقار جديداً (بدون معرف)، نطلب صورة
  if (!data.id && (!data.imageFile || data.imageFile.length === 0) && !data.imageUrl) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "يرجى إرفاق صورة للعقار",
      path: ["imageFile"]
    });
  }
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

interface PropertyFormProps {
  property?: PropertyFormValues;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PropertyForm({ property, onSuccess, onCancel }: PropertyFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(property?.imageUrl || null);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      id: property?.id || undefined,
      name: property?.name || "",
      description: property?.description || "",
      location: property?.location || "",
      price: property?.price || 0,
      currency: property?.currency || "USD",
      imageUrl: property?.imageUrl || "",
      beds: property?.beds || 1,
      baths: property?.baths || 1,
      size: property?.size || 0,
      featured: property?.featured || false,
      adminId: property?.adminId || (user?.id ? parseInt(user.id) : undefined),
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: PropertyFormValues) => {
      if (!user?.uid) throw new Error("يجب تسجيل الدخول لإضافة عقار");
      if (!db) throw new Error("قاعدة البيانات غير متاحة حالياً");
      
      // Handle image upload with improved error handling
      let imageUrl = data.imageUrl;
      if (data.imageFile && data.imageFile.length > 0) {
        try {
          setIsUploading(true);
          const file = data.imageFile[0];
          
          if (!storage) {
            throw new Error("خدمة تخزين الصور غير متاحة حالياً، يرجى استخدام رابط صورة خارجي بدلاً من ذلك");
          }
          
          // Validate file size (max 5MB)
          if (file.size > 5 * 1024 * 1024) {
            throw new Error("حجم الملف كبير جداً. الحد الأقصى المسموح به هو 5 ميجابايت");
          }
          
          // Validate file type
          const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
          if (!validTypes.includes(file.type)) {
            throw new Error("نوع الملف غير مدعوم. يُرجى استخدام صور بتنسيق JPEG أو PNG أو WebP أو GIF");
          }
          
          console.log("بدأ رفع الصورة إلى Firebase Storage...");
          
          // Create a storage reference with a unique name to avoid conflicts
          const storageRef = ref(storage, `properties/${user.uid}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`);
          
          // Upload the file with retry logic
          let uploadAttempts = 0;
          let snapshot;
          
          while (uploadAttempts < 3) {
            try {
              snapshot = await uploadBytes(storageRef, file);
              console.log("تم رفع الصورة بنجاح");
              break;
            } catch (uploadError: any) {
              uploadAttempts++;
              console.error(`فشل محاولة رفع الصورة ${uploadAttempts}/3:`, uploadError);
              
              if (uploadAttempts >= 3) {
                throw new Error(`فشل رفع الصورة: ${uploadError.message || "خطأ غير معروف"}`);
              }
              
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
          
          if (!snapshot) {
            throw new Error("فشل رفع الصورة بعد عدة محاولات");
          }
          
          // Get download URL with retry logic
          let urlAttempts = 0;
          while (urlAttempts < 3) {
            try {
              imageUrl = await getDownloadURL(snapshot.ref);
              console.log("تم الحصول على رابط الصورة بنجاح");
              break;
            } catch (urlError: any) {
              urlAttempts++;
              console.error(`فشل محاولة الحصول على رابط الصورة ${urlAttempts}/3:`, urlError);
              
              if (urlAttempts >= 3) {
                throw new Error(`فشل الحصول على رابط الصورة: ${urlError.message || "خطأ غير معروف"}`);
              }
              
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        } catch (imageError: any) {
          setIsUploading(false);
          toast({
            title: "خطأ في رفع الصورة",
            description: imageError.message || "حدث خطأ أثناء رفع الصورة، يرجى المحاولة مرة أخرى أو استخدام رابط صورة",
            variant: "destructive"
          });
          throw imageError;
        } finally {
          setIsUploading(false);
        }
      }
      
      // Prepare the property data with validation
      const propertyData = {
        name: data.name.trim(),
        description: data.description.trim(),
        location: data.location.trim(),
        price: Number(data.price) || 0,
        currency: data.currency || "USD",
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200", // صورة افتراضية
        beds: Number(data.beds) || 1,
        baths: Number(data.baths) || 1,
        size: Number(data.size) || 0,
        featured: !!data.featured,
        adminId: user.id ? parseInt(user.id) : null,
        ownerId: user.uid, // For Firestore query by owner
        createdAt: serverTimestamp(), // إضافة طابع زمني للإنشاء
        updatedAt: serverTimestamp() // إضافة طابع زمني للتحديث
      };
      
      try {
        console.log("جاري إضافة العقار إلى Firestore...");
        
        // استخدام وظيفة safeDoc للتعامل مع الأخطاء المحتملة
        return await safeDoc(async () => {
          // Add to Firestore
          const docRef = await addDoc(collection(db, "properties"), propertyData);
          console.log("تم إضافة العقار بنجاح بمعرف:", docRef.id);
          
          // إرجاع البيانات الكاملة مع المعرف
          return { id: docRef.id, ...propertyData };
        }, null, 3); // 3 محاولات كحد أقصى
      } catch (firestoreError: any) {
        console.error("خطأ في إضافة العقار إلى Firestore:", firestoreError);
        
        // محاولة حذف الصورة التي تم رفعها في حالة فشل إضافة العقار
        if (imageUrl && imageUrl !== data.imageUrl && storage) {
          try {
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
            console.log("تم حذف الصورة المرفوعة بعد فشل إضافة العقار");
          } catch (deleteError) {
            console.error("فشل حذف الصورة بعد فشل إضافة العقار:", deleteError);
          }
        }
        
        throw new Error(`فشلت عملية إضافة العقار: ${firestoreError.message || "خطأ غير معروف في قاعدة البيانات"}`);
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["owner-properties"] });
      queryClient.invalidateQueries({ queryKey: ["featured-properties"] });
      if (result?.featured) {
        queryClient.invalidateQueries({ queryKey: ["featured-properties"] });
      }
      toast({
        title: "تم إضافة العقار بنجاح",
        description: "تم إضافة العقار الجديد إلى قائمة عقاراتك",
        variant: "default"
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "فشلت عملية إضافة العقار",
        description: error.message || "حدث خطأ أثناء إضافة العقار، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: PropertyFormValues) => {
      if (!user?.uid) throw new Error("يجب تسجيل الدخول لتعديل العقار");
      if (!db) throw new Error("قاعدة البيانات غير متاحة حالياً");
      if (!data.id) throw new Error("معرف العقار غير موجود");
      
      // Handle image upload with improved error handling
      let imageUrl = data.imageUrl;
      if (data.imageFile && data.imageFile.length > 0) {
        try {
          setIsUploading(true);
          const file = data.imageFile[0];
          
          if (!storage) {
            throw new Error("خدمة تخزين الصور غير متاحة حالياً، يرجى استخدام رابط صورة خارجي بدلاً من ذلك");
          }
          
          // Validate file size (max 5MB)
          if (file.size > 5 * 1024 * 1024) {
            throw new Error("حجم الملف كبير جداً. الحد الأقصى المسموح به هو 5 ميجابايت");
          }
          
          // Validate file type
          const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
          if (!validTypes.includes(file.type)) {
            throw new Error("نوع الملف غير مدعوم. يُرجى استخدام صور بتنسيق JPEG أو PNG أو WebP أو GIF");
          }
          
          console.log("بدأ رفع الصورة إلى Firebase Storage للتحديث...");
          
          // Create a storage reference with a unique name to avoid conflicts
          const storageRef = ref(storage, `properties/${user.uid}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`);
          
          // Upload the file with retry logic
          let uploadAttempts = 0;
          let snapshot;
          
          while (uploadAttempts < 3) {
            try {
              snapshot = await uploadBytes(storageRef, file);
              console.log("تم رفع الصورة بنجاح");
              break;
            } catch (uploadError: any) {
              uploadAttempts++;
              console.error(`فشل محاولة رفع الصورة ${uploadAttempts}/3:`, uploadError);
              
              if (uploadAttempts >= 3) {
                throw new Error(`فشل رفع الصورة: ${uploadError.message || "خطأ غير معروف"}`);
              }
              
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
          
          if (!snapshot) {
            throw new Error("فشل رفع الصورة بعد عدة محاولات");
          }
          
          // Get download URL with retry logic
          let urlAttempts = 0;
          while (urlAttempts < 3) {
            try {
              imageUrl = await getDownloadURL(snapshot.ref);
              console.log("تم الحصول على رابط الصورة بنجاح");
              break;
            } catch (urlError: any) {
              urlAttempts++;
              console.error(`فشل محاولة الحصول على رابط الصورة ${urlAttempts}/3:`, urlError);
              
              if (urlAttempts >= 3) {
                throw new Error(`فشل الحصول على رابط الصورة: ${urlError.message || "خطأ غير معروف"}`);
              }
              
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        } catch (imageError: any) {
          setIsUploading(false);
          toast({
            title: "خطأ في رفع الصورة",
            description: imageError.message || "حدث خطأ أثناء رفع الصورة، يرجى المحاولة مرة أخرى أو استخدام رابط صورة",
            variant: "destructive"
          });
          throw imageError;
        } finally {
          setIsUploading(false);
        }
      }
      
      // حفظ رابط الصورة القديم قبل التحديث
      const oldImageUrl = data.imageUrl;
      
      // Prepare the property data with validation
      const propertyData = {
        name: data.name.trim(),
        description: data.description.trim(),
        location: data.location.trim(),
        price: Number(data.price) || 0,
        currency: data.currency || "USD",
        imageUrl: imageUrl || data.imageUrl,
        beds: Number(data.beds) || 1,
        baths: Number(data.baths) || 1,
        size: Number(data.size) || 0,
        featured: !!data.featured,
        adminId: user.id ? parseInt(user.id) : null,
        ownerId: user.uid, // For Firestore query by owner
        updatedAt: serverTimestamp() // إضافة طابع زمني للتحديث
      };
      
      try {
        console.log("جاري تحديث العقار في Firestore...");
        
        // استخدام وظيفة safeDoc للتعامل مع الأخطاء المحتملة
        return await safeDoc(async () => {
          // Update in Firestore
          if (db) {
            const docRef = doc(db, "properties", data.id!.toString());
            await setDoc(docRef, propertyData, { merge: true });
            console.log("تم تحديث العقار بنجاح");
            
            // محاولة حذف الصورة القديمة إذا تم تغييرها
            if (imageUrl && oldImageUrl && imageUrl !== oldImageUrl && storage && oldImageUrl.includes("firebasestorage")) {
              try {
                // استخراج المسار من URL الكامل للصورة
                // عادةً تكون URLs من Firebase بالشكل التالي:
                // https://firebasestorage.googleapis.com/v0/b/[project-id].appspot.com/o/[path]?alt=media&token=[token]
                const oldRef = ref(storage, decodeURIComponent(
                  oldImageUrl.split("/o/")[1].split("?")[0]
                ));
                await deleteObject(oldRef);
                console.log("تم حذف الصورة القديمة بنجاح");
              } catch (deleteError) {
                console.warn("لم يتم حذف الصورة القديمة:", deleteError);
                // لا نريد إلغاء العملية كاملة إذا فشل حذف الصورة القديمة
              }
            }
            
            // إرجاع البيانات الكاملة مع المعرف
            return { id: data.id, ...propertyData };
          } else {
            throw new Error("قاعدة البيانات غير متاحة حالياً");
          }
        }, null, 3); // 3 محاولات كحد أقصى
      } catch (firestoreError: any) {
        console.error("خطأ في تحديث العقار في Firestore:", firestoreError);
        
        // محاولة حذف الصورة الجديدة التي تم رفعها في حالة فشل التحديث
        if (imageUrl && imageUrl !== oldImageUrl && storage) {
          try {
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
            console.log("تم حذف الصورة الجديدة بعد فشل التحديث");
          } catch (deleteError) {
            console.error("فشل حذف الصورة الجديدة بعد فشل التحديث:", deleteError);
          }
        }
        
        throw new Error(`فشلت عملية تحديث العقار: ${firestoreError.message || "خطأ غير معروف في قاعدة البيانات"}`);
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["owner-properties"] });
      queryClient.invalidateQueries({ queryKey: ["property", result?.id] });
      
      // تحديث قائمة العقارات المميزة إذا كان العقار مميزاً
      if (result?.featured) {
        queryClient.invalidateQueries({ queryKey: ["featured-properties"] });
      }
      
      toast({
        title: "تم تحديث العقار بنجاح",
        description: "تم تحديث تفاصيل العقار بنجاح",
        variant: "default"
      });
      
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "فشلت عملية تحديث العقار",
        description: error.message || "حدث خطأ أثناء تحديث العقار، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  });

  const isPending = createMutation.isPending || updateMutation.isPending || isUploading;
  const error = createMutation.error || updateMutation.error;

  function onSubmit(data: PropertyFormValues) {
    if (property?.id) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  }

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

  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-[#39FF14]/10">
      <h2 className="text-2xl font-bold text-[#39FF14] mb-4">
        {property?.id ? "تعديل العقار" : "إضافة عقار جديد"}
      </h2>
      
      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-500 p-3 rounded-lg mb-4">
          {error.message}
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">اسم العقار</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="فيلا بحرية فاخرة..." 
                        className="bg-gray-800 border-gray-700 text-white" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">الموقع</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="الساحل الشمالي - سيدي عبد الرحمن" 
                        className="bg-gray-800 border-gray-700 text-white" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">السعر (لليلة الواحدة)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="200" 
                        className="bg-gray-800 border-gray-700 text-white" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-3 gap-4">
                {/* Beds */}
                <FormField
                  control={form.control}
                  name="beds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">عدد الأسرّة</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="2" 
                          className="bg-gray-800 border-gray-700 text-white" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Baths */}
                <FormField
                  control={form.control}
                  name="baths"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">عدد الحمامات</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="2" 
                          className="bg-gray-800 border-gray-700 text-white" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Size */}
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">المساحة (م²)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="120" 
                          className="bg-gray-800 border-gray-700 text-white" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">وصف العقار</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="شاليه فاخر مطل على البحر مباشرةً..." 
                        className="bg-gray-800 border-gray-700 text-white min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Image Upload */}
              <FormField
                control={form.control}
                name="imageFile"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel className="text-white">صورة العقار</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
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
                        
                        {/* Image Preview */}
                        {previewUrl && (
                          <div className="mt-4 relative rounded-lg overflow-hidden border border-gray-700 h-[140px]">
                            <img 
                              src={previewUrl} 
                              alt="Property preview" 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription className="text-gray-400">
                      يفضل استخدام صور بدقة عالية وأبعاد متناسبة.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Featured */}
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0 rtl:space-x-reverse">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value === true}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-[#39FF14]"
                      />
                    </FormControl>
                    <FormLabel className="text-white">عرض في القائمة المميزة</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="bg-transparent border-gray-700 text-white hover:bg-gray-800"
              disabled={isPending}
            >
              إلغاء
            </Button>
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
              ) : property?.id ? "تحديث العقار" : "إضافة العقار"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}