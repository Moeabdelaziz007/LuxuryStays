import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/features/i18n/hooks/useTranslation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import Logo from "@/components/Logo";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

export default function MobileMenu({ isOpen, onClose, onLogin, onRegister }: MobileMenuProps) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

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

  return (
    <div className="md:hidden">
      <div className="glass-effect px-4 py-6">
        <div className="mb-6 flex justify-center">
          <Link to="/" className="flex items-center justify-center" onClick={handleMenuItemClick}>
            <Logo size="lg" variant="neon" withText={true} />
          </Link>
        </div>
        <div className="flex flex-col space-y-4">
          <Link href="#featured" className="text-white hover:text-accent transition-colors duration-300" onClick={handleMenuItemClick}>
            {t("nav.properties")}
          </Link>
          <Link href="#services" className="text-white hover:text-accent transition-colors duration-300" onClick={handleMenuItemClick}>
            {t("nav.services")}
          </Link>
          <Link href="#coming-soon" className="text-white hover:text-accent transition-colors duration-300" onClick={handleMenuItemClick}>
            {t("nav.comingSoon")}
          </Link>
          <Link href="#about" className="text-white hover:text-accent transition-colors duration-300" onClick={handleMenuItemClick}>
            {t("nav.about")}
          </Link>
          
          {user ? (
            <div className="flex flex-col space-y-3 pt-4 border-t border-white/10">
              <Link 
                href={`/dashboard/${user.role.toLowerCase()}`} 
                className="text-white hover:text-accent transition-colors duration-300"
                onClick={handleMenuItemClick}
              >
                {t("nav.dashboard")}
              </Link>
              <Button
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-primary transition-colors duration-300"
                onClick={handleLogout}
              >
                {t("auth.logout")}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col space-y-3 pt-4 border-t border-white/10">
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
      </div>
    </div>
  );
}
