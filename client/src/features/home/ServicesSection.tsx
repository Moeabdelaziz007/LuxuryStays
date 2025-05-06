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

// بيانات واقعية للمطاعم والنوادي الليلية والخدمات المميزة في الساحل الشمالي وراس الحكمة
const localServices: Service[] = [
  {
    id: "service1",
    name: "حجز المطاعم الفاخرة",
    description: "احجز طاولتك بشكل فوري في أفخم وأرقى مطاعم الساحل الشمالي وراس الحكمة مع خصم حصري 15% لعملاء StayX على جميع المأكولات والمشروبات",
    imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop",
    status: "active",
    iconClass: "utensils",
    locations: [
      { name: "مطعم زودياك (Zodiac)", area: "راس الحكمة - ماونتن فيو", cuisine: "مأكولات بحرية ومتوسطية", priceRange: "$$$" },
      { name: "مطعم سمك", area: "بو آيلاند، سيدي عبد الرحمن", cuisine: "مأكولات بحرية طازجة", priceRange: "$$$" },
      { name: "تشيبرياني (Cipriani)", area: "المراسي، الساحل الشمالي", cuisine: "مطبخ إيطالي فاخر", priceRange: "$$$$" },
      { name: "كايرو كيتشين", area: "مارينا، الساحل الشمالي", cuisine: "مأكولات مصرية عصرية", priceRange: "$$" },
      { name: "أندريا مارينا", area: "مارينا، الساحل الشمالي", cuisine: "مطبخ متوسطي", priceRange: "$$$" },
      { name: "زيتونة", area: "هاسيندا باي، الساحل الشمالي", cuisine: "لبناني ومشاوي", priceRange: "$$$" },
      { name: "مطعم إل جونا (El Gouna)", area: "ديبو، راس الحكمة", cuisine: "مأكولات بحرية", priceRange: "$$$" }
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
      { name: "سقالة (Scaffold)", area: "المراسي، الساحل الشمالي", type: "نادي ليلي", specialty: "موسيقى الهاوس والإلكترونيك" },
      { name: "مارتنز بيتش كلوب (Martin's)", area: "نورث إيدج، الساحل الشمالي", type: "بيتش كلوب", specialty: "حفلات موسيقية حية" },
      { name: "ساوند بيتش كلوب (Sound)", area: "هاسيندا باي، الساحل الشمالي", type: "نادي ليلي وبيتش كلوب", specialty: "حفلات تيك هاوس" },
      { name: "باليو (Palio)", area: "راس الحكمة", type: "نادي ليلي وبيتش كلوب", specialty: "حفلات مع منظر بانورامي للبحر" },
      { name: "سكرلا بيتش (Secrela)", area: "الساحل الشمالي", type: "بيتش كلوب", specialty: "أجواء استوائية مميزة" }
    ]
  },
  {
    id: "service3",
    name: "خدمات الشاطئ الخاص",
    description: "استمتع بخدمات الشاطئ الخاص الحصرية مع توفير كراسي استلقاء فاخرة، مظلات، مشروبات باردة ووجبات خفيفة مقدمة مباشرة إلى موقعك على الشاطئ",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
    status: "active",
    iconClass: "umbrella-beach",
    locations: [
      { name: "شاطئ ماونتن فيو الخاص", area: "راس الحكمة", specialty: "خدمة كاملة مع مطعم بحري" },
      { name: "هاسيندا بيتش", area: "هاسيندا باي، الساحل الشمالي", specialty: "شواطئ فيروزية هادئة" },
      { name: "لافيستا بيتش", area: "لافيستا باي، الساحل الشمالي", specialty: "مناطق مخصصة للعائلات" },
      { name: "مراسي بيتش", area: "المراسي، الساحل الشمالي", specialty: "خدمة الكابانا الخاصة" }
    ]
  },
  {
    id: "service4",
    name: "خدمات نقل فاخرة",
    description: "خدمات نقل فاخرة من وإلى مطار برج العرب أو القاهرة بسيارات مرسيدس ومرافقة شخصية. توفر أيضًا خدمة الليموزين للتنقل بين المناطق المختلفة",
    imageUrl: "https://images.unsplash.com/photo-1625066811353-ad8a40306922?q=80&w=2071&auto=format&fit=crop",
    status: "active",
    iconClass: "car-alt",
    locations: [
      { name: "مطار برج العرب", area: "الإسكندرية", specialty: "خدمة استقبال VIP" },
      { name: "مطار القاهرة الدولي", area: "القاهرة", specialty: "خدمة 24 ساعة" },
      { name: "خدمة التنقل الداخلي", area: "الساحل الشمالي", specialty: "سيارات فاخرة مع سائق" },
      { name: "خدمة التنقل الداخلي", area: "راس الحكمة", specialty: "خدمة الليموزين الفاخرة" }
    ]
  },
  {
    id: "service5",
    name: "مركز الصحة والجمال",
    description: "خدمة مساج وسبا فاخرة داخل الفيلا من معالجين معتمدين. استمتع بتجربة علاجية كاملة من سبا لاديرا وذا ريتريت مع باقات خاصة مصممة للأزواج والعائلات",
    imageUrl: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=2070&auto=format&fit=crop",
    status: "coming-soon",
    iconClass: "spa",
    launchDate: new Date("2025-06-15").toISOString(),
    locations: [
      { name: "سبا لاديرا (La'dera Spa)", area: "راس الحكمة", specialty: "معالجات تايلاندية وإندونيسية" },
      { name: "ذا ريتريت (The Retreat)", area: "الساحل الشمالي", specialty: "معالجات الوجه المتقدمة" },
      { name: "إليمنتس سبا (Elements)", area: "ماونتن فيو، راس الحكمة", specialty: "علاجات الأعشاب الطبيعية" },
      { name: "زين سبا (Zen)", area: "هاسيندا باي، الساحل الشمالي", specialty: "جلسات يوغا ومساج" }
    ]
  },
  {
    id: "service6",
    name: "تأجير اليخوت والقوارب الفاخرة",
    description: "استمتع برحلات بحرية خاصة في مارينا الساحل الشمالي ومارينا راس الحكمة على متن يخوت فاخرة مع طاقم احترافي وتجهيزات كاملة للاسترخاء والترفيه",
    imageUrl: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2070&auto=format&fit=crop",
    status: "coming-soon",
    iconClass: "ship",
    launchDate: new Date("2025-07-01").toISOString(),
    locations: [
      { name: "مارينا الساحل الشمالي", area: "الساحل الشمالي", specialty: "يخوت فاخرة حتى 100 قدم" },
      { name: "مارينا راس الحكمة", area: "راس الحكمة", specialty: "رحلات السباحة والغطس" },
      { name: "رحلات صيد VIP", area: "الساحل الشمالي", specialty: "صيد الأسماك مع طاقم محترف" },
      { name: "رحلات غروب الشمس", area: "راس الحكمة", specialty: "جولات غروب الشمس الرومانسية" }
    ]
  },
  {
    id: "service7",
    name: "الرياضات المائية والأنشطة البحرية",
    description: "استمتع بمجموعة من الأنشطة المائية المثيرة مثل الجيت سكي، ركوب الأمواج، الإبحار بالمظلة، والغطس. تشمل الخدمة التدريب والمعدات الكاملة مع مدربين محترفين",
    imageUrl: "https://images.unsplash.com/photo-1560252406-9f8cbee59304?q=80&w=2070&auto=format&fit=crop",
    status: "coming-soon",
    iconClass: "swimming-pool",
    launchDate: new Date("2025-06-15").toISOString(),
    locations: [
      { name: "مركز الرياضات المائية", area: "راس الحكمة", specialty: "جيت سكي ووركوب الأمواج" },
      { name: "نادي الغطس", area: "الساحل الشمالي", specialty: "غطس سكوبا واستكشاف الشعاب" },
      { name: "مركز الإبحار الشراعي", area: "مارينا، الساحل الشمالي", specialty: "دروس الإبحار الشراعي" },
      { name: "نادي الباراسيلينج", area: "سيدي عبد الرحمن", specialty: "رحلات الإبحار بالمظلة" }
    ]
  },
  {
    id: "service8",
    name: "خدمات المناسبات والحفلات الخاصة",
    description: "نظّم حفلات خاصة، مناسبات، وحفلات زفاف على الشاطئ مع خدمة تخطيط متكاملة تشمل الديكور، الإضاءة، الضيافة، والترفيه. نوفر تجارب لا تُنسى لجميع المناسبات",
    imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2070&auto=format&fit=crop",
    status: "coming-soon",
    iconClass: "glass-cheers",
    launchDate: new Date("2025-07-15").toISOString(),
    locations: [
      { name: "فيلا المنتزه", area: "راس الحكمة", specialty: "حفلات زفاف على الشاطئ" },
      { name: "قاعة سي فيو", area: "هاسيندا باي، الساحل الشمالي", specialty: "حفلات الخطوبة والمناسبات" },
      { name: "شاطئ الأحلام الخاص", area: "نورث إيدج، الساحل الشمالي", specialty: "حفلات الشاطئ الخاصة" },
      { name: "يخت الاحتفالات", area: "مارينا، الساحل الشمالي", specialty: "مناسبات خاصة على اليخت" }
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
          console.log("Firebase DB not available, using local services data");
          setLocalFallback(true);
          return localServices;
        }
        
        const activeQuery = query(collection(db, "services"), where("status", "==", "active"));
        const snapshot = await getDocs(activeQuery);
        
        if (snapshot.empty) {
          console.log("No active services found in Firestore, using local data");
          setLocalFallback(true);
          return localServices;
        }
        
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[];
      } catch (error: any) {
        console.error("Error fetching services:", error);
        
        // Handle specific Firebase errors
        if (error.code === "permission-denied") {
          setError("Firebase security rules prevent access to services data. Using local data instead.");
          console.warn("Firebase permission denied. Make sure Firestore rules allow read access to the services collection.");
        } else if (error.name === "FirebaseError") {
          setError("Firebase error: " + error.message);
        }
        
        setLocalFallback(true);
        return localServices;
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