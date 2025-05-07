// ServicesPage.tsx - صفحة الخدمات المبسطة مع تصميم بطاقات جذاب
import React, { useState } from 'react';
import { collection, getDocs, query } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import Layout from '@/components/layout/Layout';
import { ArrowUpRight, Sparkles, Calendar, MapPin, Clock, Shield } from "lucide-react";
import { motion } from "framer-motion";

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

// بيانات الخدمات المحلية
const localServices: Service[] = [
  {
    id: "service1",
    name: "حجز المطاعم الفاخرة",
    description: "احجز طاولتك بشكل فوري في أفخم وأرقى مطاعم الساحل الشمالي وراس الحكمة مع خصم حصري 15% لعملاء StayX",
    imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop",
    status: "active",
    iconClass: "utensils",
    locations: [
      { name: "مطعم زودياك", area: "راس الحكمة", cuisine: "مأكولات بحرية", priceRange: "$$$" },
      { name: "مطعم سمك", area: "الساحل الشمالي", cuisine: "مأكولات بحرية", priceRange: "$$$" },
      { name: "تشيبرياني", area: "الساحل الشمالي", cuisine: "إيطالي", priceRange: "$$$$" }
    ]
  },
  {
    id: "service2",
    name: "حجز النوادي الليلية والشاطئية",
    description: "تمتع بقضاء أجمل الأوقات في النوادي الشاطئية والليلية مع دخول VIP وطاولات محجوزة",
    imageUrl: "https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=2070&auto=format&fit=crop",
    status: "active",
    iconClass: "glass-cheers",
    locations: [
      { name: "سيكس ديجريز", area: "راس الحكمة", type: "نادي ليلي", specialty: "حفلات DJ عالمية" },
      { name: "بيتش باد", area: "الساحل الشمالي", type: "بيتش كلوب", specialty: "حفلات شاطئية" }
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
 * صفحة الخدمات المبسطة مع تصميم بطاقات جذاب
 */
export default function ServicesPage() {
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
        return localServices;
      }
    }
  });

  // تصنيف الخدمات حسب الحالة
  const activeServices = services?.filter(service => service.status === 'active') || [];
  const comingSoonServices = services?.filter(service => service.status === 'coming-soon') || [];

  // مؤشر التحميل
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-72">
        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-[#39FF14] border-b-2"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      {/* العنوان الرئيسي */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
            خدمات <span className="text-[#39FF14] relative">
              StayX
              <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#39FF14] rounded-full shadow-[0_0_5px_#39FF14]"></span>
            </span> المميزة
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            ندعوك لاستكشاف مجموعة خدماتنا الحصرية المصممة لتحويل إقامتك إلى تجربة لا تُنسى
          </p>
        </div>

        {/* قسم الخدمات المتاحة حالياً */}
        {activeServices.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center mb-10">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Sparkles size={24} className="text-[#39FF14] mr-3" />
                الخدمات المتاحة حالياً
              </h2>
              <div className="flex-grow border-t border-gray-700 mr-4 ml-6"></div>
            </div>

            <div className="grid grid-cols-1 gap-12">
              {activeServices.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* قسم الخدمات القادمة قريباً */}
        {comingSoonServices.length > 0 && (
          <div>
            <div className="flex items-center mb-10">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Calendar size={24} className="text-[#39FF14] mr-3" />
                خدمات قادمة قريباً
              </h2>
              <div className="flex-grow border-t border-gray-700 mr-4 ml-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {comingSoonServices.map((service, index) => (
                <ComingSoonCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        )}
      </div>
  );
}

/**
 * بطاقة عرض الخدمة المتاحة - تصميم جذاب
 */
function ServiceCard({ service, index }: { service: Service; index: number }) {
  // مؤثرات الرسوم المتحركة
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: index * 0.1,
      }
    }
  };

  // استخراج الأيقونة حسب نوع الخدمة
  const getEmoji = (serviceName: string) => {
    if (serviceName.includes('مطاعم')) return '🍽️';
    if (serviceName.includes('نوادي')) return '🎉';
    if (serviceName.includes('صحة')) return '💆‍♀️';
    if (serviceName.includes('يخوت')) return '⛵';
    return '✨';
  };

  const [isHovered, setIsHovered] = useState(false);
  const [showAllLocations, setShowAllLocations] = useState(false);
  
  // عرض عدد محدود من المواقع ما لم يتم الضغط على "عرض المزيد"
  const displayLocations = showAllLocations 
    ? service.locations 
    : service.locations?.slice(0, 2);
  
  const hasMoreLocations = service.locations && service.locations.length > 2;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="relative rounded-xl overflow-hidden bg-gradient-to-r from-gray-900 to-black border border-[#39FF14]/10 hover:border-[#39FF14]/40 transition-all duration-500 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute inset-0 flex">
          <div className="w-1/4 h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTAgMTAwVjUwbTAgMEgwbTUwIDBoNTBtLTUwIDBoMCIgc3Ryb2tlPSJyZ2JhKDU3LCAyNTUsIDIwLCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+')]"></div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* صورة الخدمة */}
        <div className="relative md:w-2/5 h-60 md:h-auto overflow-hidden">
          <img 
            src={service.imageUrl} 
            alt={service.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent md:bg-gradient-to-l"></div>
          <div className="absolute top-4 left-4 bg-[#39FF14] text-black font-medium px-3 py-1 rounded-full text-xs shadow-[0_0_10px_rgba(57,255,20,0.5)]">
            متاح الآن
          </div>
        </div>
        
        {/* معلومات الخدمة */}
        <div className="p-6 md:w-3/5 flex flex-col">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 flex items-center justify-center bg-[#39FF14]/10 rounded-full border border-[#39FF14]/30 text-2xl">
              {getEmoji(service.name)}
            </div>
            <h3 className="text-2xl font-bold text-white">{service.name}</h3>
          </div>
          
          <p className="text-gray-300 mb-5">{service.description}</p>
          
          {/* المواقع المتاحة */}
          {service.locations && service.locations.length > 0 && (
            <div className="space-y-3 mb-6">
              <h4 className="font-medium text-[#39FF14] flex items-center gap-2">
                <MapPin size={16} className="text-[#39FF14]" />
                المواقع المتاحة
              </h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {displayLocations?.map((location, idx) => (
                  <div key={idx} className="flex flex-col bg-black/30 rounded-lg p-3 border border-[#39FF14]/10">
                    <div className="font-medium text-white">{location.name}</div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-400">{location.area}</span>
                      {location.priceRange && (
                        <span className="text-amber-400">{location.priceRange}</span>
                      )}
                    </div>
                    {(location.cuisine || location.specialty) && (
                      <div className="text-[#39FF14]/80 text-xs mt-1">
                        {location.cuisine || location.specialty}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* زر عرض المزيد */}
              {hasMoreLocations && (
                <button
                  onClick={() => setShowAllLocations(!showAllLocations)}
                  className="text-[#39FF14] text-sm hover:underline focus:outline-none flex items-center mt-2"
                >
                  {showAllLocations ? 'عرض أقل' : `عرض المزيد (${service.locations!.length - 2})`}
                </button>
              )}
            </div>
          )}
          
          {/* زر الحجز */}
          <button className="mt-auto w-full md:w-auto self-start px-6 py-2.5 bg-[#39FF14] hover:bg-[#39FF14]/90 text-black font-medium rounded-lg transition-all duration-300 flex items-center gap-2 group">
            حجز الآن
            <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * بطاقة عرض الخدمة القادمة قريباً
 */
function ComingSoonCard({ service }: { service: Service }) {
  // الحصول على تاريخ الإطلاق المتوقع
  const launchDate = service.launchDate 
    ? new Date(service.launchDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })
    : 'قريباً';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(57, 255, 20, 0.1)' }}
      className="rounded-xl overflow-hidden border border-amber-500/20 bg-gradient-to-br from-gray-900 to-black/80 relative group"
    >
      {/* الزخرفة */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/30 rounded-full blur-3xl"></div>
      </div>
      
      {/* صورة الخدمة */}
      <div className="h-44 relative overflow-hidden">
        <img 
          src={service.imageUrl} 
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-black/10"></div>
        <div className="absolute top-4 left-4 bg-amber-500 text-black font-medium px-3 py-1 rounded-full text-xs">
          قريباً
        </div>
      </div>
      
      {/* محتوى البطاقة */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
        <p className="text-gray-400 text-sm mb-3">{service.description}</p>
        
        {/* معلومات الإطلاق */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-amber-500" />
            <span className="text-amber-400 text-sm">
              متوقع في {launchDate}
            </span>
          </div>
          
          <button className="flex items-center gap-1 text-amber-400 text-sm border border-amber-500/50 bg-black/30 px-3 py-1 rounded-full hover:bg-amber-500/10 transition-colors">
            <Clock size={14} />
            <span>إشعاري</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}