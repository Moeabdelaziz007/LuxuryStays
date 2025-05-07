// PropertiesPage.tsx - صفحة العقارات المحسنة لتحسين تجربة المستخدم وتعزيز SEO
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import Layout from '@/components/layout/Layout';
import { ArrowDownCircle, ArrowUpCircle, Compass, MapPin, Clock, Star, Users, Home, Bath, BedDouble, CheckCircle, ShieldCheck, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from '@/components/ui/button';

// تعريف واجهة الخاصية العقارية
interface Property {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  location: string;
  pricePerNight: number;
  featured: boolean;
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  rating?: number;
  reviewCount?: number;
  ownerId: string;
  ownerRole?: string;
  verified?: boolean;
  images?: string[]; // صور إضافية
  availability?: { from: string, to: string }; // توفر العقار
}

// بيانات العقارات الافتراضية
const localProperties: Property[] = [
  {
    id: "property1",
    name: "فيلا بانوراما راس الحكمة",
    imageUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop",
    description: "فيلا فاخرة في قلب راس الحكمة مع إطلالة بانورامية على البحر المتوسط. تتميز بحمام سباحة خاص، وشرفة واسعة، وتصميم داخلي أنيق.",
    location: "ماونتن فيو، راس الحكمة",
    pricePerNight: 15000,
    featured: true,
    amenities: ["حمام سباحة خاص", "شاطئ خاص", "واي فاي", "موقف سيارات", "مكيف هواء", "مطبخ مجهز", "خدمة تنظيف يومية", "حديقة", "شواية"],
    bedrooms: 4,
    bathrooms: 3,
    maxGuests: 10,
    rating: 4.9,
    reviewCount: 28,
    ownerId: "owner1",
    ownerRole: "PROPERTY_ADMIN",
    verified: true,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
    ],
    availability: { from: "2025-07-01", to: "2025-09-30" }
  },
  {
    id: "property2",
    name: "شاليه مارينا الساحل",
    imageUrl: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop",
    description: "شاليه عصري وأنيق في مارينا الساحل الشمالي بإطلالة مباشرة على البحر. يوفر الشاليه مساحة معيشة مفتوحة مع تصميم عصري وديكور فاخر.",
    location: "مارينا، الساحل الشمالي",
    pricePerNight: 8000,
    featured: true,
    amenities: ["حمام سباحة مشترك", "شاطئ قريب", "واي فاي", "موقف سيارات", "مكيف هواء", "مطبخ", "تراس"],
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 6,
    rating: 4.7,
    reviewCount: 45,
    ownerId: "owner2",
    ownerRole: "PROPERTY_ADMIN",
    verified: true,
    availability: { from: "2025-06-15", to: "2025-09-15" }
  },
  {
    id: "property3",
    name: "فيلا هاسيندا لاجون",
    imageUrl: "https://images.unsplash.com/photo-1527030280862-64139fba04ca?q=80&w=2070&auto=format&fit=crop",
    description: "فيلا راقية وهادئة في قلب هاسيندا باي، تطل على بحيرة صناعية خلابة. تتميز بمسبح خاص وحديقة واسعة وتشطيبات فاخرة.",
    location: "هاسيندا باي، الساحل الشمالي",
    pricePerNight: 12000,
    featured: true,
    amenities: ["حمام سباحة خاص", "إطلالة على البحيرة", "واي فاي", "موقف سيارات", "مكيف هواء", "مطبخ مجهز", "خدمة تنظيف", "حديقة", "تراس"],
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 8,
    rating: 4.8,
    reviewCount: 32,
    ownerId: "owner3",
    ownerRole: "PROPERTY_ADMIN",
    verified: true,
    availability: { from: "2025-06-01", to: "2025-09-30" }
  },
  {
    id: "property4",
    name: "شاليه سيزارز جاردنز",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
    description: "شاليه أنيق في قرية سيزارز جاردنز على بعد دقائق من الشاطئ. يتميز بتصميم معاصر ومساحات معيشة مريحة.",
    location: "سيدي عبد الرحمن، الساحل الشمالي",
    pricePerNight: 6000,
    featured: true,
    amenities: ["حمام سباحة مشترك", "شاطئ قريب", "واي فاي", "موقف سيارات", "مكيف هواء", "مطبخ"],
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 5,
    rating: 4.5,
    reviewCount: 19,
    ownerId: "owner4",
    ownerRole: "PROPERTY_ADMIN",
    verified: true,
    availability: { from: "2025-06-15", to: "2025-08-31" }
  },
  {
    id: "property5",
    name: "فيلا مراقيا بيتش فرونت",
    imageUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2073&auto=format&fit=crop",
    description: "فيلا فاخرة على الشاطئ مباشرة في مراقيا، تتميز بإطلالة خلابة على البحر المتوسط مع تصميم داخلي على الطراز المتوسطي.",
    location: "مراقيا، الساحل الشمالي",
    pricePerNight: 18000,
    featured: true,
    amenities: ["حمام سباحة خاص", "شاطئ خاص", "واي فاي", "موقف سيارات", "مكيف هواء", "مطبخ مجهز", "خدمة تنظيف يومية", "شرفة", "غرفة ألعاب"],
    bedrooms: 5,
    bathrooms: 4,
    maxGuests: 12,
    rating: 4.9,
    reviewCount: 23,
    ownerId: "owner5",
    ownerRole: "PROPERTY_ADMIN",
    verified: true,
    availability: { from: "2025-07-01", to: "2025-09-15" }
  },
  {
    id: "property6",
    name: "شاليه ديبو راس الحكمة",
    imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop",
    description: "شاليه حديث في منتجع ديبو براس الحكمة، قريب من الشاطئ ويوفر إطلالة جميلة على المساحات الخضراء.",
    location: "ديبو، راس الحكمة",
    pricePerNight: 7500,
    featured: false,
    amenities: ["حمام سباحة مشترك", "شاطئ قريب", "واي فاي", "موقف سيارات", "مكيف هواء", "مطبخ", "شرفة"],
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 6,
    rating: 4.6,
    reviewCount: 14,
    ownerId: "owner6",
    ownerRole: "PROPERTY_ADMIN",
    verified: true,
    availability: { from: "2025-06-15", to: "2025-08-31" }
  },
  {
    id: "property7",
    name: "فيلا بو راس الحكمة",
    imageUrl: "https://images.unsplash.com/photo-1584738766473-61c083514bf4?q=80&w=2070&auto=format&fit=crop",
    description: "فيلا فاخرة وعصرية في قرية بو براس الحكمة، مع حديقة خاصة وحمام سباحة وإطلالة على البحر.",
    location: "بو، راس الحكمة",
    pricePerNight: 14000,
    featured: false,
    amenities: ["حمام سباحة خاص", "شاطئ قريب", "واي فاي", "موقف سيارات", "مكيف هواء", "مطبخ مجهز", "خدمة تنظيف", "حديقة"],
    bedrooms: 4,
    bathrooms: 3,
    maxGuests: 9,
    rating: 4.8,
    reviewCount: 17,
    ownerId: "owner7",
    ownerRole: "PROPERTY_ADMIN",
    verified: true,
    availability: { from: "2025-07-01", to: "2025-09-15" }
  },
  {
    id: "property8",
    name: "شاليه الفيروز نورث كوست",
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2074&auto=format&fit=crop",
    description: "شاليه أنيق في قرية الفيروز بالساحل الشمالي، يوفر مساحة معيشة مريحة وديكور عصري على بعد دقائق من الشاطئ.",
    location: "الفيروز، الساحل الشمالي",
    pricePerNight: 5500,
    featured: false,
    amenities: ["حمام سباحة مشترك", "شاطئ قريب", "واي فاي", "موقف سيارات", "مكيف هواء", "مطبخ"],
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 4,
    rating: 4.4,
    reviewCount: 21,
    ownerId: "owner8",
    ownerRole: "PROPERTY_ADMIN",
    verified: true,
    availability: { from: "2025-06-01", to: "2025-08-15" }
  }
];

