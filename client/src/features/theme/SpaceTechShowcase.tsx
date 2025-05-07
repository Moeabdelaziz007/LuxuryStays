import React, { useState } from "react";
import { motion } from "framer-motion";
import { SpaceTechButton } from "@/components/ui/space-tech-button";
import { SpaceHologramCard } from "@/components/ui/space-hologram-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChevronRight, CircleDot, Rocket, Shield, Zap, Mail, Info, Cpu, Star, Clock } from "lucide-react";

/**
 * مكون عرض لتجربة كافة مكونات واجهة المستخدم بالتصميم الفضائي/التقني
 * يتيح للمستخدم استكشاف الخيارات المتعددة للتصميم ويقدم أمثلة عملية للاستخدام
 */
export default function SpaceTechShowcase() {
  // حالة إعدادات العرض
  const [buttonsIntensity, setButtonsIntensity] = useState<number>(70);
  const [cardsIntensity, setCardsIntensity] = useState<number>(70);
  const [showAnimations, setShowAnimations] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("buttons");
  
  // تحويل قيمة الشدة إلى تصنيف
  const getIntensityLevel = (value: number): 'low' | 'medium' | 'high' | 'ultra' => {
    if (value < 25) return 'low';
    if (value < 50) return 'medium';
    if (value < 75) return 'high';
    return 'ultra';
  };

  return (
    <div className="space-gradient-bg min-h-screen p-6 flex flex-col">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-[#39FF14] mb-2">StayX Design System</h1>
        <p className="text-gray-300">استكشف مكونات واجهة المستخدم بالتصميم الفضائي/التقني لتطبيق StayX</p>
      </header>

      {/* لوحة التحكم بالتأثيرات */}
      <div className="bg-black/40 backdrop-blur-lg rounded-lg p-4 border border-gray-800 shadow-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label className="text-gray-300 mb-2 block">شدة تأثيرات الأزرار</Label>
            <Slider 
              value={[buttonsIntensity]} 
              min={0} 
              max={100} 
              step={1}
              onValueChange={(value) => setButtonsIntensity(value[0])}
              className="mb-2"
            />
            <div className="text-xs text-gray-400 flex justify-between">
              <span>هادئ</span>
              <span>متوسط</span>
              <span>قوي</span>
              <span>فائق</span>
            </div>
          </div>
          
          <div>
            <Label className="text-gray-300 mb-2 block">شدة تأثيرات البطاقات</Label>
            <Slider 
              value={[cardsIntensity]} 
              min={0} 
              max={100} 
              step={1}
              onValueChange={(value) => setCardsIntensity(value[0])}
              className="mb-2"
            />
            <div className="text-xs text-gray-400 flex justify-between">
              <span>هادئ</span>
              <span>متوسط</span>
              <span>قوي</span>
              <span>فائق</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="animations" 
              checked={showAnimations}
              onCheckedChange={setShowAnimations}
            />
            <Label htmlFor="animations" className="text-gray-300">تفعيل التأثيرات المتحركة</Label>
          </div>
        </div>
      </div>

      {/* عرض المكونات */}
      <div className="bg-black/40 backdrop-blur-lg rounded-lg border border-gray-800 shadow-lg flex-grow">
        <Tabs defaultValue="buttons" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-gray-900/50 grid grid-cols-3 border-b border-gray-800">
            <TabsTrigger value="buttons" className="data-[state=active]:bg-[#39FF14]/10 data-[state=active]:text-[#39FF14]">
              الأزرار
            </TabsTrigger>
            <TabsTrigger value="cards" className="data-[state=active]:bg-[#39FF14]/10 data-[state=active]:text-[#39FF14]">
              البطاقات
            </TabsTrigger>
            <TabsTrigger value="effects" className="data-[state=active]:bg-[#39FF14]/10 data-[state=active]:text-[#39FF14]">
              تأثيرات خاصة
            </TabsTrigger>
          </TabsList>
          
          {/* قسم عرض الأزرار */}
          <TabsContent value="buttons" className="p-6">
            <h2 className="text-xl font-bold text-white mb-6">أنماط الأزرار الفضائية</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="flex flex-col space-y-4">
                <SpaceTechButton 
                  variant="primary"
                  animated={showAnimations}
                  effect={showAnimations ? "scanline" : "none"}
                  intensity={getIntensityLevel(buttonsIntensity)}
                >
                  زر رئيسي
                </SpaceTechButton>
                
                <SpaceTechButton 
                  variant="secondary"
                  animated={showAnimations}
                  effect={showAnimations ? "pulse" : "none"}
                  intensity={getIntensityLevel(buttonsIntensity)}
                  icon={<ChevronRight size={16} />}
                >
                  زر ثانوي
                </SpaceTechButton>
                
                <SpaceTechButton 
                  variant="hologram"
                  animated={showAnimations}
                  effect={showAnimations ? "energize" : "none"}
                  intensity={getIntensityLevel(buttonsIntensity)}
                  icon={<Zap size={16} />}
                >
                  زر هولوجرامي
                </SpaceTechButton>
              </div>
              
              <div className="flex flex-col space-y-4">
                <SpaceTechButton 
                  variant="command"
                  animated={showAnimations}
                  effect={showAnimations ? "thruster" : "none"}
                  intensity={getIntensityLevel(buttonsIntensity)}
                  icon={<Rocket size={16} />}
                >
                  زر المهام
                </SpaceTechButton>
                
                <SpaceTechButton 
                  variant="warning"
                  animated={showAnimations}
                  effect={showAnimations ? "pulse" : "none"}
                  intensity={getIntensityLevel(buttonsIntensity)}
                  icon={<Info size={16} />}
                >
                  زر تحذير
                </SpaceTechButton>
                
                <SpaceTechButton 
                  variant="danger"
                  animated={showAnimations}
                  effect={showAnimations ? "scanline" : "none"}
                  intensity={getIntensityLevel(buttonsIntensity)}
                  icon={<Shield size={16} />}
                >
                  زر خطر
                </SpaceTechButton>
              </div>
              
              <div className="flex flex-col space-y-4">
                <SpaceTechButton 
                  variant="outline"
                  animated={showAnimations}
                  effect={showAnimations ? "scanline" : "none"}
                  intensity={getIntensityLevel(buttonsIntensity)}
                >
                  زر مخطط
                </SpaceTechButton>
                
                <SpaceTechButton 
                  variant="metallic"
                  animated={showAnimations}
                  effect={showAnimations ? "energize" : "none"}
                  intensity={getIntensityLevel(buttonsIntensity)}
                  icon={<Cpu size={16} />}
                >
                  زر معدني
                </SpaceTechButton>
                
                <SpaceTechButton 
                  variant="stealth"
                  animated={showAnimations}
                  effect={showAnimations ? "pulse" : "none"}
                  intensity={getIntensityLevel(buttonsIntensity)}
                >
                  زر خفي
                </SpaceTechButton>
              </div>
              
              <div className="flex flex-col space-y-4">
                <SpaceTechButton 
                  variant="ghost"
                  animated={showAnimations}
                  effect={showAnimations ? "none" : "none"}
                  intensity={getIntensityLevel(buttonsIntensity)}
                >
                  زر شبح
                </SpaceTechButton>
                
                <SpaceTechButton 
                  variant="primary"
                  size="sm"
                  animated={showAnimations}
                  effect={showAnimations ? "scanline" : "none"}
                  intensity={getIntensityLevel(buttonsIntensity)}
                >
                  زر صغير
                </SpaceTechButton>
                
                <SpaceTechButton 
                  variant="primary"
                  size="lg"
                  animated={showAnimations}
                  effect={showAnimations ? "scanline" : "none"}
                  intensity={getIntensityLevel(buttonsIntensity)}
                  icon={<Star size={18} />}
                >
                  زر كبير
                </SpaceTechButton>
              </div>
            </div>

            <h2 className="text-xl font-bold text-white mb-6">حالات استخدام الأزرار</h2>
            <div className="space-card p-6 mb-6">
              <h3 className="text-[#39FF14] mb-4">شريط الإجراءات</h3>
              <div className="flex space-x-2 rtl:space-x-reverse">
                <SpaceTechButton 
                  variant="primary"
                  animated={showAnimations}
                  intensity={getIntensityLevel(buttonsIntensity)}
                  icon={<Rocket size={16} />}
                >
                  حجز الآن
                </SpaceTechButton>
                
                <SpaceTechButton 
                  variant="outline"
                  animated={showAnimations}
                  intensity={getIntensityLevel(buttonsIntensity)}
                  icon={<Mail size={16} />}
                >
                  تواصل معنا
                </SpaceTechButton>
                
                <SpaceTechButton 
                  variant="secondary"
                  animated={showAnimations}
                  intensity={getIntensityLevel(buttonsIntensity)}
                  icon={<Info size={16} />}
                >
                  معلومات
                </SpaceTechButton>
              </div>
            </div>
            
            <div className="space-card p-6">
              <h3 className="text-[#39FF14] mb-4">زر شاشة الترحيب</h3>
              <div className="flex justify-center">
                <SpaceTechButton 
                  variant="command"
                  size="xl"
                  animated={showAnimations}
                  effect={showAnimations ? "thruster" : "none"}
                  intensity={getIntensityLevel(buttonsIntensity)}
                  icon={<Star size={20} />}
                  withGlowEffect
                >
                  استكشف التجربة الفضائية
                </SpaceTechButton>
              </div>
            </div>
          </TabsContent>
          
          {/* قسم عرض البطاقات */}
          <TabsContent value="cards" className="p-6">
            <h2 className="text-xl font-bold text-white mb-6">أنماط البطاقات الهولوجرامية</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <SpaceHologramCard
                variant="primary"
                title="بطاقة رئيسية"
                subtitle="تصميم هولوجرامي متطور"
                intensity={getIntensityLevel(cardsIntensity)}
                animation={showAnimations ? "holographic" : "none"}
                showScanLine={showAnimations}
                showParticles={showAnimations}
                icon={<Rocket className="text-[#39FF14]" />}
                className="min-h-[200px]"
              >
                <p className="text-gray-300 mb-4">بطاقة بتصميم هولوجرامي مستوحى من الأفلام والألعاب الفضائية المستقبلية.</p>
                <SpaceTechButton variant="primary" size="sm" className="mt-auto">
                  عرض التفاصيل
                </SpaceTechButton>
              </SpaceHologramCard>
              
              <SpaceHologramCard
                variant="glass"
                title="بطاقة زجاجية"
                subtitle="تأثير الضبابية المتقدم"
                intensity={getIntensityLevel(cardsIntensity)}
                animation={showAnimations ? "pulse" : "none"}
                showScanLine={showAnimations}
                className="min-h-[200px]"
              >
                <p className="text-gray-300 mb-4">بطاقة بتأثير زجاجي شفاف مع ضبابية متطورة تعزز من جمالية الواجهة.</p>
                <SpaceTechButton variant="secondary" size="sm" className="mt-auto">
                  المزيد
                </SpaceTechButton>
              </SpaceHologramCard>
              
              <SpaceHologramCard
                variant="tech"
                title="بطاقة تقنية"
                subtitle="بيانات السفر الفضائي"
                intensity={getIntensityLevel(cardsIntensity)}
                animation={showAnimations ? "scan" : "none"}
                showScanLine={showAnimations}
                showGlitch={showAnimations}
                icon={<Cpu className="text-blue-400" />}
                className="min-h-[200px]"
              >
                <p className="text-gray-300 mb-4">بطاقة مخصصة لعرض البيانات التقنية والمعلومات الفضائية المتطورة.</p>
                <SpaceTechButton variant="hologram" size="sm" className="mt-auto">
                  تحميل البيانات
                </SpaceTechButton>
              </SpaceHologramCard>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <SpaceHologramCard
                variant="command"
                title="بطاقة قيادة فضائية"
                subtitle="لوحة تحكم المركبة"
                intensity={getIntensityLevel(cardsIntensity)}
                animation={showAnimations ? "float" : "none"}
                showScanLine={showAnimations}
                showCorners={showAnimations}
                icon={<CircleDot className="text-[#39FF14]" />}
                withHeaderAccent
                className="min-h-[250px]"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">حالة المحركات</span>
                    <span className="text-[#39FF14]">تعمل بكفاءة</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">مستوى الوقود</span>
                    <span className="text-amber-400">75%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">وقت الوصول المتوقع</span>
                    <span className="text-white">2:45 ساعة</span>
                  </div>
                </div>
              </SpaceHologramCard>
              
              <SpaceHologramCard
                variant="dark"
                title="بطاقة المهام"
                subtitle="إحصائيات الحجوزات"
                intensity={getIntensityLevel(cardsIntensity)}
                animation={showAnimations ? "none" : "none"}
                showScanLine={showAnimations}
                withHeaderAccent
                withHover3D
                icon={<Clock className="text-white" />}
                className="min-h-[250px]"
                footer={
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">تم التحديث قبل 5 دقائق</span>
                    <SpaceTechButton variant="ghost" size="sm">
                      تحديث
                    </SpaceTechButton>
                  </div>
                }
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">حجوزات اليوم</span>
                    <span className="text-white font-bold">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">إيرادات الأسبوع</span>
                    <span className="text-white font-bold">$12,450</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">معدل الإشغال</span>
                    <span className="text-[#39FF14] font-bold">87%</span>
                  </div>
                </div>
              </SpaceHologramCard>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-6">حالات استخدام البطاقات</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <SpaceHologramCard
                  key={i}
                  variant="primary"
                  animation={showAnimations ? "holographic" : "none"}
                  intensity={getIntensityLevel(cardsIntensity)}
                  showScanLine={showAnimations}
                  className="min-h-[180px]"
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded mb-3 flex items-center justify-center">
                    <Rocket className="text-[#39FF14] w-10 h-10 opacity-50" />
                  </div>
                  <h3 className="text-[#39FF14] font-bold">مسكن فضائي {i}</h3>
                  <p className="text-gray-400 text-sm mb-2">عطلة مثالية بين النجوم</p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-white font-bold">$1,{i}00 / الليلة</span>
                    <SpaceTechButton variant="outline" size="sm">
                      حجز
                    </SpaceTechButton>
                  </div>
                </SpaceHologramCard>
              ))}
            </div>
          </TabsContent>
          
          {/* قسم التأثيرات الخاصة */}
          <TabsContent value="effects" className="p-6">
            <h2 className="text-xl font-bold text-white mb-6">تأثيرات خاصة</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <SpaceHologramCard
                variant="primary"
                title="تأثيرات النجوم"
                intensity={getIntensityLevel(cardsIntensity)}
                className="min-h-[300px] flex flex-col"
              >
                <div className="flex-grow relative">
                  <div className="space-stars-bg">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className={`space-star ${Math.random() > 0.7 ? 'large' : ''} ${
                          Math.random() > 0.7 
                            ? Math.random() > 0.5 ? 'blue' : 'orange'
                            : ''
                        }`}
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 4}s`
                        }}
                      />
                    ))}
                    
                    {showAnimations && (
                      <motion.div 
                        className="space-shooting-star"
                        style={{
                          left: '10%',
                          top: '30%',
                          transform: 'rotate(45deg)',
                        }}
                        animate={{
                          left: ['10%', '100%'],
                          top: ['30%', '100%'],
                          opacity: [0, 1, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 5
                        }}
                      />
                    )}
                    
                    {showAnimations && (
                      <motion.div 
                        className="space-nebula"
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)'
                        }}
                      />
                    )}
                  </div>
                </div>
              </SpaceHologramCard>
              
              <SpaceHologramCard
                variant="tech"
                title="تأثيرات الدوائر الكهربائية"
                intensity={getIntensityLevel(cardsIntensity)}
                className="min-h-[300px] flex flex-col"
              >
                <div className="flex-grow relative overflow-hidden">
                  <div className="tech-grid absolute inset-0 opacity-20"></div>
                  <div className="tech-circuit absolute inset-0 opacity-30"></div>
                  
                  {showAnimations && (
                    <motion.div 
                      className="absolute h-[1px] bg-blue-400/70 left-0 right-0"
                      style={{ top: "30%" }}
                      animate={{
                        opacity: [0, 0.7, 0],
                        scaleX: [0, 1, 0],
                        left: ['0%', '0%', '100%']
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                    />
                  )}
                  
                  {showAnimations && Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="tech-data-flow"
                      style={{
                        left: `${10 + i * 20}%`,
                        top: 0,
                        bottom: 0,
                        animationDelay: `${i * 0.5}s`
                      }}
                    />
                  ))}
                </div>
              </SpaceHologramCard>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SpaceHologramCard
                variant="hologram"
                title="تأثيرات الهولوجرام"
                intensity={getIntensityLevel(cardsIntensity)}
                className="min-h-[300px] flex flex-col"
              >
                <div className="flex-grow relative">
                  {showAnimations && (
                    <div className="hologram-scan-line"></div>
                  )}
                  
                  <div className="hologram-element absolute inset-0 m-auto w-32 h-32 flex items-center justify-center text-[#39FF14]">
                    <div className="hologram-corner-accents">
                      <span></span>
                      <motion.div
                        animate={{
                          rotateY: [0, 360]
                        }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        style={{
                          transformStyle: "preserve-3d"
                        }}
                        className="text-5xl hologram-text animated"
                      >
                        X
                      </motion.div>
                    </div>
                  </div>
                </div>
              </SpaceHologramCard>
              
              <SpaceHologramCard
                variant="command"
                title="تأثيرات القيادة الفضائية"
                intensity={getIntensityLevel(cardsIntensity)}
                className="min-h-[300px] flex flex-col space-button-commander"
              >
                <div className="flex-grow relative flex items-center justify-center">
                  <div className="space-orbit w-40 h-40">
                    <motion.div 
                      className="absolute w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-full border border-[#39FF14]/50 flex items-center justify-center text-[#39FF14]"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <Rocket size={24} />
                    </motion.div>
                  </div>
                </div>
              </SpaceHologramCard>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}