// features/home/ServicesSection.tsx
import { collection, getDocs, query, where } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { useState, useEffect } from "react";

interface ServiceLocation {
  name: string;
  area: string;
  cuisine?: string;
  priceRange?: string;
  type?: string;
  specialty?: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  status: "active" | "coming-soon";
  iconClass?: string;
  launchDate?: string;
  locations?: ServiceLocation[];
}

// بيانات الخدمات الرئيسية - 2 فقط كما طلب
const localServices: Service[] = [
  {
    id: "service1",
    name: "حجز العقارات الفاخرة",
    description: "استمتع بإقامة مميزة في أفخم الفلل والشاليهات في الساحل الشمالي وراس الحكمة مع خدمات حصرية ومرافق متكاملة. توفر StayX أفضل اختيارات الإقامة الفاخرة",
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1170",
    status: "active",
    iconClass: "home",
    locations: [
      { name: "فيلات ماونتن فيو", area: "راس الحكمة", specialty: "فلل فاخرة مع إطلالة بانورامية" },
      { name: "شاليهات هاسيندا باي", area: "الساحل الشمالي", specialty: "شاليهات قريبة من الشاطئ" },
      { name: "فلل المراسي", area: "الساحل الشمالي", specialty: "فلل بمسابح خاصة" }
    ]
  },
  {
    id: "service2",
    name: "حجز النوادي الليلية والبيتش كلوب",
    description: "تمتع بقضاء أجمل الأوقات في أشهر النوادي الليلية والشاطئية في الساحل الشمالي وراس الحكمة مع دخول VIP وطاولات محجوزة مسبقًا بدون انتظار",
    imageUrl: "https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=2070&auto=format&fit=crop",
    status: "active",
    iconClass: "glass-cheers",
    locations: [
      { name: "سيكس ديجريز (6IX Degrees)", area: "ماونتن فيو، راس الحكمة", type: "نادي ليلي وبيتش كلوب", specialty: "حفلات DJ عالمية" },
      { name: "بيتش باد (Beach Bud)", area: "مراقيا، الساحل الشمالي", type: "بيتش كلوب", specialty: "حفلات شاطئية نهارية" },
      { name: "سقالة (Scaffold)", area: "المراسي، الساحل الشمالي", type: "نادي ليلي", specialty: "موسيقى الهاوس والإلكترونيك" }
    ]
  }
];

