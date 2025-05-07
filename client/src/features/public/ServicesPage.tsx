// ServicesPage.tsx - صفحة الخدمات الجديدة والمبسطة
import React, { useState } from 'react';
import { collection, getDocs, query } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Compass, Calendar, Sparkles, AlertCircle } from "lucide-react";
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

// بيانات الخدمات
const localServices: Service[] = [
  {
    id: "service1",
    name: "حجز المطاعم الفاخرة",
    description: "احجز طاولتك بشكل فوري في أفخم وأرقى مطاعم الساحل الشمالي وراس الحكمة مع خصم حصري 15%",
    imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop",
    status: "active",
    iconClass: "utensils",
    locations: [
      { name: "مطعم زودياك (Zodiac)", area: "راس الحكمة", cuisine: "مأكولات بحرية", priceRange: "$$$" },
      { name: "مطعم سمك", area: "الساحل الشمالي", cuisine: "مأكولات بحرية", priceRange: "$$$" },
      { name: "تشيبرياني (Cipriani)", area: "الساحل الشمالي", cuisine: "إيطالي", priceRange: "$$$$" }
    ]
  },
  {
    id: "service2",
    name: "حجز النوادي الليلية والبيتش كلوب",
    description: "تمتع بقضاء أجمل الأوقات في النوادي الشاطئية مع دخول VIP وطاولات محجوزة مسبقًا",
    imageUrl: "https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=2070&auto=format&fit=crop",
    status: "active",
    iconClass: "glass-cheers",
    locations: [
      { name: "سيكس ديجريز (6IX Degrees)", area: "راس الحكمة", type: "نادي ليلي", specialty: "حفلات DJ عالمية" },
      { name: "بيتش باد (Beach Bud)", area: "الساحل الشمالي", type: "بيتش كلوب", specialty: "حفلات شاطئية" }
    ]
  },
  {
    id: "service3",
    name: "مركز الصحة والجمال",
    description: "خدمة مساج وسبا فاخرة داخل الفيلا من معالجين معتمدين مع باقات خاصة للأزواج والعائلات",
    imageUrl: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=2070&auto=format&fit=crop",
    status: "coming-soon",
    iconClass: "spa",
    launchDate: new Date("2025-06-15").toISOString()
  },
  {
    id: "service4",
    name: "تأجير اليخوت والقوارب الفاخرة",
    description: "استمتع برحلات بحرية خاصة على متن يخوت فاخرة مع طاقم احترافي وتجهيزات كاملة للاسترخاء",
    imageUrl: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2070&auto=format&fit=crop",
    status: "coming-soon",
    iconClass: "ship",
    launchDate: new Date("2025-07-01").toISOString()
  }
];

/**
 * صفحة الخدمات المبسطة بتصميم أكثر سهولة
 */
