import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import { ArrowRight, Building, Shield, Clock } from "lucide-react";

export default function NewHeroSection() {
  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden flex flex-col">
      {/* Subtle background elements */}
      <div className="absolute inset-0 z-0">
        {/* Deep space gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-gray-900"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMCAzaDR2MWgtNHYtMXptMCAzaDR2MWgtNHYtMXptLTYtNmg0djFoLTR2LTF6bTAgM2g0djFoLTR2LTF6bTAgM2g0djFoLTR2LTF6bS02LTZoNHYxaC00di0xem0wIDNoNHYxaC00di0xem0wIDNoNHYxaC00di0xem0wLTl2MWgtM1YzMWgzem0wIDNoLTN2MWgzdi0xem0wIDNoLTN2MWgzdi0xeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
      </div>
      
      {/* Accent elements */}
      <motion.div 
        className="absolute top-[25%] left-[20%] w-40 h-40 bg-[#39FF14] rounded-full opacity-[0.02] blur-[100px]"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.02, 0.03, 0.02]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          easings: ["easeInOut"],
        }}
      />
      
      <motion.div 
        className="absolute bottom-[10%] right-[15%] w-60 h-60 bg-white rounded-full opacity-[0.01] blur-[100px]"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.01, 0.02, 0.01]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          easings: ["easeInOut"],
          delay: 2
        }}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col h-screen">
        {/* Header with Logo */}
        <div className="flex justify-between items-center">
          <Logo size="md" variant="light" withText withAnimation />
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Button 
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-gray-900"
              asChild
            >
              <Link href="/auth">تسجيل الدخول</Link>
            </Button>
          </motion.div>
        </div>
        
        {/* Main hero content */}
        <div className="flex flex-col md:flex-row items-center justify-between flex-1 py-12">
          {/* Left side: Text content */}
          <motion.div
            className="w-full md:w-1/2 text-right md:pr-8 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="text-white">استكشف</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-white">
                العقارات الفاخرة
              </span>
              <span className="text-[#39FF14]">.</span>
            </h1>
            
            <p className="text-gray-400 text-lg max-w-lg font-tajawal leading-relaxed">
              بوابتك للإقامة الفاخرة في الساحل الشمالي وراس الحكمة بخدمة تقنية متطورة وتجربة فريدة
            </p>
            
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-[#39FF14]"><Building size={20} /></span>
                <span className="text-gray-300">+٥٠ عقار فاخر</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-[#39FF14]"><Shield size={20} /></span>
                <span className="text-gray-300">ضمان الجودة ١٠٠٪</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-[#39FF14]"><Clock size={20} /></span>
                <span className="text-gray-300">دعم فني ٢٤/٧</span>
              </div>
            </div>
            
            <div className="pt-6">
              <Button
                className="h-14 px-8 bg-gray-900 hover:bg-gray-800 text-white border border-gray-700 shadow-lg group relative overflow-hidden"
                asChild
              >
                <Link href="/properties">
                  <span className="flex items-center gap-2 z-10 relative font-tajawal">
                    استكشف العقارات الآن
                    <ArrowRight size={18} className="rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </span>
                  <span className="absolute inset-0 w-0 bg-[#39FF14] opacity-20 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </Button>
            </div>
          </motion.div>
          
          {/* Right side: Abstract UI component */}
          <motion.div
            className="w-full md:w-1/2 hidden md:flex justify-center items-center mt-8 md:mt-0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              {/* Main image frame */}
              <div className="w-[380px] h-[380px] relative z-10 rounded-2xl shadow-2xl overflow-hidden border border-gray-800 bg-gradient-to-br from-gray-900 to-black">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-800 to-transparent opacity-30 rounded-2xl"></div>
                
                {/* Content grid */}
                <div className="p-3 h-full">
                  <div className="grid grid-cols-2 grid-rows-2 gap-3 h-full">
                    <div className="col-span-2 row-span-1 bg-gray-800 rounded-xl overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/80 z-10"></div>
                      <div className="absolute bottom-3 right-3 z-20 text-right">
                        <div className="text-sm text-gray-300">فيلا الساحل</div>
                        <div className="text-sm text-[#39FF14] font-bold">$350 / ليلة</div>
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-xl overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/80 z-10"></div>
                      <div className="absolute bottom-3 right-3 z-20 text-right">
                        <div className="text-xs text-gray-300">شاليه لوسيندا</div>
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-xl overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/80 z-10"></div>
                      <div className="absolute bottom-3 right-3 z-20 text-right">
                        <div className="text-xs text-gray-300">بيتش هاوس</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-[-15px] right-[-15px] w-[120px] h-[120px] border border-gray-800/50 rounded-full"></div>
              <div className="absolute bottom-[-25px] left-[-25px] w-[180px] h-[180px] border border-[#39FF14]/10 rounded-full"></div>
              <div className="absolute top-[50%] left-[-40px] w-[15px] h-[15px] bg-[#39FF14] rounded-full opacity-20"></div>
              <div className="absolute top-[60%] right-[-20px] w-[8px] h-[8px] bg-white rounded-full opacity-20"></div>
              
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
        
        {/* Footer */}
        <div className="pb-4 text-center">
          <motion.p 
            className="text-gray-600 text-sm"
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