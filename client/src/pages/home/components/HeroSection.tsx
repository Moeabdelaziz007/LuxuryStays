import { Button } from "@/components/ui/button";
import { useTranslation } from "@/features/i18n/hooks/useTranslation";
import { Search, Utensils } from "lucide-react";

export default function HeroSection() {
  const { t, isRTL } = useTranslation();

  return (
    <section className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
          alt="Luxury property" 
          className="object-cover w-full h-full" 
        />
        <div className="absolute inset-0 hero-gradient"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-end pb-20">
        <div className="max-w-3xl mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-poppins leading-tight">
            <span className="text-white">{t("home.hero.title1")}</span>
            <span className="text-accent block">{t("home.hero.title2")}</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            {t("home.hero.description")}
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              size="lg" 
              className="px-8 py-6 bg-accent text-primary text-lg font-semibold hover:bg-accent/90"
            >
              <Search className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t("home.hero.exploreProperties")}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-6 border-white text-white text-lg font-semibold hover:border-accent hover:text-accent"
            >
              <Utensils className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t("home.hero.viewServices")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
