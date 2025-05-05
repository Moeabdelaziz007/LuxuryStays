import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/features/i18n/hooks/useTranslation";
import { Bed, Bath, Ruler, Star } from "lucide-react";
import type { Property } from "@shared/schema";

interface PropertyProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { t, isRTL } = useTranslation();

  return (
    <div 
      className="property-card rounded-xl overflow-hidden shadow-card bg-primary relative group transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={property.imageUrl} 
          className={`object-cover w-full h-full transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`} 
          alt={property.name} 
        />
        <div className={`absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Button className="px-4 py-2 bg-accent text-primary rounded-lg font-medium hover:bg-accent/90 transition-colors duration-300">
            {t("home.featured.viewDetails")}
          </Button>
        </div>
        {property.featured && (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 bg-accent text-primary font-medium rounded-full text-sm">Featured</span>
          </div>
        )}
      </div>
      <div className={`p-5 transform transition-transform duration-300 ${isHovered ? 'translate-y-[-10px]' : 'translate-y-0'}`}>
        <h3 className="text-xl font-semibold mb-2">{property.name}</h3>
        <p className="text-white/70 mb-3">{property.location}</p>
        <div className="flex justify-between items-center">
          <p className="text-accent font-semibold">${property.price} {t("home.featured.price")}</p>
          <div className="flex items-center">
            <Star className="text-accent mr-1" size={16} />
            <span>{property.rating ? property.rating / 10 : 4.5}</span>
          </div>
        </div>
        <div className="flex mt-4 border-t border-white/10 pt-4 text-white/70">
          <div className={`flex items-center ${isRTL ? 'ml-4' : 'mr-4'}`}>
            <Bed className={`${isRTL ? 'ml-2' : 'mr-2'}`} size={16} />
            <span>{property.beds} {t("home.featured.beds")}</span>
          </div>
          <div className={`flex items-center ${isRTL ? 'ml-4' : 'mr-4'}`}>
            <Bath className={`${isRTL ? 'ml-2' : 'mr-2'}`} size={16} />
            <span>{property.baths} {t("home.featured.baths")}</span>
          </div>
          <div className="flex items-center">
            <Ruler className={`${isRTL ? 'ml-2' : 'mr-2'}`} size={16} />
            <span>{property.size} {t("home.featured.sqft")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
