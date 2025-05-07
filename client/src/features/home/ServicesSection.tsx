// features/home/ServicesSection.tsx
import { collection, getDocs, query, where } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db, safeDoc } from "@/lib/firebase";
import { useState, useEffect } from "react";
import { HolographicCard } from "@/components/ui/holographic-card";

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
        return await safeDoc(
          async () => {
            if (!db) {
              throw new Error("Firebase DB not available");
            }
            
            console.log("جاري جلب الخدمات النشطة من Firestore...");
            
            const activeQuery = query(collection(db, "services"), where("status", "==", "active"));
            const snapshot = await getDocs(activeQuery);
            
            if (snapshot.empty) {
              console.log("لم يتم العثور على خدمات نشطة في Firestore");
              return []; // لا نعرض بيانات عشوائية
            }
            
            console.log(`تم العثور على ${snapshot.docs.length} خدمات نشطة في Firestore`);
            
            return snapshot.docs.map(doc => ({ 
              id: doc.id, 
              ...doc.data() 
            })) as Service[];
          },
          [], // قيمة افتراضية فارغة في حالة الفشل
          3, // عدد محاولات إعادة المحاولة
          "services-active" // مفتاح التخزين المؤقت
        );
      } catch (error: any) {
        console.error("Error fetching services:", error);
        
        // Handle specific Firebase errors
        if (error.code === "permission-denied") {
          setError("قواعد أمان Firebase تمنع الوصول إلى بيانات الخدمات.");
          console.warn("Firebase permission denied. Make sure Firestore rules allow read access to the services collection.");
        } else if (error.name === "FirebaseError") {
          setError("خطأ في Firebase: " + error.message);
        } else {
          setError("حدث خطأ أثناء جلب البيانات. يرجى المحاولة لاحقًا.");
        }
        
        return []; // لا نعرض بيانات عشوائية
      }
    }
  });
  
  // دائماً استخدم الخدمات المحلية للصفحة الرئيسية (نموذج فقط)
  useEffect(() => {
    // استخدم النموذج المحلي دائماً كما طلب المستخدم
    setServicesList(localServices);
  }, []);

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

  // نحن دائماً سنعرض نموذج الخدمات بغض النظر عن حالة الاتصال بـ Firestore

  return (
    <div>
      <div className="max-w-4xl mx-auto text-center mb-6 sm:mb-8 md:mb-12">
        <p className="text-gray-400 mb-4 sm:mb-8 text-sm sm:text-base px-2 sm:px-0">
          استمتع بخدماتنا الحصرية التي تجعل إقامتك تجربة لا تُنسى. نتعاون مع أفضل المطاعم والنوادي الليلية في الساحل الشمالي وراس الحكمة.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {servicesList.map((service) => (
          <HolographicCard
            key={service.id}
            className="overflow-hidden h-full"
            glowColor="#39FF14"
            glowIntensity="medium"
            withBorder={true}
            interactive={true}
            variant="transparent"
          >
            {/* Service Header with Background Image */}
            <div className="relative h-40 overflow-hidden">
              {/* Background Image with Overlay */}
              <img 
                src={service.name?.includes("مطاعم") 
                  ? "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1170" 
                  : "https://images.unsplash.com/photo-1532452119098-a3650b3c46d3?q=80&w=1170"} 
                alt={service.name} 
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.6] transform group-hover:scale-105 transition-transform duration-700" 
              />
              
              {/* إضافة تأثير التكنو-فضائي */}
              <div 
                className="absolute inset-0 opacity-10 pointer-events-none" 
                style={{
                  backgroundImage: 'linear-gradient(to right, rgba(57, 255, 20, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(57, 255, 20, 0.1) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                  mixBlendMode: 'overlay'
                }}
              ></div>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-gray-900/50 to-transparent"></div>
              
              {/* Price Badge - Top Right */}
              <div className="absolute top-0 right-0 z-10 m-4">
                <span className="inline-block px-4 py-1 rounded-full text-sm font-bold bg-[#39FF14] text-black shadow-[0_0_15px_rgba(57,255,20,0.3)] backdrop-blur-sm border border-[#39FF14]/20">
                  {service.name?.includes("مطاعم") ? "مجاناً" : "5$ فقط"}
                </span>
              </div>
              
              {/* Icon and Service Title - Positioned at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10 flex items-center">
                {/* Icon Container */}
                <div className="p-3 rounded-full mr-4 bg-gradient-to-br from-[#39FF14] to-[#39FF14]/80 shadow-[0_0_15px_rgba(57,255,20,0.4)] border border-[#39FF14]">
                  <span className="text-2xl">
                    {service.name?.includes("مطاعم") ? "🍽️" : "💃"}
                  </span>
                </div>
                
                {/* Service Title */}
                <h3 className="text-2xl font-bold text-white group-hover:text-[#39FF14] transition-colors drop-shadow-md">{service.name}</h3>
              </div>
            </div>
            
            {/* Service Content */}
            <div className="p-5">
              {/* Description */}
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 mb-5 border border-[#39FF14]/10">
                <p className="text-md text-gray-300">{service.description}</p>
              </div>
              
              {/* Location Filter Pills */}
              {service.locations && (
                <div className="mb-5">
                  <h4 className="text-sm font-semibold text-[#39FF14] mb-2 flex items-center">
                    <span className="w-4 h-0.5 bg-[#39FF14] mr-2 opacity-70 rounded-full"></span>
                    تصفية حسب المنطقة:
                    <span className="w-4 h-0.5 bg-[#39FF14] ml-2 opacity-70 rounded-full"></span>
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button
                      onClick={() => setSelectedLocation(null)}
                      className={`text-xs px-3 py-1 rounded-full transition-colors ${selectedLocation === null 
                        ? 'bg-[#39FF14] text-black shadow-[0_0_8px_rgba(57,255,20,0.5)] border border-[#39FF14]/80' 
                        : 'bg-black/40 text-white border border-gray-700 hover:border-[#39FF14]/50 backdrop-blur-sm'}`}
                    >
                      الكل
                    </button>
                    <button
                      onClick={() => setSelectedLocation("راس الحكمة")}
                      className={`text-xs px-3 py-1 rounded-full transition-colors ${selectedLocation?.includes("راس الحكمة") 
                        ? 'bg-[#39FF14] text-black shadow-[0_0_8px_rgba(57,255,20,0.5)] border border-[#39FF14]/80' 
                        : 'bg-black/40 text-white border border-gray-700 hover:border-[#39FF14]/50 backdrop-blur-sm'}`}
                    >
                      راس الحكمة
                    </button>
                    <button
                      onClick={() => setSelectedLocation("الساحل الشمالي")}
                      className={`text-xs px-3 py-1 rounded-full transition-colors ${selectedLocation?.includes("الساحل") 
                        ? 'bg-[#39FF14] text-black shadow-[0_0_8px_rgba(57,255,20,0.5)] border border-[#39FF14]/80' 
                        : 'bg-black/40 text-white border border-gray-700 hover:border-[#39FF14]/50 backdrop-blur-sm'}`}
                    >
                      الساحل الشمالي
                    </button>
                  </div>
                  
                  {/* Locations List */}
                  <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-[#39FF14]/20">
                    <h5 className="text-sm font-semibold text-white mb-3 flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] mr-2 animate-pulse-subtle"></span>
                      الأماكن المتاحة:
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {service.locations
                        .filter(loc => selectedLocation ? loc.area.includes(selectedLocation) : true)
                        .map((location, idx) => (
                        <div key={idx} className="flex items-center text-sm bg-black/50 backdrop-blur-sm rounded-md p-2 border border-gray-800 hover:border-[#39FF14]/30 transition-colors">
                          <span className="w-2 h-2 rounded-full bg-[#39FF14] mr-2 flex-shrink-0 shadow-[0_0_5px_rgba(57,255,20,0.7)]"></span>
                          <div className="flex flex-col flex-grow">
                            <span className="font-medium text-white">{location.name}</span>
                            <span className="text-gray-400 text-xs">({location.area})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Divider Line - futuristic divider */}
              <div className="relative h-px my-4">
                <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/40 to-transparent"></div>
                <div className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-[#39FF14] transform -translate-x-1/2 -translate-y-1/2 animate-pulse-subtle"></div>
              </div>
              
              {/* Footer with Availability & CTA */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 block mb-1">أماكن متاحة اليوم</span>
                  <div className="flex items-center">
                    <div className="h-2 w-32 bg-black/50 rounded-full overflow-hidden border border-[#39FF14]/10">
                      <div className={`h-full ${service.name?.includes("مطاعم") 
                        ? "bg-gradient-to-r from-[#39FF14] to-[#2ac70d] w-3/4" 
                        : "bg-gradient-to-r from-[#39FF14] to-[#45ff25] w-1/2"}`}>
                      </div>
                    </div>
                    <span className="text-sm text-white ml-2 font-medium">
                      {service.name?.includes("مطاعم") ? "75%" : "50%"}
                    </span>
                  </div>
                </div>
                
                <a 
                  href={`/services/${service.id}`} 
                  className="relative overflow-hidden bg-[#39FF14] hover:bg-[#45ff25] text-black font-bold py-2.5 px-5 rounded-lg transition-all shadow-[0_0_15px_rgba(57,255,20,0.2)] hover:shadow-[0_0_15px_rgba(57,255,20,0.5)] group"
                >
                  <span className="relative z-10">احجز الآن</span>
                  <span className="absolute inset-0 w-full h-full bg-white/30 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                </a>
              </div>
            </div>
          </HolographicCard>
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