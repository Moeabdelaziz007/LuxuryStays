import React from "react";
import Layout from "@/components/layout/Layout";
import { Facebook, Mail, Phone, MapPin, Star, Shield, Zap, Users } from "lucide-react";
import TechBackground from "@/components/ui/tech-theme/TechBackground";

export default function AboutUs() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <TechBackground variant="cyber" className="rounded-2xl overflow-hidden mb-12 border border-[#39FF14]/20">
          <div className="relative py-16 px-6 sm:px-12 flex flex-col items-center text-center z-10">
            <div className="w-24 h-24 flex items-center justify-center rounded-full mb-8 bg-black/50 backdrop-blur-md border border-[#39FF14]/30 shadow-[0_0_15px_rgba(57,255,20,0.3)]">
              <span className="text-4xl font-bold">
                <span className="text-[#39FF14]">Stay</span>
                <span className="text-white">X</span>
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              عن <span className="text-[#39FF14] animate-pulse-subtle">StayX</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mb-8">
              منصة حديثة للحجوزات الفاخرة للإيجارات الصيفية والخدمات الرقمية المتميزة في الساحل الشمالي ورأس الحكمة بمصر
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <a 
                href="https://www.facebook.com/share/1L5CCr1JVD/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-black/40 backdrop-blur-sm border border-[#39FF14]/30 rounded-full text-white hover:bg-black/60 hover:border-[#39FF14]/70 transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.3)]"
              >
                <Facebook size={20} className="text-[#39FF14]" />
                <span>تابعنا على فيسبوك</span>
              </a>
              
              <a 
                href="mailto:contact@stayx.com" 
                className="flex items-center gap-2 px-6 py-3 bg-black/40 backdrop-blur-sm border border-[#39FF14]/30 rounded-full text-white hover:bg-black/60 hover:border-[#39FF14]/70 transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.3)]"
              >
                <Mail size={20} className="text-[#39FF14]" />
                <span>تواصل معنا</span>
              </a>
            </div>
          </div>
        </TechBackground>
        
        {/* مهمتنا */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#39FF14]/10 border border-[#39FF14]/30 mr-4">
              <Star size={24} className="text-[#39FF14]" />
            </div>
            <h2 className="text-3xl font-bold text-white">مهمتنا</h2>
          </div>
          
          <div className="bg-black/40 backdrop-blur-md border border-[#39FF14]/20 rounded-xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.2)] relative overflow-hidden">
            {/* زخرفة الخلفية */}
            <div className="absolute top-0 right-0 w-40 h-40 opacity-10 pointer-events-none">
              <div className="w-full h-full bg-grid-pattern"></div>
            </div>
            
            <p className="text-xl text-gray-200 leading-relaxed">
              نسعى في StayX إلى إحداث ثورة في صناعة الإقامات الفاخرة في الساحل الشمالي المصري ورأس الحكمة من خلال توفير منصة رقمية متكاملة تتيح للمستخدمين اكتشاف وحجز أفخم العقارات والشاليهات بسهولة وأمان.
            </p>
            <p className="text-xl text-gray-200 leading-relaxed mt-4">
              هدفنا هو تحويل تجربة حجز العقارات الصيفية من عملية معقدة إلى تجربة سلسة وممتعة، مع توفير خدمات إضافية حصرية تجعل الإقامة لا تُنسى للأفراد والعائلات.
            </p>
          </div>
        </div>
        
        {/* ما يميزنا */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#39FF14]/10 border border-[#39FF14]/30 mr-4">
              <Zap size={24} className="text-[#39FF14]" />
            </div>
            <h2 className="text-3xl font-bold text-white">ما يميزنا</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/40 backdrop-blur-sm border border-[#39FF14]/20 rounded-xl p-6 hover:border-[#39FF14]/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(57,255,20,0.2)] relative group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#39FF14]/10 border border-[#39FF14]/30 mb-4 group-hover:bg-[#39FF14]/20 transition-colors">
                <Shield size={24} className="text-[#39FF14]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">ضمان جودة العقارات</h3>
              <p className="text-gray-300">
                جميع العقارات على منصتنا تخضع لعملية تحقق دقيقة للتأكد من مطابقتها لمعايير الجودة والفخامة التي يتوقعها عملاؤنا.
              </p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-sm border border-[#39FF14]/20 rounded-xl p-6 hover:border-[#39FF14]/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(57,255,20,0.2)] relative group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#39FF14]/10 border border-[#39FF14]/30 mb-4 group-hover:bg-[#39FF14]/20 transition-colors">
                <Zap size={24} className="text-[#39FF14]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">خدمات حصرية</h3>
              <p className="text-gray-300">
                نقدم خدمات إضافية حصرية مثل حجز المطاعم الفاخرة والنوادي الليلية وخدمات السبا وتأجير اليخوت لجعل تجربة الإقامة استثنائية.
              </p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-sm border border-[#39FF14]/20 rounded-xl p-6 hover:border-[#39FF14]/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(57,255,20,0.2)] relative group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#39FF14]/10 border border-[#39FF14]/30 mb-4 group-hover:bg-[#39FF14]/20 transition-colors">
                <Users size={24} className="text-[#39FF14]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">دعم العملاء المتميز</h3>
              <p className="text-gray-300">
                فريق دعم متخصص متاح على مدار الساعة لتقديم المساعدة وحل أي مشكلات قد تواجه العملاء قبل وأثناء وبعد الإقامة.
              </p>
            </div>
          </div>
        </div>
        
        {/* فريقنا */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#39FF14]/10 border border-[#39FF14]/30 mr-4">
              <Users size={24} className="text-[#39FF14]" />
            </div>
            <h2 className="text-3xl font-bold text-white">فريقنا</h2>
          </div>
          
          <div className="bg-black/40 backdrop-blur-md border border-[#39FF14]/20 rounded-xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
            <p className="text-xl text-gray-200 leading-relaxed mb-4">
              يتكون فريق StayX من نخبة من المتخصصين في مجالات التكنولوجيا والضيافة الفاخرة وإدارة العقارات، بخبرات متنوعة تمتد لأكثر من 15 عامًا في السوق المصري.
            </p>
            <p className="text-xl text-gray-200 leading-relaxed">
              يعمل الفريق بشغف لتقديم خدمة استثنائية وتجربة لا تضاهى لكل من مالكي العقارات والضيوف، مع التركيز على الابتكار المستمر وتحسين المنصة.
            </p>
          </div>
        </div>
        
        {/* تواصل معنا */}
        <TechBackground variant="matrix" className="rounded-2xl overflow-hidden border border-[#39FF14]/20">
          <div className="relative py-12 px-6 sm:px-12 z-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">تواصل معنا</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/70 backdrop-blur-xl border border-[#39FF14]/30 rounded-xl p-6 hover:border-[#39FF14]/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(57,255,20,0.2)]">
                  <div className="flex items-center mb-4">
                    <Phone size={24} className="text-[#39FF14] mr-3" />
                    <div>
                      <h3 className="text-xl font-bold text-white">الهاتف</h3>
                      <p className="text-gray-300">+20 123 456 7890</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <Mail size={24} className="text-[#39FF14] mr-3" />
                    <div>
                      <h3 className="text-xl font-bold text-white">البريد الإلكتروني</h3>
                      <p className="text-gray-300">contact@stayx.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin size={24} className="text-[#39FF14] mr-3" />
                    <div>
                      <h3 className="text-xl font-bold text-white">العنوان</h3>
                      <p className="text-gray-300">القاهرة الجديدة، التجمع الخامس، مصر</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/70 backdrop-blur-xl border border-[#39FF14]/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">تابعنا على وسائل التواصل الاجتماعي</h3>
                  
                  <div className="space-y-4">
                    <a 
                      href="https://www.facebook.com/share/1L5CCr1JVD/?mibextid=wwXIfr" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-[#39FF14]/10 hover:bg-[#39FF14]/20 rounded-lg transition-colors text-white"
                    >
                      <Facebook size={20} className="text-[#39FF14]" />
                      <span>StayX Egypt</span>
                    </a>
                    
                    <a 
                      href="#" 
                      className="flex items-center gap-3 p-3 bg-[#39FF14]/10 hover:bg-[#39FF14]/20 rounded-lg transition-colors text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#39FF14]">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                      <span>@stayx.egypt</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TechBackground>
      </div>
    </Layout>
  );
}