import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import AuthModal from "@/features/auth/components/AuthModal";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useTranslation } from "@/features/i18n/hooks/useTranslation";
import MobileMenu from "./MobileMenu";
import { Menu, X } from "lucide-react";
import Logo from "@/components/Logo";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t, language, setLanguage, isRTL } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/90" : "glass-effect"
      }`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <Logo size="lg" variant="neon" withText={true} />
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link to="#featured" className="text-white hover:text-accent transition-colors duration-300">
                {t("nav.properties")}
              </Link>
              <Link to="#services" className="text-white hover:text-accent transition-colors duration-300">
                {t("nav.services")}
              </Link>
              <Link to="#coming-soon" className="text-white hover:text-accent transition-colors duration-300">
                {t("nav.comingSoon")}
              </Link>
              <Link to="#about" className="text-white hover:text-accent transition-colors duration-300">
                {t("nav.about")}
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-white hover:text-accent transition-colors duration-300"
                onClick={toggleLanguage}
              >
                {language === "en" ? "عربي" : "English"}
              </Button>
              
              <div className="hidden md:block">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <Link href={`/dashboard/${user.role.toLowerCase()}`} className="text-white hover:text-accent transition-colors duration-300">
                      {t("nav.dashboard")}
                    </Link>
                    <Button
                      variant="outline"
                      className="border-accent text-accent hover:bg-accent hover:text-primary transition-colors duration-300"
                      onClick={() => logout()}
                    >
                      {t("auth.logout")}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      className="border-accent text-accent hover:bg-accent hover:text-primary transition-colors duration-300"
                      onClick={handleLogin}
                    >
                      {t("auth.login")}
                    </Button>
                    <Button
                      className="bg-accent text-primary hover:bg-accent/90 transition-colors duration-300"
                      onClick={handleRegister}
                    >
                      {t("auth.register")}
                    </Button>
                  </div>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:text-accent"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
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
