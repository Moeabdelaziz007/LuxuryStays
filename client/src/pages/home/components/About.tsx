import { useTranslation } from "@/features/i18n/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";

export default function About() {
  const { t } = useTranslation();

  const stats = [
    { value: "200+", label: t("home.about.stats.properties") },
    { value: "50+", label: t("home.about.stats.locations") },
    { value: "10K+", label: t("home.about.stats.guests") },
    { value: "30+", label: t("home.about.stats.partners") }
  ];

  return (
    <section id="about" className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <span className="inline-block px-4 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium mb-4">
              About StayX
            </span>
            <h2 className="text-3xl font-bold font-poppins mb-6">
              <span className="text-white">{t("home.about.title1")}</span>
              <span className="text-accent"> {t("home.about.title2")}</span>
            </h2>
            <p className="text-white/70 mb-6">
              {t("home.about.description1")}
            </p>
            <p className="text-white/70 mb-8">
              {t("home.about.description2")}
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col">
                  <span className="text-3xl font-bold text-accent mb-2">{stat.value}</span>
                  <span className="text-white/70">{stat.label}</span>
                </div>
              ))}
            </div>
            
            <Button 
              size="lg" 
              className="px-6 py-3 bg-accent text-primary text-lg font-semibold hover:bg-accent/90"
            >
              <InfoIcon className="mr-2" size={18} />
              {t("home.about.learnMore")}
            </Button>
          </div>
          
          <div className="lg:w-1/2">
            <div className="relative h-[500px] rounded-xl overflow-hidden shadow-card">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                className="object-cover w-full h-full" 
                alt="Luxury Experience" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 p-6 glass-effect rounded-lg">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://randomuser.me/api/portraits/women/32.jpg" 
                    className="w-12 h-12 rounded-full mr-4" 
                    alt="Guest Testimonial" 
                  />
                  <div>
                    <h4 className="font-medium">Sarah Johnson</h4>
                    <div className="flex text-accent">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i}
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="currentColor"
                          className="mr-1"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-white/90 italic">
                  "StayX completely transformed our vacation experience. The property was stunning and their concierge service anticipated our every need. Truly exceptional."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
