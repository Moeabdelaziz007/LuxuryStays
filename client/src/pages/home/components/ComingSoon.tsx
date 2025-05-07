import { useState, useEffect } from "react";
import { useTranslation } from "@/features/i18n/hooks/useTranslation";
import { Sofa, Ship, Plane, Bell, Rocket, Satellite, Cpu, Clock, Zap, Sparkles, Timer, AreaChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getComingSoonServices } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { Service } from "@shared/schema";

export default function ComingSoon() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getComingSoonServices();
        setServices(data);
      } catch (error) {
        console.error("Error fetching coming soon services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // تعريف واجهة للخدمة المخصصة لحل مشكلة التوافق
  interface CustomService {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    status: string;
    iconClass?: string;
    launchDate?: string | Date | null;
  }

  // Function to get the appropriate icon based on name
  const getIcon = (service: Service | CustomService, isHighlighted: boolean = false) => {
    const iconSize = "h-12 w-12";
    const nameStr = service.name.toLowerCase();
    const iconClass = 'iconClass' in service && service.iconClass ? service.iconClass.toLowerCase() : '';
    
    // Try to determine icon from iconClass first, then from name if no match
    if (iconClass.includes('lounge') || nameStr.includes('lounge') || nameStr.includes('room')) {
      return <Sofa className={`${iconSize} ${isHighlighted ? 'text-accent' : 'text-white/80'}`} />;
    } else if (iconClass.includes('yacht') || nameStr.includes('yacht') || nameStr.includes('boat')) {
      return <Ship className={`${iconSize} ${isHighlighted ? 'text-accent' : 'text-white/80'}`} />;
    } else if (iconClass.includes('plane') || nameStr.includes('plane') || nameStr.includes('transfer')) {
      return <Plane className={`${iconSize} ${isHighlighted ? 'text-accent' : 'text-white/80'}`} />;
    } else if (iconClass.includes('tech') || nameStr.includes('tech') || nameStr.includes('ai')) {
      return <Cpu className={`${iconSize} ${isHighlighted ? 'text-accent' : 'text-white/80'}`} />;
    } else if (iconClass.includes('vr') || nameStr.includes('vr') || nameStr.includes('virtual')) {
      return <Rocket className={`${iconSize} ${isHighlighted ? 'text-accent' : 'text-white/80'}`} />;
    } else {
      return <Satellite className={`${iconSize} ${isHighlighted ? 'text-accent' : 'text-white/80'}`} />;
    }
  };

  // Function to calculate approximate time remaining
  const getTimeRemaining = (launchDate: string | null | Date) => {
    if (!launchDate) return { months: 0, days: 0 };

    const target = new Date(launchDate);
    const now = new Date();
    
    // Calculate difference in milliseconds
    const diff = target.getTime() - now.getTime();
    
    if (diff <= 0) return { months: 0, days: 0 };
    
    // Convert to days and months
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    
    return { months, days: remainingDays };
  };

  // Fallback data if no services are found
  const fallbackServices: CustomService[] = [
    {
      id: "1",
      name: "تجربة الواقع الافتراضي VR",
      description: "اختبر أحدث تقنيات الواقع الافتراضي لاستكشاف العقارات والوجهات من منزلك، مع إمكانية المشاهدة بزاوية 360 درجة وتجربة غامرة",
      imageUrl: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      launchDate: "2025-09-15",
      status: "coming-soon",
      iconClass: "vr"
    },
    {
      id: "2",
      name: "رحلات اليخوت الفاخرة بتقنية ذكية",
      description: "استمتع برحلات بحرية على متن يخوت مجهزة بأحدث التقنيات الذكية للتحكم المناخي والإضاءة والصوت، مع طاقم خدمة متميز",
      imageUrl: "https://images.unsplash.com/photo-1516550135131-fe3dcb0bedc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      launchDate: "2025-08-20",
      status: "coming-soon",
      iconClass: "yacht"
    },
    {
      id: "3",
      name: "مساعد السفر الذكي",
      description: "تطبيق ذكي بتقنية الذكاء الاصطناعي لتخطيط رحلتك بالكامل وحجز كافة الخدمات المتاحة أثناء إقامتك في الساحل الشمالي",
      imageUrl: "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      launchDate: "2025-07-01",
      status: "coming-soon",
      iconClass: "ai"
    }
  ];

  // Calculate the dots showing the countdown scale
  const getCountdownDots = (launchDate: string | null | Date) => {
    const { months } = getTimeRemaining(launchDate);
    const totalDots = 6;
    // Calculate filled dots based on how soon the launch date is
    // More filled dots means launching sooner
    const filledDots = Math.max(1, Math.min(totalDots, totalDots - months));
    
    return Array(totalDots).fill(0).map((_, i) => (
      <div 
        key={i} 
        className={`w-2 h-2 rounded-full ${i < filledDots ? 'bg-accent' : 'bg-white/20'}`}
      />
    ));
  };

  // Animation for cards on hover
  const handleCardHover = (index: number | null) => {
    setSelectedCard(index);
  };

  return (
    <section id="coming-soon" className="py-20 bg-black relative overflow-hidden">
      {/* Tech/Space inspired background elements */}
      <div className="absolute inset-0 z-0">
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KICA8cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgIDxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxMTEiIHN0cm9rZS13aWR0aD0iMC41Ii8+CiAgPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiIC8+Cjwvc3ZnPg==')] opacity-20"></div>
        
        {/* Neon glow effects */}
        <div className="absolute h-64 w-64 rounded-full bg-accent blur-[100px] opacity-10 top-20 left-1/4 animate-pulse"></div>
        <div className="absolute h-96 w-96 rounded-full bg-accent blur-[150px] opacity-5 bottom-0 right-1/3"></div>
        
        {/* Digital particles */}
        <div className="absolute top-1/4 left-1/3 h-2 w-2 rounded-full bg-accent shadow-glow animate-ping"></div>
        <div className="absolute top-2/3 left-1/2 h-2 w-2 rounded-full bg-accent shadow-glow animate-ping animation-delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 h-2 w-2 rounded-full bg-accent shadow-glow animate-ping animation-delay-2000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Badge className="px-4 py-1 bg-black border border-accent/30 text-accent rounded-full text-sm font-medium">
                <Zap className="w-4 h-4 mr-2 inline-block" />
                {t("home.comingSoon.badge")}
              </Badge>
              <div className="absolute -inset-0.5 bg-accent/20 blur-sm rounded-full -z-10"></div>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold font-poppins mb-6 tracking-tight">
            <span className="text-white">{t("home.comingSoon.title1")}</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent/80"> {t("home.comingSoon.title2")}</span>
          </h2>
          
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            {t("home.comingSoon.description")}
          </p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="rounded-xl overflow-hidden bg-primary/20 backdrop-blur-sm p-8 border border-white/5 shadow-glow-sm">
                <Skeleton className="h-16 w-16 rounded-md mb-6" />
                <Skeleton className="h-7 w-3/4 mb-4" />
                <Skeleton className="h-20 w-full mb-8" />
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(services.length > 0 ? services : fallbackServices).map((service, index) => {
              const isSelected = selectedCard === index;
              const isHighlighted = index === 0;
              const launchDateObj = service.launchDate ? new Date(service.launchDate) : null;
              const launchDateDisplay = launchDateObj ? 
                new Intl.DateTimeFormat('ar-EG', { year: 'numeric', month: 'long' }).format(launchDateObj) : 
                'قريباً';
              
              const { months, days } = getTimeRemaining(service.launchDate);
              const timeRemainingText = months > 0 ? 
                `${months} شهر و ${days} يوم` : 
                days > 0 ? `${days} يوم` : 'قريباً جدًا';
              
              return (
                <div 
                  key={service.id}
                  className={`rounded-xl overflow-hidden shadow-xl bg-primary/10 backdrop-blur-sm relative group p-8 border 
                    ${isHighlighted ? "border-accent/30" : "border-white/5"}
                    transition-all duration-500 hover:shadow-glow-lg
                    ${isSelected ? 'scale-[1.02] shadow-glow-md border-accent/30 z-10' : 'scale-100'}
                  `}
                  onMouseEnter={() => handleCardHover(index)}
                  onMouseLeave={() => handleCardHover(null)}
                >
                  {/* Service Icon with tech glow effect */}
                  <div className="relative mb-8 inline-block">
                    <div className={`p-4 rounded-xl bg-primary/30 border border-white/10 relative z-10
                      ${isSelected ? 'border-accent/20 bg-accent/5' : ''}`}>
                      {getIcon(service, isSelected || isHighlighted)}
                    </div>
                    <div className={`absolute inset-0 bg-accent/10 blur-md rounded-xl -z-0 opacity-0 transition-opacity duration-500 
                      ${isSelected || isHighlighted ? 'opacity-100' : ''}`}></div>
                  </div>
                  
                  {/* Launch Badge */}
                  <div className="absolute top-6 right-6">
                    <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                      <Clock className="h-3 w-3 text-accent" />
                      <span className="text-xs font-medium text-white">{timeRemainingText}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 font-poppins text-white">{service.name}</h3>
                  
                  <p className={`text-white/70 mb-8 text-sm leading-relaxed transition-all duration-500 
                    ${isSelected ? 'text-white/90' : ''}`}>
                    {service.description}
                  </p>
                  
                  <div className="flex flex-col space-y-6">
                    {/* Launch Timeline */}
                    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/5">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <Sparkles className="h-4 w-4 text-accent mr-2" />
                          <span className="text-sm font-medium text-white">موعد الإطلاق</span>
                        </div>
                        <span className="text-xs text-accent font-bold">{launchDateDisplay}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 justify-between">
                        {getCountdownDots(service.launchDate)}
                      </div>
                    </div>
                    
                    {/* Notification Button */}
                    <Button 
                      className={`w-full py-6 rounded-xl transition-all duration-500 flex items-center justify-center
                        ${isSelected || isHighlighted ? 
                          'bg-accent text-primary hover:bg-accent/90' : 
                          'bg-white/5 text-white hover:bg-white/10'
                        }`}
                    >
                      <Bell className="mr-2" size={16} />
                      {t("home.comingSoon.getNotified")}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tech Timeline */}
        <div className="mt-24 relative">
          <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent top-8"></div>
          
          <div className="flex justify-between relative">
            {['2025', '2026', '2027+'].map((year, i) => (
              <div key={i} className="text-center relative">
                <div className={`w-4 h-4 rounded-full mx-auto mb-3 ${i === 0 ? 'bg-accent' : 'bg-white/20'}`}>
                  {i === 0 && (
                    <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-75"></div>
                  )}
                </div>
                <span className={`text-sm font-medium ${i === 0 ? 'text-accent' : 'text-white/50'}`}>{year}</span>
                
                {i === 0 && (
                  <div className="absolute top-[-8px] left-1/2 transform -translate-x-1/2 text-xs text-accent font-medium bg-black/80 px-2 py-1 rounded whitespace-nowrap">
                    أنت هنا
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}