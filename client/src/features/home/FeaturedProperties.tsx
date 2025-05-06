// features/home/FeaturedProperties.tsx
import { collection, getDocs, query, where } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { useState } from "react";

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

// Fallback properties for when Firebase fails
const localProperties: Property[] = [
  {
    id: "prop1",
    name: "فيلا الحلم - كمباوند ماونتن فيو",
    imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&q=85&w=1200",
    description: "فيلا فاخرة مع مسبح خاص وإطلالة رائعة على البحر. مناسبة للعائلات والمجموعات الكبيرة.",
    location: "الساحل الشمالي - سيدي عبد الرحمن",
    pricePerNight: 250,
    featured: true,
    ownerId: "owner1"
  },
  {
    id: "prop2",
    name: "شاليه مطل على البحر",
    imageUrl: "https://images.unsplash.com/photo-1615571022219-eb45cf7faa9d?ixlib=rb-4.0.3&q=85&w=1200",
    description: "شاليه حديث مع إطلالة مباشرة على البحر. يقع على بعد خطوات من الشاطئ الخاص.",
    location: "راس الحكمة - لافيستا باي",
    pricePerNight: 180,
    featured: true,
    ownerId: "owner2"
  },
  {
    id: "prop3",
    name: "فيلا بونساي الفاخرة",
    imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&q=85&w=1200",
    description: "فيلا مستقلة في قلب بونساي، تتميز بديكور عصري وحديقة خاصة ومسبح.",
    location: "الساحل الشمالي - بونساي",
    pricePerNight: 320,
    featured: true,
    ownerId: "owner3"
  }
];

export default function FeaturedProperties() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { data, isLoading, isError } = useQuery({ 
    queryKey: ["featured-properties"], 
    retry: 2,  // زيادة عدد محاولات إعادة الاتصال
    retryDelay: 1000, // مهلة بين المحاولات
    queryFn: async () => {
      try {
        if (!db) {
          console.log("Firebase DB not available, using local data");
          return localProperties;
        }
        
        try {
          // Get only featured properties
          const featuredQuery = query(collection(db, "properties"), where("featured", "==", true));
          const snapshot = await getDocs(featuredQuery);
          
          if (snapshot.empty) {
            console.log("No featured properties found in Firestore, using local data");
            return localProperties;
          }
          
          return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Property[];
        } catch (firestoreError: any) {
          console.error("Firestore query error:", firestoreError);
          
          // محاولة إضافة البيانات الأولية في حالة عدم وجود بيانات
          if (firestoreError.code === "permission-denied") {
            setError("خطأ في الوصول إلى البيانات: ليس لديك صلاحيات كافية.");
          } else if (firestoreError.code === "unavailable" || firestoreError.code === "deadline-exceeded") {
            setError("خطأ في الاتصال بقاعدة البيانات. جاري استخدام البيانات المحلية.");
          }
          
          try {
            // محاولة إضافة البيانات الأولية
            const { seedFirestore } = await import('@/lib/seedFirestore');
            const result = await seedFirestore();
            if (result.success) {
              console.log("تمت إضافة البيانات الأولية بنجاح. يرجى تحديث الصفحة.");
            }
          } catch (seedError) {
            console.error("فشل إضافة البيانات الأولية:", seedError);
          }
          
          // Return local data as fallback
          return localProperties;
        }
      } catch (error: any) {
        console.error("Error in query function:", error);
        setError("حدث خطأ غير متوقع. جاري استخدام البيانات المحلية.");
        return localProperties;
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
        <p className="text-sm text-gray-400 mb-4">نعرض لك بدلاً من ذلك بعض العقارات المميزة المتاحة.</p>
      </div>
    );
  }

  if (!data?.length) return (
    <div className="text-center py-12">
      <p className="text-xl text-gray-500">لم يتم العثور على عقارات مميزة</p>
      <button className="mt-4 bg-[#39FF14] hover:bg-[#50FF30] text-black font-bold py-2 px-6 rounded-lg">
        تصفح جميع العقارات
      </button>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {data?.map((property) => (
        <div 
          key={property.id} 
          className="bg-gray-800 text-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 group"
          onMouseEnter={() => setHoveredId(property.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="relative">
            <img 
              src={property.imageUrl} 
              alt={property.name} 
              className="w-full h-64 object-cover transition-transform group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <div>
                <p className="text-white font-medium mb-1">
                  <span className="text-[#39FF14]">معروض بواسطة: </span> 
                  مدير عقارات معتمد
                </p>
                <p className="text-sm text-white/80">تم التحقق بواسطة فريق StayX</p>
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-[#39FF14] text-black px-3 py-1 rounded-full text-sm font-bold">
              ${property.pricePerNight} / ليلة
            </div>
          </div>
          
          <div className="p-5">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-white">{property.name}</h3>
              <button className="text-[#39FF14] hover:text-[#50FF30] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center text-sm text-gray-400 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {property.location}
            </div>
            
            <p className="text-gray-300 text-sm mb-4 line-clamp-2">{property.description}</p>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                <span className="text-white">4.9</span>
                <span className="text-gray-400 text-sm ml-1">(23 تقييم)</span>
              </div>
              <a 
                href={`/properties/${property.id}`} 
                className="bg-green-400 hover:bg-green-500 text-black font-medium py-2 px-4 rounded-lg text-sm transition-colors"
              >
                عرض التفاصيل
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}