export default function ServicesSection() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [localFallback, setLocalFallback] = useState(false);
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const { data: activeServices, isLoading: activeLoading } = useQuery({
    queryKey: ["services", "active"],
    queryFn: async () => {
      try {
        if (!db) {
          console.log("Firebase DB not available");
          return []; // لا نعرض بيانات محلية
        }
        
        const activeQuery = query(collection(db, "services"), where("status", "==", "active"));
        const snapshot = await getDocs(activeQuery);
        
        if (snapshot.empty) {
          console.log("No active services found in Firestore");
          return []; // لا نعرض بيانات محلية
        }
        
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[];
      } catch (error: any) {
        console.error("Error fetching services:", error);
        
        // Handle specific Firebase errors
        if (error.code === "permission-denied") {
          setError("قواعد أمان Firebase تمنع الوصول إلى بيانات الخدمات.");
          console.warn("Firebase permission denied. Make sure Firestore rules allow read access to the services collection.");
        } else if (error.name === "FirebaseError") {
          setError("خطأ في Firebase: " + error.message);
        }
        
        return []; // لا نعرض بيانات محلية
      }
    }
  });
  
  useEffect(() => {
    if (activeServices) {
      setServicesList(activeServices);
    } else if (localFallback) {
      setServicesList(localServices);
    }
  }, [activeServices, localFallback]);

  if (activeLoading && !servicesList.length) return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-gray-700 h-10 w-10"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
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
          نحن نعرض فقط الخدمات الرسمية المقدمة من قبل StayX.
          قد تكون الخدمة غير متاحة حاليًا، يرجى المحاولة لاحقًا.
        </p>
      </div>
    );
  }

  // عندما لا توجد خدمات
  if (!activeServices?.length) {
    return (
      <div className="text-center py-12 bg-gray-800/50 rounded-2xl backdrop-blur-sm border border-gray-700">
        <div className="max-w-lg mx-auto px-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-black/30 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-4">لا توجد خدمات متاحة حاليًا</h3>
          <p className="text-gray-300 mb-6">
            سيتم إضافة خدمات قريبًا. يرجى العودة لاحقًا للاطلاع على أحدث الخدمات المتوفرة.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto text-center mb-12">
        <p className="text-gray-400 mb-8">
          استمتع بخدماتنا الحصرية التي تجعل إقامتك تجربة لا تُنسى. نتعاون مع أفضل المطاعم والنوادي الليلية في الساحل الشمالي وراس الحكمة.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {activeServices?.map((service) => (
          <div
            key={service.id}
            className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-2xl overflow-hidden shadow-xl transform transition-all hover:scale-105 border border-gray-700 group"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  {service.name?.includes("مطاعم") ? (
                    <div className="p-3 bg-gradient-to-br from-[#39FF14] to-[#2ac70d] rounded-full mr-4">
                      <span className="text-3xl">🍽️</span>
                    </div>
                  ) : (
                    <div className="p-3 bg-gradient-to-br from-[#39FF14]/80 to-[#39FF14] rounded-full mr-4">
                      <span className="text-3xl">💃</span>
                    </div>
                  )}
                  <h3 className="text-2xl font-bold">{service.name}</h3>
                </div>
                
                <div className="flex-shrink-0">
                  <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${service.name?.includes("مطاعم") ? "bg-[#39FF14] text-black" : "bg-[#39FF14] text-black"}`}>
                    {service.name?.includes("مطاعم") ? "مجاناً" : "5$ فقط"}
                  </span>
                </div>
              </div>
              
              <p className="text-md mb-4">{service.description}</p>
              
              {/* Display locations */}
              {service.locations && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2 my-4">
                    <button
                      onClick={() => setSelectedLocation(null)}
                      className={`text-xs px-3 py-1 rounded-full ${selectedLocation === null ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white'}`}
                    >
                      الكل
                    </button>
                    <button
                      onClick={() => setSelectedLocation("راس الحكمة")}
                      className={`text-xs px-3 py-1 rounded-full ${selectedLocation?.includes("راس الحكمة") ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white'}`}
                    >
                      راس الحكمة
                    </button>
                    <button
                      onClick={() => setSelectedLocation("الساحل الشمالي")}
                      className={`text-xs px-3 py-1 rounded-full ${selectedLocation?.includes("الساحل") ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white'}`}
                    >
                      الساحل الشمالي
                    </button>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-3 mt-2">
                    <h4 className="text-sm font-semibold text-[#39FF14] mb-2">الأماكن المتاحة:</h4>
                    <ul className="space-y-2">
                      {service.locations
                        .filter(loc => selectedLocation ? loc.area.includes(selectedLocation) : true)
                        .map((location, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <span className="w-2 h-2 rounded-full bg-[#39FF14] mr-2"></span>
                          <span className="font-medium">{location.name}</span>
                          <span className="text-gray-400 text-xs mr-2">({location.area})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between mt-6">
                <div>
                  <span className="text-xs text-gray-400 block mb-1">أماكن متاحة اليوم</span>
                  <div className="flex items-center">
                    <div className="h-2 w-32 bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full ${service.name?.includes("مطاعم") ? "bg-[#39FF14] w-3/4" : "bg-[#39FF14] w-1/2"}`}></div>
                    </div>
                    <span className="text-sm text-gray-300 ml-2">
                      {service.name?.includes("مطاعم") ? "75%" : "50%"}
                    </span>
                  </div>
                </div>
                
                <button className={`bg-[#39FF14] hover:bg-[#50FF30] text-black font-bold py-3 px-6 rounded-lg transition-colors group-hover:scale-105 shadow-[0_0_10px_rgba(57,255,20,0.3)]`}>
                  احجز الآن
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-12">
        <a href="/services" className="inline-flex items-center justify-center gap-2 text-[#39FF14] hover:text-[#50FF30] font-bold text-lg">
          عرض جميع الخدمات
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  );
}