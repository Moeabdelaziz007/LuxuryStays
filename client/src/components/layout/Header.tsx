import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import AuthModal from "@/features/auth/components/AuthModal";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useTranslation } from "@/features/i18n/hooks/useTranslation";
import { UserRole } from "@shared/schema";
import MobileMenu from "./MobileMenu";
import { Menu, X, Globe } from "lucide-react";
import Logo from "@/components/Logo";
import { TechButton } from "@/components/ui/tech-theme";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [scanlineActive, setScanlineActive] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const { user, logout } = useAuth();
  const { t, language, setLanguage, isRTL } = useTranslation();

  // تأثير التمرير والتوهج
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // تأثير خطوط المسح الضوئي العشوائية
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setScanlineActive(true);
        setTimeout(() => setScanlineActive(false), 200);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // تأثير الخلل العشوائي
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.9) {
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 150);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    setAuthModalTab("login");
    setAuthModalOpen(true);
  };

  const handleRegister = () => {
    setAuthModalTab("register");
    setAuthModalOpen(true);
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  return (
    <>
      <header 
        ref={headerRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-[#39FF14]/20",
          isScrolled 
            ? "bg-black/80 backdrop-blur-md" 
            : "bg-black/60 backdrop-blur-sm"
        )}
        style={{
          transform: glitchEffect ? `translateX(${Math.random() * 5 - 2.5}px)` : 'none'
        }}
      >
        {/* خطوط المسح (سكانلاينز) */}
        {scanlineActive && (
          <div 
            className="absolute inset-0 pointer-events-none z-0 opacity-10"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(57, 255, 20, 0.2) 1px, transparent 2px)',
              backgroundSize: '100% 2px'
            }}
          ></div>
        )}
        
        {/* الحدود المتوهجة */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/70 to-transparent"></div>
        
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <Logo 
                  size="lg" 
                  variant="neon" 
                  withText={true}
                  className="transition-all duration-300 group-hover:scale-105" 
                />
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              {[
                { to: "#featured", label: t("nav.properties") },
                { to: "#services", label: t("nav.services") },
                { to: "#coming-soon", label: t("nav.comingSoon") },
                { to: "#about", label: t("nav.about") }
              ].map(item => (
                <Link 
                  key={item.to} 
                  to={item.to} 
                  className="relative px-3 py-2 text-white/90 hover:text-[#39FF14] group"
                >
                  <span className="relative z-10">{item.label}</span>
                  
                  {/* تأثير التوهج عند التحويم */}
                  <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#39FF14]/40 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  
                  {/* تأثير التوهج الرأسي */}
                  <span className="absolute opacity-0 group-hover:opacity-100 top-0 bottom-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-[#39FF14]/30 to-transparent transition-opacity duration-300"></span>
                </Link>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* زر تبديل اللغة */}
              <Button
                variant="ghost"
                className="text-white/90 hover:text-[#39FF14] group relative"
                onClick={toggleLanguage}
              >
                <Globe className="w-4 h-4 mr-1 opacity-70 group-hover:opacity-100" />
                <span>{language === "en" ? "عربي" : "English"}</span>
                <span className="absolute -bottom-px left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#39FF14]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </Button>
              
              <div className="hidden md:block">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <Link 
                      to={`/dashboard/${user.role.toLowerCase()}`} 
                      className="text-white/90 hover:text-[#39FF14] relative group px-3 py-2"
                    >
                      <span className="relative z-10">{t("nav.dashboard")}</span>
                      <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#39FF14]/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </Link>
                    
                    {/* Admin Link for Admin Users */}
                    {(user.role === UserRole.SUPER_ADMIN || user.role === UserRole.PROPERTY_ADMIN) && (
                      <Link 
                        to="/admin" 
                        className="text-[#39FF14] hover:text-[#39FF14]/80 relative group px-3 py-2"
                      >
                        <span className="relative z-10">{language === "en" ? "Admin Panel" : "لوحة الإدارة"}</span>
                        <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#39FF14]/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                      </Link>
                    )}
                    
                    <Button
                      variant="outline"
                      className="border-[#39FF14]/70 text-[#39FF14] hover:bg-[#39FF14]/10 transition-colors relative overflow-hidden group"
                      onClick={() => logout()}
                    >
                      <span className="relative z-10">{t("auth.logout")}</span>
                      <span className="absolute top-0 left-0 w-full h-full bg-[#39FF14]/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      className="border-[#39FF14]/70 text-[#39FF14] hover:bg-[#39FF14]/10 relative overflow-hidden group"
                      onClick={handleLogin}
                    >
                      <span className="relative z-10">{t("auth.login")}</span>
                      <span className="absolute inset-0 w-full h-full bg-[#39FF14]/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                    </Button>
                    
                    <Button
                      className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90 relative overflow-hidden group transition-transform"
                      onClick={handleRegister}
                    >
                      <span className="relative z-10">{t("auth.register")}</span>
                      <span className="absolute inset-0 bg-black/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                      <span className="absolute top-0 left-0 right-0 h-[1px] bg-white/20"></span>
                    </Button>
                  </div>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:text-[#39FF14] relative group"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="relative z-10" /> : <Menu className="relative z-10" />}
                <span className="absolute inset-0 rounded-full bg-[#39FF14]/10 scale-0 group-hover:scale-100 transition-transform duration-300"></span>
              </Button>
            </div>
          </div>
        </div>
        
        <MobileMenu 
          isOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)} 
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      </header>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        defaultTab={authModalTab} 
      />
    </>
  );
}