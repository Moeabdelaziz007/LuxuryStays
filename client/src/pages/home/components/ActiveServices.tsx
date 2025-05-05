import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/features/i18n/hooks/useTranslation";
import { getActiveServices } from "@/lib/api";
import ServiceCard from "./ServiceCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Service as ServiceType } from "@shared/schema";

export default function ActiveServices() {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getActiveServices();
        setServices(data);
      } catch (error) {
        console.error("Error fetching active services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[1, 2].map((item) => (
        <div key={item} className="rounded-xl overflow-hidden bg-secondary">
          <Skeleton className="h-80 w-full" />
        </div>
      ))}
    </div>
  );

  return (
    <section id="services" className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold font-poppins">
            <span className="text-white">{t("home.services.title")}</span>
            <span className="text-accent"> Services</span>
          </h2>
          <Link href="/services" className="text-accent hover:underline flex items-center">
            {t("common.viewAll")}
            <ArrowRight className="ml-2" size={16} />
          </Link>
        </div>
        
        {loading ? (
          renderSkeleton()
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={{
                  ...service,
                  id: service.id.toString(),
                  iconClass: service.iconClass || 'utensils'
                }} 
              />
            ))}
          </div>
        ) : (
          // Default services if no data is available from Firebase
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ServiceCard 
              service={{
                id: "1",
                name: t("home.services.restaurants.title"),
                description: t("home.services.restaurants.description"),
                imageUrl: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                status: "active",
                iconClass: "utensils"
              }}
              buttonText={t("home.services.restaurants.button")}
            />
            <ServiceCard 
              service={{
                id: "2",
                name: t("home.services.nightclubs.title"),
                description: t("home.services.nightclubs.description"),
                imageUrl: "https://images.unsplash.com/photo-1556035511-3168381ea4d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                status: "active",
                iconClass: "glass-cheers"
              }}
              buttonText={t("home.services.nightclubs.button")}
            />
          </div>
        )}
      </div>
    </section>
  );
}
