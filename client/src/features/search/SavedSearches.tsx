import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { personalizationService, SavedSearch } from '@/services/PersonalizationService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Map,
  Search,
  Trash2,
  User,
  Bed,
  Home,
  DollarSign,
  Timer
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';

interface SavedSearchesProps {
  onApplySearch?: (search: SavedSearch) => void;
  onClose?: () => void;
}

export default function SavedSearches({ onApplySearch, onClose }: SavedSearchesProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedSearches = async () => {
      if (!user) {
        setSavedSearches([]);
        setLoading(false);
        return;
      }

      try {
        const preferences = await personalizationService.getUserPreferences(user.uid);
        setSavedSearches(preferences.savedSearches);
      } catch (error) {
        console.error('Error fetching saved searches:', error);
        toast({
          title: 'خطأ في جلب عمليات البحث المحفوظة',
          description: 'حدث خطأ أثناء محاولة جلب عمليات البحث المحفوظة. يرجى المحاولة مرة أخرى.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSavedSearches();
  }, [user, toast]);

  const handleDeleteSearch = async (searchId: string) => {
    if (!user) return;

    try {
      const success = await personalizationService.deleteSearch(user.uid, searchId);
      if (success) {
        setSavedSearches(savedSearches.filter(search => search.id !== searchId));
        toast({
          title: 'تم حذف البحث بنجاح',
          description: 'تم حذف عملية البحث المحفوظة بنجاح.',
        });
      }
    } catch (error) {
      console.error('Error deleting saved search:', error);
      toast({
        title: 'خطأ في حذف البحث',
        description: 'حدث خطأ أثناء محاولة حذف عملية البحث المحفوظة.',
        variant: 'destructive',
      });
    }
  };

  const applySearch = (search: SavedSearch) => {
    if (onApplySearch) {
      onApplySearch(search);
    }
    
    toast({
      title: 'تم تطبيق معايير البحث',
      description: `تم تطبيق معايير البحث المحفوظة "${search.name}".`,
    });
    
    if (onClose) {
      onClose();
    }
  };

  if (loading) {
    return (
      <div className="w-full py-10 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#39FF14] border-b-2"></div>
      </div>
    );
  }

  if (savedSearches.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-medium text-white mb-2">لا توجد عمليات بحث محفوظة</h3>
        <p className="text-gray-400 max-w-md mx-auto mb-6">
          قم بحفظ معايير البحث المفضلة لديك للوصول بسرعة إليها في المرات القادمة.
        </p>
        <Button
          onClick={onClose}
          variant="outline"
          className="border-gray-700 text-white hover:bg-gray-700"
        >
          العودة للبحث
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white flex items-center">
          <Timer className="w-5 h-5 mr-2 text-[#39FF14]" />
          عمليات البحث المحفوظة
        </h3>
        <span className="text-sm text-gray-400">
          {savedSearches.length} {savedSearches.length === 1 ? 'بحث محفوظ' : 'عمليات بحث محفوظة'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {savedSearches.map((search) => (
          <motion.div
            key={search.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gray-900 border-gray-700 hover:border-[#39FF14]/30 transition-all overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white text-lg flex items-center">
                    {search.name}
                  </CardTitle>
                  <Badge 
                    variant="outline" 
                    className="bg-[#39FF14]/10 border-[#39FF14]/30 text-[#39FF14] text-xs"
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    {format(parseISO(search.createdAt), 'dd MMM yyyy', { locale: ar })}
                  </Badge>
                </div>
                <CardDescription className="text-gray-400">
                  معايير بحث محفوظة للعودة إليها لاحقاً
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                  {search.location && (
                    <div className="flex items-center text-sm text-gray-300">
                      <Map className="w-4 h-4 mr-2 text-[#39FF14]" />
                      <span>{search.location}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-300">
                    <DollarSign className="w-4 h-4 mr-2 text-[#39FF14]" />
                    <span>{search.priceRange[0]} - {search.priceRange[1]} ج.م</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <User className="w-4 h-4 mr-2 text-[#39FF14]" />
                    <span>{search.guests} ضيوف</span>
                  </div>
                  {search.bedrooms && (
                    <div className="flex items-center text-sm text-gray-300">
                      <Bed className="w-4 h-4 mr-2 text-[#39FF14]" />
                      <span>{search.bedrooms}+ غرف</span>
                    </div>
                  )}
                  {search.dateRange.from && search.dateRange.to && (
                    <div className="flex items-center text-sm text-gray-300 col-span-2">
                      <Calendar className="w-4 h-4 mr-2 text-[#39FF14]" />
                      <span>
                        {format(parseISO(search.dateRange.from), 'dd/MM')} - {format(parseISO(search.dateRange.to), 'dd/MM/yyyy')}
                      </span>
                    </div>
                  )}
                </div>
                
                {search.amenities.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-400 mb-2">المرافق:</p>
                    <div className="flex flex-wrap gap-2">
                      {search.amenities.map((amenity, index) => (
                        <Badge 
                          key={index} 
                          variant="outline"
                          className="bg-gray-800 text-gray-300 border-gray-700 text-xs"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0 flex gap-2">
                <Button
                  onClick={() => applySearch(search)}
                  className="flex-1 bg-[#39FF14] text-black hover:bg-[#39FF14]/90 transition-colors"
                >
                  <Search className="w-4 h-4 mr-2" />
                  تطبيق البحث
                </Button>
                <Button
                  onClick={() => handleDeleteSearch(search.id)}
                  variant="outline"
                  className="border-red-500/30 text-red-500 hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}