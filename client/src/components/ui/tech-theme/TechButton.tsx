import React from 'react';
import { Loader2 } from 'lucide-react';

interface TechButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning' | 'neon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  withSweepingGlow?: boolean;
  glowIntensity?: 'low' | 'medium' | 'high';
  shimmer?: boolean;
}

const TechButton = React.forwardRef<HTMLButtonElement, TechButtonProps>(
  ({
    children,
    className = '',
    variant = 'default',
    size = 'md',
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    withSweepingGlow = true,
    glowIntensity = 'medium',
    shimmer = false,
    ...props
  }, ref) => {
    // تحديد الأحجام
    const getSizeClasses = () => {
      switch (size) {
        case 'sm':
          return 'py-1.5 px-3 text-sm';
        case 'lg':
          return 'py-3 px-6 text-lg';
        case 'xl':
          return 'py-4 px-8 text-xl';
        default: // medium
          return 'py-2.5 px-5';
      }
    };
    
    // تحديد أنماط الأزرار
    const getVariantClasses = () => {
      switch (variant) {
        case 'primary':
          return 'bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white border border-blue-700 hover:border-blue-600';
        case 'secondary':
          return 'bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white border border-gray-600 hover:border-gray-500';
        case 'outline':
          return 'bg-transparent hover:bg-gray-900/30 text-gray-300 border border-gray-700 hover:border-gray-600';
        case 'ghost':
          return 'bg-transparent hover:bg-white/5 text-gray-300 border-0';
        case 'danger':
          return 'bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-white border border-red-700 hover:border-red-600';
        case 'success':
          return 'bg-gradient-to-r from-green-900 to-green-800 hover:from-green-800 hover:to-green-700 text-white border border-green-700 hover:border-green-600';
        case 'warning':
          return 'bg-gradient-to-r from-yellow-900 to-yellow-800 hover:from-yellow-800 hover:to-yellow-700 text-white border border-yellow-700 hover:border-yellow-600';
        case 'neon':
          return 'bg-black hover:bg-black/80 text-[#39FF14] border border-[#39FF14]/50 hover:border-[#39FF14] hover:shadow-[0_0_10px_rgba(57,255,20,0.5)]';
        default: // default tech theme
          return 'bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white border border-gray-700 hover:border-[#39FF14]/50 hover:shadow-[0_0_10px_rgba(57,255,20,0.2)]';
      }
    };
    
    const widthClass = fullWidth ? 'w-full' : '';
    
    // تأثير التوهج المتحرك
    const sweepingGlowClass = withSweepingGlow ? 'overflow-hidden' : '';
    
    // تحديد كثافة التوهج
    const getGlowIntensityStyles = () => {
      switch (glowIntensity) {
        case 'low':
          return 'rgba(57,255,20,0.05)';
        case 'high':
          return 'rgba(57,255,20,0.2)';
        default: // medium
          return 'rgba(57,255,20,0.1)';
      }
    };
    
    const sweepingGlowEffect = withSweepingGlow ? (
      <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_25%,rgba(57,255,20,0.1)_50%,transparent_75%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-x-[-100%] group-hover:translate-x-[100%]" style={{ 
        backgroundImage: `linear-gradient(40deg, transparent 25%, ${getGlowIntensityStyles()} 50%, transparent 75%)` 
      }}></div>
    ) : null;
    
    // تأثير التلالؤ (الوميض)
    const shimmerClass = shimmer ? 'shimmer-effect' : '';
    
    return (
      <button
        ref={ref}
        className={`relative group font-medium rounded-lg transition-all flex items-center justify-center ${sweepingGlowClass} ${shimmerClass} ${getSizeClasses()} ${getVariantClasses()} ${widthClass} ${loading ? 'opacity-80 cursor-not-allowed' : 'active:scale-[0.98]'} ${className}`}
        disabled={loading || props.disabled}
        {...props}
      >
        {sweepingGlowEffect}
        
        <span className="flex items-center justify-center gap-2">
          {loading ? (
            <Loader2 className={`animate-spin ${size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : size === 'xl' ? 'h-6 w-6' : 'h-4 w-4'}`} />
          ) : (
            iconPosition === 'left' && icon && <span className="mr-1">{icon}</span>
          )}
          
          {children}
          
          {!loading && iconPosition === 'right' && icon && (
            <span className="ml-1">{icon}</span>
          )}
        </span>
        
        {variant === 'neon' && (
          <div className="absolute inset-0 rounded-lg border border-[#39FF14]/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        )}
      </button>
    );
  }
);

TechButton.displayName = 'TechButton';

export default TechButton;