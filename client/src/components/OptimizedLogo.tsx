import { cn } from '@/lib/utils';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePerformanceMode, PerformanceMode } from '@/hooks/use-performance-mode';

interface OptimizedLogoProps {
  linkToHome?: boolean;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'dark' | 'light' | 'neon' | 'glass' | 'futuristic';
  withText?: boolean;
  position?: 'default' | 'top-right' | 'top-left' | 'center';
}

/**
 * نسخة محسنة من شعار التطبيق تراعي أداء الجهاز
 * تقلل من المؤثرات البصرية والرسوم المتحركة على الأجهزة الضعيفة
 */
export default function OptimizedLogo({ 
  className, 
  size = 'md', 
  variant = 'neon', 
  withText = true, 
  position = 'default',
  linkToHome = true,
}: OptimizedLogoProps) {
  const [hovered, setHovered] = useState(false);
  const [settings] = usePerformanceMode();
  const [animationTriggered, setAnimationTriggered] = useState(false);

  // Size mapping
  const sizeClasses = {
    xs: 'h-6',
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
    xl: 'h-16',
    '2xl': 'h-24',
  };
  
  // X size is slightly bigger for visual balance
  const xSizeClasses = {
    xs: 'text-lg',
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
    '2xl': 'text-6xl',
  };
  
  // Text size is matched to logo size
  const textSizeClasses = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
    '2xl': 'text-4xl',
  };
  
  // For futuristic mode, trigger special animation when loaded (but only for high performance mode)
  useEffect(() => {
    if (variant === 'futuristic' && settings.useHeavyAnimations) {
      setTimeout(() => {
        setAnimationTriggered(true);
      }, 500);
    }
  }, [variant, settings.useHeavyAnimations]);
  
  // Determine colors based on variant
  const colorClasses = {
    dark: {
      text: 'text-gray-900',
      x: 'text-gray-900', 
    },
    light: {
      text: 'text-white',
      x: 'text-white',
    },
    neon: {
      text: 'text-white',
      x: 'text-[#39FF14]', 
    },
    glass: {
      text: 'text-white/90',
      x: 'text-[#39FF14]/90', 
    },
    futuristic: {
      text: 'text-[#39FF14]',
      x: 'text-white',
    }
  };
  
  // Position classes
  const positionClasses = {
    default: '',
    'top-right': 'absolute top-4 right-4',
    'top-left': 'absolute top-4 left-4',
    center: 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
  };

  // تحديد أي نوع من التأثيرات سيتم استخدامه بناءً على إعدادات الأداء
  const shouldUseComplexEffects = settings.useComplexShadows;
  const shouldUseGlowing = settings.useGlowing;
  const shouldUseHologramEffects = settings.useHologramEffects;
  const shouldUseHeavyAnimations = settings.useHeavyAnimations;

  // Enhanced X element with special effects based on variants AND performance settings
  const getXElement = () => {
    // تحقق من إعدادات الأداء لتحديد نوع التأثيرات التي سيتم استخدامها
    if (variant === 'futuristic' && shouldUseHologramEffects) {
      return (
        <span 
          className={cn(
            'font-extrabold relative transition-all duration-300',
            xSizeClasses[size],
            'text-white', // White X for futuristic variant
            shouldUseGlowing && hovered ? 'drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]' : 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'
          )}
        >
          <span className="relative z-10">X</span>

          {/* Holographic effects - only if performance allows */}
          {shouldUseComplexEffects && (
            <>
              <span className="absolute inset-0 z-0 blur-[2px] text-white/70">X</span>
              {shouldUseHeavyAnimations && (
                <>
                  <motion.span 
                    className="absolute inset-0 z-0 blur-[4px] text-white/30" 
                    style={{ animationDelay: '0.5s' }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    X
                  </motion.span>
                  <motion.span 
                    className="absolute inset-0 z-0 blur-[8px] text-white/10" 
                    style={{ animationDelay: '1s' }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    X
                  </motion.span>
                </>
              )}
            </>
          )}

          {/* Flashy animation for high performance only */}
          {shouldUseHeavyAnimations && animationTriggered && (
            <motion.div
              className="absolute inset-0 z-0"
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: [0, 0.8, 0], scale: [1.5, 1, 1.5] }}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              <span className="absolute inset-0 blur-[15px] text-white">X</span>
            </motion.div>
          )}

          {/* Circuit-like details - only if using hologram effects */}
          {shouldUseHologramEffects && (
            <>
              <div className="absolute -top-1 right-0 w-1 h-1 bg-white rounded-full animate-pulse-slow"></div>
              <div className="absolute top-1/2 -right-1 w-0.5 h-3 bg-white/30 rounded-full"></div>
            </>
          )}
        </span>
      );
    }
    
    // استخدام safeVariant للتأكد من عدم وجود أخطاء
    const safeVariant = colorClasses[variant] ? variant : 'neon';
    return (
      <span className={cn(
        colorClasses[safeVariant].x,
        xSizeClasses[size],
        'font-extrabold relative',
        shouldUseGlowing && safeVariant === 'neon' ? 'drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]' : ''
      )}>
        <span className="relative z-10">X</span>
        {safeVariant === 'neon' && shouldUseComplexEffects && (
          <>
            <span className="absolute inset-0 z-0 blur-[2px] text-[#39FF14]/70">X</span>
            {shouldUseHeavyAnimations && (
              <>
                <span className="absolute inset-0 z-0 blur-[4px] text-[#39FF14]/30 animate-neon-pulse" style={{ animationDelay: '0.5s' }}>X</span>
                <span className="absolute inset-0 z-0 blur-[8px] text-[#39FF14]/10 animate-pulse" style={{ animationDelay: '1s' }}>X</span>
              </>
            )}
          </>
        )}
      </span>
    );
  };

  // Get enhanced Stay text element with performance-aware tech effects
  const getStayElement = () => {
    if (variant === 'futuristic' && shouldUseHologramEffects) {
      return (
        <motion.span 
          className={cn(
            "relative mr-0.5 font-bold",
            "text-[#39FF14]", // Neon green text for "Stay"
            shouldUseGlowing && hovered ? 'drop-shadow-[0_0_12px_rgba(57,255,20,0.8)]' : 'drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]'
          )}
          animate={shouldUseHeavyAnimations && hovered ? {
            textShadow: [
              '0 0 4px rgba(57,255,20,0.8)', 
              '0 0 12px rgba(57,255,20,0.9)', 
              '0 0 4px rgba(57,255,20,0.8)'
            ]
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="relative z-10">Stay</span>
          
          {/* Tech circuit details only if performance allows */}
          {shouldUseComplexEffects && (
            <>
              <div className="absolute -top-1 left-0 w-6 h-[1px] bg-[#39FF14]/40"></div>
              <div className="absolute -top-1 left-0 w-[1px] h-2 bg-[#39FF14]/40"></div>
              <div className="absolute -bottom-1 right-0 w-4 h-[1px] bg-[#39FF14]/40"></div>
              <div className="absolute -bottom-1 right-0 w-[1px] h-2 bg-[#39FF14]/40"></div>
            </>
          )}
          
          {/* Active dots for high performance mode */}
          {shouldUseHeavyAnimations && (
            <>
              <div className="absolute -top-1 left-0 w-1 h-1 bg-[#39FF14] rounded-full animate-pulse-slow"></div>
              <div className="absolute -bottom-1 right-0 w-1 h-1 bg-[#39FF14] rounded-full animate-pulse-slow"></div>
            </>
          )}
        </motion.span>
      );
    }
    
    // استخدام safeVariant للتأكد من عدم وجود أخطاء
    const safeVariant = colorClasses[variant] ? variant : 'neon';
    return (
      <span className={cn(
        colorClasses[safeVariant].text, 
        "mr-0.5",
        shouldUseGlowing && safeVariant === 'neon' ? 'drop-shadow-[0_0_5px_rgba(57,255,20,0.5)]' : ''
      )}>
        Stay
      </span>
    );
  };

  // Enhanced tech accent lines - performance-aware
  const getBrandAccent = () => {
    // استخدام safeVariant للتأكد من عدم وجود أخطاء
    const safeVariant = colorClasses[variant] ? variant : 'neon';
    
    if (!shouldUseComplexEffects) {
      return (
        <div className="absolute -bottom-1 left-0 right-0">
          <div className="h-px w-3/5 bg-gradient-to-r from-[#39FF14]/60 to-transparent"></div>
        </div>
      );
    }
    
    return (
      <div className="absolute -bottom-1 left-0 right-0 flex flex-col space-y-0.5 opacity-70 pointer-events-none">
        {/* Main accent line with animation for high performance */}
        <div className="relative h-[1px] w-full overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-[#39FF14]/80 via-[#39FF14]/40 to-transparent"></div>
          
          {/* Moving light effect only for higher performance */}
          {shouldUseHeavyAnimations && (
            <motion.div 
              className="absolute top-0 h-full w-6 bg-gradient-to-r from-transparent via-white to-transparent"
              animate={{ 
                left: ["-10%", "110%"],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                repeatDelay: 3
              }}
            />
          )}
        </div>
        
        {/* Secondary accents only if complex shadows enabled */}
        {shouldUseComplexEffects && (
          <div className="flex justify-between items-center">
            <div className="h-[1px] w-1/4 bg-gradient-to-r from-[#39FF14]/60 to-transparent"></div>
            {shouldUseHeavyAnimations && (
              <div className="h-1 w-1 rounded-full bg-[#39FF14] animate-pulse-slow"></div>
            )}
            <div className="h-[1px] w-1/5 bg-gradient-to-l from-[#39FF14]/40 to-transparent"></div>
          </div>
        )}
      </div>
    );
  };

  // Content
  const logoContent = (
    <div 
      className={cn(
        'flex items-center cursor-pointer relative group', 
        positionClasses[position],
        shouldUseHeavyAnimations ? 'animate-neon-pulse' : '',
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {withText ? (
        <div className={cn('font-bold tracking-tight flex items-center relative', textSizeClasses[size])}>
          {getStayElement()}
          {getXElement()}
          {(variant === 'neon' || variant === 'futuristic') && getBrandAccent()}
        </div>
      ) : (
        <div className="relative">
          {getXElement()}
          {(variant === 'neon' || variant === 'futuristic') && getBrandAccent()}
        </div>
      )}
      
      {/* Interactive hover effect only for high performance mode */}
      {shouldUseComplexEffects && shouldUseHologramEffects && (
        <motion.div 
          className="absolute -inset-2 rounded-md pointer-events-none z-0"
          animate={hovered ? { 
            backgroundColor: 'rgba(57, 255, 20, 0.07)',
            boxShadow: '0 0 20px 2px rgba(57, 255, 20, 0.08)'
          } : { 
            backgroundColor: 'rgba(57, 255, 20, 0)',
            boxShadow: '0 0 0px 0px rgba(57, 255, 20, 0)'
          }}
          transition={{ duration: 0.3 }}
        />
      )}
    </div>
  );

  // Wrap with link if needed
  if (linkToHome) {
    return (
      <Link href="/" className="no-underline">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}