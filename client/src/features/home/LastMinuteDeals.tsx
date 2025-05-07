import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Clock, Zap, ArrowRight, TimerIcon, Tag, Sparkles, CalendarClock, BadgePercent, ShieldCheck } from 'lucide-react';

// نوع بيانات للعرض اللحظي
interface LastMinuteDeal {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  imageUrl: string;
  location: string;
  availability: string;
  features: string[];
  timeLeft: string;
  rating: number;
}

// قائمة العروض اللحظية
const deals: LastMinuteDeal[] = [
  {
    id: 'deal1',
    title: 'شاليه فاخر بإطلالة بحرية',
    description: 'تمتع بعطلة نهاية الأسبوع في شاليه فاخر مع إطلالة بانورامية على البحر، حمام سباحة خاص وخدمة غرف 24 ساعة',
    originalPrice: 3500,
    discountedPrice: 2450,
    discountPercentage: 30,
    imageUrl: '/assets/luxury-chalet.webp',
    location: 'العين السخنة',
    availability: 'متاح لمدة 3 أيام فقط',
    features: ['إطلالة بحرية', 'حمام سباحة خاص', 'خدمة غرف 24 ساعة', 'موقف سيارات مجاني'],
    timeLeft: '23:45:12',
    rating: 4.8,
  },
  {
    id: 'deal2',
    title: 'فيلا مع حديقة خاصة',
    description: 'فيلا فاخرة مكيفة بالكامل مع حديقة خاصة ومنطقة شواء، مثالية للعائلات والمجموعات الكبيرة لقضاء عطلة مميزة',
    originalPrice: 5000,
    discountedPrice: 3750,
    discountPercentage: 25,
    imageUrl: '/assets/villa-garden.webp',
    location: 'الساحل الشمالي',
    availability: 'متاح لمدة 5 أيام فقط',
    features: ['حديقة خاصة', 'مكيف بالكامل', 'منطقة شواء', 'مسبح خاص', 'أمن 24 ساعة'],
    timeLeft: '47:15:33',
    rating: 4.7,
  },
  {
    id: 'deal3',
    title: 'شقة فاخرة وسط المدينة',
    description: 'شقة عصرية بموقع متميز وسط المدينة، قريبة من كافة المرافق والخدمات، مجهزة بالكامل بأحدث التقنيات الذكية',
    originalPrice: 2800,
    discountedPrice: 1960,
    discountPercentage: 30,
    imageUrl: '/assets/city-apartment.webp',
    location: 'القاهرة الجديدة',
    availability: 'متاح اليوم فقط',
    features: ['تقنيات ذكية', 'موقع مركزي', 'أمن 24 ساعة', 'خدمة تنظيف'],
    timeLeft: '08:30:44',
    rating: 4.5,
  },
];

// مكون لعرض تقييم المنتج بالنجوم
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${
            star <= Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'
          } ${star <= rating && star > Math.floor(rating) ? 'text-yellow-300' : ''}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-2 text-white text-sm">{rating}</span>
    </div>
  );
};

