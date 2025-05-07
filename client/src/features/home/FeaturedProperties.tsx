// features/home/FeaturedProperties.tsx
import { collection, getDocs, query, where } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db, safeDoc } from "@/lib/firebase";
import { useState } from "react";
import { HolographicCard } from "@/components/ui/holographic-card";

interface Property {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  location: string;
  pricePerNight: number;
  featured: boolean;
  ownerId: string;
}

// لا توجد عقارات افتراضية - فقط العقارات التي يضيفها مدراء العقارات
const localProperties: Property[] = [];

export default function FeaturedProperties() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { data, isLoading, isError } = useQuery({ 
    queryKey: ["featured-properties"], 
    retry: 5,  // زيادة عدد محاولات إعادة الاتصال إلى 5
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(1.5, attemptIndex), 10000), // تأخير تكيفي
    staleTime: 5 * 60 * 1000, // 5 دقائق قبل اعتبار البيانات قديمة
    refetchOnWindowFocus: false, // لا تعيد جلب البيانات عند استعادة التركيز لتقليل عمليات الاتصال
    queryFn: async () => {
      try {
        // تنفيذ عملية الاسترداد مع safeDoc المُحسّنة مع ميزة التخزين المؤقت
        return await safeDoc(
          async () => {
            if (!db) {
              throw new Error("Firestore is not initialized");
            }
            
            console.log("جاري جلب العقارات المميزة من Firestore...");
            
            // تحسين الاستعلام ليركز على العقارات المميزة فقط
            const featuredPropertiesQuery = query(
              collection(db, "properties"),
              where("featured", "==", true)
            );
            
            // استخدام تجميع الاتصالات لتقليل عدد الاتصالات المطلوبة
            const snapshot = await getDocs(featuredPropertiesQuery);
            
            if (snapshot.empty) {
              console.log("لم يتم العثور على أي عقارات مميزة في Firestore");
              
              // محاولة جلب جميع العقارات للتحقق مما إذا كانت هناك عقارات غير مميزة
              const allPropertiesQuery = query(collection(db, "properties"));
              const allSnapshot = await getDocs(allPropertiesQuery);
              
              if (allSnapshot.empty) {
                console.log("لا توجد عقارات على الإطلاق في Firestore");
                return [];
              } else {
                console.log(`تم العثور على ${allSnapshot.docs.length} عقارات غير مميزة`);
                
                // أخذ أحدث 3 عقارات (أو أقل) واعتبارها مميزة
                const properties = allSnapshot.docs
                  .slice(0, Math.min(3, allSnapshot.docs.length))
                  .map(doc => {
                    const docData = doc.data() as Record<string, any>;
                    return {
                      id: doc.id,
                      name: docData.name || "عقار بدون اسم",
                      imageUrl: docData.imageUrl || "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200",
                      description: docData.description || "لا يوجد وصف متاح",
                      location: docData.location || "موقع غير محدد",
                      pricePerNight: docData.pricePerNight || 0,
                      featured: true, // اعتبارها مميزة للعرض
                      ownerId: docData.ownerId || "unknown"
                    } as Property;
                  });
                
                return properties;
              }
            }
            
            console.log(`تم العثور على ${snapshot.docs.length} عقار مميز في Firestore`);
            
            // تحويل وثائق Firestore إلى كائنات Property مع تدقيق وتصحيح البيانات
            const properties = snapshot.docs.map(doc => {
              const docData = doc.data() as Record<string, any>;
              // ضمان وجود جميع الحقول المطلوبة مع قيم افتراضية
              return {
                id: doc.id,
                name: docData.name || "عقار بدون اسم",
                imageUrl: docData.imageUrl || "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200", // صورة افتراضية
                description: docData.description || "لا يوجد وصف متاح",
                location: docData.location || "موقع غير محدد",
                pricePerNight: docData.pricePerNight || 0,
                featured: true,
                ownerId: docData.ownerId || "unknown"
              } as Property;
            });
            
            return properties;
          }, 
          [], // القيمة الافتراضية للعودة في حالة فشل العملية هي مصفوفة فارغة
          5, // عدد محاولات إعادة المحاولة
          "featured-properties" // مفتاح التخزين المؤقت
        );
      } catch (error: any) {
        console.error("❌ حدث خطأ أثناء جلب العقارات المميزة:", error);
        setError(`حدث خطأ في الوصول إلى بيانات العقارات: ${error.message || "خطأ غير معروف"}`);
        // في حالة الفشل، نعيد مصفوفة فارغة
        return [];
      }
    }
  });

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-xl bg-gray-800 h-12 w-12"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-gray-800 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-800 rounded"></div>
            <div className="h-4 bg-gray-800 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // نعرض رسالة في حالة حدوث خطأ
  if (error) {
    return (
      <div className="text-center py-12 bg-gray-800 rounded-xl p-6 mb-8">
        <div className="text-yellow-400 mb-4">⚠️</div>
        <p className="text-lg text-yellow-400 font-semibold mb-2">تنبيه</p>
        <p className="text-white mb-4">{error}</p>
        <p className="text-sm text-gray-400 mb-4">
          نحن نعرض فقط العقارات الحقيقية المضافة من قبل مدراء العقارات المعتمدين.
          قد تكون الخدمة غير متاحة حاليًا، يرجى المحاولة لاحقًا.
        </p>
      </div>
    );
  }

  if (!data?.length) return (
    <div className="text-center py-16 bg-gray-800/50 rounded-2xl backdrop-blur-sm border border-gray-700">
      <div className="max-w-lg mx-auto px-4">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-black/30 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2a1 1 0 001-1v-5m-1.5-2h-9" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">لا توجد عقارات متاحة حاليًا</h3>
        <p className="text-gray-300 mb-8">
          لم يتم إضافة أي عقارات من قبل مدراء العقارات بعد. نحن نعرض فقط العقارات التي يضيفها مدراء العقارات المعتمدين للتأكد من جودة وموثوقية تجربتك.
        </p>
        <div className="space-x-4 rtl:space-x-reverse">
          <a href="/register-property" className="bg-[#39FF14] hover:bg-[#50FF30] px-5 py-2.5 rounded-lg text-black font-bold transition-colors">
            سجل كمدير عقارات
          </a>
          <a href="/about" className="bg-black/40 border border-gray-700 hover:bg-black/60 px-5 py-2.5 rounded-lg text-white transition-colors">
            اعرف المزيد
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {data?.map((property: Property) => (
        <HolographicCard
          key={property.id}
          className="overflow-hidden h-full"
          glowColor="#39FF14"
          glowIntensity="medium"
          withBorder={true}
          interactive={true}
          variant="dark"
        >
          {/* Header - Image Container */}
          <div className="relative">
            {/* Property Badge - Top Right */}
            <div className="absolute top-0 right-0 z-20">
              <div className="bg-[#39FF14] text-black font-bold m-4 py-1 px-3 rounded-full shadow-lg flex items-center space-x-1 rtl:space-x-reverse transform hover:scale-105 transition-transform backdrop-blur-sm border border-[#39FF14]/20">
                <span>${property.pricePerNight}</span>
                <span className="text-xs opacity-70">/ ليلة</span>
              </div>
            </div>
            
            {/* Save Button - Top Left */}
            <div className="absolute top-0 left-0 z-20">
              <button className="m-4 bg-black/40 hover:bg-black/60 p-2 rounded-full backdrop-blur-sm transition-colors group-hover:opacity-100 opacity-0 border border-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white hover:text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            
            {/* Main Image */}
            <div className="h-56 overflow-hidden">
              <img 
                src={property.imageUrl} 
                alt={property.name} 
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110" 
              />
              
              {/* Image Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              
              {/* إضافة تأثير خطوط المسح للتصميم التكنو-فضائي */}
              <div 
                className="absolute inset-0 opacity-10 pointer-events-none" 
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(57, 255, 20, 0.15) 2px, transparent 4px)',
                  backgroundSize: '100% 4px',
                  mixBlendMode: 'overlay'
                }}
              ></div>
            </div>
            
            {/* Property Verification - Bottom of Image */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
              <div className="flex items-center space-x-2 rtl:space-x-reverse transition-opacity duration-300">
                <div className="w-7 h-7 rounded-full bg-[#39FF14]/80 flex items-center justify-center border border-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.5)]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">تم التحقق بواسطة <span className="text-[#39FF14]">StayX</span></p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Container */}
          <div className="p-5">
            {/* Property Title & Rating */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-white group-hover:text-[#39FF14] transition-colors">{property.name}</h3>
              <div className="flex items-center bg-black/30 px-2 py-1 rounded-lg backdrop-blur-sm">
                <span className="text-yellow-400">★</span>
                <span className="text-white mx-1">4.9</span>
              </div>
            </div>
            
            {/* Location */}
            <div className="flex items-center text-sm text-gray-400 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {property.location}
            </div>
            
            {/* Description */}
            <div className="bg-black/30 p-3 rounded-lg mb-4 backdrop-blur-sm border border-[#39FF14]/10">
              <p className="text-gray-300 text-sm line-clamp-2">{property.description}</p>
            </div>
            
            {/* Divider Line - futuristic divider */}
            <div className="relative h-px my-4">
              <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/40 to-transparent"></div>
              <div className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-[#39FF14] transform -translate-x-1/2 -translate-y-1/2 animate-pulse-subtle"></div>
            </div>
            
            {/* Bottom Action Section */}
            <div className="flex justify-between items-center">
              <span className="text-[#39FF14] font-medium text-sm">
                {/* Property Owner */}
                <span className="text-gray-400">بواسطة: </span>مدير معتمد
              </span>
              <a 
                href={`/properties/${property.id}`} 
                className="relative overflow-hidden bg-[#39FF14] hover:bg-[#45ff25] text-black font-medium py-2 px-4 rounded-lg text-sm transition-colors shadow-md hover:shadow-[0_0_15px_rgba(57,255,20,0.5)] group"
              >
                <span className="relative z-10">عرض التفاصيل</span>
                <span className="absolute inset-0 w-full h-full bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              </a>
            </div>
          </div>
        </HolographicCard>
      ))}
    </div>
  );
}