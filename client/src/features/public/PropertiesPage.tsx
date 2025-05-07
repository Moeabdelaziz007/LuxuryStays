// PropertiesPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { collection, getDocs, query, where } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import RoleBadge from '@/components/badges/RoleBadge';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Search, Map, FilterX, BuildingIcon, BedDouble, Bath, Users, Save, BookMarked } from "lucide-react";
import { format } from "date-fns";
import { SavedSearch, personalizationService } from '@/services/PersonalizationService';
import SavedSearches from '@/features/search/SavedSearches';
import PersonalizedRecommendations from '@/features/properties/PersonalizedRecommendations';

interface Property {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  location: string;
  pricePerNight: number; // Price in USD
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
    pricePerNight: 485,
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
    pricePerNight: 259,
    featured: true,
    amenities: ["حمام سباحة مشترك", "شاطئ قريب", "واي فاي", "موقف سيارات", "مكيف هواء", "مطبخ", "تراس"],
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 6,
    rating: 4.7,
    reviewCount: 45,
    ownerId: "owner2",
    ownerRole: "PROPERTY_ADMIN",
    verified: true
  },
  {
    id: "property3",
    name: "فيلا هاسيندا لاجون",
    imageUrl: "https://images.unsplash.com/photo-1527030280862-64139fba04ca?q=80&w=2070&auto=format&fit=crop",
    description: "فيلا راقية وهادئة في قلب هاسيندا باي، تطل على بحيرة صناعية خلابة. تتميز بمسبح خاص وحديقة واسعة وتشطيبات فاخرة.",
    location: "هاسيندا باي، الساحل الشمالي",
    pricePerNight: 388,
    featured: true,
    amenities: ["حمام سباحة خاص", "إطلالة على البحيرة", "واي فاي", "موقف سيارات", "مكيف هواء", "مطبخ مجهز", "خدمة تنظيف", "حديقة", "تراس"],
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 8,
    rating: 4.8,
    reviewCount: 32,
    ownerId: "owner3",
    ownerRole: "PROPERTY_ADMIN",
    verified: true
  },
  {
    id: "property4",
    name: "شاليه سيزارز جاردنز",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
    description: "شاليه أنيق في قرية سيزارز جاردنز على بعد دقائق من الشاطئ. يتميز بتصميم معاصر ومساحات معيشة مريحة.",
    location: "سيدي عبد الرحمن، الساحل الشمالي",
    pricePerNight: 195,
    featured: true,
    amenities: ["حمام سباحة مشترك", "شاطئ قريب", "واي فاي", "موقف سيارات", "مكيف هواء", "مطبخ"],
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 5,
    rating: 4.5,
    reviewCount: 19,
    ownerId: "owner4",
    ownerRole: "CUSTOMER",
    verified: false
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
    verified: true
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
    ownerRole: "CUSTOMER",
    verified: false
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
    verified: true
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
    ownerRole: "CUSTOMER",
    verified: false
  }
];

// Get all unique amenities from properties
const getAllAmenities = () => {
  const amenitiesSet = new Set<string>();
  localProperties.forEach(property => {
    property.amenities.forEach(amenity => {
      amenitiesSet.add(amenity);
    });
  });
  return Array.from(amenitiesSet);
};

// Get property geo coordinates for map view (simplified mock)
const getPropertyCoordinates = (property: Property) => {
  // This is a simplified mock - in a real app we would get real coordinates from a geocoding API
  const baseCoordinates = {
    "راس الحكمة": { lat: 31.17, lng: 27.77 },
    "الساحل الشمالي": { lat: 30.95, lng: 28.72 },
    "مراقيا": { lat: 31.03, lng: 28.55 },
    "هاسيندا": { lat: 30.97, lng: 28.64 },
  };

  // Find the matching region or default to a base coordinate
  let baseCoord = { lat: 31.0, lng: 28.5 }; // Default
  Object.entries(baseCoordinates).forEach(([region, coord]) => {
    if (property.location.includes(region)) {
      baseCoord = coord;
    }
  });

  // Add small random offset to avoid overlapping pins
  return {
    lat: baseCoord.lat + (Math.random() - 0.5) * 0.05,
    lng: baseCoord.lng + (Math.random() - 0.5) * 0.05,
  };
};