// مكون بطاقة العرض اللحظي
const DealCard: React.FC<{ deal: LastMinuteDeal; isExpanded: boolean; onClick: () => void }> = ({
  deal,
  isExpanded,
  onClick,
}) => {
  return (
    <motion.div
      className={`flex flex-col bg-black rounded-xl overflow-hidden border border-[#39FF14]/20 shadow-[0_0_15px_rgba(57,255,20,0.15)] transition-all duration-300 ${
        isExpanded ? 'md:flex-row h-auto' : 'h-[450px]'
      }`}
      layout
      onClick={onClick}
    >
      {/* صورة العرض */}
      <div
        className={`relative overflow-hidden ${
          isExpanded ? 'md:w-2/5 h-[300px] md:h-auto' : 'h-48'
        }`}
      >
        {/* التأثيرات الفضائية على الصورة */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-[#39FF14]/20 z-10"></div>
        
        {/* شارة الخصم */}
        <div className="absolute top-4 right-4 bg-[#39FF14] text-black font-bold px-3 py-1 rounded-full z-20 flex items-center shadow-[0_0_10px_rgba(57,255,20,0.5)]">
          <BadgePercent size={14} className="mr-1" /> {deal.discountPercentage}% خصم
        </div>
        
        <img
          src={deal.imageUrl}
          alt={deal.title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        
        {/* معلومات سريعة على الصورة */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-20">
          <div className="bg-black/70 text-white text-xs px-3 py-1 rounded-full flex items-center backdrop-blur-sm">
            <Clock size={12} className="mr-1 text-[#39FF14]" /> {deal.timeLeft}
          </div>
          <div className="bg-black/70 text-white text-xs px-3 py-1 rounded-full flex items-center backdrop-blur-sm">
            <Tag size={12} className="mr-1 text-[#39FF14]" /> {deal.location}
          </div>
        </div>
      </div>
      
      {/* محتوى العرض */}
      <div className="flex-1 p-5 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-white">{deal.title}</h3>
          <StarRating rating={deal.rating} />
        </div>
        
        <p className="text-gray-300 text-sm mb-4">{deal.description}</p>
        
        {/* التوافر والوقت */}
        <div className="flex items-center mb-4">
          <CalendarClock size={16} className="text-[#39FF14] mr-2" />
          <span className="text-gray-300 text-sm">{deal.availability}</span>
        </div>
        
        {/* الأسعار */}
        <div className="mb-4 flex items-end">
          <div className="flex flex-col">
            <span className="text-gray-400 text-xs line-through">{deal.originalPrice} ج.م</span>
            <span className="text-[#39FF14] text-2xl font-bold">{deal.discountedPrice} ج.م</span>
          </div>
          <span className="text-gray-400 text-xs ml-2">لليلة الواحدة</span>
        </div>
        
        {/* المميزات */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            <h4 className="text-white font-semibold mb-2 flex items-center">
              <Sparkles size={16} className="text-[#39FF14] mr-2" /> المميزات
            </h4>
            <ul className="grid grid-cols-2 gap-2">
              {deal.features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-300 text-sm">
                  <ShieldCheck size={12} className="text-[#39FF14] mr-2 flex-shrink-0" /> {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
        
        {/* زر الحجز */}
        <motion.button
          className="mt-auto py-3 px-6 bg-gradient-to-r from-[#39FF14]/80 to-[#39FF14] text-black font-bold rounded-lg flex items-center justify-center hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          احجز الآن
          <ArrowRight size={16} className="mr-2 transition-transform group-hover:translate-x-1" />
        </motion.button>
      </div>
    </motion.div>
  );
};

// مكون قسم العروض اللحظية الرئيسي
const LastMinuteDeals: React.FC = () => {
  const [expandedDeal, setExpandedDeal] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  // مراقبة ظهور القسم في الشاشة
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start('visible');
        }
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [controls]);
  
  const toggleExpand = (dealId: string) => {
    setExpandedDeal(expandedDeal === dealId ? null : dealId);
  };
  
  return (
    <section 
      ref={sectionRef} 
      className="py-16 md:py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(10,15,25,1) 100%)' }}
    >
      {/* خلفية القسم */}
      <div className="absolute inset-0 z-0">
        {/* خطوط الشبكة */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: `radial-gradient(#39FF14 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}></div>
        
        {/* أضواء وتأثيرات */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/30 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* ترويسة القسم */}
        <div className="text-center mb-16">
          <motion.div
            className="inline-flex items-center mb-3 px-4 py-1.5 bg-[#39FF14]/10 text-[#39FF14] text-sm font-medium rounded-full border border-[#39FF14]/20"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            transition={{ duration: 0.5 }}
            variants={{
              visible: { opacity: 1, y: 0 }
            }}
          >
            <TimerIcon size={16} className="mr-2" /> العروض اللحظية
          </motion.div>
          
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            transition={{ duration: 0.5, delay: 0.2 }}
            variants={{
              visible: { opacity: 1, y: 0 }
            }}
          >
            <span className="text-white">عروض </span>
            <span className="text-[#39FF14]">حصرية</span>
            <span className="text-white"> لفترة محدودة</span>
          </motion.h2>
          
          <motion.p
            className="text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            transition={{ duration: 0.5, delay: 0.3 }}
            variants={{
              visible: { opacity: 1, y: 0 }
            }}
          >
            اغتنم الفرصة واحجز إقامتك الآن بأسعار استثنائية. عروض خاصة لفترة محدودة على وحدات مختارة بخصومات تصل إلى 30%
          </motion.p>
        </div>
        
        {/* قائمة العروض */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {deals.map((deal) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 30 }}
              animate={controls}
              transition={{ duration: 0.5, delay: 0.4 + parseInt(deal.id.replace('deal', '')) * 0.1 }}
              variants={{
                visible: { opacity: 1, y: 0 }
              }}
            >
              <DealCard
                deal={deal}
                isExpanded={expandedDeal === deal.id}
                onClick={() => toggleExpand(deal.id)}
              />
            </motion.div>
          ))}
        </div>
        
        {/* زر عرض المزيد */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ duration: 0.5, delay: 0.8 }}
          variants={{
            visible: { opacity: 1, y: 0 }
          }}
        >
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-[#39FF14] text-[#39FF14] rounded-lg font-medium hover:bg-[#39FF14]/10 transition-colors">
            شاهد جميع العروض
            <Zap size={16} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default LastMinuteDeals;