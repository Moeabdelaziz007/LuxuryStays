import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Link } from "wouter";
import PageTransition from "@/features/common/PageTransition";
import { motion } from "framer-motion";
import SavedSearchPreferences from "./SavedSearchPreferences";

interface PropertyPin {
  id: string;
  lat: number;
  lng: number;
  title: string;
  price: number;
  rating: number;
  type: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
}

export default function MapSearch() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>("");
  const [minBedrooms, setMinBedrooms] = useState(1);
  const [hasPool, setHasPool] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyPin | null>(null);
  const [savedSearchVisible, setSavedSearchVisible] = useState(false);
  
  // Sample data for the mock implementation
  const [properties, setProperties] = useState<PropertyPin[]>([
    {
      id: "1",
      lat: 25.276987,
      lng: 55.296249,
      title: "فيلا فاخرة مع إطلالة بحرية",
      price: 1500,
      rating: 4.8,
      type: "فيلا",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1740&auto=format&fit=crop",
      bedrooms: 4,
      bathrooms: 3
    },
    {
      id: "2",
      lat: 25.204849,
      lng: 55.270783,
      title: "شقة حديثة في وسط المدينة",
      price: 850,
      rating: 4.5,
      type: "شقة",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1740&auto=format&fit=crop",
      bedrooms: 2,
      bathrooms: 2
    },
    {
      id: "3",
      lat: 25.261681,
      lng: 55.3064,
      title: "شاليه فاخر مع مسبح خاص",
      price: 1200,
      rating: 4.7,
      type: "شاليه",
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop",
      bedrooms: 3,
      bathrooms: 2
    },
  ]);
  
  // Search function
  const handleSearch = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Filter properties based on search criteria
      const filteredProperties = properties.filter(property => {
        const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
        const matchesType = !selectedPropertyType || selectedPropertyType === 'all' || property.type === selectedPropertyType;
        const matchesBedrooms = property.bedrooms >= minBedrooms;
        
        return matchesPrice && matchesType && matchesBedrooms;
      });
      
      setProperties(filteredProperties);
      setIsLoading(false);
      
      toast({
        title: "تم تحديث نتائج البحث",
        description: `تم العثور على ${filteredProperties.length} عقارات تطابق المعايير`,
      });
    }, 1000);
  };
  
  // Save search
  const handleSaveSearch = () => {
    if (!user) {
      toast({
        title: "يرجى تسجيل الدخول",
        description: "يجب تسجيل الدخول لحفظ تفضيلات البحث",
        variant: "destructive",
      });
      return;
    }
    
    // Save search logic would go here
    toast({
      title: "تم حفظ البحث",
      description: "تم حفظ تفضيلات البحث بنجاح",
    });
  };
  
  // Reset search
  const handleResetSearch = () => {
    setLocation("");
    setPriceRange([0, 2000]);
    setSelectedPropertyType("");
    setMinBedrooms(1);
    setHasPool(false);
    
    // Reset to original properties
    setProperties([
      {
        id: "1",
        lat: 25.276987,
        lng: 55.296249,
        title: "فيلا فاخرة مع إطلالة بحرية",
        price: 1500,
        rating: 4.8,
        type: "فيلا",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1740&auto=format&fit=crop",
        bedrooms: 4,
        bathrooms: 3
      },
      {
        id: "2",
        lat: 25.204849,
        lng: 55.270783,
        title: "شقة حديثة في وسط المدينة",
        price: 850,
        rating: 4.5,
        type: "شقة",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1740&auto=format&fit=crop",
        bedrooms: 2,
        bathrooms: 2
      },
      {
        id: "3",
        lat: 25.261681,
        lng: 55.3064,
        title: "شاليه فاخر مع مسبح خاص",
        price: 1200,
        rating: 4.7,
        type: "شاليه",
        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop",
        bedrooms: 3,
        bathrooms: 2
      },
    ]);
    
    toast({
      title: "تم إعادة ضبط البحث",
      description: "تم إعادة ضبط معايير البحث بنجاح",
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col space-y-6">
            {/* عنوان الصفحة */}
            <div className="text-center mb-8">
              <motion.h1 
                className="text-4xl font-bold mb-4 text-white relative inline-block"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                البحث عن العقارات على الخريطة
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#39FF14] to-transparent"></span>
              </motion.h1>
              <motion.p 
                className="text-gray-400 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                استخدم خريطة البحث التفاعلية للعثور على أفضل العقارات في المواقع المفضلة لديك
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* نموذج البحث */}
              <Card className="bg-gray-900 border-gray-800 lg:col-span-1">
                <CardHeader className="border-b border-gray-800 bg-black/50">
                  <CardTitle className="text-xl text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    خيارات البحث
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    حدد معايير البحث لإيجاد أفضل العقارات
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-5 pt-5">
                  <div className="space-y-3">
                    <Label htmlFor="location" className="text-gray-300">الموقع</Label>
                    <div className="relative">
                      <Input
                        id="location"
                        placeholder="أدخل المدينة أو الحي..."
                        className="bg-gray-950 border-gray-700 text-white pl-10 focus:ring-[#39FF14] focus:border-[#39FF14]"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="price-range" className="text-gray-300">نطاق السعر (في الليلة)</Label>
                      <span className="text-[#39FF14] font-medium">
                        ${priceRange[0]} - ${priceRange[1]}
                      </span>
                    </div>
                    <Slider
                      id="price-range"
                      min={0}
                      max={2000}
                      step={50}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="[&>.sliders-thumb]:bg-[#39FF14] [&>.sliders-track]:bg-[#39FF14]"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="property-type" className="text-gray-300">نوع العقار</Label>
                    <Select value={selectedPropertyType} onValueChange={setSelectedPropertyType}>
                      <SelectTrigger className="bg-gray-950 border-gray-700 text-white focus:ring-[#39FF14] focus:border-[#39FF14]">
                        <SelectValue placeholder="اختر نوع العقار" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="all">الكل</SelectItem>
                        <SelectItem value="شقة">شقة</SelectItem>
                        <SelectItem value="فيلا">فيلا</SelectItem>
                        <SelectItem value="شاليه">شاليه</SelectItem>
                        <SelectItem value="استوديو">استوديو</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="min-bedrooms" className="text-gray-300">الحد الأدنى لعدد غرف النوم</Label>
                    <Select value={minBedrooms.toString()} onValueChange={(value) => setMinBedrooms(parseInt(value))}>
                      <SelectTrigger className="bg-gray-950 border-gray-700 text-white focus:ring-[#39FF14] focus:border-[#39FF14]">
                        <SelectValue placeholder="اختر الحد الأدنى" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="has-pool" className="text-gray-300 cursor-pointer">
                      يحتوي على مسبح
                    </Label>
                    <Switch 
                      id="has-pool" 
                      checked={hasPool} 
                      onCheckedChange={setHasPool}
                      className="data-[state=checked]:bg-[#39FF14]" 
                    />
                  </div>
                  
                  <Separator className="my-4 bg-gray-800" />
                  
                  <div className="flex flex-col gap-3 pt-2">
                    <Button 
                      onClick={handleSearch} 
                      className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90 transition-colors relative overflow-hidden group"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          جارٍ البحث...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          البحث
                        </div>
                      )}
                      <span className="absolute inset-0 bg-black/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    </Button>
                    
                    <div className="flex gap-3">
                      <Button 
                        onClick={handleSaveSearch} 
                        variant="outline" 
                        className="flex-1 border-[#39FF14]/40 text-[#39FF14] hover:bg-[#39FF14]/10 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        حفظ البحث
                      </Button>
                      
                      <Button 
                        onClick={handleResetSearch} 
                        variant="ghost" 
                        className="flex-1 text-white hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        إعادة تعيين
                      </Button>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      className="text-white hover:text-[#39FF14] hover:bg-[#39FF14]/5 transition-colors"
                      onClick={() => setSavedSearchVisible(!savedSearchVisible)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      عمليات البحث المحفوظة
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* خريطة البحث (محاكاة) */}
              <div className="lg:col-span-2 flex flex-col">
                <Card className="bg-gray-900 border-gray-800 h-full flex flex-col">
                  <CardHeader className="border-b border-gray-800 bg-black/50">
                    <CardTitle className="text-xl text-white flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      خريطة العقارات
                    </CardTitle>
                    <CardDescription className="text-gray-400 flex justify-between items-center">
                      <span>تم العثور على {properties.length} عقارات</span>
                      
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Badge variant="outline" className="border-[#39FF14]/50 text-[#39FF14] bg-[#39FF14]/5">
                          فيلا
                        </Badge>
                        <Badge variant="outline" className="border-[#FF1493]/50 text-[#FF1493] bg-[#FF1493]/5">
                          شقة
                        </Badge>
                        <Badge variant="outline" className="border-[#00BFFF]/50 text-[#00BFFF] bg-[#00BFFF]/5">
                          شاليه
                        </Badge>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-grow p-0 relative">
                    {/* عرض الخريطة (محاكاة باستخدام div) */}
                    <div className="w-full h-[400px] bg-gradient-to-br from-black to-gray-900 relative overflow-hidden">
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
                      {properties.map((property) => (
                        <motion.div
                          key={property.id}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2`}
                          style={{ 
                            left: `${(property.lng - 55.2) * 500 + 50}%`, 
                            top: `${(25.3 - property.lat) * 800 + 30}%` 
                          }}
                          onClick={() => setSelectedProperty(property)}
                        >
                          <div 
                            className={`w-5 h-5 rounded-full ${
                              property.type === 'فيلا' ? 'bg-[#39FF14]' : 
                              property.type === 'شقة' ? 'bg-[#FF1493]' : 'bg-[#00BFFF]'
                            } relative shadow-lg`}
                          >
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-white"></span>
                            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-white whitespace-nowrap shadow-lg px-2 py-1 rounded-md bg-black/80 border border-gray-800">
                              ${property.price}
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
                              src={selectedProperty.image} 
                              alt={selectedProperty.title} 
                              className="w-24 h-24 object-cover rounded-md border border-[#39FF14]/20" 
                            />
                            <div className="flex-1">
                              <h3 className="text-white font-medium mb-1">{selectedProperty.title}</h3>
                              <div className="flex items-center gap-3 text-sm text-gray-400">
                                <span className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                  </svg>
                                  {selectedProperty.rating}
                                </span>
                                <span className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                  </svg>
                                  {selectedProperty.type}
                                </span>
                                <span className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                  </svg>
                                  {selectedProperty.bedrooms} غرف
                                </span>
                                <span className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  متاح الآن
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[#39FF14] font-bold text-xl">${selectedProperty.price}</div>
                              <div className="text-xs text-gray-400">في الليلة</div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-2 border-[#39FF14]/50 text-[#39FF14] hover:bg-[#39FF14]/10"
                              >
                                عرض التفاصيل
                              </Button>
                            </div>
                            <button 
                              className="absolute top-2 right-2 text-gray-400 hover:text-white"
                              onClick={() => setSelectedProperty(null)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </motion.div>
                      )}
                      
                      {/* تراكب الزوم والتحكم */}
                      <div className="absolute top-4 right-4 flex flex-col space-y-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="w-8 h-8 rounded-full bg-black/70 border-gray-700 text-white hover:bg-[#39FF14]/20 hover:border-[#39FF14]/50"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="w-8 h-8 rounded-full bg-black/70 border-gray-700 text-white hover:bg-[#39FF14]/20 hover:border-[#39FF14]/50"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                          </svg>
                        </Button>
                      </div>
                      
                      {/* المؤشر (إشارة إلى عدم وجود خريطة حقيقية) */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-black/50 px-4 py-2 rounded-md backdrop-blur-md border border-[#39FF14]/30 text-[#39FF14] animate-pulse">
                          محاكاة بصرية للخريطة - انقر على أي عقار لمعرفة المزيد
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="border-t border-gray-800 bg-black/50 p-3 flex justify-between">
                    <div className="text-sm text-gray-400">
                      تم تحديث الخريطة منذ دقيقة واحدة
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Badge className="bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/30">
                        {location || "جميع المواقع"}
                      </Badge>
                      <Badge className="bg-gray-800 text-white border-gray-700">
                        ${priceRange[0]} - ${priceRange[1]}
                      </Badge>
                    </div>
                  </CardFooter>
                </Card>
              </div>
              
              {/* عمليات البحث المحفوظة */}
              {savedSearchVisible && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 lg:col-span-3"
                >
                  <SavedSearchPreferences onSelectSearch={(searchData) => {
                    // تطبيق معايير البحث المحفوظة
                    setLocation(searchData.location);
                    setPriceRange(searchData.priceRange);
                    setSelectedPropertyType(searchData.propertyType);
                    setMinBedrooms(searchData.minBedrooms);
                    setHasPool(searchData.hasPool);
                    
                    toast({
                      title: "تم تطبيق البحث المحفوظ",
                      description: `تم تطبيق معايير البحث: ${searchData.name}`,
                    });
                  }} />
                </motion.div>
              )}
            </div>
            
            {/* قائمة العقارات */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">نتائج البحث</h2>
                <Select value="recommended" defaultValue="recommended">
                  <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700 text-white focus:ring-[#39FF14] focus:border-[#39FF14]">
                    <SelectValue placeholder="ترتيب حسب" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 text-white">
                    <SelectItem value="recommended">الأكثر توصية</SelectItem>
                    <SelectItem value="price-asc">السعر: من الأقل إلى الأعلى</SelectItem>
                    <SelectItem value="price-desc">السعر: من الأعلى إلى الأقل</SelectItem>
                    <SelectItem value="rating">التقييم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="bg-gray-900 border-gray-800 overflow-hidden h-full group">
                      <div className="relative">
                        <img 
                          src={property.image} 
                          alt={property.title} 
                          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                          <Badge className={`
                            ${property.type === 'فيلا' ? 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/50' : 
                             property.type === 'شقة' ? 'bg-[#FF1493]/20 text-[#FF1493] border-[#FF1493]/50' : 
                             'bg-[#00BFFF]/20 text-[#00BFFF] border-[#00BFFF]/50'}
                          `}>
                            {property.type}
                          </Badge>
                          <div className="text-white text-2xl font-bold drop-shadow-lg">
                            ${property.price}
                          </div>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{property.title}</h3>
                        
                        <div className="flex items-center text-sm text-gray-400 space-x-4 rtl:space-x-reverse mb-3">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            {property.bedrooms} غرف
                          </div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            متاح الآن
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm">
                            <div className="flex items-center text-yellow-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                              <span className="text-white ml-1">{property.rating}</span>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-[#39FF14] hover:bg-[#39FF14]/10"
                          >
                            عرض التفاصيل
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              {properties.length === 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">لم يتم العثور على نتائج</h3>
                  <p className="text-gray-500 mb-4">جرب تعديل معايير البحث للحصول على نتائج أكثر</p>
                  <Button 
                    onClick={handleResetSearch} 
                    variant="outline" 
                    className="border-[#39FF14]/40 text-[#39FF14] hover:bg-[#39FF14]/10 transition-colors"
                  >
                    إعادة تعيين البحث
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}