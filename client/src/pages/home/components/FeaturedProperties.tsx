import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/features/i18n/hooks/useTranslation";
import { getProperties } from "@/lib/firebase";
import PropertyCard from "./PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Property {
  id: string;
  name: string;
  location: string;
  price: number;
  imageUrl: string;
  beds: number;
  baths: number;
  size: number;
  rating: number;
  featured: boolean;
}

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await getProperties(3);
        setProperties(data as Property[]);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((item) => (
        <div key={item} className="rounded-xl overflow-hidden bg-primary">
          <Skeleton className="h-64 w-full" />
          <div className="p-5">
            <Skeleton className="h-8 w-4/5 mb-2" />
            <Skeleton className="h-5 w-3/5 mb-3" />
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-1/4" />
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section id="featured" className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold font-poppins">
            <span className="text-white">{t("home.featured.title")}</span>
            <span className="text-accent"> Properties</span>
          </h2>
          <Link href="/properties" className="text-accent hover:underline flex items-center">
            {t("common.viewAll")}
            <ArrowRight className="ml-2" size={16} />
          </Link>
        </div>
        
        {loading ? (
          renderSkeleton()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