export default function ServicesPage() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // استعلام الخدمات
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
        setError("حدث خطأ أثناء جلب بيانات الخدمات");
        return localServices;
      }
    }
  });

  // فلترة الخدمات حسب الموقع
  const getFilteredServices = (status: "active" | "coming-soon") => {
    return services?.filter(service => {
      if (service.status !== status) return false;
      if (selectedLocation && service.locations) {
        return service.locations.some(loc => loc.area.includes(selectedLocation));
      }
      return true;
    }) || [];
  };

  // الخدمات المفلترة
  const activeServices = getFilteredServices("active");
  const comingSoonServices = getFilteredServices("coming-soon");

  // مؤشر التحميل
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-72">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-[#39FF14] border-b-2"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* العنوان والمقدمة */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            خدمات <span className="text-[#39FF14]">StayX</span> المميزة
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            ندعوك لاستكشاف مجموعة خدماتنا الحصرية لتحويل إقامتك إلى تجربة استثنائية
          </p>
        </div>

        {/* أزرار تصفية الموقع */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedLocation(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!selectedLocation ? 'bg-[#39FF14] text-black' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
          >
            كل المواقع
          </button>
          <button
            onClick={() => setSelectedLocation('الساحل الشمالي')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedLocation === 'الساحل الشمالي' ? 'bg-[#39FF14] text-black' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
          >
            الساحل الشمالي
          </button>
          <button
            onClick={() => setSelectedLocation('راس الحكمة')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedLocation === 'راس الحكمة' ? 'bg-[#39FF14] text-black' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
          >
            راس الحكمة
          </button>
        </div>

        {/* رسالة خطأ */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-white px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={18} className="text-red-400" />
            <p>{error}</p>
          </div>
        )}

        {/* تنظيم الخدمات في تبويبات */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-800/50 p-1 border border-gray-700 rounded-xl">
            <TabsTrigger 
              value="active" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-[#39FF14] py-3 rounded-lg"
            >
              <Sparkles size={16} className="mr-2" />
              الخدمات المتاحة ({activeServices.length})
            </TabsTrigger>
            <TabsTrigger 
              value="coming-soon" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-amber-400 py-3 rounded-lg"
            >
              <Calendar size={16} className="mr-2" />
              خدمات قادمة قريباً ({comingSoonServices.length})
            </TabsTrigger>
          </TabsList>

          {/* محتوى الخدمات النشطة */}
          <TabsContent value="active" className="focus-visible:outline-none">
            {activeServices.length === 0 ? (
              <div className="text-center py-10 bg-gray-800/20 rounded-xl border border-gray-700">
                <Compass size={48} className="mx-auto text-gray-500 mb-3" />
                <p className="text-gray-400">لا توجد خدمات متاحة في هذه المنطقة</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {activeServices.map(service => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* محتوى الخدمات القادمة */}
          <TabsContent value="coming-soon" className="focus-visible:outline-none">
            {comingSoonServices.length === 0 ? (
              <div className="text-center py-10 bg-gray-800/20 rounded-xl border border-gray-700">
                <Calendar size={48} className="mx-auto text-gray-500 mb-3" />
                <p className="text-gray-400">لا توجد خدمات قادمة في هذه المنطقة</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {comingSoonServices.map(service => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

/**
 * مكون بطاقة الخدمة - تصميم مبسط وأنيق
 */
function ServiceCard({ service }: { service: Service }) {
  // الأيقونات حسب نوع الخدمة
  const getEmoji = (serviceName: string) => {
    if (serviceName.includes('مطاعم')) return '🍽️';
    if (serviceName.includes('نوادي')) return '🎉';
    if (serviceName.includes('صحة')) return '💆‍♀️';
    if (serviceName.includes('يخوت')) return '⛵';
    return '✨';
  };

  return (
    <div className="rounded-xl overflow-hidden group bg-gray-800/50 border border-gray-700 hover:border-[#39FF14]/30 transition-all hover:shadow-[0_0_15px_rgba(57,255,20,0.15)]">
      <div className="flex flex-col md:flex-row">
        {/* صورة الخدمة */}
        <div className="relative md:w-1/3 h-48 md:h-auto overflow-hidden">
          <img 
            src={service.imageUrl} 
            alt={service.name} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent md:bg-gradient-to-r"></div>
          
          {/* شارة الحالة */}
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              service.status === 'active' 
                ? 'bg-[#39FF14] text-black' 
                : 'bg-amber-500 text-black'
            }`}>
              {service.status === 'active' ? 'متاح الآن' : 'قريباً'}
            </span>
          </div>
        </div>
        
        {/* معلومات الخدمة */}
        <div className="p-5 md:w-2/3 md:p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#39FF14]/10 flex items-center justify-center text-2xl">
              {getEmoji(service.name)}
            </div>
            <h3 className="text-xl font-bold text-white">{service.name}</h3>
          </div>
          
          <p className="text-gray-300 text-sm mb-4">{service.description}</p>
          
          {/* مواقع الخدمة */}
          {service.locations && service.locations.length > 0 && (
            <div className="mt-auto mb-4">
              <h4 className="text-[#39FF14] text-sm font-medium mb-2">
                📍 الأماكن المتاحة:
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {service.locations.map((location, idx) => (
                  <li key={idx} className="bg-gray-800/80 rounded p-2">
                    <div className="font-medium text-white">{location.name}</div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{location.area}</span>
                      {location.priceRange && (
                        <span className="text-amber-400">{location.priceRange}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* زر الحجز أو الإشعار */}
          <button
            className={`w-full py-2 rounded-lg font-medium text-sm mt-auto ${
              service.status === 'active'
                ? 'bg-[#39FF14] text-black hover:bg-[#39FF14]/90'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500/30'
            } transition-all`}
          >
            {service.status === 'active' ? 'حجز الآن' : 'إشعاري عند الإطلاق'}
          </button>
        </div>
      </div>
    </div>
  );
}