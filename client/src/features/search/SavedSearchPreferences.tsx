import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SpaceButton } from "@/components/ui/space-button";
import { Link } from "wouter";

// واجهة تفضيلات البحث
interface SearchPreference {
  id: string;
  name: string; 
  timestamp: number;
  filters: {
    priceMin: number;
    priceMax: number;
    propertyType: string[];
    rating: number;
    location?: string;
    dates?: {
      checkIn: string;
      checkOut: string;
    };
    guests?: number;
  };
}

export default function SavedSearchPreferences() {
  const [savedPreferences, setSavedPreferences] = useState<SearchPreference[]>([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newSearchName, setNewSearchName] = useState('');

  // استعادة التفضيلات المحفوظة
  useEffect(() => {
    const loadSavedPreferences = () => {
      const storedPrefs = localStorage.getItem('allSearchPreferences');
      if (storedPrefs) {
        try {
          setSavedPreferences(JSON.parse(storedPrefs));
        } catch (error) {
          console.error("Error parsing saved preferences:", error);
        }
      } else {
        // إضافة بعض التفضيلات الافتراضية للعرض
        const demoPreferences: SearchPreference[] = [
          {
            id: "pref1",
            name: "عطلة صيفية",
            timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000, // قبل 10 أيام
            filters: {
              priceMin: 800,
              priceMax: 3000,
              propertyType: ["villa", "chalet"],
              rating: 4.5,
              location: "الساحل الشمالي",
              dates: {
                checkIn: "2025-07-15",
                checkOut: "2025-07-25"
              },
              guests: 4
            }
          },
          {
            id: "pref2",
            name: "رحلة عمل - القاهرة",
            timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, // قبل 3 أيام
            filters: {
              priceMin: 500,
              priceMax: 1000,
              propertyType: ["apartment"],
              rating: 4,
              location: "القاهرة",
              dates: {
                checkIn: "2025-06-05",
                checkOut: "2025-06-10"
              },
              guests: 1
            }
          }
        ];
        setSavedPreferences(demoPreferences);
        localStorage.setItem('allSearchPreferences', JSON.stringify(demoPreferences));
      }
    };

    loadSavedPreferences();
  }, []);

  // حفظ البحث الحالي
  const saveCurrentSearch = () => {
    if (!newSearchName.trim()) return;

    // الحصول على البحث الحالي من localStorage
    const currentPrefs = localStorage.getItem('searchPreferences');
    if (!currentPrefs) {
      alert("لا توجد معايير بحث حالية للحفظ");
      return;
    }

    const currentFilters = JSON.parse(currentPrefs);
    const newPreference: SearchPreference = {
      id: `pref_${Date.now()}`,
      name: newSearchName,
      timestamp: Date.now(),
      filters: currentFilters
    };

    const updatedPreferences = [...savedPreferences, newPreference];
    setSavedPreferences(updatedPreferences);
    localStorage.setItem('allSearchPreferences', JSON.stringify(updatedPreferences));
    
    setShowNewForm(false);
    setNewSearchName('');
  };

  // تطبيق التفضيلات المحفوظة
  const applyPreference = (preference: SearchPreference) => {
    localStorage.setItem('searchPreferences', JSON.stringify(preference.filters));
    // انتقال للبحث
    window.location.href = '/search';
  };

  // حذف التفضيلات المحفوظة
  const deletePreference = (id: string) => {
    const confirmed = window.confirm("هل أنت متأكد من حذف هذه التفضيلات؟");
    if (confirmed) {
      const updatedPreferences = savedPreferences.filter(p => p.id !== id);
      setSavedPreferences(updatedPreferences);
      localStorage.setItem('allSearchPreferences', JSON.stringify(updatedPreferences));
    }
  };

  // تنسيق التاريخ
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // تحويل أنواع العقارات إلى أسماء عربية
  const getPropertyTypeLabel = (type: string) => {
    switch (type) {
      case 'apartment': return 'شقة';
      case 'villa': return 'فيلا';
      case 'chalet': return 'شاليه';
      default: return type;
    }
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
          <span className="text-white">تفضيلات</span>{" "}
          <span className="text-[#39FF14]">البحث المحفوظة</span>
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#39FF14]/70 to-transparent mx-auto mb-4"></div>
        <p className="text-gray-300 text-center max-w-2xl mx-auto mb-8">
          قم بإدارة تفضيلات البحث المحفوظة لديك لتوفير الوقت في عمليات البحث المستقبلية
        </p>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="container mx-auto px-4 pb-20">
        {/* شريط الأدوات */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/search">
            <SpaceButton 
              variant="outline" 
              className="flex items-center gap-1"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              }
            >
              العودة للبحث
            </SpaceButton>
          </Link>
          <SpaceButton 
            variant="primary"
            className="flex items-center gap-1"
            onClick={() => setShowNewForm(!showNewForm)}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            }
          >
            حفظ البحث الحالي
          </SpaceButton>
        </div>

        {/* نموذج حفظ البحث الحالي */}
        {showNewForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-black/60 backdrop-blur-sm rounded-xl p-4 mb-6 border border-[#39FF14]/10 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-white mb-3">حفظ البحث الحالي</h3>
            <div className="flex gap-3">
              <input 
                type="text" 
                value={newSearchName} 
                onChange={(e) => setNewSearchName(e.target.value)} 
                placeholder="أدخل اسماً لمعايير البحث هذه..." 
                className="flex-1 bg-black/30 border border-gray-700 rounded-md px-3 py-2 text-white"
              />
              <SpaceButton 
                variant="primary" 
                onClick={saveCurrentSearch}
              >
                حفظ
              </SpaceButton>
              <SpaceButton 
                variant="outline" 
                onClick={() => setShowNewForm(false)}
              >
                إلغاء
              </SpaceButton>
            </div>
          </motion.div>
        )}

        {/* قائمة التفضيلات المحفوظة */}
        <div className="space-y-4">
          {savedPreferences.length > 0 ? (
            savedPreferences.map(preference => (
              <motion.div 
                key={preference.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/60 backdrop-blur-sm rounded-xl overflow-hidden border border-[#39FF14]/10 shadow-lg relative"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/30 to-transparent"></div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{preference.name}</h3>
                      <div className="text-gray-400 text-sm mb-3">تم الحفظ: {formatDate(preference.timestamp)}</div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => applyPreference(preference)}
                        className="bg-[#39FF14]/10 hover:bg-[#39FF14]/20 text-[#39FF14] rounded-md p-2 transition-colors"
                        title="تطبيق هذه المعايير"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => deletePreference(preference.id)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-md p-2 transition-colors"
                        title="حذف"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                    {/* نطاق السعر */}
                    <div className="bg-black/30 p-3 rounded-lg">
                      <h4 className="text-[#39FF14] mb-1 text-sm font-medium">نطاق السعر</h4>
                      <p className="text-white">
                        ${preference.filters.priceMin} - ${preference.filters.priceMax}
                      </p>
                    </div>
                    
                    {/* أنواع العقارات */}
                    <div className="bg-black/30 p-3 rounded-lg">
                      <h4 className="text-[#39FF14] mb-1 text-sm font-medium">أنواع العقارات</h4>
                      <div className="flex flex-wrap gap-1">
                        {preference.filters.propertyType.map(type => (
                          <span key={type} className="inline-block bg-[#39FF14]/10 text-white text-xs rounded-full px-2 py-1">
                            {getPropertyTypeLabel(type)}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* التقييم */}
                    <div className="bg-black/30 p-3 rounded-lg">
                      <h4 className="text-[#39FF14] mb-1 text-sm font-medium">التقييم</h4>
                      <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-white">{preference.filters.rating}+</span>
                      </div>
                    </div>
                    
                    {/* الموقع - إذا كان متوفراً */}
                    {preference.filters.location && (
                      <div className="bg-black/30 p-3 rounded-lg">
                        <h4 className="text-[#39FF14] mb-1 text-sm font-medium">الموقع</h4>
                        <div className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-white">{preference.filters.location}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* تواريخ الحجز - إذا كانت متوفرة */}
                    {preference.filters.dates && (
                      <div className="bg-black/30 p-3 rounded-lg">
                        <h4 className="text-[#39FF14] mb-1 text-sm font-medium">تواريخ الإقامة</h4>
                        <p className="text-white text-sm">
                          {new Date(preference.filters.dates.checkIn).toLocaleDateString('ar-EG')} -<br/> 
                          {new Date(preference.filters.dates.checkOut).toLocaleDateString('ar-EG')}
                        </p>
                      </div>
                    )}
                    
                    {/* عدد الضيوف - إذا كان متوفراً */}
                    {preference.filters.guests && (
                      <div className="bg-black/30 p-3 rounded-lg">
                        <h4 className="text-[#39FF14] mb-1 text-sm font-medium">عدد الضيوف</h4>
                        <div className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                          </svg>
                          <span className="text-white">{preference.filters.guests} {preference.filters.guests > 2 ? 'ضيوف' : 'ضيف'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-[#39FF14]/10 shadow-lg text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm0-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">لا توجد تفضيلات محفوظة</h3>
              <p className="text-gray-400 mb-4">قم بحفظ معايير البحث الخاصة بك لتسهيل عمليات البحث المستقبلية</p>
              <Link href="/search">
                <SpaceButton 
                  variant="primary"
                  className="mx-auto"
                >
                  ابدأ البحث الآن
                </SpaceButton>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}