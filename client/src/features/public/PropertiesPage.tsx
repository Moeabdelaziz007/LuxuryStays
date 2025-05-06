// PropertiesPage.tsx
import React, { useState } from 'react';
import { collection, getDocs, query, where } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import Layout from '@/components/layout/Layout';

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
  ownerRole?: string; // نوع المالك (CUSTOMER, PROPERTY_ADMIN, SUPER_ADMIN)
  verified?: boolean; // هل تم التحقق من العقار من قبل النظام
}

// بيانات العقارات الواقعية في الساحل الشمالي وراس الحكمة
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
    verified: true
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
    ownerId: "owner2"
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
    ownerId: "owner3"
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
    ownerId: "owner4"
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
    ownerId: "owner5"
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
    ownerId: "owner6"
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
    ownerId: "owner7"
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
    ownerId: "owner8"
  }
];

export default function PropertiesPage() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minBedrooms, setMinBedrooms] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      try {
        if (!db) {
          console.log("Firebase DB not available, using local properties data");
          return localProperties;
        }
        
        const propertiesQuery = query(collection(db, "properties"));
        const snapshot = await getDocs(propertiesQuery);
        
        if (snapshot.empty) {
          console.log("No properties found in Firestore, using local data");
          return localProperties;
        }
        
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Property[];
      } catch (error: any) {
        console.error("Error fetching properties:", error);
        setError("حدث خطأ أثناء جلب بيانات العقارات. يرجى المحاولة مرة أخرى لاحقًا.");
        return localProperties;
      }
    }
  });

  const filteredProperties = properties?.filter(property => {
    // فلترة حسب الموقع
    if (selectedLocation && !property.location.includes(selectedLocation)) {
      return false;
    }
    
    // فلترة حسب السعر
    if (minPrice !== null && property.pricePerNight < minPrice) {
      return false;
    }
    if (maxPrice !== null && property.pricePerNight > maxPrice) {
      return false;
    }
    
    // فلترة حسب عدد غرف النوم
    if (minBedrooms !== null && property.bedrooms < minBedrooms) {
      return false;
    }
    
    return true;
  });

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

  // حساب المواقع المتاحة للفلترة
  const locations = [...new Set(properties?.map(p => {
    if (p.location.includes("راس الحكمة")) return "راس الحكمة";
    if (p.location.includes("الساحل الشمالي")) return "الساحل الشمالي";
    return p.location.split(",")[0].trim();
  }))];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">عقارات <span className="text-[#39FF14]">StayX</span> المميزة</h1>
          <p className="text-gray-400 max-w-3xl mx-auto">
            اكتشف مجموعة من أفخم العقارات في الساحل الشمالي وراس الحكمة، مصممة خصيصًا لتوفير تجربة إقامة استثنائية.
            جميع العقارات مجهزة بأحدث المرافق وتقع في مواقع متميزة.
          </p>
        </div>
        
        {/* فلاتر */}
        <div className="mb-12 bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">البحث والتصفية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* فلتر الموقع */}
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">المنطقة</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedLocation(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!selectedLocation ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                  الكل
                </button>
                {locations.map(location => (
                  <button
                    key={location}
                    onClick={() => setSelectedLocation(location)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedLocation === location ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
            
            {/* فلتر السعر */}
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">السعر (جنيه مصري/ليلة)</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setMinPrice(null); setMaxPrice(null); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!minPrice && !maxPrice ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                  الكل
                </button>
                <button
                  onClick={() => { setMinPrice(null); setMaxPrice(5000); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${maxPrice === 5000 && !minPrice ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                  أقل من 5000
                </button>
                <button
                  onClick={() => { setMinPrice(5000); setMaxPrice(10000); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${minPrice === 5000 && maxPrice === 10000 ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                  5000 - 10000
                </button>
                <button
                  onClick={() => { setMinPrice(10000); setMaxPrice(null); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${minPrice === 10000 && !maxPrice ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                  أكثر من 10000
                </button>
              </div>
            </div>
            
            {/* فلتر غرف النوم */}
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">غرف النوم</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMinBedrooms(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!minBedrooms ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setMinBedrooms(1)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${minBedrooms === 1 ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                  غرفة+
                </button>
                <button
                  onClick={() => setMinBedrooms(2)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${minBedrooms === 2 ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                  غرفتين+
                </button>
                <button
                  onClick={() => setMinBedrooms(3)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${minBedrooms === 3 ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                  3 غرف+
                </button>
                <button
                  onClick={() => setMinBedrooms(4)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${minBedrooms === 4 ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                  4 غرف+
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
        
        {/* قائمة العقارات */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">العقارات المتاحة للإيجار</h2>
            <p className="text-gray-400">عدد النتائج: {filteredProperties?.length || 0}</p>
          </div>
          
          {filteredProperties?.length === 0 ? (
            <div className="text-center py-16 bg-gray-800/50 rounded-xl">
              <h3 className="text-xl font-medium text-white mb-3">لا توجد نتائج مطابقة</h3>
              <p className="text-gray-400">حاول تغيير معايير البحث للعثور على المزيد من العقارات</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties?.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-xl border border-gray-700 hover:border-[#39FF14]/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(57,255,20,0.2)]">
      {/* صورة العقار */}
      <div className="relative h-56">
        <img 
          src={property.imageUrl} 
          alt={property.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {/* السعر */}
        <div className="absolute bottom-4 right-4 bg-[#39FF14] text-black font-bold px-3 py-1 rounded-full">
          {property.pricePerNight.toLocaleString()} ج.م/ليلة
        </div>
        
        {/* التقييم */}
        {property.rating && (
          <div className="absolute top-4 left-4 bg-black/70 text-white flex items-center px-2 py-1 rounded-full">
            <span className="text-[#39FF14] mr-1">★</span>
            <span>{property.rating}</span>
            {property.reviewCount && (
              <span className="text-xs text-gray-300 mr-1">({property.reviewCount})</span>
            )}
          </div>
        )}
        
        {/* مميز */}
        {property.featured && (
          <div className="absolute top-4 right-4 bg-[#39FF14]/90 text-black font-bold px-3 py-1 rounded-full text-xs">
            مميز
          </div>
        )}
      </div>
      
      {/* معلومات العقار */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2">{property.name}</h3>
        <p className="text-gray-400 text-sm mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {property.location}
        </p>
        
        {/* مميزات العقار */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-gray-300">{property.bedrooms} غرف</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-300">{property.bathrooms} حمامات</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-gray-300">{property.maxGuests} ضيوف</span>
          </div>
        </div>
        
        {/* وصف العقار */}
        <p className="text-gray-300 text-sm mb-5 line-clamp-2">{property.description}</p>
        
        {/* المرافق */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="mb-5">
            <h4 className="text-[#39FF14] text-sm font-medium mb-2">المرافق</h4>
            <div className="flex flex-wrap gap-2">
              {property.amenities.slice(0, 4).map((amenity, index) => (
                <span key={index} className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full">
                  {amenity}
                </span>
              ))}
              {property.amenities.length > 4 && (
                <span className="text-xs px-2 py-1 bg-gray-700 text-[#39FF14] rounded-full">
                  +{property.amenities.length - 4}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* زر الحجز */}
        <button className="w-full bg-[#39FF14] hover:bg-[#50FF30] text-black font-bold py-3 rounded-lg transition-colors">
          احجز الآن
        </button>
      </div>
    </div>
  );
}