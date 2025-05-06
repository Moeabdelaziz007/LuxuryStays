import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { ChevronLeft, Activity } from "lucide-react";
import { IconType } from 'react-icons';

interface CustomerStatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  colors: {
    primary: string; // e.g., "#39FF14" or "cyan-500"
    bgFrom: string; // e.g., "[#39FF14]/20" or "cyan-500/20"
    bgTo: string; // e.g., "[#39FF14]/5" or "cyan-500/5" 
  };
  linkText?: string;
  delay?: number;
  isActive?: boolean;
  animate?: boolean;
}

export const CustomerStatsCard: React.FC<CustomerStatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  colors,
  linkText,
  delay = 0,
  isActive = true,
  animate = true
}) => {
  // Format the colors for tailwind classes
  const isFull = !colors.primary.includes('-');
  const primaryColor = colors.primary;
  const bgFrom = colors.bgFrom;
  const bgTo = colors.bgTo;
  const shadowColor = isFull ? colors.primary : `rgb(var(--${colors.primary}))`;
  
  // For animation
  const fadeInClass = animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4';
  const delayStyle = { transitionDelay: `${delay}ms` };
  
  // Calculate hover classes
  const hoverBorderClass = isFull 
    ? `hover:border-${primaryColor}/30` 
    : `hover:border-${colors.primary}/30`;
    
  const hoverShadowClass = isFull 
    ? `hover:shadow-[0_0_15px_${shadowColor}15]` 
    : `hover:shadow-[0_0_15px_rgba(var(--${colors.primary}-rgb),0.15)]`;

  return (
    <Card 
      className={`border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 shadow-xl
        relative overflow-hidden ${hoverBorderClass} transition-all duration-500 ${hoverShadowClass}
        ${fadeInClass}`
      }
      style={delayStyle}
    >
      {/* Decorative background */}
      <div className={`absolute -top-12 -right-12 w-24 h-24 bg-${bgFrom} rounded-full blur-xl`}></div>
      
      <CardHeader className="pb-2 relative z-10">
        <div className="flex justify-between items-start">
          <div className={`p-3 rounded-2xl bg-gradient-to-br from-${bgFrom} to-${bgTo} text-${primaryColor}`}>
            {icon}
          </div>
          <div className="flex gap-1 items-center">
            <span className={`h-1.5 w-1.5 rounded-full bg-${primaryColor}`}></span>
            <span className={`h-1.5 w-1.5 rounded-full bg-${primaryColor}/70`}></span>
            <span className={`h-1.5 w-1.5 rounded-full bg-${primaryColor}/40`}></span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="flex items-baseline gap-1">
          <div className="text-3xl font-bold text-white mb-1 font-mono">
            {value}
          </div>
        </div>
        <p className="text-gray-400 text-sm">{subtitle}</p>
      </CardContent>
      
      {linkText && (
        <CardFooter className="pt-0 relative z-10">
          <div className="w-full h-8 bg-gray-800/30 rounded-lg overflow-hidden backdrop-blur-sm flex items-center px-2">
            <div className="text-xs text-gray-400 flex gap-2 items-center mr-auto">
              <Activity size={12} />
              <span>{linkText}</span>
            </div>
            <ChevronLeft size={16} className={`text-${primaryColor}`} />
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default CustomerStatsCard;