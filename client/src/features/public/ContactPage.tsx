import React from "react";
import Layout from "@/components/layout/Layout";
import { Facebook, Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import TechBackground from "@/components/ui/tech-theme/TechBackground";

export default function ContactPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <TechBackground variant="matrix" className="rounded-2xl overflow-hidden mb-12 border border-[#39FF14]/20">
          <div className="relative py-16 px-6 sm:px-12 flex flex-col items-center text-center z-10">
            <div className="w-20 h-20 flex items-center justify-center rounded-full mb-8 bg-black/50 backdrop-blur-md border border-[#39FF14]/30 shadow-[0_0_15px_rgba(57,255,20,0.3)]">
              <MessageSquare size={40} className="text-[#39FF14]" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              تواصل <span className="text-[#39FF14] animate-pulse-subtle">معنا</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mb-8">
              نحن هنا للإجابة على جميع استفساراتك ومساعدتك في العثور على العقار المثالي لإقامتك القادمة
            </p>
          </div>
        </TechBackground>
        
        {/* معلومات الاتصال وخريطة الموقع */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* بطاقات معلومات الاتصال */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-black/40 backdrop-blur-md border border-[#39FF14]/20 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:border-[#39FF14]/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(57,255,20,0.2)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#39FF14]/10 border border-[#39FF14]/30">
                  <Phone size={20} className="text-[#39FF14]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">الهاتف</h3>
                  <p className="text-gray-300">+20 123 456 7890</p>
                </div>
              </div>
            </div>
            
            <div className="bg-black/40 backdrop-blur-md border border-[#39FF14]/20 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:border-[#39FF14]/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(57,255,20,0.2)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#39FF14]/10 border border-[#39FF14]/30">
                  <Mail size={20} className="text-[#39FF14]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">البريد الإلكتروني</h3>
                  <p className="text-gray-300">contact@stayx.com</p>
                </div>
              </div>
            </div>
            
            <div className="bg-black/40 backdrop-blur-md border border-[#39FF14]/20 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:border-[#39FF14]/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(57,255,20,0.2)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#39FF14]/10 border border-[#39FF14]/30">
                  <MapPin size={20} className="text-[#39FF14]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">العنوان</h3>
                  <p className="text-gray-300">القاهرة الجديدة، التجمع الخامس، مصر</p>
                </div>
              </div>
            </div>
            
            <div className="bg-black/40 backdrop-blur-md border border-[#39FF14]/20 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:border-[#39FF14]/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(57,255,20,0.2)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#39FF14]/10 border border-[#39FF14]/30">
                  <Facebook size={20} className="text-[#39FF14]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">وسائل التواصل الاجتماعي</h3>
                  <a 
                    href="https://www.facebook.com/share/1L5CCr1JVD/?mibextid=wwXIfr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#39FF14] hover:underline"
                  >
                    StayX Egypt
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* نموذج الاتصال */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 backdrop-blur-md border border-[#39FF14]/20 rounded-xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.2)] h-full">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <MessageSquare size={20} className="text-[#39FF14]" />
                أرسل لنا رسالة
              </h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">الاسم</label>
                    <input
                      type="text"
                      id="name"
                      className="block w-full rounded-lg bg-gray-900/50 border border-gray-600 py-3 px-4 text-white focus:border-[#39FF14] focus:ring-[#39FF14] focus:outline-none focus:ring-1 transition-colors"
                      placeholder="أدخل اسمك"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">البريد الإلكتروني</label>
                    <input
                      type="email"
                      id="email"
                      className="block w-full rounded-lg bg-gray-900/50 border border-gray-600 py-3 px-4 text-white focus:border-[#39FF14] focus:ring-[#39FF14] focus:outline-none focus:ring-1 transition-colors"
                      placeholder="أدخل بريدك الإلكتروني"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">الموضوع</label>
                  <input
                    type="text"
                    id="subject"
                    className="block w-full rounded-lg bg-gray-900/50 border border-gray-600 py-3 px-4 text-white focus:border-[#39FF14] focus:ring-[#39FF14] focus:outline-none focus:ring-1 transition-colors"
                    placeholder="ما موضوع رسالتك؟"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">الرسالة</label>
                  <textarea
                    id="message"
                    rows={6}
                    className="block w-full rounded-lg bg-gray-900/50 border border-gray-600 py-3 px-4 text-white focus:border-[#39FF14] focus:ring-[#39FF14] focus:outline-none focus:ring-1 transition-colors"
                    placeholder="اكتب رسالتك هنا..."
                  ></textarea>
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="inline-flex justify-center items-center gap-2 rounded-lg bg-[#39FF14] px-8 py-3 text-black font-medium hover:bg-[#39FF14]/90 focus:outline-none focus:ring-2 focus:ring-[#39FF14]/50 transition-all duration-300 shadow-[0_0_10px_rgba(57,255,20,0.5)]"
                  >
                    <Mail size={18} />
                    إرسال الرسالة
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* ساعات العمل */}
        <div className="mb-12">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#39FF14]/10 border border-[#39FF14]/30 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#39FF14]">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">ساعات العمل</h2>
          </div>
          
          <div className="bg-black/40 backdrop-blur-md border border-[#39FF14]/20 rounded-xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-r border-[#39FF14]/20 pr-4">
                <h3 className="text-xl font-bold text-white mb-3">مكتب القاهرة</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex justify-between">
                    <span>السبت - الخميس:</span>
                    <span>9:00 ص - 5:00 م</span>
                  </li>
                  <li className="flex justify-between">
                    <span>الجمعة:</span>
                    <span>مغلق</span>
                  </li>
                </ul>
              </div>
              
              <div className="border-r border-[#39FF14]/20 pr-4">
                <h3 className="text-xl font-bold text-white mb-3">مكتب الساحل الشمالي</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex justify-between">
                    <span>يوميًا:</span>
                    <span>10:00 ص - 8:00 م</span>
                  </li>
                  <li className="flex justify-between">
                    <span>خلال موسم الصيف</span>
                    <span></span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-3">دعم العملاء</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex justify-between">
                    <span>الهاتف:</span>
                    <span>24/7 متاح</span>
                  </li>
                  <li className="flex justify-between">
                    <span>البريد الإلكتروني:</span>
                    <span>24/7 متاح</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* خريطة الموقع (محاكاة) */}
        <TechBackground variant="cyber" className="rounded-2xl overflow-hidden border border-[#39FF14]/20">
          <div className="relative h-96 z-10">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-[#39FF14]/20 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-16 h-16 bg-[#39FF14]/30 rounded-full animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 bg-[#39FF14]/50 rounded-full animate-pulse flex items-center justify-center">
                    <MapPin size={20} className="text-[#39FF14]" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* أنماط الشبكة المحاكاة للخريطة */}
            <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
            
            {/* خطوط وهمية للخريطة */}
            <div className="absolute inset-0">
              <div className="h-px w-full bg-[#39FF14]/10 absolute top-1/4"></div>
              <div className="h-px w-full bg-[#39FF14]/10 absolute top-2/4"></div>
              <div className="h-px w-full bg-[#39FF14]/10 absolute top-3/4"></div>
              <div className="w-px h-full bg-[#39FF14]/10 absolute left-1/4"></div>
              <div className="w-px h-full bg-[#39FF14]/10 absolute left-2/4"></div>
              <div className="w-px h-full bg-[#39FF14]/10 absolute left-3/4"></div>
            </div>
            
            {/* كلمة خريطة تفاعلية */}
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-lg border border-[#39FF14]/30 text-[#39FF14] text-sm">
              تفتح خريطة تفاعلية عند النقر
            </div>
          </div>
        </TechBackground>
      </div>
    </Layout>
  );
}