/**
 * صفحة العقارات المحسنة مع تحسينات SEO ومؤثرات بصرية متقدمة
 */
export default function PropertiesPage() {
  // حالة الفلترة
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minBedrooms, setMinBedrooms] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating'>('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // تأثيرات خلفية السايبر
  const [gridOffset, setGridOffset] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // تعقب حركة الماوس لتأثير الخلفية
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) * 10, 
        y: (e.clientY / window.innerHeight) * 10 
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // تأثير تحريك الشبكة
  useEffect(() => {
    const interval = setInterval(() => {
      setGridOffset(prev => ({
        x: (prev.x + 0.2) % 100,
        y: (prev.y + 0.1) % 100
      }));
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  // استعلام العقارات
  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      try {
        if (!db) {
          console.log("Firebase DB not available, using local properties data");
          // تصفية البيانات المحلية بحيث تعرض فقط العقارات المملوكة من قبل مديري العقارات
          const filteredLocalProperties = localProperties.filter(property => 
            property.ownerRole === "PROPERTY_ADMIN" || property.ownerRole === "SUPER_ADMIN"
          );
          
          return filteredLocalProperties.length > 0 
            ? filteredLocalProperties 
            : [localProperties[0]];
        }
        
        // استعلام Firestore للعقارات المملوكة من قبل مديري العقارات فقط
        const propertiesQuery = query(
          collection(db, "properties"),
          where("ownerRole", "in", ["PROPERTY_ADMIN", "SUPER_ADMIN"])
        );
        
        const snapshot = await getDocs(propertiesQuery);
        
        if (snapshot.empty) {
          console.log("No properties found in Firestore, using filtered local data");
          const filteredLocalProperties = localProperties.filter(property => 
            property.ownerRole === "PROPERTY_ADMIN" || property.ownerRole === "SUPER_ADMIN"
          );
          
          return filteredLocalProperties.length > 0 
            ? filteredLocalProperties 
            : [localProperties[0]];
        }
        
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Property[];
      } catch (error: any) {
        console.error("Error fetching properties:", error);
        setError("حدث خطأ أثناء جلب بيانات العقارات. يرجى المحاولة مرة أخرى لاحقًا.");
        
        // تصفية البيانات المحلية
        const filteredLocalProperties = localProperties.filter(property => 
          property.ownerRole === "PROPERTY_ADMIN" || property.ownerRole === "SUPER_ADMIN"
        );
        
        return filteredLocalProperties.length > 0 
          ? filteredLocalProperties 
          : [localProperties[0]];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 دقائق قبل استعلام جديد
  });

  // تصفية وترتيب العقارات
  const filteredAndSortedProperties = React.useMemo(() => {
    if (!properties) return [];

    // تصفية أولاً
    const filtered = properties.filter(property => {
      if (selectedLocation && !property.location.includes(selectedLocation)) {
        return false;
      }
      
      if (minPrice !== null && property.pricePerNight < minPrice) {
        return false;
      }
      
      if (maxPrice !== null && property.pricePerNight > maxPrice) {
        return false;
      }
      
      if (minBedrooms !== null && property.bedrooms < minBedrooms) {
        return false;
      }
      
      return true;
    });

    // ثم الترتيب
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'price_asc') {
        return a.pricePerNight - b.pricePerNight;
      } else if (sortBy === 'price_desc') {
        return b.pricePerNight - a.pricePerNight;
      } else {
        // افتراضي: ترتيب حسب التقييم
        return (b.rating || 0) - (a.rating || 0);
      }
    });

    return sorted;
  }, [properties, selectedLocation, minPrice, maxPrice, minBedrooms, sortBy]);

  // حساب المواقع المتاحة للفلترة
  const locations = React.useMemo(() => {
    if (!properties) return [];
    
    const locationsMap: Record<string, boolean> = {};
    properties.forEach(p => {
      let location = "";
      if (p.location.includes("راس الحكمة")) location = "راس الحكمة";
      else if (p.location.includes("الساحل الشمالي")) location = "الساحل الشمالي";
      else location = p.location.split(",")[0].trim();
      
      locationsMap[location] = true;
    });
    
    return Object.keys(locationsMap);
  }, [properties]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-black relative overflow-hidden">
          {/* مؤثرات الخلفية */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(57, 255, 20, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(57, 255, 20, 0.03) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              backgroundPosition: `${gridOffset.x}px ${gridOffset.y}px`
            }}></div>
          </div>
          
          <div className="flex justify-center items-center h-72">
            {/* مؤشر التحميل بتصميم سايبر */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-[#39FF14]/10 animate-pulse"></div>
              <svg className="animate-spin h-12 w-12 text-[#39FF14]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // عناصر تصفية السعر
  const priceFilters = [
    { label: 'الكل', minPrice: null, maxPrice: null },
    { label: 'أقل من 5000 ج.م', minPrice: null, maxPrice: 5000 },
    { label: '5000 - 10000 ج.م', minPrice: 5000, maxPrice: 10000 },
    { label: '10000 - 15000 ج.م', minPrice: 10000, maxPrice: 15000 },
    { label: 'أكثر من 15000 ج.م', minPrice: 15000, maxPrice: null },
  ];

  return (
    <Layout>
      {/* خلفية سايبر للصفحة */}
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* مؤثرات الخلفية التفاعلية */}
        <div className="fixed inset-0 overflow-hidden opacity-20 pointer-events-none z-0">
          {/* شبكة متحركة */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(57, 255, 20, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(57, 255, 20, 0.03) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            backgroundPosition: `${gridOffset.x}px ${gridOffset.y}px`
          }}></div>
          
          {/* نقاط توهج متحركة تتبع الماوس */}
          <div className="absolute opacity-30" style={{
            left: `calc(${mousePosition.x}% - 100px)`,
            top: `calc(${mousePosition.y}% - 100px)`,
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(57, 255, 20, 0.4) 0%, transparent 70%)',
            transition: 'left 0.3s ease-out, top 0.3s ease-out',
          }}></div>
          
          {/* خطوط المسح */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute h-full w-full opacity-5">
              {[...Array(15)].map((_, index) => (
                <div
                  key={index}
                  className="h-[2px] w-full bg-[#39FF14]/30 absolute"
                  style={{
                    top: `${(index * 7) % 100}%`,
                    animation: `scan ${3 + index % 2}s linear infinite`,
                    animationDelay: `${index * 0.1}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* محتوى الصفحة الرئيسي */}
        <div className="container mx-auto px-4 py-12 sm:py-16 relative z-10">
          {/* عنوان الصفحة */}
          <div className="relative z-10 text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#39FF14] to-white animate-gradient-x">
                عقارات ستاي إكس
              </span>
            </h1>
            
            {/* خط زخرفي تحت العنوان */}
            <div className="h-px w-full max-w-xs mx-auto mt-4 bg-gradient-to-r from-transparent via-[#39FF14] to-transparent"></div>
            
            {/* وصف العقارات مع تحسين SEO */}
            <p className="text-gray-300 mt-6 max-w-2xl mx-auto text-sm sm:text-base">
              اكتشف أفخم العقارات للإيجار في الساحل الشمالي وراس الحكمة. 
              فلل خاصة وشاليهات مجهزة بالكامل لقضاء إجازة صيفية مميزة مع إطلالات بحرية خلابة وخدمات فندقية راقية.
            </p>
            
            {/* إحصائيات العقارات */}
            <div className="flex justify-center gap-8 mt-8">
              <div className="bg-black/40 backdrop-blur-sm border border-[#39FF14]/20 rounded-lg px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex items-center gap-2">
                  <Home size={18} className="text-[#39FF14]" />
                  <span className="text-white font-bold">{properties?.length || 0}</span>
                  <span className="text-gray-400 text-sm">عقار</span>
                </div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-[#39FF14]/20 rounded-lg px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-[#39FF14]" />
                  <span className="text-white font-bold">{locations.length}</span>
                  <span className="text-gray-400 text-sm">موقع</span>
                </div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-[#39FF14]/20 rounded-lg px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-[#39FF14]" />
                  <span className="text-white font-bold">4.7</span>
                  <span className="text-gray-400 text-sm">متوسط التقييم</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* قسم الفلترة */}
          <motion.div 
            className="mb-10 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-black/70 backdrop-blur-lg border border-[#39FF14]/20 rounded-xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
              {/* رأس قسم الفلترة */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-[#39FF14] animate-pulse"></div>
                  <h2 className="text-xl font-bold text-white">تصفية النتائج</h2>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm flex items-center">
                    <Clock size={14} className="ml-1" />
                    تم التحديث اليوم
                  </span>
                  
                  <Button 
                    onClick={() => setShowFilters(!showFilters)}
                    variant="outline"
                    size="sm"
                    className="border-[#39FF14]/30 hover:border-[#39FF14] hover:bg-[#39FF14]/10 text-[#39FF14]"
                  >
                    {showFilters ? <ArrowUpCircle size={16} className="ml-2" /> : <ArrowDownCircle size={16} className="ml-2" />}
                    {showFilters ? 'إخفاء الفلاتر' : 'عرض الفلاتر'}
                  </Button>
                </div>
              </div>
              
              {/* قسم الفلاتر المفصلة */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="py-4 border-t border-[#39FF14]/10">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* فلتر الموقع */}
                        <div>
                          <h3 className="text-sm font-semibold text-[#39FF14] mb-3 flex items-center">
                            <MapPin size={14} className="ml-1" />
                            المنطقة
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            <button
                              onClick={() => setSelectedLocation(null)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${!selectedLocation ? 'bg-[#39FF14] text-black' : 'bg-gray-900/60 border border-[#39FF14]/20 text-white hover:bg-gray-800/60 hover:border-[#39FF14]/40'}`}
                            >
                              الكل
                            </button>
                            {locations.map(location => (
                              <button
                                key={location}
                                onClick={() => setSelectedLocation(location)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedLocation === location ? 'bg-[#39FF14] text-black' : 'bg-gray-900/60 border border-[#39FF14]/20 text-white hover:bg-gray-800/60 hover:border-[#39FF14]/40'}`}
                              >
                                {location}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* فلتر السعر */}
                        <div>
                          <h3 className="text-sm font-semibold text-[#39FF14] mb-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20" />
                            </svg>
                            السعر (جنيه/ليلة)
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {priceFilters.map((filter, index) => (
                              <button
                                key={index}
                                onClick={() => { setMinPrice(filter.minPrice); setMaxPrice(filter.maxPrice); }}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${minPrice === filter.minPrice && maxPrice === filter.maxPrice ? 'bg-[#39FF14] text-black' : 'bg-gray-900/60 border border-[#39FF14]/20 text-white hover:bg-gray-800/60 hover:border-[#39FF14]/40'}`}
                              >
                                {filter.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* فلتر غرف النوم */}
                        <div>
                          <h3 className="text-sm font-semibold text-[#39FF14] mb-3 flex items-center">
                            <BedDouble size={14} className="ml-1" />
                            غرف النوم
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            <button
                              onClick={() => setMinBedrooms(null)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${!minBedrooms ? 'bg-[#39FF14] text-black' : 'bg-gray-900/60 border border-[#39FF14]/20 text-white hover:bg-gray-800/60 hover:border-[#39FF14]/40'}`}
                            >
                              الكل
                            </button>
                            {[1, 2, 3, 4].map(num => (
                              <button
                                key={num}
                                onClick={() => setMinBedrooms(num)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${minBedrooms === num ? 'bg-[#39FF14] text-black' : 'bg-gray-900/60 border border-[#39FF14]/20 text-white hover:bg-gray-800/60 hover:border-[#39FF14]/40'}`}
                              >
                                {num}+ غرف
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* خيارات الترتيب وعدد النتائج */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 border-t border-[#39FF14]/10">
                <div className="text-gray-400 text-sm mb-4 sm:mb-0">
                  <span>تم العثور على </span>
                  <span className="text-white font-bold">{filteredAndSortedProperties.length}</span>
                  <span> عقار</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm hidden sm:inline-block">الترتيب:</span>
                  <div className="flex gap-1 bg-black/50 border border-[#39FF14]/20 rounded-lg p-1">
                    <button
                      onClick={() => setSortBy('rating')}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${sortBy === 'rating' ? 'bg-[#39FF14]/20 text-[#39FF14]' : 'hover:bg-black/50 text-gray-400'}`}
                    >
                      الأعلى تقييماً
                    </button>
                    <button
                      onClick={() => setSortBy('price_asc')}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${sortBy === 'price_asc' ? 'bg-[#39FF14]/20 text-[#39FF14]' : 'hover:bg-black/50 text-gray-400'}`}
                    >
                      الأقل سعراً
                    </button>
                    <button
                      onClick={() => setSortBy('price_desc')}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${sortBy === 'price_desc' ? 'bg-[#39FF14]/20 text-[#39FF14]' : 'hover:bg-black/50 text-gray-400'}`}
                    >
                      الأعلى سعراً
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* رسالة خطأ إذا وجدت */}
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-white px-4 py-3 rounded-lg mb-6">
              <p>{error}</p>
            </div>
          )}
          
          {/* قائمة العقارات */}
          <div className="mb-16 space-y-6">
            {filteredAndSortedProperties.length === 0 ? (
              <div className="text-center py-12 bg-black/40 backdrop-blur-sm border border-[#39FF14]/10 rounded-xl">
                <div className="text-5xl mb-4">🏝️</div>
                <h3 className="text-xl font-bold text-white mb-2">لا توجد عقارات تطابق المعايير</h3>
                <p className="text-gray-400">حاول تغيير معايير البحث للحصول على المزيد من النتائج</p>
                <button
                  onClick={() => {
                    setSelectedLocation(null);
                    setMinPrice(null);
                    setMaxPrice(null);
                    setMinBedrooms(null);
                  }}
                  className="mt-4 text-[#39FF14] hover:underline"
                >
                  إعادة ضبط جميع الفلاتر
                </button>
              </div>
            ) : (
              filteredAndSortedProperties.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

/**
 * مكون بطاقة عرض العقار المُحسّن
 */
interface PropertyCardProps {
  property: Property;
  index: number;
}

function PropertyCard({ property, index }: PropertyCardProps) {
  // تأثيرات الصور عند تمرير الماوس
  const [isHovered, setIsHovered] = useState(false);
  
  // تأخير ظهور البطاقات بالتسلسل
  const initialDelay = Math.min(index * 0.1, 0.8);
  
  // تنسيق عدد النجوم
  const stars = Array(5).fill(0).map((_, i) => {
    if (!property.rating) return false;
    const roundedRating = Math.round(property.rating * 2) / 2;
    return i < Math.floor(roundedRating);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: initialDelay }}
      className="relative group"
    >
      {/* مؤثر توهج الحدود عند تمرير الماوس */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#39FF14]/0 via-[#39FF14]/40 to-[#39FF14]/0 rounded-xl blur opacity-0 group-hover:opacity-90 transition-opacity duration-500"></div>
      
      <div className="relative bg-black/80 backdrop-blur-md border border-[#39FF14]/20 hover:border-[#39FF14]/50 rounded-xl overflow-hidden transition-all duration-500">
        <div className="flex flex-col md:flex-row">
          {/* قسم صورة العقار */}
          <div 
            className="md:w-2/5 h-60 md:h-auto relative overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* الصورة الرئيسية */}
            <img 
              src={property.imageUrl} 
              alt={property.name}
              className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
              loading="lazy"
            />
            
            {/* تأثير التدرج فوق الصورة */}
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent md:bg-gradient-to-l"></div>
            
            {/* شارة مميز إذا كان العقار مميز */}
            {property.featured && (
              <div className="absolute top-4 left-4 bg-[#39FF14] text-black font-medium px-3 py-1 rounded-full text-xs shadow-[0_0_10px_rgba(57,255,20,0.5)] z-10">
                عقار مميز
              </div>
            )}
            
            {/* شارة التحقق إذا كان العقار موثّق */}
            {property.verified && (
              <div className="absolute top-4 right-4 bg-black/80 text-[#39FF14] font-medium px-3 py-1 rounded-full text-xs z-10 flex items-center backdrop-blur-sm border border-[#39FF14]/30">
                <ShieldCheck size={14} className="ml-1" />
                موثّق
              </div>
            )}
            
            {/* تأثير خط المسح على الصورة */}
            <div className="absolute inset-0 z-10 opacity-30 overflow-hidden pointer-events-none">
              <div className="absolute w-full h-[1px] bg-[#39FF14]/50 animate-scan"></div>
            </div>
          </div>
          
          {/* معلومات العقار */}
          <div className="p-6 md:w-3/5 flex flex-col relative">
            {/* معلومات الموقع */}
            <div className="flex items-center text-[#39FF14]/80 text-sm mb-2">
              <MapPin size={14} className="ml-1" />
              <span>{property.location}</span>
            </div>
            
            {/* اسم العقار */}
            <h3 className="text-2xl font-bold text-white mb-2 md:mb-3">{property.name}</h3>
            
            {/* وصف العقار مختصر */}
            <p className="text-gray-300 text-sm mb-4 line-clamp-2 md:line-clamp-3">
              {property.description}
            </p>
            
            {/* معلومات الغرف والمساحة */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-1.5 text-sm text-gray-300">
                <BedDouble size={16} className="text-[#39FF14]/70" />
                <span>{property.bedrooms} غرف نوم</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-300">
                <Bath size={16} className="text-[#39FF14]/70" />
                <span>{property.bathrooms} حمام</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-300">
                <Users size={16} className="text-[#39FF14]/70" />
                <span>يتسع لـ {property.maxGuests} أشخاص</span>
              </div>
            </div>
            
            {/* المرافق المتوفرة */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {property.amenities?.slice(0, 4).map((amenity, idx) => (
                  <div key={idx} className="bg-black/40 text-gray-200 text-xs px-2 py-1 rounded-md border border-[#39FF14]/10">
                    {amenity}
                  </div>
                ))}
                
                {property.amenities && property.amenities.length > 4 && (
                  <div className="bg-black/40 text-gray-200 text-xs px-2 py-1 rounded-md border border-[#39FF14]/10">
                    +{property.amenities.length - 4}
                  </div>
                )}
              </div>
            </div>
            
            {/* التقييم والسعر */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-auto">
              <div>
                {property.rating && (
                  <div className="flex items-center gap-1.5">
                    <div className="flex">
                      {stars.map((filled, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={filled ? "text-[#39FF14]" : "text-gray-600"} 
                          fill={filled ? "#39FF14" : "transparent"}
                        />
                      ))}
                    </div>
                    <span className="text-white font-medium text-sm">{property.rating}</span>
                    {property.reviewCount && (
                      <span className="text-gray-400 text-xs">
                        ({property.reviewCount} تقييم)
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <div className="text-[#39FF14] font-bold text-2xl">
                  {property.pricePerNight.toLocaleString()} ج.م
                </div>
                <div className="text-gray-400 text-xs">في الليلة</div>
              </div>
            </div>
            
            {/* زر عرض التفاصيل */}
            <div className="mt-6 flex justify-end">
              <button className="group inline-flex items-center gap-2 px-5 py-2 bg-black/70 hover:bg-[#39FF14]/90 text-[#39FF14] hover:text-black border border-[#39FF14]/50 hover:border-[#39FF14] rounded-lg transition-all duration-300">
                <span className="font-medium">عرض التفاصيل</span>
                <ExternalLink 
                  size={16} 
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" 
                />
              </button>
            </div>
          </div>
        </div>
        
        {/* تأثيرات زخرفية للبطاقة */}
        <div className="absolute top-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#39FF14]/30 to-transparent"></div>
        <div className="absolute bottom-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#39FF14]/30 to-transparent"></div>
      </div>
    </motion.div>
  );
}

// مشابك CSS لإضافة مؤثرات التصميم
const CyberStyles = () => (
  <style>{`
    @keyframes scan {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100%); }
    }
    
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    @keyframes float {
      0% { transform: translate(0, 0); }
      50% { transform: translate(0, 10px); }
      100% { transform: translate(0, 0); }
    }
    
    @keyframes gradient-x {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    .animate-scan {
      animation: scan 2s linear infinite;
    }
    
    .animate-blink {
      animation: blink 1.5s infinite;
    }
    
    .animate-pulse-slow {
      animation: pulse 3s ease-in-out infinite;
    }
    
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    
    .animate-gradient-x {
      background-size: 200% 100%;
      animation: gradient-x 8s ease infinite;
    }
  `}</style>
);