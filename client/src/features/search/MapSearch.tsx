import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SpaceButton } from "@/components/ui/space-button";
import { Link } from "wouter";

// نموذج الممتلكات المعروضة على الخريطة
interface MapProperty {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  lat: number;
  lng: number;
  type: 'apartment' | 'villa' | 'chalet';
  rating: number;
  location: string;
}

// بيانات عقارات عينة للعرض على الخريطة
const sampleProperties: MapProperty[] = [
  {
    id: 1,
    title: "شاليه فاخر بإطلالة بحرية",
    description: "إقامة فاخرة مع إطلالة ساحرة على البحر",
    price: 1200,
    image: "/assets/luxury-chalet.svg",
    lat: 27.2578, 
    lng: 33.8116, // الغردقة
    type: 'chalet',
    rating: 4.8,
    location: "شرم الشيخ"
  },
  {
    id: 2,
    title: "فيلا مع حديقة خاصة",
    description: "فيلا فاخرة مع حديقة خاصة وحمام سباحة",
    price: 1800,
    image: "/assets/villa-garden.svg",
    lat: 31.2001,
    lng: 29.9187, // الإسكندرية
    type: 'villa',
    rating: 4.9,
    location: "الساحل الشمالي"
  },
  {
    id: 3,
    title: "شقة فاخرة وسط المدينة",
    description: "شقة مريحة بتصميم عصري في قلب المدينة",
    price: 750,
    image: "/assets/city-apartment.svg",
    lat: 30.0444,
    lng: 31.2357, // القاهرة
    type: 'apartment',
    rating: 4.6,
    location: "القاهرة"
  },
  {
    id: 4,
    title: "شقة مطلة على النيل",
    description: "شقة مميزة بإطلالة خلابة على نهر النيل",
    price: 920,
    image: "/assets/city-apartment.svg",
    lat: 30.0687,
    lng: 31.2297, // القاهرة، قرب النيل
    type: 'apartment',
    rating: 4.7,
    location: "القاهرة"
  },
  {
    id: 5,
    title: "فيلا فاخرة مع مسبح",
    description: "فيلا فاخرة مع مسبح خاص وحديقة واسعة",
    price: 2300,
    image: "/assets/villa-garden.svg",
    lat: 29.9773,
    lng: 32.5258, // السويس
    type: 'villa',
    rating: 4.9,
    location: "العين السخنة"
  },
];

// واجهة خيارات الفلتر
interface FilterOptions {
  priceMin: number;
  priceMax: number;
  propertyType: string[];
  rating: number;
}

