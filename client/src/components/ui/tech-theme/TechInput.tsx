import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TechInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'bordered' | 'filled' | 'minimal';
  error?: string;
  withGlow?: boolean;
  glassMorphism?: boolean;
}

const TechInput = forwardRef<HTMLInputElement, TechInputProps>(
  ({ 
    className, 
    variant = 'default', 
    label, 
    icon, 
    error, 
    withGlow = false,
    glassMorphism = true,
    ...props 
  }, ref) => {
    // Base input styles
    const baseInputClass = "w-full rounded-md bg-transparent py-2 px-3 outline-none transition-all duration-200 placeholder:text-gray-500 placeholder:opacity-70";
    
    // Variant-specific classes
    const variantClasses = {
      default: 'border border-[#39FF14]/30 focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14]',
      bordered: 'border-2 border-[#39FF14]/20 focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14]',
      filled: 'bg-[#0f0f15] border border-[#39FF14]/20 focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14]',
      minimal: 'border-b-2 border-[#39FF14]/30 rounded-none px-0 focus:border-[#39FF14]'
    };
    
    // Glow effect class
    const glowClass = withGlow ? 'focus:shadow-[0_0_10px_rgba(57,255,20,0.3)]' : '';
    
    // Glass effect class
    const glassClass = glassMorphism ? 'backdrop-blur-sm bg-black/30' : '';
    
    return (
      <div className={cn("relative", className)}>
        {label && (
          <label className="block text-[#39FF14] text-sm mb-1 font-medium">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#39FF14]">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            className={cn(
              baseInputClass,
              variantClasses[variant],
              glowClass,
              glassClass,
              icon && "pl-10",
              "text-white"
            )}
            {...props}
          />
          
          {/* Slight scanline effect */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden rounded-md" 
            aria-hidden="true"
          >
            <div className="h-full w-full" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(57, 255, 20, 0.1) 2px, transparent 4px)',
              backgroundSize: '100% 4px',
              mixBlendMode: 'overlay'
            }}></div>
          </div>
        </div>
        
        {error && (
          <div className="mt-1 text-xs text-red-500 animate-fadeIn">{error}</div>
        )}
      </div>
    );
  }
);

TechInput.displayName = 'TechInput';

export { TechInput };