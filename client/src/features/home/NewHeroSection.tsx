import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import { ArrowRight, Building, Shield, Clock, Star, ChevronDown } from "lucide-react";

export default function NewHeroSection() {
  return (
    <div className="min-h-screen text-white relative overflow-hidden flex flex-col">
      
      <div className="relative z-10 container mx-auto px-4 py-6 sm:py-8 flex flex-col min-h-screen">
        {/* Header with Logo - Improved Mobile View */}
        <div className="flex justify-between items-center">
          <div className="z-20">
            <Logo size="sm" variant="light" withText withAnimation />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="z-20"
          >
            <Button 
              variant="outline"
              size="sm"
              className="text-white border-gray-700 hover:text-[#39FF14] hover:bg-gray-900/60 backdrop-blur-sm hover:border-[#39FF14]/50"
              asChild
            >
              <Link href="/auth">تسجيل الدخول</Link>
            </Button>
          </motion.div>
        </div>
        
        {/* Main hero content - Responsive Redesign */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between flex-1 py-6 md:py-8">
          {/* Left side: Text content - Mobile First Design */}
          <motion.div
            className="w-full md:w-1/2 text-center md:text-right space-y-5 sm:space-y-6 mt-8 md:mt-0 md:pr-8"
            initial={{ opacity: 0, y: 20, x: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="text-white">استكشف</span>
              <span className="md:hidden">
                <br />
              </span>
              <span className="hidden md:inline"> </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-white">
                العقارات الفاخرة
              </span>
              <span className="text-[#39FF14]">.</span>
            </h1>
            
            <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto md:mx-0 md:max-w-lg font-tajawal leading-relaxed">
              بوابتك للإقامة الفاخرة في الساحل الشمالي وراس الحكمة بخدمة تقنية متطورة وتجربة فريدة
            </p>
            
            {/* Feature Badges - Improved for Mobile */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 sm:gap-6 md:gap-8 pt-3 md:pt-4">
              <motion.div 
                className="flex items-center gap-2 bg-gray-900/60 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-800"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <span className="text-[#39FF14]"><Building size={18} /></span>
                <span className="text-gray-300 text-sm">+٥٠ عقار فاخر</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-2 bg-gray-900/60 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-800"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <span className="text-[#39FF14]"><Shield size={18} /></span>
                <span className="text-gray-300 text-sm">ضمان الجودة ١٠٠٪</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-2 bg-gray-900/60 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-800"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <span className="text-[#39FF14]"><Clock size={18} /></span>
                <span className="text-gray-300 text-sm">دعم فني ٢٤/٧</span>
              </motion.div>
            </div>
            
            {/* CTA Button - Redesigned for Better Visibility */}
            <div className="pt-6 md:pt-8">
              <Button
                className="h-12 sm:h-14 px-6 sm:px-8 bg-[#39FF14] text-black border-none shadow-lg shadow-[#39FF14]/20 hover:bg-[#45ff25] hover:shadow-[#39FF14]/30 group relative overflow-hidden"
                asChild
              >
                <Link href="/properties">
                  <span className="flex items-center gap-2 z-10 relative font-tajawal font-bold">
                    استكشف العقارات الآن
                    <ArrowRight size={18} className="rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </span>
                  <span className="absolute inset-0 w-0 bg-white opacity-20 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </Button>
            </div>
            
            {/* Mobile Only: Scroll Down Indicator */}
            <motion.div 
              className="pt-8 pb-2 flex justify-center md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <div className="flex flex-col items-center">
                <span className="text-gray-500 text-xs mb-1">اكتشف المزيد</span>
                <ChevronDown size={20} className="text-[#39FF14] animate-bounce" />
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right side: Property Preview - Now Visible on Mobile */}
          <motion.div
            className="w-full md:w-1/2 flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              {/* Main image frame - Adjusted for Mobile */}
              <div className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[340px] md:h-[340px] lg:w-[380px] lg:h-[380px] relative z-10 rounded-2xl shadow-2xl overflow-hidden border border-gray-800 bg-gradient-to-br from-gray-900 to-black">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-800 to-transparent opacity-30 rounded-2xl"></div>
                
                {/* Content grid - Simplified for Mobile */}
                <div className="p-3 h-full">
                  <div className="grid grid-cols-2 grid-rows-2 gap-3 h-full">
                    <div className="col-span-2 row-span-1 bg-gray-800 rounded-xl overflow-hidden relative group">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/80 z-10"></div>
                      <div className="absolute top-3 left-3 z-20 flex items-center space-x-1">
                        <div className="flex items-center bg-black/40 px-2 py-1 rounded-lg text-xs backdrop-blur-sm">
                          <Star size={12} className="text-yellow-400 mr-1" />
                          <span className="text-white">4.9</span>
                        </div>
                      </div>
                      <div className="absolute bottom-3 right-3 z-20 text-right">
                        <div className="text-sm text-gray-300">فيلا الساحل</div>
                        <div className="text-sm text-[#39FF14] font-bold">$350 / ليلة</div>
                      </div>
                      <div className="absolute inset-0 bg-[#39FF14]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-xl overflow-hidden relative group">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/80 z-10"></div>
                      <div className="absolute bottom-3 right-3 z-20 text-right">
                        <div className="text-xs text-gray-300">شاليه لوسيندا</div>
                      </div>
                      <div className="absolute inset-0 bg-[#39FF14]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-xl overflow-hidden relative group">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/80 z-10"></div>
                      <div className="absolute bottom-3 right-3 z-20 text-right">
                        <div className="text-xs text-gray-300">بيتش هاوس</div>
                      </div>
                      <div className="absolute inset-0 bg-[#39FF14]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements - Enhanced for Visual Impact */}
              <div className="absolute top-[-15px] right-[-15px] w-[80px] sm:w-[120px] h-[80px] sm:h-[120px] border border-gray-800/50 rounded-full"></div>
              <div className="absolute bottom-[-25px] left-[-25px] w-[120px] sm:w-[180px] h-[120px] sm:h-[180px] border border-[#39FF14]/10 rounded-full"></div>
              <div className="absolute top-[50%] left-[-20px] sm:left-[-40px] w-[10px] sm:w-[15px] h-[10px] sm:h-[15px] bg-[#39FF14] rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute top-[60%] right-[-15px] sm:right-[-20px] w-[6px] sm:w-[8px] h-[6px] sm:h-[8px] bg-white rounded-full opacity-20"></div>
              
              {/* Tech-style scan line overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(57, 255, 20, 0.2) 2px, transparent 4px)',
                  backgroundSize: '100% 4px',
                }}></div>
              
              {/* Accent line */}
              <motion.div 
                className="absolute top-[40px] right-[20px] h-[1px] bg-gradient-to-r from-[#39FF14]/20 to-transparent"
                initial={{ width: 0 }}
                animate={{ width: "150px" }}
                transition={{ duration: 1.2, delay: 0.6 }}
              />
            </div>
          </motion.div>
        </div>
        
        {/* Footer - Minimized for Mobile */}
        <div className="pb-2 md:pb-4 text-center hidden md:block">
          <motion.p 
            className="text-gray-600 text-xs md:text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            StayX © {new Date().getFullYear()} - بوابة الإقامة الفاخرة
          </motion.p>
        </div>
      </div>
    </div>
  );
}