export default function PropertiesPage() {
  const { toast } = useToast();
  
  // Basic Filters
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minBedrooms, setMinBedrooms] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Extended Filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [guests, setGuests] = useState<number>(1);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("list");
  const [mapOpen, setMapOpen] = useState<boolean>(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [advancedFiltersVisible, setAdvancedFiltersVisible] = useState<boolean>(false);
  
  // Get all amenities for filtering
  const allAmenities = getAllAmenities();

  // State for offline mode
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [offlineProperties, setOfflineProperties] = useState<Property[]>([]);
  
  // Toggle offline mode
  const toggleOfflineMode = (checked: boolean) => {
    setIsOfflineMode(checked);
    if (checked) {
      toast({
        title: "وضع عدم الاتصال مفعل",
        description: "يمكنك الآن تصفح العقارات دون الحاجة للإنترنت",
      });
    } else {
      toast({
        title: "تم إيقاف وضع عدم الاتصال",
        description: "أنت متصل الآن بالخادم مرة أخرى",
      });
      
      // Refresh data from server when going back online
      if (navigator.onLine) {
        // Here we would refresh data from server in real implementation
        console.log("Refreshing data from server");
      }
    }
  };
  
  // Function to store properties data locally
  const storePropertiesLocally = (properties: Property[]) => {
    try {
      localStorage.setItem('cachedProperties', JSON.stringify(properties));
      localStorage.setItem('propertiesCacheTimestamp', Date.now().toString());
      setOfflineProperties(properties);
    } catch (error) {
      console.error("Error storing properties locally:", error);
    }
  };
  
  // Function to load locally stored properties
  const loadLocalProperties = (): Property[] => {
    try {
      const cachedData = localStorage.getItem('cachedProperties');
      if (cachedData) {
        return JSON.parse(cachedData);
      }
    } catch (error) {
      console.error("Error loading local properties:", error);
    }
    return [];
  };
  
  // Check connection status
  useEffect(() => {
    const handleOffline = () => {
      setIsOfflineMode(true);
      toast({
        title: "أنت في وضع عدم الاتصال",
        description: "تم التبديل إلى وضع عدم الاتصال. يمكنك الاستمرار في تصفح العقارات المخزنة مسبقًا.",
        variant: "default",
        className: "bg-amber-900/80 border-amber-600"
      });
    };
    
    const handleOnline = () => {
      setIsOfflineMode(false);
      toast({
        title: "تم استعادة الاتصال",
        description: "تم التبديل إلى وضع الاتصال. يتم الآن تحديث البيانات.",
        variant: "default",
        className: "bg-green-900/80 border-green-600"
      });
    };
    
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    
    // Check initial state
    if (!navigator.onLine) {
      setIsOfflineMode(true);
    }
    
    // Load offline data initially
    const localData = loadLocalProperties();
    if (localData.length > 0) {
      setOfflineProperties(localData);
    }
    
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);
  
  // This toggleOfflineMode function is already declared above, so removed duplicate

  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      try {
        // If manually in offline mode or network is unavailable, use cached data
        if (isOfflineMode || !navigator.onLine) {
          console.log("Using offline data");
          const cachedProperties = loadLocalProperties();
          if (cachedProperties.length > 0) {
            return cachedProperties;
          }
          // Fallback to local data if no cached data
          const filteredLocalProperties = localProperties.filter(property => 
            property.ownerRole === "PROPERTY_ADMIN" || property.ownerRole === "SUPER_ADMIN"
          );
          return filteredLocalProperties.length > 0 ? filteredLocalProperties : [localProperties[0]];
        }
        
        if (!db) {
          console.log("Firebase DB not available, using local properties data");
          // تصفية البيانات المحلية بحيث تعرض فقط العقارات المملوكة من قبل مديري العقارات
          const filteredLocalProperties = localProperties.filter(property => 
            property.ownerRole === "PROPERTY_ADMIN" || property.ownerRole === "SUPER_ADMIN"
          );
          
          // Cache for offline use
          storePropertiesLocally(filteredLocalProperties);
          
          // إذا لم تكن هناك بيانات بعد التصفية، نعرض العقار الأول الذي أضفنا له ownerRole
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
          // تصفية البيانات المحلية
          const filteredLocalProperties = localProperties.filter(property => 
            property.ownerRole === "PROPERTY_ADMIN" || property.ownerRole === "SUPER_ADMIN"
          );
          
          // Cache for offline use
          storePropertiesLocally(filteredLocalProperties);
          
          return filteredLocalProperties.length > 0 
            ? filteredLocalProperties 
            : [localProperties[0]];
        }
        
        const fetchedProperties = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Property[];
        
        // Cache for offline use
        storePropertiesLocally(fetchedProperties);
        
        return fetchedProperties;
      } catch (error: any) {
        console.error("Error fetching properties:", error);
        setError("حدث خطأ أثناء جلب بيانات العقارات. يرجى المحاولة مرة أخرى لاحقًا.");
        
        // Check for cached properties first
        const cachedProperties = loadLocalProperties();
        if (cachedProperties.length > 0) {
          return cachedProperties;
        }
        
        // تصفية البيانات المحلية
        const filteredLocalProperties = localProperties.filter(property => 
          property.ownerRole === "PROPERTY_ADMIN" || property.ownerRole === "SUPER_ADMIN"
        );
        
        return filteredLocalProperties.length > 0 
          ? filteredLocalProperties 
          : [localProperties[0]];
      }
    },
    staleTime: isOfflineMode ? Infinity : 60000, // Set stale time to infinity in offline mode
    refetchOnWindowFocus: !isOfflineMode,
    refetchOnMount: !isOfflineMode,
    refetchOnReconnect: !isOfflineMode
  });

  // Update the advanced filter states based on basic filters
  useEffect(() => {
    if (minPrice !== null || maxPrice !== null) {
      setPriceRange([
        minPrice !== null ? minPrice : 0,
        maxPrice !== null ? maxPrice : 20000
      ]);
    }
    
    if (minBedrooms !== null) {
      // Keep the advanced filter in sync with the basic filter
    }
  }, [minPrice, maxPrice, minBedrooms]);

  // Function to handle search and apply all filters
  const handleSearch = () => {
    // This would be an API call in a real application
    toast({
      title: "تم تطبيق المرشحات",
      description: `تم العثور على ${filteredProperties?.length || 0} عقار يطابق معايير البحث`,
    });
  };

  // Toggle amenity selection
  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedLocation(null);
    setMinPrice(null);
    setMaxPrice(null);
    setMinBedrooms(null);
    setPriceRange([0, 20000]);
    setDateRange({ from: undefined, to: undefined });
    setGuests(1);
    setSelectedAmenities([]);
    setSearchText("");
    
    toast({
      title: "تم إعادة تعيين المرشحات",
      description: "تم إعادة تعيين جميع مرشحات البحث"
    });
  };

  // Open map view
  const openMapView = () => {
    setMapOpen(true);
  };

  // Apply coordinates to properties for map view
  const propertiesWithCoordinates = properties?.map(property => ({
    ...property,
    coordinates: getPropertyCoordinates(property)
  }));

  const filteredProperties = properties?.filter(property => {
    // Text search filter
    if (searchText && 
      !property.name.toLowerCase().includes(searchText.toLowerCase()) && 
      !property.description.toLowerCase().includes(searchText.toLowerCase()) &&
      !property.location.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }
    
    // فلترة حسب الموقع
    if (selectedLocation && !property.location.includes(selectedLocation)) {
      return false;
    }
    
    // فلترة حسب السعر (using advanced price range)
    if (property.pricePerNight < priceRange[0] || property.pricePerNight > priceRange[1]) {
      return false;
    }
    
    // فلترة حسب عدد غرف النوم
    if (minBedrooms !== null && property.bedrooms < minBedrooms) {
      return false;
    }
    
    // Filter by guest capacity
    if (guests > property.maxGuests) {
      return false;
    }
    
    // Filter by amenities
    if (selectedAmenities.length > 0) {
      // Check if property has ALL selected amenities
      for (const amenity of selectedAmenities) {
        if (!property.amenities.includes(amenity)) {
          return false;
        }
      }
    }
    
    return true;
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-72">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-[#39FF14] border-b-2"></div>
        </div>
      </div>
    );
  }

  // حساب المواقع المتاحة للفلترة بطريقة تجنب استخدام Set (لتفادي مشكلة TypeScript)
  const locationsMap: Record<string, boolean> = {};
  properties?.forEach(p => {
    let location = "";
    if (p.location.includes("راس الحكمة")) location = "راس الحكمة";
    else if (p.location.includes("الساحل الشمالي")) location = "الساحل الشمالي";
    else location = p.location.split(",")[0].trim();
    
    locationsMap[location] = true;
  });
  
  const locations = Object.keys(locationsMap);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">عقارات <span className="text-[#39FF14]">StayX</span> المميزة</h1>
        <p className="text-gray-400 max-w-3xl mx-auto">
          اكتشف مجموعة من أفخم العقارات في الساحل الشمالي وراس الحكمة، مصممة خصيصًا لتوفير تجربة إقامة استثنائية.
          جميع العقارات مجهزة بأحدث المرافق وتقع في مواقع متميزة.
        </p>
      </div>
        
        {/* بحث متقدم مع عرضين (قائمة / خريطة) */}
        <div className="mb-12">
          <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 mb-4">
              <TabsList className="bg-gray-800 p-1 w-full sm:w-auto">
                <TabsTrigger 
                  value="list" 
                  className="data-[state=active]:bg-[#39FF14] data-[state=active]:text-black text-gray-300"
                >
                  <BuildingIcon className="w-4 h-4 mr-2" />
                  عرض القائمة
                </TabsTrigger>
                <TabsTrigger 
                  value="map" 
                  className="data-[state=active]:bg-[#39FF14] data-[state=active]:text-black text-gray-300"
                >
                  <Map className="w-4 h-4 mr-2" />
                  عرض الخريطة
                </TabsTrigger>
              </TabsList>
              
              {/* Offline Mode Toggle */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700">
                <Switch 
                  id="offline-mode" 
                  checked={isOfflineMode}
                  onCheckedChange={toggleOfflineMode}
                  className="data-[state=checked]:bg-[#39FF14]"
                />
                <Label 
                  htmlFor="offline-mode" 
                  className={`text-sm ${isOfflineMode ? 'text-[#39FF14]' : 'text-gray-300'}`}
                >
                  {isOfflineMode ? "وضع عدم الاتصال مفعل" : "وضع عدم الاتصال"}
                </Label>
                <div className={`w-2 h-2 rounded-full ${isOfflineMode ? 'bg-[#39FF14]' : navigator.onLine ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setAdvancedFiltersVisible(!advancedFiltersVisible)}
                  variant="outline"
                  size="sm"
                  className={`border-gray-700 text-white hover:bg-gray-700 transition-all ${
                    advancedFiltersVisible ? 'bg-gray-700' : ''
                  }`}
                >
                  {advancedFiltersVisible ? "إخفاء البحث المتقدم" : "البحث المتقدم"}
                </Button>
                
                <Button
                  onClick={resetFilters}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-gray-700 transition-all"
                >
                  <FilterX className="w-4 h-4 mr-2" />
                  إعادة تعيين المرشحات
                </Button>
              </div>
            </div>

            {/* حقل البحث */}
            <div className="mb-6">
              <div className="relative w-full">
                <Input
                  placeholder="ابحث عن العقار المثالي حسب الاسم أو الموقع..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white pr-10 focus:ring-[#39FF14] focus:border-[#39FF14] placeholder-gray-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* مرشحات متقدمة */}
            {advancedFiltersVisible && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800 rounded-xl p-6 mb-6 shadow-lg border border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* نطاق السعر المتقدم باستخدام شريط التمرير */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="price-range" className="text-gray-300">نطاق السعر (في الليلة)</Label>
                      <span className="text-[#39FF14] font-medium">
                        {priceRange[0]} - {priceRange[1]} جنيه
                      </span>
                    </div>
                    <Slider
                      id="price-range"
                      min={0}
                      max={20000}
                      step={500}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="[&>.sliders-thumb]:bg-[#39FF14] [&>.sliders-track]:bg-[#39FF14]"
                    />
                  </div>
                  
                  {/* اختيار التاريخ */}
                  <div className="space-y-3">
                    <Label className="text-gray-300 block">تواريخ الإقامة</Label>
                    <div className="relative">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full bg-gray-900 border-gray-700 text-white justify-start hover:bg-gray-950 text-right"
                          >
                            <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                            {dateRange.from ? (
                              dateRange.to ? (
                                <>
                                  {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
                                </>
                              ) : (
                                format(dateRange.from, "dd/MM/yyyy")
                              )
                            ) : (
                              <span className="text-gray-400">اختر تواريخ الإقامة</span>
                            )}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-900 border-gray-700 text-white">
                          <DialogHeader>
                            <DialogTitle className="text-white">اختر تواريخ الإقامة</DialogTitle>
                            <DialogDescription className="text-gray-400">
                              حدد تاريخ الوصول والمغادرة لحساب التكلفة الإجمالية للإقامة
                            </DialogDescription>
                          </DialogHeader>
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange.from}
                            selected={{
                              from: dateRange.from,
                              to: dateRange.to,
                            }}
                            onSelect={(value) => {
                              if (value) {
                                setDateRange({
                                  from: value.from,
                                  to: value.to || undefined
                                });
                              } else {
                                setDateRange({ from: undefined, to: undefined });
                              }
                            }}
                            numberOfMonths={2}
                            className="bg-gray-900 text-white border-gray-700"
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  {/* عدد الضيوف */}
                  <div className="space-y-3">
                    <Label className="text-gray-300 block">عدد الضيوف</Label>
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 w-10 border-gray-700 text-white hover:bg-gray-700"
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                      >
                        -
                      </Button>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-2 text-[#39FF14]" />
                        <span className="text-white font-medium">{guests} ضيف</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 w-10 border-gray-700 text-white hover:bg-gray-700"
                        onClick={() => setGuests(guests + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* المرافق */}
                <div className="mt-6">
                  <Label className="text-gray-300 block mb-3">المرافق</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {allAmenities.slice(0, 10).map(amenity => (
                      <Badge
                        key={amenity}
                        variant="outline"
                        className={`cursor-pointer transition-all py-2 text-center ${
                          selectedAmenities.includes(amenity) 
                            ? 'bg-[#39FF14]/10 border-[#39FF14] text-[#39FF14]' 
                            : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-600'
                        }`}
                        onClick={() => toggleAmenity(amenity)}
                      >
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* زر تطبيق المرشحات */}
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleSearch}
                    className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90 transition-colors"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    تطبيق المرشحات
                  </Button>
                </div>
              </motion.div>
            )}

            {/* عرض القائمة / الخريطة */}
            <TabsContent value="list" className="mt-0">
              {/* المرشحات السريعة */}
              <div className="bg-gray-800 rounded-xl p-4 mb-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* فلتر الموقع */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-2">المنطقة</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSelectedLocation(null)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${!selectedLocation ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                      >
                        الكل
                      </button>
                      {locations.map(location => (
                        <button
                          key={location}
                          onClick={() => setSelectedLocation(location)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedLocation === location ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
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
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${!minPrice && !maxPrice ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                      >
                        الكل
                      </button>
                      <button
                        onClick={() => { setMinPrice(null); setMaxPrice(5000); }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${maxPrice === 5000 && !minPrice ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                      >
                        أقل من 5000
                      </button>
                      <button
                        onClick={() => { setMinPrice(5000); setMaxPrice(10000); }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${minPrice === 5000 && maxPrice === 10000 ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                      >
                        5000 - 10000
                      </button>
                      <button
                        onClick={() => { setMinPrice(10000); setMaxPrice(null); }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${minPrice === 10000 && !maxPrice ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
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
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${!minBedrooms ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                      >
                        الكل
                      </button>
                      <button
                        onClick={() => setMinBedrooms(1)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${minBedrooms === 1 ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                      >
                        غرفة+
                      </button>
                      <button
                        onClick={() => setMinBedrooms(2)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${minBedrooms === 2 ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                      >
                        غرفتين+
                      </button>
                      <button
                        onClick={() => setMinBedrooms(3)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${minBedrooms === 3 ? 'bg-[#39FF14] text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                      >
                        3 غرف+
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="map" className="mt-0">
              {/* عرض الخريطة */}
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 h-[500px] relative">
                {/* محاكاة الخريطة - في التطبيق الحقيقي يمكن استخدام Google Maps أو Mapbox */}
                <div className="w-full h-full bg-gradient-to-br from-black to-gray-900 relative overflow-hidden">
                  {/* خطوط الشبكة */}
                  <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-30">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={`horizontal-${i}`} className="border-b border-[#39FF14]/20 col-span-12"></div>
                    ))}
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={`vertical-${i}`} className="border-r border-[#39FF14]/20 row-span-12"></div>
                    ))}
                  </div>
                  
                  {/* نقاط العقارات على الخريطة */}
                  {propertiesWithCoordinates?.map((property) => (
                    <motion.div
                      key={property.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                      style={{ 
                        left: `${(property.coordinates.lng - 27.5) * 100 + 25}%`, 
                        top: `${(31.2 - property.coordinates.lat) * 800 + 25}%` 
                      }}
                      onClick={() => setSelectedProperty(property)}
                    >
                      <div 
                        className={`w-5 h-5 rounded-full ${
                          property.bedrooms >= 4 ? 'bg-[#39FF14]' : 
                          property.bedrooms >= 3 ? 'bg-[#00BFFF]' : 
                          property.bedrooms >= 2 ? 'bg-[#FF1493]' : 'bg-orange-500'
                        } relative shadow-lg`}
                      >
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-white"></span>
                        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-white whitespace-nowrap shadow-lg px-2 py-1 rounded-md bg-black/80 border border-gray-800">
                          {property.pricePerNight} ج.م
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* معلومات العقار المحدد */}
                  {selectedProperty && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-4 left-4 right-4 bg-black/90 border border-[#39FF14]/30 rounded-lg shadow-lg p-4 backdrop-blur-md"
                    >
                      <div className="flex items-start gap-4">
                        <img 
                          src={selectedProperty.imageUrl} 
                          alt={selectedProperty.name} 
                          className="w-24 h-24 object-cover rounded-md border border-[#39FF14]/20" 
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-white font-medium">{selectedProperty.name}</h3>
                            {selectedProperty.ownerRole && selectedProperty.ownerRole !== 'CUSTOMER' && (
                              <RoleBadge role={selectedProperty.ownerRole as 'PROPERTY_ADMIN' | 'SUPER_ADMIN'} size="sm" />
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-400">
                            <span className="flex items-center">
                              <BedDouble className="h-4 w-4 mr-1 text-[#39FF14]" />
                              {selectedProperty.bedrooms} غرف
                            </span>
                            <span className="flex items-center">
                              <Bath className="h-4 w-4 mr-1 text-[#39FF14]" />
                              {selectedProperty.bathrooms} حمامات
                            </span>
                            <span className="flex items-center">
                              <Users className="h-4 w-4 mr-1 text-[#39FF14]" />
                              {selectedProperty.maxGuests} ضيوف
                            </span>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[#39FF14] font-bold">${selectedProperty.pricePerNight.toLocaleString()} / night</span>
                            <Button 
                              size="sm" 
                              className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90 transition-colors"
                            >
                              عرض التفاصيل
                            </Button>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-white absolute top-2 right-2"
                          onClick={() => setSelectedProperty(null)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                          </svg>
                        </Button>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* مفتاح الخريطة */}
                  <div className="absolute top-4 right-4 bg-black/70 border border-gray-700 rounded-lg p-3 text-xs text-white">
                    <div className="mb-2 font-medium">عدد غرف النوم</div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-[#39FF14] inline-block mr-2"></span>
                        <span>4+ غرف</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-[#00BFFF] inline-block mr-2"></span>
                        <span>3 غرف</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-[#FF1493] inline-block mr-2"></span>
                        <span>غرفتين</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-orange-500 inline-block mr-2"></span>
                        <span>غرفة واحدة</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* مرشحات الخريطة */}
              <div className="mt-4 bg-gray-800 p-4 rounded-xl shadow-lg">
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  <Select value={selectedLocation || "all"} onValueChange={(value) => setSelectedLocation(value === "all" ? null : value)}>
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white focus:ring-[#39FF14] focus:border-[#39FF14]">
                      <SelectValue placeholder="كل المناطق" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 text-white">
                      <SelectItem value="all">كل المناطق</SelectItem>
                      {locations.map(location => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={minBedrooms?.toString() || "all"} onValueChange={(value) => setMinBedrooms(value === "all" ? null : parseInt(value))}>
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white focus:ring-[#39FF14] focus:border-[#39FF14]">
                      <SelectValue placeholder="غرف النوم" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 text-white">
                      <SelectItem value="all">كل الغرف</SelectItem>
                      <SelectItem value="1">غرفة+</SelectItem>
                      <SelectItem value="2">غرفتين+</SelectItem>
                      <SelectItem value="3">3 غرف+</SelectItem>
                      <SelectItem value="4">4 غرف+</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priceRange[1].toString()} onValueChange={(value) => setPriceRange([0, parseInt(value)])}>
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white focus:ring-[#39FF14] focus:border-[#39FF14]">
                      <SelectValue placeholder="أقصى سعر" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 text-white">
                      <SelectItem value="5000">حتى 5000</SelectItem>
                      <SelectItem value="10000">حتى 10000</SelectItem>
                      <SelectItem value="15000">حتى 15000</SelectItem>
                      <SelectItem value="20000">حتى 20000</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    onClick={handleSearch}
                    className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90 transition-colors"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    بحث
                  </Button>
                  
                  <Button 
                    onClick={resetFilters}
                    variant="outline"
                    className="border-gray-700 text-white hover:bg-gray-700"
                  >
                    <FilterX className="h-4 w-4 mr-2" />
                    إعادة تعيين
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
        
        {/* السعر - تم تحويل الأسعار من الجنيه المصري إلى الدولار */}
        <div className="absolute bottom-4 right-4 bg-[#39FF14] text-black font-bold px-3 py-1 rounded-full">
          ${property.pricePerNight.toLocaleString()}/night
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
        
        {/* شارة دور المالك */}
        {property.ownerRole && property.ownerRole !== 'CUSTOMER' && (
          <div className="absolute top-4 left-20">
            <RoleBadge role={property.ownerRole as 'PROPERTY_ADMIN' | 'SUPER_ADMIN'} size="sm" />
          </div>
        )}
        
        {/* علامة التحقق */}
        {property.verified && (
          <motion.div 
            className="absolute bottom-12 right-4 bg-black/40 backdrop-blur-sm border border-[#39FF14]/30 rounded-full p-1"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <svg className="h-4 w-4 text-[#39FF14]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
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