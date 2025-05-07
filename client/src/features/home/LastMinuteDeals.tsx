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
      
      {/* محتوى القسم - تم إزالته بناءً على طلب المستخدم */}
    </section>
  );
}