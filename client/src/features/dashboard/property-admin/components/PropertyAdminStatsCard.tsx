import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircleOff, TrendingUp, TrendingDown } from "lucide-react";

interface PropertyAdminStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  hasShadow?: boolean;
  className?: string;
  delay?: number;
  animate?: boolean;
}

export const PropertyAdminStatsCard: React.FC<PropertyAdminStatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
  hasShadow = true,
  className = "",
  delay = 0,
  animate = true
}) => {
  // Format color variables
  const primaryColor = color;
  
  // Animation classes 
  const fadeInClass = animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4';
  const delayStyle = { transitionDelay: `${delay}ms` };
  
  // Shadow 
  const shadowClass = hasShadow 
    ? `shadow-lg hover:shadow-xl hover:shadow-${primaryColor}/10` 
    : '';
  
  return (
    <Card 
      className={`relative overflow-hidden border-0 h-full ${shadowClass} transition-all duration-500
        ${fadeInClass} ${className}`}
      style={{
        background: `linear-gradient(145deg, #1a1b1f 0%, #121316 100%)`,
        ...delayStyle
      }}
    >
      {/* Decorative top border */}
      <div className={`h-1 w-full bg-${primaryColor}`} style={{ borderRadius: '8px 8px 0 0' }}></div>
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">{title}</p>
            <div className="flex items-end gap-2">
              <h3 className="text-2xl md:text-3xl font-bold text-white">{value}</h3>
              {trend && (
                <div className="flex items-center">
                  <Badge variant="outline" className={`flex items-center gap-1 px-2 py-1 text-xs border-0 ${
                    trend.isPositive 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-500'
                  }`}>
                    {trend.isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {trend.value}%
                  </Badge>
                </div>
              )}
            </div>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          
          <div className={`p-3 rounded-md bg-${primaryColor}/10 text-${primaryColor}`}>
            {icon}
          </div>
        </div>
        
        <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-${primaryColor} rounded-full`} 
            style={{ width: '70%', transition: 'width 1s ease-in-out' }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyAdminStatsCard;