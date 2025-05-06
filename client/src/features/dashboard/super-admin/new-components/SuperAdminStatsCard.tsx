import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";

interface SuperAdminStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  accentColor?: 'green' | 'blue' | 'purple' | 'amber' | 'rose' | 'default';
  actionText?: string;
  onAction?: () => void;
  delay?: number;
  className?: string;
}

export const SuperAdminStatsCard: React.FC<SuperAdminStatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = 'default',
  actionText,
  onAction,
  delay = 0,
  className = ""
}) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Map accent colors to gradients and styles
  const colorStyles = {
    default: {
      gradientFrom: 'from-[#39FF14]/10',
      gradientTo: 'to-[#39FF14]/5',
      iconBg: 'bg-[#39FF14]/20',
      iconText: 'text-[#39FF14]',
      valueText: 'text-[#39FF14]',
      borderAccent: 'border-t-[#39FF14]',
      hoverBorder: 'group-hover:border-[#39FF14]/50',
      iconGlow: 'drop-shadow(0 0 8px rgba(57, 255, 20, 0.5))'
    },
    green: {
      gradientFrom: 'from-green-500/10',
      gradientTo: 'to-green-500/5',
      iconBg: 'bg-green-500/20',
      iconText: 'text-green-400',
      valueText: 'text-green-400',
      borderAccent: 'border-t-green-500',
      hoverBorder: 'group-hover:border-green-500/50',
      iconGlow: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))'
    },
    blue: {
      gradientFrom: 'from-blue-500/10',
      gradientTo: 'to-blue-500/5',
      iconBg: 'bg-blue-500/20',
      iconText: 'text-blue-400',
      valueText: 'text-blue-400',
      borderAccent: 'border-t-blue-500',
      hoverBorder: 'group-hover:border-blue-500/50',
      iconGlow: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))'
    },
    purple: {
      gradientFrom: 'from-purple-500/10',
      gradientTo: 'to-purple-500/5',
      iconBg: 'bg-purple-500/20',
      iconText: 'text-purple-400',
      valueText: 'text-purple-400',
      borderAccent: 'border-t-purple-500',
      hoverBorder: 'group-hover:border-purple-500/50',
      iconGlow: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.5))'
    },
    amber: {
      gradientFrom: 'from-amber-500/10',
      gradientTo: 'to-amber-500/5',
      iconBg: 'bg-amber-500/20',
      iconText: 'text-amber-400',
      valueText: 'text-amber-400',
      borderAccent: 'border-t-amber-500',
      hoverBorder: 'group-hover:border-amber-500/50',
      iconGlow: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))'
    },
    rose: {
      gradientFrom: 'from-rose-500/10',
      gradientTo: 'to-rose-500/5',
      iconBg: 'bg-rose-500/20',
      iconText: 'text-rose-400',
      valueText: 'text-rose-400',
      borderAccent: 'border-t-rose-500',
      hoverBorder: 'group-hover:border-rose-500/50',
      iconGlow: 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.5))'
    }
  };

  const styles = colorStyles[accentColor];

  return (
    <Card 
      className={`relative group overflow-hidden border-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 
        transition-all duration-500 hover:shadow-xl ${className} ${
        animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ 
        transitionDelay: `${delay}ms`,
        borderTop: '3px solid transparent' 
      }}
    >
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${styles.borderAccent} ${styles.hoverBorder} opacity-70 transition-colors duration-300`}></div>
      
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradientFrom} ${styles.gradientTo} opacity-50`}></div>
      
      <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-br from-black/60 to-black/20 rounded-full blur-xl"></div>
      
      <CardContent className="p-6 z-10 relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
              <p className="text-gray-400 font-medium">{title}</p>
              {trend && (
                <Badge 
                  variant="outline"
                  className={`flex items-center gap-0.5 px-1.5 py-px text-xs border-0 ml-2 ${
                    trend.isPositive
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {trend.isPositive ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {trend.value}%
                </Badge>
              )}
            </div>
            
            <h3 className={`text-3xl md:text-4xl font-bold mt-2 ${styles.valueText}`}>
              {value}
            </h3>
            
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          
          <div className={`p-3 rounded-xl ${styles.iconBg} ${styles.iconText}`} style={{ filter: styles.iconGlow }}>
            {icon}
          </div>
        </div>
        
        {actionText && (
          <Button 
            variant="ghost" 
            className={`w-full justify-between px-3 py-2 h-auto text-xs font-medium ${styles.iconText} hover:bg-gray-800/60`}
            onClick={onAction}
          >
            <span>{actionText}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SuperAdminStatsCard;