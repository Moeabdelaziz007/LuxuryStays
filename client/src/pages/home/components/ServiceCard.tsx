import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Utensils, Wine, MapPin, Star, Users, Music, Car, Coffee, Umbrella, Spa, Compass, PlaneTakeoff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Service } from "@shared/schema";

interface ServiceCardProps {
  service: Service | {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    status: string;
    iconClass: string;
    locations?: { name: string; area: string }[];
  };
  buttonText?: string;
  featured?: boolean;
}

export default function ServiceCard({ service, buttonText, featured = false }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showLocations, setShowLocations] = useState(false);

  // Function to get the appropriate icon based on iconClass
  const getIcon = () => {
    switch (service.iconClass?.toLowerCase()) {
      case 'utensils':
        return <Utensils className="mr-2" size={18} />;
      case 'glass-cheers':
        return <Wine className="mr-2" size={18} />;
      case 'coffee':
        return <Coffee className="mr-2" size={18} />;
      case 'music':
        return <Music className="mr-2" size={18} />;
      case 'car':
        return <Car className="mr-2" size={18} />;
      case 'beach':
        return <Umbrella className="mr-2" size={18} />;
      case 'spa':
        return <Spa className="mr-2" size={18} />;
      case 'travel':
        return <Compass className="mr-2" size={18} />;
      case 'flight':
        return <PlaneTakeoff className="mr-2" size={18} />;
      default:
        return <Star className="mr-2" size={18} />;
    }
  };

  // Function to render locations in an attractive way
  const renderLocations = () => {
    if (!service.locations || service.locations.length === 0) return null;
    
    const locationsToShow = service.locations.slice(0, 3); // Show max 3 locations
    const hasMore = service.locations.length > 3;
    
    return (
      <div className={`absolute inset-0 bg-black/90 p-6 flex flex-col transition-all duration-500 ${showLocations ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-bold text-accent">المواقع المتوفرة</h4>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowLocations(false);
            }}
            className="text-white/70 hover:text-white"
          >
            &times;
          </button>
        </div>
        <div className="flex-grow overflow-auto">
          <ul className="space-y-3">
            {locationsToShow.map((location, idx) => (
              <li key={idx} className="border-b border-white/10 pb-2 last:border-0">
                <div className="font-semibold text-white">{location.name}</div>
                <div className="text-sm text-white/70 flex items-center">
                  <MapPin size={12} className="mr-1 text-accent" /> {location.area}
                </div>
              </li>
            ))}
          </ul>
          {hasMore && (
            <div className="mt-3 text-sm text-accent text-center">
              +{service.locations.length - 3} مواقع أخرى
            </div>
          )}
        </div>
        <Button 
          className="mt-4 w-full bg-accent text-primary hover:bg-accent/90"
          onClick={(e) => {
            e.stopPropagation();
            setShowLocations(false);
          }}
        >
          حجز الآن
        </Button>
      </div>
    );
  };

  return (
    <div 
      className={`rounded-xl overflow-hidden shadow-card bg-secondary relative group transition-transform duration-300 ${featured ? 'md:scale-105 ring-2 ring-accent/30' : 'hover:-translate-y-2'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {featured && (
        <Badge className="absolute top-4 right-4 z-10 bg-accent text-primary py-1 px-3">
          <Star className="w-3 h-3 mr-1" /> مميز
        </Badge>
      )}
      
      <div className="relative h-[350px]">
        <img 
          src={service.imageUrl} 
          className={`object-cover w-full h-full transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`} 
          alt={service.name} 
        />
        
        {/* Gradient Overlay with adjustable opacity on hover */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-90' : 'opacity-80'}`}
        ></div>
        
        {/* Main content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 transition-all duration-500 transform">
          <div className={`transition-transform duration-500 ${isHovered ? 'translate-y-[-10px]' : ''}`}>
            {/* Service badge with icon */}
            <div className="inline-flex items-center bg-accent/20 text-accent text-sm font-medium px-3 py-1 rounded-full mb-3">
              {getIcon()}
              <span>{service.status === "active" ? "متاح الآن" : "قريباً"}</span>
            </div>
            
            <h3 className="text-2xl font-bold mb-3 font-poppins text-white">{service.name}</h3>
            
            <p className={`text-white/80 mb-4 line-clamp-2 transition-all duration-500 ${isHovered ? 'line-clamp-none' : ''}`}>
              {service.description}
            </p>
            
            <div className="flex flex-wrap items-center mt-4 gap-2">
              {/* Main action button */}
              <Button 
                className="px-6 py-2 bg-accent text-primary rounded-lg font-medium hover:bg-accent/90 transition-all duration-300 inline-flex items-center shadow-glow-sm"
              >
                {getIcon()}
                {buttonText || "استكشاف"}
              </Button>
              
              {/* Location button - only if service has locations */}
              {service.locations && service.locations.length > 0 && (
                <Button 
                  variant="outline" 
                  className="px-4 py-2 border-white/20 text-white hover:bg-white/10 transition-colors duration-300 inline-flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLocations(true);
                  }}
                >
                  <MapPin className="mr-2" size={16} />
                  <span className="hidden sm:inline">المواقع</span> ({service.locations.length})
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Locations panel that slides in */}
        {renderLocations()}
      </div>
    </div>
  );
}
