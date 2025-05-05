import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/features/i18n/hooks/useTranslation";
import { MapPin, Phone, Mail, ArrowRight, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const { t, isRTL } = useTranslation();

  return (
    <footer className="bg-secondary pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link href="/" className="text-2xl font-bold text-white font-poppins mb-6 inline-block">
              Stay<span className="text-accent">X</span>
            </Link>
            <p className="text-white/70 mb-6">
              {t("footer.description")}
            </p>
            <div className="flex space-x-4">
              <Button variant="outline" size="icon" className="rounded-full hover:bg-accent hover:text-primary">
                <Facebook size={18} />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full hover:bg-accent hover:text-primary">
                <Twitter size={18} />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full hover:bg-accent hover:text-primary">
                <Instagram size={18} />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full hover:bg-accent hover:text-primary">
                <Linkedin size={18} />
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">{t("footer.quickLinks")}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#properties" className="text-white/70 hover:text-accent transition-colors duration-300">
                  {t("nav.properties")}
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-white/70 hover:text-accent transition-colors duration-300">
                  {t("nav.services")}
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-white/70 hover:text-accent transition-colors duration-300">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-white/70 hover:text-accent transition-colors duration-300">
                  {t("footer.contactUs")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-accent transition-colors duration-300">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">{t("footer.services")}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-white/70 hover:text-accent transition-colors duration-300">
                  Fine Dining
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-accent transition-colors duration-300">
                  Nightlife
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-accent transition-colors duration-300">
                  Concierge
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-accent transition-colors duration-300">
                  Private Events
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-accent transition-colors duration-300">
                  ChillRoom (Coming Soon)
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">{t("footer.contactUs")}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className={`${isRTL ? 'ml-3' : 'mr-3'} mt-1 text-accent flex-shrink-0`} size={18} />
                <span className="text-white/70">Downtown Dubai, United Arab Emirates</span>
              </li>
              <li className="flex items-center">
                <Phone className={`${isRTL ? 'ml-3' : 'mr-3'} text-accent flex-shrink-0`} size={18} />
                <span className="text-white/70">+971 4 123 4567</span>
              </li>
              <li className="flex items-center">
                <Mail className={`${isRTL ? 'ml-3' : 'mr-3'} text-accent flex-shrink-0`} size={18} />
                <span className="text-white/70">info@stayx.com</span>
              </li>
            </ul>
            
            <div className="mt-6">
              <h4 className="text-white mb-3">{t("footer.subscribe")}</h4>
              <div className="flex">
                <Input 
                  type="email" 
                  placeholder={t("footer.emailPlaceholder")} 
                  className="bg-secondary border-border rounded-r-none"
                />
                <Button className="bg-accent hover:bg-accent/90 text-primary rounded-l-none">
                  <ArrowRight size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm mb-4 md:mb-0">
            {t("footer.copyright")}
          </p>
          <div className="flex space-x-6">
            <Link href="#" className="text-white/50 hover:text-accent text-sm transition-colors duration-300">
              {t("footer.privacy")}
            </Link>
            <Link href="#" className="text-white/50 hover:text-accent text-sm transition-colors duration-300">
              {t("footer.terms")}
            </Link>
            <Link href="#" className="text-white/50 hover:text-accent text-sm transition-colors duration-300">
              {t("footer.cookies")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
