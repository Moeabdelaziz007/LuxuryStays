import { useTranslation } from "@/features/i18n/hooks/useTranslation";
import { Sofa, Ship, Plane, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ComingSoon() {
  const { t } = useTranslation();

  const comingSoonServices = [
    {
      id: 1,
      icon: <Sofa className="text-5xl text-accent" />,
      title: "ChillRoom Lounges",
      description: "Exclusive relaxation spaces with premium amenities, perfect for unwinding after a busy day.",
      launchDate: "Q3 2023",
      highlighted: true
    },
    {
      id: 2,
      icon: <Ship className="text-5xl text-white/80" />,
      title: "Luxury Yacht Charters",
      description: "Private yacht experiences with professional crew, catering, and customized routes.",
      launchDate: "Q4 2023",
      highlighted: false
    },
    {
      id: 3,
      icon: <Plane className="text-5xl text-white/80" />,
      title: "Plane Transfers",
      description: "Quick and stylish transportation between properties and key locations.",
      launchDate: "Q1 2024",
      highlighted: false
    }
  ];

  return (
    <section id="coming-soon" className="py-16 bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute h-40 w-40 rounded-full bg-accent blur-3xl top-20 left-20"></div>
        <div className="absolute h-60 w-60 rounded-full bg-accent blur-3xl bottom-20 right-20"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium mb-4 coming-soon-badge">
            {t("home.comingSoon.badge")}
          </span>
          <h2 className="text-3xl font-bold font-poppins mb-4">
            <span className="text-white">{t("home.comingSoon.title1")}</span>
            <span className="text-accent"> {t("home.comingSoon.title2")}</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            {t("home.comingSoon.description")}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {comingSoonServices.map((service) => (
            <div 
              key={service.id}
              className={`rounded-xl overflow-hidden shadow-card bg-primary relative group p-6 border ${
                service.highlighted ? "border-accent/30" : "border-white/10"
              }`}
            >
              <div className="mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 font-poppins">{service.title}</h3>
              <p className="text-white/70 mb-6">{service.description}</p>
              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <span className={`text-sm font-medium ${
                  service.highlighted ? "text-accent" : "text-white/70"
                }`}>
                  {t("home.comingSoon.launching")} {service.launchDate}
                </span>
                <Button variant="ghost" className="text-white hover:text-accent transition-colors duration-300">
                  <Bell className="mr-2" size={16} />
                  {t("home.comingSoon.getNotified")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
