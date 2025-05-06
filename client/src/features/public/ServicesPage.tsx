// ServicesPage.tsx
import React, { useState } from 'react';
import { collection, getDocs, query, where } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import Layout from '@/components/layout/Layout';

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

// بيانات واقعية للمطاعم والنوادي الليلية في الساحل الشمالي وراس الحكمة
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
    name: "مركز الصحة والجمال",
    description: "خدمة مساج وسبا فاخرة داخل الفيلا من معالجين معتمدين. استمتع بتجربة علاجية كاملة من سبا لاديرا وذا ريتريت مع باقات خاصة مصممة للأزواج والعائلات",
    imageUrl: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=2070&auto=format&fit=crop",
    status: "coming-soon",
    iconClass: "spa",
    launchDate: new Date("2025-06-15").toISOString(),
    locations: [
      { name: "سبا لاديرا (La'dera Spa)", area: "راس الحكمة", specialty: "معالجات تايلاندية وإندونيسية" },
      { name: "ذا ريتريت (The Retreat)", area: "الساحل الشمالي", specialty: "معالجات الوجه المتقدمة" }
    ]
  },
  {
    id: "service4",
    name: "تأجير اليخوت والقوارب الفاخرة",
    description: "استمتع برحلات بحرية خاصة في مارينا الساحل الشمالي ومارينا راس الحكمة على متن يخوت فاخرة مع طاقم احترافي وتجهيزات كاملة للاسترخاء والترفيه",
    imageUrl: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2070&auto=format&fit=crop",
    status: "coming-soon",
    iconClass: "ship",
    launchDate: new Date("2025-07-01").toISOString(),
    locations: [
      { name: "مارينا الساحل الشمالي", area: "الساحل الشمالي", specialty: "يخوت فاخرة حتى 100 قدم" },
      { name: "مارينا راس الحكمة", area: "راس الحكمة", specialty: "رحلات السباحة والغطس" }
    ]
  }
];

