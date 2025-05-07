import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Zap, Sparkles, Timer, Users, Clock, Shield, Star, Smartphone } from 'lucide-react';

// نوع بيانات الخدمة القادمة
interface UpcomingService {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  date: string;
  color: string;
}

const ComingSoonSection: React.FC = () => {
  const controls = useAnimation();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState<string>('services');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // طريقة بديلة لتتبع ظهور العنصر في الواجهة
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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

  // قائمة الخدمات القادمة
  const upcomingServices: UpcomingService[] = [
    {
      id: 'chillroom',
      title: 'ChillRoom',
      description: 'غرف استرخاء مجهزة بأحدث التقنيات الصوتية والمرئية ومكيفات ذكية تتيح للمستخدمين تجربة استرخاء فريدة في أجواء مصممة لتناسب الأذواق المختلفة',
      icon: <Sparkles className="text-purple-400" size={28} />,
      date: 'يونيو 2025',
      color: 'from-purple-600 to-blue-600',
    },
    {
      id: 'cleaning',
      title: 'خدمات التنظيف المتطورة',
      description: 'خدمات تنظيف متكاملة بأحدث التقنيات الروبوتية وبمعايير عالمية لضمان راحتك وخصوصيتك، مع إمكانية الحجز والجدولة التلقائية حسب تفضيلاتك',
      icon: <Zap className="text-green-400" size={28} />,
      date: 'يوليو 2025',
      color: 'from-green-600 to-teal-500',
    },
    {
      id: 'rent',
      title: 'الإيجار الفوري',
      description: 'نظام إيجار فوري مدعوم بتقنية الذكاء الاصطناعي يتيح لك حجز وتأجير وحدات سكنية خلال دقائق مع التحقق الآلي من الهوية وإتمام العقود الإلكترونية',
      icon: <Timer className="text-blue-400" size={28} />,
      date: 'أغسطس 2025',
      color: 'from-blue-600 to-cyan-500',
    },
    {
      id: 'smart-keys',
      title: 'المفاتيح الذكية',
      description: 'تقنية المفاتيح الذكية اللاسلكية التي تمكنك من التحكم في منزلك عن بعد وإدارة الوصول للضيوف بطريقة آمنة ومريحة دون الحاجة لمفاتيح تقليدية',
      icon: <Shield className="text-amber-400" size={28} />,
      date: 'سبتمبر 2025',
      color: 'from-amber-500 to-orange-600',
    },
  ];

  // معلومات حول زيادة حركة المرور والمستخدمين
  const growthStrategies = [
    {
      id: 'exclusive',
      title: 'عروض حصرية للمستخدمين الأوائل',
      description: 'سجل اهتمامك الآن للحصول على خصومات حصرية تصل إلى 30% على الخدمات الجديدة عند إطلاقها وأولوية الحجز للمناسبات الخاصة',
      icon: <Star className="text-amber-400" size={28} />,
    },
    {
      id: 'rewards',
      title: 'برنامج المكافآت والإحالة',
      description: 'احصل على نقاط مكافآت StayX عن كل صديق تدعوه للانضمام للمنصة، واستبدلها بخدمات مجانية وترقيات وهدايا حصرية',
      icon: <Users className="text-blue-400" size={28} />,
    },
    {
      id: 'instant',
      title: 'حجز وتأكيد فوري',
      description: 'نظام حجز متطور يتيح لك تأكيد حجزك خلال ثوانٍ مع إمكانية الإلغاء المجاني المرن وإعادة الجدولة بسهولة',
      icon: <Clock className="text-green-400" size={28} />,
    },
    {
      id: 'app',
      title: 'تطبيق جوال متكامل',
      description: 'تطبيق جوال متطور قادم قريباً يتيح الوصول لجميع خدمات StayX من أي مكان مع ميزات حصرية وإشعارات مخصصة وإدارة كاملة لحجوزاتك',
      icon: <Smartphone className="text-purple-400" size={28} />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative py-20 overflow-hidden bg-black"
    >
      {/* خلفية متحركة مع تأثيرات فضائية */}
      <div className="absolute inset-0 opacity-20 overflow-hidden">
        <div className="stars-container stars-density-high">
          <div className="stars-small"></div>
          <div className="stars-medium"></div>
          <div className="stars-large"></div>
        </div>
      </div>
      
      {/* تأثير الدوائر الكهربائية */}
      <div className="absolute inset-0 opacity-5">
        <div className="circuit-lines"></div>
      </div>
      
      {/* رؤوس ليزر تتحرك على الشاشة */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/30 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* العنوان الرئيسي بتأثيرات متحركة */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-text-glow">
            <span className="text-white">خدمات</span>{" "}
            <span className="text-[#39FF14] animate-pulse-subtle">قادمة قريباً</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#39FF14]/70 to-transparent mx-auto mb-6 animate-pulse"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            نحن نعمل باستمرار على تطوير منصتنا وإضافة خدمات جديدة مبتكرة لنقدم تجربة إقامة فريدة لا مثيل لها
          </p>
        </motion.div>
        
        {/* شريط التبويب للتنقل بين الخدمات واستراتيجيات النمو */}
        <div className="flex justify-center mb-12">
          <div className="bg-black/60 p-1 rounded-lg border border-[#39FF14]/30 backdrop-blur-sm">
            <div className="flex">
              <button
                onClick={() => setActiveTab('services')}
                className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === 'services' 
                    ? 'bg-[#39FF14]/20 text-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.3)]' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                الخدمات القادمة
              </button>
              <button
                onClick={() => setActiveTab('growth')}
                className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === 'growth' 
                    ? 'bg-[#39FF14]/20 text-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.3)]' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                استراتيجيات النمو
              </button>
            </div>
          </div>
        </div>
        
        {/* محتوى الخدمات القادمة */}
        {activeTab === 'services' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          >
            {upcomingServices.map((service) => (
              <motion.div
                key={service.id}
                variants={itemVariants}
                className="bg-black/60 backdrop-blur-sm border border-[#39FF14]/20 rounded-xl overflow-hidden relative group"
              >
                {/* الشريط العلوي بلون مميز */}
                <div className={`h-1 w-full bg-gradient-to-r ${service.color}`}></div>
                
                <div className="p-6 sm:p-8">
                  {/* الايقونة والعنوان */}
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-black/70 border border-[#39FF14]/20 flex items-center justify-center mr-4 overflow-hidden group-hover:border-[#39FF14]/50 transition-all duration-300">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-[#39FF14] transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-[#39FF14]/80 text-sm">
                        {service.date}
                      </p>
                    </div>
                  </div>
                  
                  {/* وصف الخدمة */}
                  <p className="text-gray-300 text-sm sm:text-base mt-3">
                    {service.description}
                  </p>
                  
                  {/* زر الاشتراك المسبق */}
                  <div className="mt-6">
                    <button className="bg-black/80 text-[#39FF14] border border-[#39FF14]/30 px-5 py-2 rounded-lg hover:bg-[#39FF14]/10 transition-all duration-300 text-sm font-medium flex items-center justify-center group-hover:border-[#39FF14]/60">
                      <span>سجل اهتمامك</span>
                      <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
                
                {/* زخرفة خلفية */}
                <div className="absolute bottom-0 right-0 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <div className="circuit-lines"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {/* محتوى استراتيجيات النمو */}
        {activeTab === 'growth' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          >
            {growthStrategies.map((strategy) => (
              <motion.div
                key={strategy.id}
                variants={itemVariants}
                className="bg-black/60 backdrop-blur-sm border border-[#39FF14]/20 rounded-xl p-6 sm:p-8 relative group hover:border-[#39FF14]/40 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-black/70 border border-[#39FF14]/20 flex items-center justify-center mr-4 overflow-hidden group-hover:border-[#39FF14]/50 transition-all duration-300">
                    {strategy.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#39FF14] transition-colors duration-300">
                    {strategy.title}
                  </h3>
                </div>
                
                <p className="text-gray-300 text-sm sm:text-base">
                  {strategy.description}
                </p>
                
                {/* خط فاصل مضيء */}
                <div className="mt-6 pt-4 border-t border-[#39FF14]/10 group-hover:border-[#39FF14]/30 transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <div className="text-[#39FF14]/70 text-sm">
                      <span className="animate-pulse">قادم قريباً</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]/70" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                {/* زخرفة خلفية */}
                <div className="absolute bottom-0 right-0 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <div className="circuit-lines"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {/* قسم الاشتراك لتلقي الإخطارات */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.6 } }
          }}
          className="mt-16 pt-10 border-t border-[#39FF14]/10"
        >
          <div className="bg-black/70 backdrop-blur-md border border-[#39FF14]/20 rounded-2xl p-8 md:p-10 relative overflow-hidden">
            {/* تأثير الخلفية المضيئة */}
            <div className="absolute -inset-px bg-gradient-to-r from-transparent via-[#39FF14]/5 to-transparent opacity-50 animate-holo-glow"></div>
            
            {/* زخرفة خلفية */}
            <div className="absolute top-0 right-0 w-full h-full opacity-5">
              <div className="circuit-lines"></div>
            </div>
            
            <div className="relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                  كن أول من <span className="text-[#39FF14] animate-pulse-subtle">يعرف</span>
                </h3>
                <p className="text-gray-300">
                  اشترك الآن للحصول على إشعارات فورية عندما نطلق خدمات جديدة واستفد من العروض والخصومات الحصرية للمشتركين المبكرين
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                <input 
                  type="email" 
                  placeholder="أدخل بريدك الإلكتروني" 
                  className="flex-1 bg-black/80 border border-[#39FF14]/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/80 focus:ring-1 focus:ring-[#39FF14]/50 transition-all duration-300"
                />
                <button className="bg-[#39FF14] hover:bg-[#39FF14]/90 text-black font-bold px-6 py-3 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(57,255,20,0.5)] hover:shadow-[0_0_20px_rgba(57,255,20,0.7)]">
                  اشترك الآن
                </button>
              </div>
              
              <p className="text-gray-500 text-sm text-center mt-4">
                لن نرسل لك رسائل غير مرغوبة ويمكنك إلغاء الاشتراك في أي وقت
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComingSoonSection;