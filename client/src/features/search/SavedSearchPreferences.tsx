import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { motion } from "framer-motion";

interface SavedSearch {
  id: string;
  name: string;
  location: string;
  priceRange: [number, number];
  propertyType: string;
  minBedrooms: number;
  hasPool: boolean;
  createdAt: string;
}

interface SavedSearchPreferencesProps {
  onSelectSearch: (searchData: SavedSearch) => void;
}

export default function SavedSearchPreferences({ onSelectSearch }: SavedSearchPreferencesProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  // Sample data for the mock implementation
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([
    {
      id: "1",
      name: "شقق فاخرة في وسط المدينة",
      location: "وسط المدينة",
      priceRange: [500, 1500],
      propertyType: "شقة",
      minBedrooms: 2,
      hasPool: false,
      createdAt: "2023-07-15T10:30:00Z"
    },
    {
      id: "2",
      name: "فلل مع مسبح",
      location: "",
      priceRange: [1000, 2000],
      propertyType: "فيلا",
      minBedrooms: 3,
      hasPool: true,
      createdAt: "2023-08-20T15:45:00Z"
    },
    {
      id: "3",
      name: "عقارات اقتصادية",
      location: "الضواحي الشمالية",
      priceRange: [0, 800],
      propertyType: "",
      minBedrooms: 1,
      hasPool: false,
      createdAt: "2023-09-05T18:20:00Z"
    }
  ]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleDeleteSearch = (id: string) => {
    setSavedSearches(prev => prev.filter(search => search.id !== id));
    
    toast({
      title: "تم حذف البحث",
      description: "تم حذف البحث المحفوظ بنجاح",
    });
  };

  if (!user) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="border-b border-gray-800 bg-black/50">
          <CardTitle className="text-xl text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            البحث المحفوظ
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">تسجيل الدخول مطلوب</h3>
          <p className="text-gray-500 mb-4 max-w-md">
            يرجى تسجيل الدخول لعرض وإدارة تفضيلات البحث المحفوظة الخاصة بك
          </p>
          <Button 
            className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90 px-5"
          >
            تسجيل الدخول
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="border-b border-gray-800 bg-black/50">
        <CardTitle className="text-xl text-white flex items-center justify-between">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            البحث المحفوظ
          </div>
          <Badge className="bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/30">
            {savedSearches.length} عمليات بحث
          </Badge>
        </CardTitle>
        <CardDescription className="text-gray-400">
          عمليات البحث المحفوظة مسبقًا لتسهيل عملية البحث عن العقارات
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-t-[#39FF14] border-l-[#39FF14]/30 border-r-[#39FF14]/30 border-b-[#39FF14]/30 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-400">جاري تحميل عمليات البحث المحفوظة...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {savedSearches.map((search, index) => (
              <motion.div 
                key={search.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group"
              >
                <Card className="bg-gray-800 border-gray-700 hover:border-[#39FF14]/30 transition-colors h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-white flex items-center justify-between">
                      <span className="line-clamp-1">{search.name}</span>
                      <span className="text-xs text-gray-400 font-normal">
                        {new Date(search.createdAt).toLocaleDateString()}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pb-3 space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-gray-300 text-sm">
                          {search.location || "جميع المواقع"}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-gray-300 text-sm">
                          ${search.priceRange[0]} - ${search.priceRange[1]}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {search.propertyType && (
                          <Badge variant="outline" className="bg-[#39FF14]/5 text-[#39FF14] border-[#39FF14]/30">
                            {search.propertyType}
                          </Badge>
                        )}
                        
                        <Badge variant="outline" className="bg-gray-700 text-white border-gray-600">
                          {search.minBedrooms}+ غرف
                        </Badge>
                        
                        {search.hasPool && (
                          <Badge variant="outline" className="bg-blue-900/20 text-blue-400 border-blue-900/50">
                            مع مسبح
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between pt-0">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      onClick={() => handleDeleteSearch(search.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      حذف
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-[#39FF14]/40 text-[#39FF14] hover:bg-[#39FF14]/10"
                      onClick={() => onSelectSearch(search)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      تطبيق
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
            
            {savedSearches.length === 0 && (
              <div className="col-span-full py-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">لا توجد عمليات بحث محفوظة</h3>
                <p className="text-gray-500 mb-4 max-w-md">
                  قم بحفظ عمليات البحث المفضلة لديك للوصول إليها بسرعة في المستقبل
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}