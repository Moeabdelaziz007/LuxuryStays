import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/features/i18n/hooks/useTranslation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { UserRole } from "@shared/schema";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Building2, 
  GanttChart, 
  AlertCircle, 
  MessageSquare, 
  LogOut, 
  LogIn, 
  UserPlus 
} from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

export default function MobileMenu({ isOpen, onClose, onLogin, onRegister }: MobileMenuProps) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showScanlines, setShowScanlines] = useState(false);

  // تأثير خطوط المسح الدورية
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setShowScanlines(true);
        setTimeout(() => setShowScanlines(false), 200);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // تأثير ظهور القائمة
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, 300);
      
      return () => {
        clearTimeout(timer);
        setAnimationComplete(false);
      };
    }
  }, [isOpen]);

  const handleMenuItemClick = () => {
    onClose();
  };

  const handleLogin = () => {
    onLogin();
    onClose();
  };

  const handleRegister = () => {
    onRegister();
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!isOpen) return null;

  const navLinks = [
    { href: "#featured", label: t("nav.properties"), icon: <Building2 className="w-5 h-5" /> },
    { href: "#services", label: t("nav.services"), icon: <GanttChart className="w-5 h-5" /> },
    { href: "#coming-soon", label: t("nav.comingSoon"), icon: <AlertCircle className="w-5 h-5" /> },
    { href: "#about", label: t("nav.about"), icon: <MessageSquare className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* خلفية شفافة */}
      <div 
        className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300 ${
          animationComplete ? 'opacity-100' : 'opacity-0'
        }`} 
        onClick={onClose}
      />
      
      {/* قائمة جانبية */}
      <div 
        className={`absolute inset-y-0 right-0 w-64 bg-[#0a0f19]/95 backdrop-blur-md border-l border-[#39FF14]/20 shadow-xl transform transition-transform duration-300 ease-in-out ${
          animationComplete ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* خطوط المسح (سكانلاينز) */}
        {showScanlines && (
          <div 
            className="absolute inset-0 pointer-events-none z-0 opacity-5"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(57, 255, 20, 0.5) 2px, transparent 4px)',
              backgroundSize: '100% 4px'
            }}
          />
        )}
        
        {/* الحدود المتوهجة */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#39FF14]/70 to-transparent"></div>
        
        {/* الشعار */}
        <div className="py-6 px-4 border-b border-[#39FF14]/10 flex justify-center relative overflow-hidden">
          <div className="relative z-10">
            <Link to="/" onClick={handleMenuItemClick}>
              <Logo size="md" variant="neon" withText={true} withAnimation={true} />
            </Link>
          </div>
          <div className="absolute inset-0 bg-[#39FF14]/5"></div>
        </div>
        
        {/* روابط التنقل */}
        <nav className="px-4 py-6 flex flex-col space-y-1">
          {navLinks.map((link, index) => (
            <Link 
              key={link.href}
              href={link.href} 
              className="group flex items-center px-2 py-3 rounded-md hover:bg-[#39FF14]/10 transition-colors duration-200 fade-slide-in"
              onClick={handleMenuItemClick}
              style={{
                animationDelay: `${100 + index * 50}ms`,
              }}
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 mr-3 border border-[#39FF14]/20 group-hover:border-[#39FF14]/60 transition-colors">
                <div className="text-[#39FF14]/70 group-hover:text-[#39FF14] transition-colors">
                  {link.icon}
                </div>
              </div>
              <span className="text-white/90 group-hover:text-[#39FF14] transition-colors">
                {link.label}
              </span>
              
              {/* تأثير الشريط المضيء */}
              <div className="absolute right-0 w-1 h-0 bg-[#39FF14] rounded-full group-hover:h-full transition-all duration-200"></div>
            </Link>
          ))}
        </nav>
        
        {/* أزرار تسجيل الدخول والتسجيل */}
        <div 
          className={`px-4 pt-4 mt-2 border-t border-[#39FF14]/10 flex flex-col space-y-3 ${
            animationComplete ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transition: 'opacity 300ms 400ms' }}
        >
          {user ? (
            <>
              <Link 
                href={`/dashboard/${user.role.toLowerCase()}`}
                className="flex items-center px-2 py-3 rounded-md hover:bg-[#39FF14]/10 group transition-colors duration-200"
                onClick={handleMenuItemClick}
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 mr-3 border border-[#39FF14]/20 group-hover:border-[#39FF14]/60 transition-colors">
                  <Home className="w-5 h-5 text-[#39FF14]/70 group-hover:text-[#39FF14] transition-colors" />
                </div>
                <span className="text-white/90 group-hover:text-[#39FF14] transition-colors">
                  {t("nav.dashboard")}
                </span>
              </Link>
              
              {/* Admin Link for Admin Users */}
              {(user.role === UserRole.SUPER_ADMIN || user.role === UserRole.PROPERTY_ADMIN) && (
                <Link 
                  href="/admin"
                  className="flex items-center px-2 py-3 rounded-md hover:bg-[#39FF14]/10 group transition-colors duration-200"
                  onClick={handleMenuItemClick}
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 mr-3 border border-[#39FF14]/20 group-hover:border-[#39FF14]/60 transition-colors">
                    <AlertCircle className="w-5 h-5 text-[#39FF14]/70 group-hover:text-[#39FF14] transition-colors" />
                  </div>
                  <span className="text-[#39FF14] group-hover:text-[#39FF14] transition-colors">
                    {t && t.language === "en" ? "Admin Panel" : "لوحة الإدارة"}
                  </span>
                </Link>
              )}
              
              <Button
                variant="outline"
                className="flex items-center w-full mt-2 bg-black/20 border border-[#39FF14]/40 text-[#39FF14]/90 hover:bg-[#39FF14]/10 hover:text-[#39FF14] px-4 py-2"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 mr-2" />
                {t("auth.logout")}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="flex items-center w-full bg-black/20 border border-[#39FF14]/40 text-[#39FF14]/90 hover:bg-[#39FF14]/10 hover:text-[#39FF14] px-4 py-2"
                onClick={handleLogin}
              >
                <LogIn className="w-5 h-5 mr-2" />
                {t("auth.login")}
              </Button>
              <Button
                className="flex items-center w-full bg-[#39FF14] text-black hover:bg-[#39FF14]/90 px-4 py-2 relative overflow-hidden group"
                onClick={handleRegister}
              >
                <UserPlus className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10">{t("auth.register")}</span>
                <span className="absolute inset-0 bg-black/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Button>
            </>
          )}
        </div>
        
        {/* زخرفة تكنولوجية في الأسفل */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-6 opacity-10 pointer-events-none">
          <div className="h-10 border border-[#39FF14]/30 rounded-md flex items-center justify-between px-3">
            <div className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse-subtle"></div>
            <div className="h-px flex-grow mx-2 bg-[#39FF14]/50"></div>
            <div className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse-subtle" style={{ animationDelay: '0.5s' }}></div>
            <div className="h-px flex-grow mx-2 bg-[#39FF14]/50"></div>
            <div className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
      
      {/* نضيف كلاس مخصص للانيميشن */}
    </div>
  );
}
