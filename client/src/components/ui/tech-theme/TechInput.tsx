import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TechInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'outlined' | 'glowing' | 'minimal';
  neonColor?: 'green' | 'blue' | 'purple' | 'cyan';
  withIcon?: React.ReactNode;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  animate?: boolean;
}

const TechInput = React.forwardRef<HTMLInputElement, TechInputProps>(
  ({ 
    className, 
    variant = 'default', 
    neonColor = 'green',
    withIcon,
    error = false,
    errorMessage,
    label,
    animate = true,
    type,
    ...props 
  }, ref) => {
    const getNeonColorValue = () => {
      switch (neonColor) {
        case 'blue': return 'var(--neon-blue)';
        case 'purple': return 'var(--neon-purple)';
        case 'cyan': return 'var(--neon-cyan)';
        case 'green':
        default: return 'var(--neon-green)';
      }
    };
    
    const colorValue = getNeonColorValue();
    
    const getVariantClasses = () => {
      const baseClasses = "flex w-full rounded-md bg-black/50 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50";
      
      switch (variant) {
        case 'outlined':
          return cn(baseClasses, `border-2 border-${neonColor === 'green' ? '[#39FF14]' : '[#0088ff]'}/30 focus:border-${neonColor === 'green' ? '[#39FF14]' : '[#0088ff]'}`);
        case 'glowing':
          return cn(baseClasses, `border border-${neonColor === 'green' ? '[#39FF14]' : '[#0088ff]'}/50 shadow-[0_0_10px_rgba(${neonColor === 'green' ? '57,255,20' : '0,150,255'},0.2)] focus:shadow-[0_0_15px_rgba(${neonColor === 'green' ? '57,255,20' : '0,150,255'},0.5)]`);
        case 'minimal':
          return cn(baseClasses, "border-b-2 rounded-none border-gray-700 hover:border-gray-500 focus:border-[#39FF14]");
        case 'default':
        default:
          return cn(baseClasses, "border border-gray-800 bg-background focus:border-[#39FF14]");
      }
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-1.5 text-gray-300">
            {label}
          </label>
        )}
        
        <div className={cn("relative group", animate && "transition-all duration-300")}>
          {withIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-gray-100">
              {withIcon}
            </div>
          )}
          
          <input
            type={type}
            className={cn(
              getVariantClasses(),
              withIcon && "pl-10",
              error ? "border-red-500 focus:border-red-500" : "",
              "h-9 p-3 transition-all",
              animate && "focus:scale-[1.01]",
              className
            )}
            ref={ref}
            style={{
              borderColor: error ? 'rgb(239, 68, 68)' : '',
              boxShadow: variant === 'glowing' && error ? '0 0 15px rgba(239, 68, 68, 0.4)' : ''
            }}
            {...props}
          />
          
          {variant === 'glowing' && !error && (
            <div 
              className={cn(
                "absolute inset-0 rounded-md opacity-0 pointer-events-none transition-opacity",
                "group-focus-within:opacity-100"
              )}
              style={{
                boxShadow: `0 0 15px ${colorValue}50`,
              }}
            />
          )}
        </div>
        
        {error && errorMessage && (
          <div className="text-red-500 text-xs mt-1">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
);

TechInput.displayName = "TechInput";

export { TechInput };