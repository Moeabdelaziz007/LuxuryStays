import React from "react";
import Layout from "@/components/layout/Layout";
import { Mail, Phone, MapPin, Star, Shield, Zap, Users, ChevronRight, Trophy, Clock, Cpu } from "lucide-react";
import TechBackground from "@/components/ui/tech-theme/TechBackground";

/**
 * صفحة من نحن - تعرض معلومات عن الشركة ورؤيتها وفريقها
 * تم تحسينها لتكون أكثر جاذبية وتفاعلية
 */
export default function AboutUs() {
  // بيانات أعضاء الفريق
  const teamMembers = [
    {
      name: "أحمد محمود",
      role: "المؤسس والرئيس التنفيذي",
      bio: "خبرة 15 عامًا في مجال التكنولوجيا والعقارات الفاخرة",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1470&auto=format&fit=crop"
    },
    {
      name: "سارة علي",
      role: "مديرة التسويق",
      bio: "متخصصة في تسويق العقارات الفاخرة والتجارب الرقمية",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1376&auto=format&fit=crop"
    },
    {
      name: "عمر خالد",
      role: "رئيس قسم التكنولوجيا",
      bio: "مهندس برمجيات بخبرة 10 سنوات في تطوير المنصات الإلكترونية",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop"
    }
  ];

  // التكنولوجيا المستخدمة
  const technologies = [
    { name: "الذكاء الاصطناعي", icon: <Cpu className="text-[#39FF14]" /> },
    { name: "تحليل البيانات المتقدم", icon: <Zap className="text-[#39FF14]" /> },
    { name: "تقنية التعلم الآلي", icon: <Star className="text-[#39FF14]" /> },
    { name: "المدفوعات الآمنة", icon: <Shield className="text-[#39FF14]" /> }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* قسم البداية المميز */}
        <TechBackground variant="cyber" className="rounded-2xl overflow-hidden mb-16 border border-[#39FF14]/20">
          <div className="relative py-20 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between z-10 gap-10">
            <div className="md:w-1/2">
              <div className="mb-6 inline-block">
                <div className="bg-black/50 backdrop-blur-md border border-[#39FF14]/30 px-4 py-1 rounded-full text-sm text-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.3)]">
                  تجربة فريدة من نوعها
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                نقدم تجربة <span className="text-[#39FF14] inline-block relative">
                  فاخرة
                  <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#39FF14] rounded-full shadow-[0_0_5px_#39FF14]"></div>
                </span> في عالم <span className="text-[#39FF14]">رقمي</span>
              </h1>
              
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                منذ عام 2022، نقدم خدمات رقمية مبتكرة تغير مفهوم الإقامات الفاخرة في مصر، من خلال الجمع بين التكنولوجيا المتطورة والتجارب الاستثنائية.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a 
                  href="mailto:contact@stayx.com" 
                  className="flex items-center gap-2 px-6 py-3 bg-[#39FF14] text-black font-medium rounded-full hover:bg-[#39FF14]/80 transition-all duration-300 shadow-[0_0_10px_rgba(57,255,20,0.5)]"
                >
                  <Mail size={18} />
                  <span>تواصل معنا</span>
                </a>
                
                <a 
                  href="#our-team" 
                  className="flex items-center gap-2 px-6 py-3 bg-black/40 backdrop-blur-sm border border-[#39FF14]/30 rounded-full text-white hover:bg-black/60 hover:border-[#39FF14]/70 transition-all duration-300"
                >
                  <span>تعرف على فريقنا</span>
                  <ChevronRight size={18} className="text-[#39FF14]" />
                </a>
              </div>
            </div>

            {/* إحصائيات مميزة */}
            <div className="md:w-1/2 max-w-md">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/50 backdrop-blur-md border border-[#39FF14]/30 rounded-xl p-6 hover:shadow-[0_0_20px_rgba(57,255,20,0.2)] transition-all duration-500 hover:border-[#39FF14]/50 group">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1 group-hover:text-[#39FF14] transition-colors">+500</div>
                  <div className="text-gray-400">عقار فاخر</div>
                </div>
                <div className="bg-black/50 backdrop-blur-md border border-[#39FF14]/30 rounded-xl p-6 hover:shadow-[0_0_20px_rgba(57,255,20,0.2)] transition-all duration-500 hover:border-[#39FF14]/50 group">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1 group-hover:text-[#39FF14] transition-colors">+5000</div>
                  <div className="text-gray-400">عميل سعيد</div>
                </div>
                <div className="bg-black/50 backdrop-blur-md border border-[#39FF14]/30 rounded-xl p-6 hover:shadow-[0_0_20px_rgba(57,255,20,0.2)] transition-all duration-500 hover:border-[#39FF14]/50 group">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1 group-hover:text-[#39FF14] transition-colors">+30</div>
                  <div className="text-gray-400">شريك خدمي</div>
                </div>
                <div className="bg-black/50 backdrop-blur-md border border-[#39FF14]/30 rounded-xl p-6 hover:shadow-[0_0_20px_rgba(57,255,20,0.2)] transition-all duration-500 hover:border-[#39FF14]/50 group">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1 group-hover:text-[#39FF14] transition-colors">24/7</div>
                  <div className="text-gray-400">دعم متواصل</div>
                </div>
              </div>
            </div>
          </div>
        </TechBackground>
        
        {/* رؤيتنا ومهمتنا - تصميم جديد */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-gray-900/70 to-black/70 backdrop-blur-md border border-[#39FF14]/20 rounded-xl p-8 relative overflow-hidden group">
            {/* زخرفة */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#39FF14]/5 rounded-full blur-3xl group-hover:bg-[#39FF14]/10 transition-all duration-700"></div>
            
            <div className="relative">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-black border border-[#39FF14]/30 mb-6 group-hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all duration-500">
                <Trophy size={28} className="text-[#39FF14]" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center">
                رؤيتنا
                <div className="h-px w-20 bg-gradient-to-r from-[#39FF14] to-transparent ml-3"></div>
              </h2>
              
              <p className="text-gray-300 leading-relaxed mb-4">
                نسعى لنكون الوجهة الرقمية الرائدة في مصر والشرق الأوسط للإقامات الفاخرة، من خلال تقديم تجربة استثنائية تجمع بين:
              </p>
              
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 mt-1 text-[#39FF14]">◉</div>
                  <span className="text-gray-200">الراحة والفخامة في اختيار وحجز العقارات</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 text-[#39FF14]">◉</div>
                  <span className="text-gray-200">الشفافية والأمان في إتمام المعاملات</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 text-[#39FF14]">◉</div>
                  <span className="text-gray-200">الاستفادة الكاملة من التكنولوجيا الحديثة</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900/70 to-black/70 backdrop-blur-md border border-[#39FF14]/20 rounded-xl p-8 relative overflow-hidden group">
            {/* زخرفة */}
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#39FF14]/5 rounded-full blur-3xl group-hover:bg-[#39FF14]/10 transition-all duration-700"></div>
            
            <div className="relative">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-black border border-[#39FF14]/30 mb-6 group-hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all duration-500">
                <Star size={28} className="text-[#39FF14]" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center">
                مهمتنا
                <div className="h-px w-20 bg-gradient-to-r from-[#39FF14] to-transparent ml-3"></div>
              </h2>
              
              <p className="text-gray-300 leading-relaxed mb-6">
                تطوير وتقديم منصة رقمية متكاملة تحدث ثورة في صناعة الإقامات الفاخرة في الساحل الشمالي المصري وراس الحكمة، من خلال:
              </p>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center bg-black/40 p-3 rounded-lg border border-[#39FF14]/10 group-hover:border-[#39FF14]/30 transition-all">
                  <Clock size={20} className="text-[#39FF14] mr-3" />
                  <span className="text-gray-200">تبسيط عملية البحث والحجز وتوفير وقت العملاء</span>
                </div>
                <div className="flex items-center bg-black/40 p-3 rounded-lg border border-[#39FF14]/10 group-hover:border-[#39FF14]/30 transition-all">
                  <Shield size={20} className="text-[#39FF14] mr-3" />
                  <span className="text-gray-200">ضمان جودة العقارات وتطابقها مع توقعات العملاء</span>
                </div>
                <div className="flex items-center bg-black/40 p-3 rounded-lg border border-[#39FF14]/10 group-hover:border-[#39FF14]/30 transition-all">
                  <Zap size={20} className="text-[#39FF14] mr-3" />
                  <span className="text-gray-200">توفير خدمات إضافية تثري تجربة الإقامة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* ما يميزنا - تصميم محسن */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4 inline-block relative">
              ما يميزنا
              <div className="absolute -bottom-2 left-1/4 right-1/4 h-0.5 bg-[#39FF14] rounded-full shadow-[0_0_5px_#39FF14]"></div>
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              نجمع بين التكنولوجيا المتطورة وفهم احتياجات العملاء لتقديم تجربة استثنائية
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/40 backdrop-blur-sm border border-[#39FF14]/20 rounded-xl p-6 hover:border-[#39FF14]/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(57,255,20,0.2)] relative group">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#39FF14]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#39FF14]/10 border border-[#39FF14]/30 mb-4 group-hover:bg-[#39FF14]/20 transition-colors">
                  <Shield size={24} className="text-[#39FF14]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">ضمان جودة العقارات</h3>
                <p className="text-gray-300">
                  جميع العقارات على منصتنا تخضع لعملية تحقق دقيقة للتأكد من مطابقتها لمعايير الجودة والفخامة.
                </p>
              </div>
            </div>
            
            <div className="bg-black/40 backdrop-blur-sm border border-[#39FF14]/20 rounded-xl p-6 hover:border-[#39FF14]/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(57,255,20,0.2)] relative group">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#39FF14]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#39FF14]/10 border border-[#39FF14]/30 mb-4 group-hover:bg-[#39FF14]/20 transition-colors">
                  <Zap size={24} className="text-[#39FF14]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">خدمات حصرية</h3>
                <p className="text-gray-300">
                  نقدم خدمات إضافية حصرية مثل حجز المطاعم الفاخرة والنوادي الليلية وخدمات السبا وتأجير اليخوت.
                </p>
              </div>
            </div>
            
            <div className="bg-black/40 backdrop-blur-sm border border-[#39FF14]/20 rounded-xl p-6 hover:border-[#39FF14]/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(57,255,20,0.2)] relative group">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#39FF14]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#39FF14]/10 border border-[#39FF14]/30 mb-4 group-hover:bg-[#39FF14]/20 transition-colors">
                  <Users size={24} className="text-[#39FF14]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">دعم العملاء المتميز</h3>
                <p className="text-gray-300">
                  فريق دعم متخصص متاح على مدار الساعة لتقديم المساعدة وحل أي مشكلات قبل وأثناء وبعد الإقامة.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* فريقنا - قسم جديد ومحسن */}
        <div id="our-team" className="mb-16 scroll-mt-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4 inline-block relative">
              فريقنا المتميز
              <div className="absolute -bottom-2 left-1/4 right-1/4 h-0.5 bg-[#39FF14] rounded-full shadow-[0_0_5px_#39FF14]"></div>
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              يتكون فريق StayX من نخبة من المتخصصين في مجالات التكنولوجيا والضيافة الفاخرة وإدارة العقارات
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-black/40 backdrop-blur-sm border border-[#39FF14]/20 rounded-xl overflow-hidden hover:border-[#39FF14]/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(57,255,20,0.2)] group">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-[#39FF14] text-sm mb-3">{member.role}</p>
                  <p className="text-gray-300 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* التكنولوجيا - قسم جديد */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-[#39FF14]/10 to-transparent backdrop-blur-sm border border-[#39FF14]/20 rounded-xl p-8 relative overflow-hidden">
            <div className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-[#39FF14]/20 blur-3xl"></div>
            <div className="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-[#39FF14]/20 blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
                تقنيات متطورة تدعم خدماتنا
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {technologies.map((tech, index) => (
                  <div key={index} className="flex flex-col items-center text-center bg-black/60 p-4 rounded-xl border border-[#39FF14]/30 hover:border-[#39FF14]/70 transition-all group">
                    <div className="w-16 h-16 flex items-center justify-center bg-[#39FF14]/10 rounded-full mb-3 group-hover:bg-[#39FF14]/20 transition-colors">
                      {tech.icon}
                    </div>
                    <span className="text-white group-hover:text-[#39FF14] transition-colors">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* معلومات الاتصال */}
        <TechBackground variant="matrix" className="rounded-2xl overflow-hidden border border-[#39FF14]/20">
          <div className="relative py-12 px-6 sm:px-12 z-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">تواصل معنا</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/70 backdrop-blur-xl border border-[#39FF14]/30 rounded-xl p-6 hover:border-[#39FF14]/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(57,255,20,0.2)] text-center group">
                  <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-[#39FF14]/10 border border-[#39FF14]/30 mb-4 group-hover:bg-[#39FF14]/20 transition-colors">
                    <Phone size={24} className="text-[#39FF14]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">الهاتف</h3>
                  <p className="text-gray-300">+20 123 456 7890</p>
                </div>
                
                <div className="bg-black/70 backdrop-blur-xl border border-[#39FF14]/30 rounded-xl p-6 hover:border-[#39FF14]/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(57,255,20,0.2)] text-center group">
                  <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-[#39FF14]/10 border border-[#39FF14]/30 mb-4 group-hover:bg-[#39FF14]/20 transition-colors">
                    <Mail size={24} className="text-[#39FF14]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">البريد الإلكتروني</h3>
                  <p className="text-gray-300">contact@stayx.com</p>
                </div>
                
                <div className="bg-black/70 backdrop-blur-xl border border-[#39FF14]/30 rounded-xl p-6 hover:border-[#39FF14]/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(57,255,20,0.2)] text-center group">
                  <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-[#39FF14]/10 border border-[#39FF14]/30 mb-4 group-hover:bg-[#39FF14]/20 transition-colors">
                    <MapPin size={24} className="text-[#39FF14]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">العنوان</h3>
                  <p className="text-gray-300">القاهرة الجديدة، التجمع الخامس، مصر</p>
                </div>
              </div>
            </div>
          </div>
        </TechBackground>
      </div>
    </Layout>
  );
}