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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
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
      
      // Handle image upload
      let imageUrl = data.imageUrl;
      if (data.imageFile && data.imageFile.length > 0) {
        setIsUploading(true);
        const file = data.imageFile[0];
        
        // Create a storage reference
        const storageRef = ref(storage!, `properties/${user.uid}/${Date.now()}_${file.name}`);
        
        // Upload the file
        const snapshot = await uploadBytes(storageRef, file);
        
        // Get download URL
        imageUrl = await getDownloadURL(snapshot.ref);
        setIsUploading(false);
      }
      
      // Prepare the property data
      const propertyData = {
        name: data.name,
        description: data.description,
        location: data.location,
        price: data.price,
        currency: data.currency,
        imageUrl: imageUrl || "",
        beds: data.beds,
        baths: data.baths,
        size: data.size,
        featured: !!data.featured,
        adminId: user.id ? parseInt(user.id) : null,
        ownerId: user.uid // For Firestore query by owner
      };
      
      // Add to Firestore
      const docRef = await addDoc(collection(db, "properties"), propertyData);
      return { id: docRef.id, ...propertyData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-properties"] });
      if (onSuccess) onSuccess();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: PropertyFormValues) => {
      if (!user?.uid) throw new Error("يجب تسجيل الدخول لتعديل العقار");
      if (!db) throw new Error("قاعدة البيانات غير متاحة حالياً");
      if (!data.id) throw new Error("معرف العقار غير موجود");
      
      // Handle image upload
      let imageUrl = data.imageUrl;
      if (data.imageFile && data.imageFile.length > 0) {
        setIsUploading(true);
        const file = data.imageFile[0];
        
        // Create a storage reference
        const storageRef = ref(storage!, `properties/${user.uid}/${Date.now()}_${file.name}`);
        
        // Upload the file
        const snapshot = await uploadBytes(storageRef, file);
        
        // Get download URL
        imageUrl = await getDownloadURL(snapshot.ref);
        setIsUploading(false);
      }
      
      // Prepare the property data
      const propertyData = {
        name: data.name,
        description: data.description,
        location: data.location,
        price: data.price,
        currency: data.currency,
        imageUrl: imageUrl || data.imageUrl,
        beds: data.beds,
        baths: data.baths,
        size: data.size,
        featured: !!data.featured,
        adminId: user.id ? parseInt(user.id) : null,
        ownerId: user.uid // For Firestore query by owner
      };
      
      // Update in Firestore
      await setDoc(doc(db, "properties", data.id.toString()), propertyData, { merge: true });
      return { id: data.id, ...propertyData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-properties"] });
      if (onSuccess) onSuccess();
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