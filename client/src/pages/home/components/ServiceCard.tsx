import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Utensils, Wine } from "lucide-react";
import type { Service } from "@shared/schema";

interface ServiceCardProps {
  service: Service | {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    status: string;
    iconClass: string;
  };
  buttonText?: string;
}

export default function ServiceCard({ service, buttonText }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Function to get the appropriate icon based on iconClass
  const getIcon = () => {
    switch (service.iconClass) {
      case 'utensils':
        return <Utensils className="mr-2" size={16} />;
      case 'glass-cheers':
        return <Wine className="mr-2" size={16} />;
      default:
        return null;
    }
  };

  return (
    <div 
      className="rounded-xl overflow-hidden shadow-card bg-secondary relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-80">
        <img 
          src={service.imageUrl} 
          className={`object-cover w-full h-full transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`} 
          alt={service.name} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl font-bold mb-2 font-poppins">{service.name}</h3>
          <p className="text-white/80 mb-4">{service.description}</p>
          <Button 
            className="px-6 py-2 bg-accent text-primary rounded-lg font-medium hover:bg-accent/90 transition-colors duration-300 inline-flex items-center"
          >
            {getIcon()}
            {buttonText || "Explore"}
          </Button>
        </div>
      </div>
    </div>
  );
}