export default function MapSearch() {
  const [selectedProperty, setSelectedProperty] = useState<MapProperty | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [savedSearch, setSavedSearch] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState<MapProperty[]>(sampleProperties);
  const mapRef = useRef<HTMLIFrameElement>(null);
  
  // خيارات الفلتر الافتراضية
  const [filters, setFilters] = useState<FilterOptions>({
    priceMin: 0,
    priceMax: 5000,
    propertyType: ['apartment', 'villa', 'chalet'],
    rating: 0
  });

  // تطبيق الفلترة على العقارات
  useEffect(() => {
    const filtered = sampleProperties.filter(property => {
      return (
        property.price >= filters.priceMin &&
        property.price <= filters.priceMax &&
        filters.propertyType.includes(property.type) &&
        property.rating >= filters.rating
      );
    });
    
    setFilteredProperties(filtered);
  }, [filters]);

  // حفظ تفضيلات البحث
  const saveSearchPreferences = () => {
    // في بيئة حقيقية، سنقوم بحفظ هذه في قاعدة البيانات
    localStorage.setItem('searchPreferences', JSON.stringify(filters));
    setSavedSearch(true);
    
    setTimeout(() => {
      setSavedSearch(false);
    }, 3000);
  };

  // استعادة تفضيلات البحث المحفوظة
  useEffect(() => {
    const savedPreferences = localStorage.getItem('searchPreferences');
    if (savedPreferences) {
      setFilters(JSON.parse(savedPreferences));
    }
  }, []);

  // تعديل الفلتر
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // تعديل أنواع العقارات المحددة
  const togglePropertyType = (type: string) => {
    setFilters(prev => {
      const types = [...prev.propertyType];
      if (types.includes(type)) {
        return {
          ...prev,
          propertyType: types.filter(t => t !== type)
        };
      } else {
        return {
          ...prev,
          propertyType: [...types, type]
        };
      }
    });
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* خلفية الصفحة مع تأثيرات النجوم والدوائر التكنولوجية */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900/90 to-black -z-10"></div>
      
      {/* نقاط النجوم المتألقة */}
      <div className="absolute inset-0 overflow-hidden -z-5">
        {Array.from({ length: 30 }).map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
        
        {/* دوائر تكنولوجية */}
        <div className="absolute inset-0 opacity-10">
          <div className="tech-circuit h-full w-full"></div>
        </div>
      </div>

      {/* العنوان */}
      <div className="container mx-auto px-4 pt-8 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center animate-text-glow">
          <span className="text-white">ابحث على</span>{" "}
          <span className="text-[#39FF14]">الخريطة</span>
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#39FF14]/70 to-transparent mx-auto mb-4"></div>
        <p className="text-gray-300 text-center max-w-2xl mx-auto mb-8">
          استكشف العقارات المتاحة في مختلف المواقع واحفظ تفضيلات البحث الخاصة بك
        </p>
      </div>

      {/* المحتوى الرئيسي - الخريطة وقائمة العقارات */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* قسم الفلترة والبحث المتقدم */}
          <div className="lg:col-span-1">
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-[#39FF14]/10 shadow-lg mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white inline-flex items-center gap-2">
                  <span className="bg-[#39FF14]/10 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                    </svg>
                  </span>
                  فلترة البحث
                </h3>
                <button 
                  onClick={() => setFilterOpen(!filterOpen)} 
                  className="text-[#39FF14] hover:text-[#45ff25] transition-colors"
                >
                  {filterOpen ? 'إغلاق' : 'فتح'}
                </button>
              </div>

              {/* حاوية الفلتر */}
              <div className={`overflow-hidden transition-all duration-300 ${filterOpen ? 'max-h-[800px]' : 'max-h-0'}`}>
                {/* نطاق السعر */}
                <div className="mb-6">
                  <h4 className="text-white mb-2 font-medium">نطاق السعر (بالدولار)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm block mb-1">من</label>
                      <input 
                        type="number" 
                        value={filters.priceMin} 
                        onChange={(e) => handleFilterChange('priceMin', Number(e.target.value))}
                        className="w-full bg-black/30 border border-gray-700 rounded-md px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm block mb-1">إلى</label>
                      <input 
                        type="number" 
                        value={filters.priceMax} 
                        onChange={(e) => handleFilterChange('priceMax', Number(e.target.value))}
                        className="w-full bg-black/30 border border-gray-700 rounded-md px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* نوع العقار */}
                <div className="mb-6">
                  <h4 className="text-white mb-2 font-medium">نوع العقار</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => togglePropertyType('apartment')}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${filters.propertyType.includes('apartment') 
                        ? 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/50' 
                        : 'bg-black/30 text-gray-400 border border-gray-700'}`}
                    >
                      شقق
                    </button>
                    <button
                      onClick={() => togglePropertyType('villa')}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${filters.propertyType.includes('villa') 
                        ? 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/50' 
                        : 'bg-black/30 text-gray-400 border border-gray-700'}`}
                    >
                      فيلا
                    </button>
                    <button
                      onClick={() => togglePropertyType('chalet')}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${filters.propertyType.includes('chalet') 
                        ? 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/50' 
                        : 'bg-black/30 text-gray-400 border border-gray-700'}`}
                    >
                      شاليه
                    </button>
                  </div>
                </div>

                {/* التقييم */}
                <div className="mb-6">
                  <h4 className="text-white mb-2 font-medium">التقييم</h4>
                  <div className="flex items-center gap-2">
                    <input 
                      type="range" 
                      min="0" 
                      max="5" 
                      step="0.5" 
                      value={filters.rating} 
                      onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
                      className="w-full h-2 bg-black/30 rounded-lg appearance-none cursor-pointer accent-[#39FF14]"
                    />
                    <span className="text-white font-medium">{filters.rating}+</span>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>0</span>
                    <span>5</span>
                  </div>
                </div>

                {/* أزرار الفلتر */}
                <div className="flex gap-2 justify-end">
                  <SpaceButton 
                    variant="outline" 
                    className="text-sm py-1.5 px-3"
                    onClick={() => setFilters({
                      priceMin: 0,
                      priceMax: 5000,
                      propertyType: ['apartment', 'villa', 'chalet'],
                      rating: 0
                    })}
                  >
                    إعادة ضبط
                  </SpaceButton>
                  <SpaceButton 
                    variant="primary" 
                    className="text-sm py-1.5 px-3"
                    onClick={saveSearchPreferences}
                  >
                    حفظ التفضيلات
                  </SpaceButton>
                </div>

                {/* تأكيد الحفظ */}
                {savedSearch && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 p-2 bg-[#39FF14]/10 border border-[#39FF14]/20 rounded-md text-center text-[#39FF14] text-sm"
                  >
                    تم حفظ تفضيلات البحث بنجاح ✓
                  </motion.div>
                )}
              </div>
            </div>

            {/* قائمة العقارات المصغرة على الجانب */}
            <div className="bg-black/60 backdrop-blur-sm rounded-xl border border-[#39FF14]/10 shadow-lg">
              <div className="p-4 border-b border-gray-800">
                <h3 className="text-xl font-semibold text-white">
                  النتائج ({filteredProperties.length})
                </h3>
              </div>

              <div className="max-h-[600px] overflow-y-auto p-2">
                {filteredProperties.length > 0 ? (
                  filteredProperties.map(property => (
                    <div 
                      key={property.id}
                      className={`p-3 mb-2 rounded-lg transition-all duration-200 cursor-pointer hover:bg-[#39FF14]/5 ${selectedProperty?.id === property.id ? 'bg-[#39FF14]/10 border border-[#39FF14]/30' : 'bg-black/30 border border-gray-800'}`}
                      onClick={() => setSelectedProperty(property)}
                    >
                      <div className="flex gap-3">
                        <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                          <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-white font-medium mb-1 text-sm">{property.title}</h4>
                          <div className="flex items-center gap-1 mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-400 text-xs">{property.location}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#39FF14] font-bold">${property.price}</span>
                            <div className="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-gray-300 text-xs">{property.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-400">
                    لا توجد عقارات تطابق معايير البحث
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* قسم الخريطة والعقار المحدد */}
          <div className="lg:col-span-2 space-y-6">
            {/* الخريطة */}
            <div className="bg-black/60 backdrop-blur-sm rounded-xl overflow-hidden border border-[#39FF14]/10 shadow-lg relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/30 to-transparent"></div>
              
              <div className="h-[500px] w-full">
                {/* باستخدام خرائط Google المضمنة لتجنب تعقيدات الاعتماديات */}
                <iframe
                  ref={mapRef}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13821.558238841918!2d31.225169324520913!3d30.026259626651277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458409d984ac895%3A0x81d689a7e0aa3feb!2sCairo%20Tower!5e0!3m2!1sen!2seg!4v1714406400000!5m2!1sen!2seg"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            {/* تفاصيل العقار المحدد */}
            {selectedProperty && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/60 backdrop-blur-sm rounded-xl overflow-hidden border border-[#39FF14]/10 shadow-lg"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={selectedProperty.image} 
                    alt={selectedProperty.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#39FF14]/90 text-black px-3 py-1 rounded-full text-xs font-bold shadow-[0_0_10px_rgba(57,255,20,0.5)]">
                    ${selectedProperty.price}/ليلة
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-white">{selectedProperty.title}</h3>
                    <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-white font-medium">{selectedProperty.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">{selectedProperty.location}</span>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{selectedProperty.description}</p>
                  
                  <div className="flex gap-3">
                    <Link href={`/property/${selectedProperty.id}`} className="flex-1">
                      <SpaceButton 
                        variant="primary" 
                        className="w-full"
                      >
                        عرض التفاصيل
                      </SpaceButton>
                    </Link>
                    <Link href={`/booking/${selectedProperty.id}`} className="flex-1">
                      <SpaceButton 
                        variant="outline" 
                        className="w-full"
                      >
                        حجز الآن
                      </SpaceButton>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}