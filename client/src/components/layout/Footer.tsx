import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Instagram, MapPin, Phone, Mail, Facebook } from "lucide-react";
import Logo from "@/components/Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-[#39FF14]/20 py-8 relative">
      {/* Subtle neon glow effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/30 to-transparent"></div>
      
      {/* Main footer */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Logo and brief description */}
          <div className="flex flex-col items-center md:items-start">
            <Logo size="lg" variant="neon" withText className="mb-4" />
            <p className="text-gray-400 text-sm mb-6 text-center md:text-right max-w-xs font-tajawal">
              بوابتك للإقامة الفاخرة في الساحل الشمالي وراس الحكمة، نوفر لك تجربة حجز مميزة وسلسة
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a 
                href="https://www.facebook.com/share/1L5CCr1JVD/?mibextid=wwXIfr" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button variant="outline" size="icon" className="rounded-full border-[#39FF14]/30 hover:bg-[#39FF14]/10 hover:border-[#39FF14]">
                  <Facebook size={18} className="text-[#39FF14]" />
                </Button>
              </a>
              <Button variant="outline" size="icon" className="rounded-full border-[#39FF14]/30 hover:bg-[#39FF14]/10 hover:border-[#39FF14]">
                <Instagram size={18} className="text-[#39FF14]" />
              </Button>
            </div>
          </div>
          
          {/* Quick links - real pages */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold text-[#39FF14] mb-6 font-tajawal">روابط سريعة</h3>
            <ul className="space-y-3 text-center md:text-right font-tajawal">
              <li>
                <Link href="/" className="text-gray-400 hover:text-[#39FF14] transition-colors duration-300">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-gray-400 hover:text-[#39FF14] transition-colors duration-300">
                  العقارات
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-[#39FF14] transition-colors duration-300">
                  الخدمات
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-400 hover:text-[#39FF14] transition-colors duration-300">
                  تسجيل الدخول
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-gray-400 hover:text-[#39FF14] transition-colors duration-300">
                  إنشاء حساب
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact info */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold text-[#39FF14] mb-6 font-tajawal">تواصل معنا</h3>
            <ul className="space-y-4 text-center md:text-right">
              <li className="flex items-start justify-center md:justify-start rtl:flex-row-reverse">
                <MapPin className="rtl:ml-3 ltr:mr-3 mt-1 text-[#39FF14] flex-shrink-0" size={18} />
                <span className="text-gray-400 font-tajawal">الساحل الشمالي، مصر</span>
              </li>
              <li className="flex items-center justify-center md:justify-start rtl:flex-row-reverse">
                <Phone className="rtl:ml-3 ltr:mr-3 text-[#39FF14] flex-shrink-0" size={18} />
                <span className="text-gray-400 font-tajawal">+20 10 1234 5678</span>
              </li>
              <li className="flex items-center justify-center md:justify-start rtl:flex-row-reverse">
                <Mail className="rtl:ml-3 ltr:mr-3 text-[#39FF14] flex-shrink-0" size={18} />
                <span className="text-gray-400 font-tajawal">info@stayx.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0 font-tajawal">
            {currentYear} © StayX - جميع الحقوق محفوظة
          </p>
          <div className="flex space-x-6 rtl:space-x-reverse">
            <Link href="/privacy" className="text-gray-500 hover:text-[#39FF14] text-sm transition-colors duration-300 font-tajawal">
              سياسة الخصوصية
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-[#39FF14] text-sm transition-colors duration-300 font-tajawal">
              الشروط والأحكام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
