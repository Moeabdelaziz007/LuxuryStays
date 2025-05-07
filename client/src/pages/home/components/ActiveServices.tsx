import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { useTranslation } from "@/features/i18n/hooks/useTranslation";
import { getActiveServices } from "@/lib/api";
import ServiceCard from "./ServiceCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { Service as ServiceType } from "@shared/schema";

export default function ActiveServices() {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getActiveServices();
        setServices(data);
      } catch (error) {
        console.error("Error fetching active services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Check scroll capabilities
  useEffect(() => {
    const checkScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      // Check on resize too
      window.addEventListener('resize', checkScroll);
      // Initial check
      checkScroll();
      
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [services, loading]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of the container width
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;
    
    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((item) => (
        <div key={item} className="rounded-xl overflow-hidden bg-secondary">
          <Skeleton className="h-[350px] w-full" />
        </div>
      ))}
    </div>
  );

  const defaultServices = [
    {
      id: "1",
      name: t("home.services.restaurants.title"),
      description: t("home.services.restaurants.description"),
      imageUrl: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      status: "active",
      iconClass: "utensils",
      locations: [
        { name: "مطعم زودياك", area: "راس الحكمة - ماونتن فيو" },
        { name: "مطعم سمك", area: "بو آيلاند، سيدي عبد الرحمن" },
      ]
    },
    {
      id: "2",
      name: t("home.services.nightclubs.title"),
      description: t("home.services.nightclubs.description"),
      imageUrl: "https://images.unsplash.com/photo-1556035511-3168381ea4d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      status: "active",
      iconClass: "glass-cheers",
      locations: [
        { name: "سيكس ديجريز", area: "ماونتن فيو، راس الحكمة" },
        { name: "بيتش باد", area: "مراقيا، الساحل الشمالي" },
      ]
    },
    {
      id: "3",
      name: "حجز رحلات اليخوت الفاخرة",
      description: "استمتع برحلة بحرية مميزة على متن يخوت فاخرة مجهزة بالكامل مع طاقم خدمة احترافي لقضاء يوم لا يُنسى في البحر المتوسط",
      imageUrl: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      status: "active",
      iconClass: "travel",
      locations: [
        { name: "مارينا الساحل الشمالي", area: "كم 130، الساحل الشمالي" },
        { name: "مارينا راس الحكمة", area: "تليباي، راس الحكمة" },
      ]
    }
  ];

  return (
    <section id="services" className="py-16 bg-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute left-[5%] top-[20%] opacity-30 w-32 h-32 bg-accent blur-3xl rounded-full"></div>
        <div className="absolute right-[15%] bottom-[10%] opacity-20 w-48 h-48 bg-accent blur-[100px] rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center">
            <div className="mr-3 p-2 rounded-full bg-accent/10 text-accent">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold font-poppins">
              <span className="text-white">{t("home.services.title")}</span>
              <span className="text-accent"> Services</span>
            </h2>
          </div>
          <Link href="/services" className="text-accent hover:underline flex items-center group">
            {t("common.viewAll")}
            <ArrowLeft className="mr-2 transform transition-transform group-hover:translate-x-[-3px]" size={16} />
          </Link>
        </div>
        
        {loading ? (
          renderSkeleton()
        ) : (
          <div className="relative">
            {/* Scroll buttons for desktop */}
            <div className="hidden md:block">
              <Button
                variant="ghost"
                size="icon"
                className={`absolute left-[-20px] top-1/2 transform -translate-y-1/2 bg-black/40 text-white rounded-full z-10 ${
                  !canScrollLeft ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/60'
                }`}
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className={`absolute right-[-20px] top-1/2 transform -translate-y-1/2 bg-black/40 text-white rounded-full z-10 ${
                  !canScrollRight ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/60'
                }`}
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>
            
            {/* Scrollable container */}
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto pb-5 hide-scrollbar snap-x snap-mandatory space-x-6 scroll-pr-10"
              style={{ scrollbarWidth: 'none' }}
            >
              {(services.length > 0 ? services : defaultServices).map((service, index) => (
                <div 
                  key={service.id || index} 
                  className="min-w-[300px] md:min-w-[400px] flex-shrink-0 snap-start"
                >
                  <ServiceCard 
                    service={{
                      ...service,
                      id: service.id?.toString() || index.toString(),
                      iconClass: service.iconClass || 'utensils'
                    }} 
                    buttonText={t("home.services.exploreButton")}
                    featured={index === 0}
                  />
                </div>
              ))}
            </div>
            
            {/* Scroll indicator dots for mobile */}
            <div className="flex justify-center mt-6 space-x-2 md:hidden">
              {Array.from({ length: services.length > 0 ? services.length : defaultServices.length }).map((_, i) => (
                <div 
                  key={i}
                  className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-accent' : 'bg-white/30'}`}
                ></div>
              ))}
            </div>
          </div>
        )}
        
        {/* Additional section for featured or special service */}
        <div className="mt-16 pt-10 border-t border-white/10">
          <div className="bg-gradient-to-r from-secondary/80 to-black/60 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-10 flex flex-col justify-center">
                <span className="text-accent uppercase tracking-wider text-sm font-medium mb-4">خدمة حصرية</span>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">مجالس وجلسات VIP على الشاطئ</h3>
                <p className="text-white/70 mb-6">
                  استمتع بتجربة فريدة على شواطئ الساحل الشمالي من خلال حجز مجلس خاص مُعد لك وللأصدقاء مع خدمة متكاملة من المشروبات والأرجيلة الفاخرة
                </p>
                <Button className="w-fit bg-accent text-primary hover:bg-accent/90">
                  احجز الآن
                </Button>
              </div>
              <div className="relative h-64 md:h-auto">
                <img 
                  src="https://images.unsplash.com/photo-1528150177508-7cc0c36cda5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="VIP Beach Lounge"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
