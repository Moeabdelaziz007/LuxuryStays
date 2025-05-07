import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Facebook, ExternalLink } from "lucide-react";
import Logo from "@/components/Logo";

/**
 * مكون تذييل الصفحة الرئيسي
 * تصميم بسيط وأنيق مع معلومات الاتصال والروابط المهمة
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-[#39FF14]/20 py-10 relative">
      {/* تأثير توهج بسيط */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/30 to-transparent"></div>
      
      {/* محتوى التذييل الرئيسي */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* الشعار والوصف المختصر */}
          <div className="flex flex-col items-center md:items-start">
            <Logo size="lg" variant="neon" withText className="mb-4" />
            <p className="text-gray-400 text-sm mb-4 text-center md:text-right max-w-xs">
              بوابتك للإقامة الفاخرة في الساحل الشمالي وراس الحكمة
            </p>
            <div className="flex space-x-3 rtl:space-x-reverse">
              <a 
                href="https://www.facebook.com/share/1L5CCr1JVD/?mibextid=wwXIfr" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="صفحة الفيسبوك"
                className="group"
              >
                <Button variant="outline" size="icon" className="rounded-full border-[#39FF14]/30 hover:bg-[#39FF14]/10 hover:border-[#39FF14] transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(57,255,20,0.4)]">
                  <Facebook size={18} className="text-[#39FF14]" />
                </Button>
              </a>
              <a 
                href="/about" 
                aria-label="من نحن"
                className="group"
              >
                <Button variant="outline" size="icon" className="rounded-full border-[#39FF14]/30 hover:bg-[#39FF14]/10 hover:border-[#39FF14] transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(57,255,20,0.4)]">
                  <ExternalLink size={18} className="text-[#39FF14]" />
                </Button>
              </a>
            </div>
          </div>
          
          {/* روابط سريعة - الصفحات الموجودة */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold text-[#39FF14] mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-center md:text-right">
              <li>
                <Link href="/">
                  <div className="text-gray-400 hover:text-[#39FF14] transition-colors duration-300">
                    الرئيسية
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/properties">
                  <div className="text-gray-400 hover:text-[#39FF14] transition-colors duration-300">
                    العقارات
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <div className="text-gray-400 hover:text-[#39FF14] transition-colors duration-300">
                    الخدمات
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <div className="text-gray-400 hover:text-[#39FF14] transition-colors duration-300">
                    من نحن
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <div className="text-gray-400 hover:text-[#39FF14] transition-colors duration-300">
                    اتصل بنا
                  </div>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* اتصل بنا - مصر */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold text-[#39FF14] mb-4">اتصل بنا - مصر</h3>
            <ul className="space-y-3 text-center md:text-right">
              <li className="flex items-center justify-center md:justify-start rtl:flex-row-reverse">
                <Phone className="rtl:ml-3 ltr:mr-3 text-[#39FF14] flex-shrink-0" size={16} />
                <a href="tel:+201094228044" className="text-gray-400 hover:text-[#39FF14] transition-colors">
                  +20 109 422 8044
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start rtl:flex-row-reverse">
                <Mail className="rtl:ml-3 ltr:mr-3 text-[#39FF14] flex-shrink-0" size={16} />
                <a href="mailto:amrikyy@stayx.com" className="text-gray-400 hover:text-[#39FF14] transition-colors">
                  amrikyy@stayx.com
                </a>
              </li>
              <li className="flex items-start justify-center md:justify-start rtl:flex-row-reverse">
                <MapPin className="rtl:ml-3 ltr:mr-3 mt-1 text-[#39FF14] flex-shrink-0" size={16} />
                <span className="text-gray-400">
                  القاهرة الجديدة، التجمع الخامس
                </span>
              </li>
            </ul>
          </div>
          
          {/* اتصل بنا - الولايات المتحدة */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold text-[#39FF14] mb-4">اتصل بنا - أمريكا</h3>
            <ul className="space-y-3 text-center md:text-right">
              <li className="flex items-center justify-center md:justify-start rtl:flex-row-reverse">
                <Phone className="rtl:ml-3 ltr:mr-3 text-[#39FF14] flex-shrink-0" size={16} />
                <a href="tel:+17706160211" className="text-gray-400 hover:text-[#39FF14] transition-colors">
                  +1 770 616 0211
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start rtl:flex-row-reverse">
                <Mail className="rtl:ml-3 ltr:mr-3 text-[#39FF14] flex-shrink-0" size={16} />
                <a href="mailto:amrikyy@gmail.com" className="text-gray-400 hover:text-[#39FF14] transition-colors">
                  amrikyy@gmail.com
                </a>
              </li>
              <li className="flex items-start justify-center md:justify-start rtl:flex-row-reverse">
                <MapPin className="rtl:ml-3 ltr:mr-3 mt-1 text-[#39FF14] flex-shrink-0" size={16} />
                <span className="text-gray-400">
                  أتلانتا، جورجيا
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* حقوق النشر والروابط القانونية */}
        <div className="border-t border-gray-800 pt-5 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            {currentYear} © StayX - جميع الحقوق محفوظة
          </p>
          <div className="flex space-x-6 rtl:space-x-reverse">
            <Link href="/privacy">
              <div className="text-gray-500 hover:text-[#39FF14] text-sm transition-colors duration-300">
                سياسة الخصوصية
              </div>
            </Link>
            <Link href="/terms">
              <div className="text-gray-500 hover:text-[#39FF14] text-sm transition-colors duration-300">
                الشروط والأحكام
              </div>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
