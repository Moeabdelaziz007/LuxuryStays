import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { SpaceButton } from "@/components/ui/space-button";

// بيانات العروض اللحظية
const lastMinuteDeals = [
  {
    id: 1,
    title: "شاليه فاخر بإطلالة بحرية",
    description: "إقامة فاخرة مع إطلالة ساحرة على البحر، خصم 30% لفترة محدودة",
    originalPrice: 1200,
    discountedPrice: 840,
    image: "/assets/luxury-chalet.svg",
    expires: "2025-05-10", // تاريخ انتهاء العرض
    roomsLeft: 2, // عدد الغرف المتبقية
    location: "شرم الشيخ",
  },
  {
    id: 2,
    title: "فيلا مع حديقة خاصة",
    description: "فيلا فاخرة مع حديقة خاصة وحمام سباحة، عرض خاص لمدة 48 ساعة فقط",
    originalPrice: 1800,
    discountedPrice: 1350,
    image: "/assets/villa-garden.svg",
    expires: "2025-05-09",
    roomsLeft: 1,
    location: "الساحل الشمالي",
  },
  {
    id: 3,
    title: "شقة فاخرة وسط المدينة",
    description: "شقة مريحة بتصميم عصري في قلب المدينة، خصم 25% للحجز المبكر",
    originalPrice: 750,
    discountedPrice: 563,
    image: "/assets/city-apartment.svg",
    expires: "2025-05-12",
    roomsLeft: 3,
    location: "القاهرة",
  },
];

export default function LastMinuteDeals() {
  const [countdowns, setCountdowns] = useState<{ [key: number]: string }>({});
  const [isHoveredId, setIsHoveredId] = useState<number | null>(null);

  // حساب الوقت المتبقي لكل عرض
  useEffect(() => {
    const intervalId = setInterval(() => {
      const newCountdowns: { [key: number]: string } = {};
      
      lastMinuteDeals.forEach((deal) => {
        const expireDate = new Date(deal.expires);
        const now = new Date();
        const diff = expireDate.getTime() - now.getTime();
        
        if (diff <= 0) {
          newCountdowns[deal.id] = "انتهى العرض";
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          
          newCountdowns[deal.id] = days + " يوم " + hours + " ساعة " + minutes + " دقيقة";
        }
      });
      
      setCountdowns(newCountdowns);
    }, 60000); // تحديث كل دقيقة
    
    // تحديث أولي
    const initialCountdowns: { [key: number]: string } = {};
    lastMinuteDeals.forEach((deal) => {
      const expireDate = new Date(deal.expires);
      const now = new Date();
      const diff = expireDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        initialCountdowns[deal.id] = "انتهى العرض";
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        initialCountdowns[deal.id] = days + " يوم " + hours + " ساعة " + minutes + " دقيقة";
      }
    });
    
    setCountdowns(initialCountdowns);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="py-16 relative overflow-hidden">
      {/* خلفية القسم مع تأثيرات النجوم والدوائر التكنولوجية */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900/90 to-black"></div>
      
      {/* نقاط النجوم المتألقة */}
      <div className="absolute inset-0 overflow-hidden">
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
        
        {/* شعاع ضوئي متحرك */}
        <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-transparent to-[#39FF14]/5 animate-scan opacity-20"
             style={{animationDuration: '8s'}}></div>
      </div>
      
      {/* محتوى القسم */}
      <div className="container mx-auto px-4 relative z-10">
        {/* عنوان القسم */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 animate-text-glow inline-flex items-center justify-center gap-2">
            <span className="bg-[#39FF14]/10 p-2 rounded-full animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="text-white">العروض</span>{" "}
            <span className="text-[#39FF14]">اللحظية</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#39FF14]/70 to-transparent mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
            عروض خاصة بأسعار استثنائية لفترة محدودة، احجز الآن قبل نفاد الكمية
          </p>
        </div>
        
        {/* بطاقات العروض */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {lastMinuteDeals.map((deal) => (
            <motion.div 
              key={deal.id}
              className="relative bg-black/60 backdrop-blur-sm rounded-xl overflow-hidden border border-[#39FF14]/10 shadow-lg group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * deal.id }}
              viewport={{ once: true }}
              onMouseEnter={() => setIsHoveredId(deal.id)}
              onMouseLeave={() => setIsHoveredId(null)}
            >
              {/* شريط علوي متوهج */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/50 to-transparent"></div>
              
              {/* شريط سفلي متوهج */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/30 to-transparent"></div>
              
              {/* صورة العرض */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={deal.image} 
                  alt={deal.title} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                />
                
                {/* طبقة توهج عند الحركة */}
                {isHoveredId === deal.id && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-[#39FF14]/10 to-transparent opacity-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
                
                {/* شريط الخصم */}
                <div className="absolute top-3 left-3 bg-[#39FF14]/90 text-black px-3 py-1 rounded-full text-xs font-bold shadow-[0_0_10px_rgba(57,255,20,0.5)] animate-pulse">
                  خصم {Math.round(((deal.originalPrice - deal.discountedPrice) / deal.originalPrice) * 100)}%
                </div>
                
                {/* علامة الموقع */}
                <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center space-x-1 rtl:space-x-reverse">
                  <span className="rtl:mr-1">{deal.location}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {/* تفاصيل العرض */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2 text-shadow-glow">{deal.title}</h3>
                <p className="text-gray-300 text-sm mb-3">{deal.description}</p>
                
                {/* السعر والخصم */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-xs line-through">{deal.originalPrice} $</span>
                    <span className="text-[#39FF14] font-bold text-xl text-shadow-glow">{deal.discountedPrice} $</span>
                  </div>
                  
                  {/* المدة المتبقية */}
                  <div className="text-xs bg-black/40 rounded-lg px-2 py-1 border border-[#39FF14]/20">
                    <div className="text-white mb-0.5">ينتهي خلال:</div>
                    <div className="text-[#39FF14] font-mono">{countdowns[deal.id] || "..."}</div>
                  </div>
                </div>
                
                {/* الغرف المتبقية */}
                <div className="flex items-center text-yellow-400 text-xs mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>باقي {deal.roomsLeft} {deal.roomsLeft === 1 ? 'غرفة' : 'غرف'} فقط</span>
                </div>
                
                {/* زر الحجز */}
                <Link href={`/booking/${deal.id}`}>
                  <SpaceButton 
                    variant="primary" 
                    className="w-full py-2 text-sm"
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    }
                  >
                    احجز الآن
                  </SpaceButton>
                </Link>
              </div>
              
              {/* تأثير توهج حول البطاقة عند الحركة */}
              {isHoveredId === deal.id && (
                <motion.div 
                  className="absolute -inset-px rounded-xl bg-gradient-to-r from-[#39FF14]/0 via-[#39FF14]/30 to-[#39FF14]/0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ zIndex: -1 }}
                />
              )}
            </motion.div>
          ))}
        </div>
        
        {/* زر عرض المزيد من العروض */}
        <div className="mt-10 text-center relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#39FF14]/0 via-[#39FF14]/20 to-[#39FF14]/0 rounded-lg blur-sm opacity-30 group-hover:opacity-100 transition-all duration-500"></div>
          <Link href="/deals">
            <SpaceButton
              variant="outline"
              className="px-6 py-2.5"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
              }
            >
              عرض المزيد من العروض
            </SpaceButton>
          </Link>
        </div>
      </div>
    </section>
  );
}