export default function ServicesPage() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      try {
        if (!db) {
          console.log("Firebase DB not available, using local services data");
          return localServices;
        }
        
        const servicesQuery = query(collection(db, "services"));
        const snapshot = await getDocs(servicesQuery);
        
        if (snapshot.empty) {
          console.log("No services found in Firestore, using local data");
          return localServices;
        }
        
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[];
      } catch (error: any) {
        console.error("Error fetching services:", error);
        setError("حدث خطأ أثناء جلب بيانات الخدمات. يرجى المحاولة مرة أخرى لاحقًا.");
        return localServices;
      }
    }
  });

  const filteredServices = services?.filter(service => {
    // فلترة حسب نوع الخدمة
    if (selectedServiceType && selectedServiceType === 'active' && service.status !== 'active') {
      return false;
    }
    if (selectedServiceType && selectedServiceType === 'coming-soon' && service.status !== 'coming-soon') {
      return false;
    }
    
    // فلترة حسب الموقع
    if (selectedLocation && service.locations) {
      return service.locations.some(loc => loc.area.includes(selectedLocation));
    }
    return true;
  });

  const activeServices = services?.filter(service => service.status === 'active') || [];
  const comingSoonServices = services?.filter(service => service.status === 'coming-soon') || [];

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-72">
            <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-[#39FF14] border-b-2"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">خدمات <span className="text-[#39FF14]">StayX</span> المميزة</h1>
          <p className="text-gray-400 max-w-3xl mx-auto">
            ندعوك لاستكشاف مجموعة خدماتنا الحصرية المصممة لتحويل إقامتك إلى تجربة استثنائية. 
            مع شبكة واسعة من الشركاء في المطاعم الفاخرة والنوادي الليلية المميزة في الساحل الشمالي وراس الحكمة، 
            نضمن لك تجربة لا تُنسى.
          </p>
        </div>
        
        {/* فلاتر */}
        <div className="mb-12 bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">تصفية الخدمات</h2>
          <div className="flex flex-wrap gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">المنطقة</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedLocation(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!selectedLocation ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setSelectedLocation('الساحل الشمالي')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedLocation === 'الساحل الشمالي' ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                  الساحل الشمالي
                </button>
                <button
                  onClick={() => setSelectedLocation('راس الحكمة')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedLocation === 'راس الحكمة' ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                  راس الحكمة
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">نوع الخدمة</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedServiceType(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!selectedServiceType ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setSelectedServiceType('active')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedServiceType === 'active' ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                  الخدمات النشطة ({activeServices.length})
                </button>
                <button
                  onClick={() => setSelectedServiceType('coming-soon')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedServiceType === 'coming-soon' ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                  قريباً ({comingSoonServices.length})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* رسالة خطأ إذا وجدت */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-white px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* قائمة الخدمات النشطة */}
        <div className="mb-16">
          {!selectedServiceType || selectedServiceType === 'active' ? (
            <>
              <div className="flex items-center mb-8">
                <h2 className="text-2xl font-bold text-white">الخدمات المتاحة حالياً</h2>
                <div className="flex-grow border-t border-gray-700 mr-4"></div>
              </div>
              {filteredServices?.filter(s => s.status === 'active').length === 0 ? (
                <p className="text-gray-400 text-center py-8">لا توجد خدمات متاحة تطابق معايير البحث</p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {filteredServices
                    ?.filter(service => service.status === 'active')
                    .map(service => (
                      <ServiceCard key={service.id} service={service} selectedLocation={selectedLocation} />
                    ))}
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* قائمة الخدمات القادمة قريباً */}
        {!selectedServiceType || selectedServiceType === 'coming-soon' ? (
          <div>
            <div className="flex items-center mb-8">
              <h2 className="text-2xl font-bold text-white">خدمات قادمة قريباً</h2>
              <div className="flex-grow border-t border-gray-700 mr-4"></div>
            </div>

            {filteredServices?.filter(s => s.status === 'coming-soon').length === 0 ? (
              <p className="text-gray-400 text-center py-8">لا توجد خدمات قادمة تطابق معايير البحث</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredServices
                  ?.filter(service => service.status === 'coming-soon')
                  .map(service => (
                    <ServiceCard key={service.id} service={service} selectedLocation={selectedLocation} />
                  ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </Layout>
  );
}

interface ServiceCardProps {
  service: Service;
  selectedLocation: string | null;
}

function ServiceCard({ service, selectedLocation }: ServiceCardProps) {
  const [showAllLocations, setShowAllLocations] = useState(false);
  
  // تحديد أي المواقع يجب عرضها بناءً على الفلتر المحدد
  const filteredLocations = service.locations?.filter(
    loc => !selectedLocation || loc.area.includes(selectedLocation)
  ) || [];
  
  // عرض 3 مواقع كحد أقصى ما لم يتم النقر على "عرض الكل"
  const displayLocations = showAllLocations ? filteredLocations : filteredLocations.slice(0, 3);
  const hasMoreLocations = filteredLocations.length > 3;

  const getIcon = (serviceName: string) => {
    if (serviceName.includes('مطاعم')) return '🍽️';
    if (serviceName.includes('نوادي')) return '🎉';
    if (serviceName.includes('صحة')) return '💆‍♀️';
    if (serviceName.includes('يخوت')) return '⛵';
    return '✨';
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-xl border border-gray-700 hover:border-[#39FF14]/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(57,255,20,0.2)]">
      {/* صورة الخدمة مع البادج */}
      <div className="relative h-48">
        <img 
          src={service.imageUrl} 
          alt={service.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white">{service.name}</h3>
        </div>
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${service.status === 'active' ? 'bg-[#39FF14] text-black' : 'bg-amber-500 text-black'}`}>
            {service.status === 'active' ? 'متاح الآن' : 'قريباً'}
          </span>
        </div>
      </div>
      
      {/* محتوى الخدمة */}
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#39FF14]/10 flex items-center justify-center text-[#39FF14] text-2xl">
            {getIcon(service.name)}
          </div>
          <div>
            <p className="text-gray-300 mb-2">{service.description}</p>
            {service.status === 'coming-soon' && service.launchDate && (
              <p className="text-amber-400 text-sm">
                متوقع في {new Date(service.launchDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })}
              </p>
            )}
          </div>
        </div>
        
        {/* الأماكن المتاحة */}
        {filteredLocations.length > 0 && (
          <div className="mt-6">
            <h4 className="text-[#39FF14] font-medium mb-3 flex items-center">
              <span className="mr-2">📍</span> الأماكن المتاحة
            </h4>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <ul className="space-y-3">
                {displayLocations.map((location, idx) => (
                  <li key={idx} className="flex justify-between">
                    <div>
                      <span className="font-medium text-white">{location.name}</span>
                      <span className="text-sm text-gray-400 block">{location.area}</span>
                    </div>
                    <div className="text-right text-sm">
                      {location.cuisine && <span className="text-gray-400 block">{location.cuisine}</span>}
                      {location.priceRange && <span className="text-[#39FF14]">{location.priceRange}</span>}
                      {location.specialty && <span className="text-gray-400 block">{location.specialty}</span>}
                      {location.type && <span className="text-gray-400 block">{location.type}</span>}
                    </div>
                  </li>
                ))}
              </ul>
              
              {hasMoreLocations && (
                <button 
                  onClick={() => setShowAllLocations(!showAllLocations)} 
                  className="text-[#39FF14] hover:text-[#50FF30] mt-3 text-sm font-medium flex items-center"
                >
                  {showAllLocations ? 'عرض أقل' : `عرض كل الأماكن (${filteredLocations.length})`}
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 transition-transform ${showAllLocations ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* زر الحجز أو الإشعار */}
        <div className="mt-6">
          {service.status === 'active' ? (
            <button className="w-full bg-[#39FF14] hover:bg-[#50FF30] text-black font-bold py-3 rounded-lg transition-colors">
              احجز الآن
            </button>
          ) : (
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors">
              أشعرني عند التوفر
            </button>
          )}
        </div>
      </div>
    </div>
  );
}