import { cn } from '@/lib/utils';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LogoProps {
  linkToHome?: boolean;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'dark' | 'light' | 'neon' | 'glass' | 'futuristic';
  withText?: boolean;
  position?: 'default' | 'top-right' | 'top-left' | 'center';
  withAnimation?: boolean;
  animationType?: 'pulse' | 'float' | 'rotate' | 'glow' | 'none' | 'futuristic' | 'holographic';
  interactive?: boolean;
}

export default function Logo({ 
  className, 
  size = 'md', 
  variant = 'neon', 
  withText = true, 
  position = 'default',
  withAnimation = false,
  animationType = 'pulse',
  linkToHome = true,
  interactive = false
}: LogoProps) {
  const [hovered, setHovered] = useState(false);
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
  
  // For futuristic mode, trigger special animation when loaded
  useEffect(() => {
    if (variant === 'futuristic' || animationType === 'futuristic' || animationType === 'holographic') {
      setTimeout(() => {
        setAnimationTriggered(true);
      }, 500);
    }
  }, [variant, animationType]);
  
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
      x: 'text-[#39FF14] drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]', 
    },
    glass: {
      text: 'text-white/90',
      x: 'text-[#39FF14]/90 backdrop-blur-sm', 
    },
    futuristic: {
      text: 'text-[#39FF14]',
      x: 'text-white',
    },
    // احتياطي لأي قيمة غير متوقعة
    holographic: {
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

  // Animation classes
  const animationClass = withAnimation 
    ? variant === 'neon' || variant === 'futuristic'
      ? animationType === 'pulse' ? 'animate-neon-pulse' 
        : animationType === 'float' ? 'animate-float' 
        : animationType === 'rotate' ? 'animate-spin-slow' 
        : animationType === 'glow' ? 'animate-glow'
        : animationType === 'futuristic' ? 'animate-none' // Custom handling
        : animationType === 'holographic' ? 'animate-none' // Custom handling
        : ''
      : 'animate-pulse'
    : '';

  // Enhanced X element with special effects based on variants
  const getXElement = () => {
    if (variant === 'futuristic') {
      return (
        <span 
          className={cn(
            'font-extrabold relative transition-all duration-300',
            xSizeClasses[size],
            'text-white', // White X for futuristic variant
            hovered ? 'drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]' : 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'
          )}
        >
          <motion.span 
            className="relative z-10"
            animate={hovered ? {
              textShadow: [
                '0 0 4px rgba(255,255,255,0.8)', 
                '0 0 12px rgba(255,255,255,0.9)', 
                '0 0 4px rgba(255,255,255,0.8)'
              ]
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            X
          </motion.span>

          {/* Holographic effects */}
          <span className="absolute inset-0 z-0 blur-[2px] text-white/70">X</span>
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

          {animationTriggered && (
            <motion.div
              className="absolute inset-0 z-0"
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: [0, 0.8, 0], scale: [1.5, 1, 1.5] }}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              <span className="absolute inset-0 blur-[15px] text-white">X</span>
            </motion.div>
          )}

          {/* Circuit-like details - more subtle for X */}
          <div className="absolute -top-1 right-0 w-1 h-1 bg-white rounded-full animate-pulse-slow"></div>
          <div className="absolute top-1/2 -right-1 w-0.5 h-3 bg-white/30 rounded-full"></div>
        </span>
      );
    }
    
    if (animationType === 'holographic') {
      return (
        <motion.span 
          className={cn(
            xSizeClasses[size],
            'font-extrabold relative overflow-visible',
            'text-white', // Always white for holographic
          )}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <span className="relative z-10">X</span>
          <div className="absolute inset-0 z-0 blur-[2px] text-white/70">X</div>
          <div className="absolute inset-0 z-0 blur-[4px] text-[#39FF14]/30 animate-pulse-slow">X</div>
          <div className="absolute inset-0 z-0 blur-[10px] text-blue-400/20 animate-pulse-very-slow">X</div>
          
          {/* Scan line effect */}
          <motion.div 
            className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent z-20"
            animate={{ 
              top: ["0%", "100%"],
              opacity: [0, 1, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          
          {/* RGB chromatic aberration effect */}
          <div className="absolute inset-0 z-0 blur-[1px] text-red-500/10 translate-x-[1px] translate-y-[1px]">X</div>
          <div className="absolute inset-0 z-0 blur-[1px] text-blue-500/10 -translate-x-[1px] -translate-y-[1px]">X</div>
        </motion.span>
      );
    }

    // استخدام safeVariant للتأكد من عدم وجود أخطاء
    const safeVariant = colorClasses[variant] ? variant : 'futuristic';
    return (
      <span className={cn(
        colorClasses[safeVariant].x,
        xSizeClasses[size],
        'font-extrabold relative'
      )}>
        <span className="relative z-10">X</span>
        {safeVariant === 'neon' && (
          <>
            <span className="absolute inset-0 z-0 blur-[2px] text-[#39FF14]/70">X</span>
            <span className="absolute inset-0 z-0 blur-[4px] text-[#39FF14]/30 animate-neon-pulse" style={{ animationDelay: '0.5s' }}>X</span>
            <span className="absolute inset-0 z-0 blur-[8px] text-[#39FF14]/10 animate-pulse" style={{ animationDelay: '1s' }}>X</span>
          </>
        )}
        {safeVariant === 'glass' && (
          <>
            <span className="absolute inset-0 z-0 blur-[2px] text-[#39FF14]/60">X</span>
            <span className="absolute inset-0 z-0 blur-[6px] text-[#39FF14]/20 animate-neon-pulse" style={{ animationDelay: '0.7s' }}>X</span>
          </>
        )}
      </span>
    );
  };

  // Get enhanced Stay text element with futuristic tech effects
  const getStayElement = () => {
    if (variant === 'futuristic') {
      return (
        <motion.span 
          className={cn(
            "relative mr-0.5 font-bold",
            "text-[#39FF14]", // Neon green text for "Stay"
            hovered ? 'drop-shadow-[0_0_12px_rgba(57,255,20,0.8)]' : 'drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]'
          )}
          animate={hovered ? {
            textShadow: [
              '0 0 4px rgba(57,255,20,0.8)', 
              '0 0 12px rgba(57,255,20,0.9)', 
              '0 0 4px rgba(57,255,20,0.8)'
            ]
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="relative z-10">Stay</span>
          
          {/* Tech circuit details only visible on hover or futuristic mode */}
          <div className="absolute -top-1 left-0 w-6 h-[1px] bg-[#39FF14]/40"></div>
          <div className="absolute -top-1 left-0 w-[1px] h-2 bg-[#39FF14]/40"></div>
          <div className="absolute -bottom-1 right-0 w-4 h-[1px] bg-[#39FF14]/40"></div>
          <div className="absolute -bottom-1 right-0 w-[1px] h-2 bg-[#39FF14]/40"></div>
          
          {/* Active dots */}
          <div className="absolute -top-1 left-0 w-1 h-1 bg-[#39FF14] rounded-full animate-pulse-slow"></div>
          <div className="absolute -bottom-1 right-0 w-1 h-1 bg-[#39FF14] rounded-full animate-blink"></div>
        </motion.span>
      );
    }
    
    if (animationType === 'holographic') {
      return (
        <motion.span 
          className={cn(
            "relative mr-0.5 font-bold",
            "text-[#39FF14]", // Neon green for Stay
          )}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <span className="relative z-10">Stay</span>
          
          {/* Holographic layers */}
          <div className="absolute inset-0 z-0 blur-[2px] text-[#39FF14]/70">Stay</div>
          <div className="absolute inset-0 z-0 blur-[4px] text-[#39FF14]/30 animate-pulse-slow">Stay</div>
          <div className="absolute inset-0 z-0 blur-[10px] text-[#39FF14]/10 animate-pulse-very-slow">Stay</div>
          
          {/* Scan line effect */}
          <motion.div 
            className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#39FF14]/80 to-transparent z-20"
            animate={{ 
              top: ["0%", "100%"],
              opacity: [0, 1, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
          />
        </motion.span>
      );
    }
    
    // استخدام safeVariant للتأكد من عدم وجود أخطاء
    const safeVariant = colorClasses[variant] ? variant : 'futuristic';
    return (
      <span className={cn(colorClasses[safeVariant].text, "mr-0.5")}>
        Stay
      </span>
    );
  };

  // Enhanced tech accent lines and effects
  const getFuturisticAccent = () => (
    <div className="absolute -bottom-1 left-0 right-0 flex flex-col space-y-0.5 opacity-70 pointer-events-none">
      {/* Main accent line with animation */}
      <div className="relative h-[1px] w-full overflow-hidden">
        <div className="h-full w-full bg-gradient-to-r from-[#39FF14]/80 via-[#39FF14]/40 to-transparent"></div>
        
        {/* Moving light effect */}
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
      </div>
      
      {/* Secondary accents */}
      <div className="flex justify-between items-center">
        <div className="h-[1px] w-1/4 bg-gradient-to-r from-[#39FF14]/60 to-transparent"></div>
        <div className="h-1 w-1 rounded-full bg-[#39FF14] animate-pulse-slow"></div>
        <div className="h-[1px] w-1/5 bg-gradient-to-l from-[#39FF14]/40 to-transparent"></div>
      </div>
    </div>
  );

  // Branded tech accent lines
  const getBrandAccent = () => {
    // استخدام safeVariant للتأكد من عدم وجود أخطاء
    const safeVariant = colorClasses[variant] ? variant : 'futuristic';
    
    return safeVariant === 'futuristic'
      ? getFuturisticAccent()
      : (
        <div className="absolute -bottom-1 left-0 right-0 flex justify-between items-center opacity-70 pointer-events-none">
          <div className="h-px w-3/5 bg-gradient-to-r from-[#39FF14]/80 to-transparent"></div>
          <div className="h-1 w-1 rounded-full bg-[#39FF14]"></div>
        </div>
      );
  };

  // Content wrapper based on linkToHome
  const LogoContent = () => {
    // تأكد من أن متغير variant موجود في colorClasses
    const safeVariant = colorClasses[variant] ? variant : 'futuristic';
    
    // Base content without animations
    const baseContent = (
      <div 
        className={cn(
          'flex items-center cursor-pointer relative group', 
          positionClasses[position],
          animationClass,
          className
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {withText ? (
          <div className={cn('font-bold tracking-tight flex items-center relative', textSizeClasses[size])}>
            {getStayElement()}
            {getXElement()}
            {(safeVariant === 'neon' || safeVariant === 'futuristic') && getBrandAccent()}
          </div>
        ) : (
          <div className="relative">
            {getXElement()}
            {(safeVariant === 'neon' || safeVariant === 'futuristic') && getBrandAccent()}
          </div>
        )}
        
        {/* Hover effects */}
        {(safeVariant === 'neon' || safeVariant === 'futuristic') && (
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
        
        {/* Interactive particle effect on hover for futuristic mode */}
        {interactive && hovered && safeVariant === 'futuristic' && (
          <motion.div 
            className="absolute -inset-4 pointer-events-none z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1 w-1 bg-[#39FF14] rounded-full"
                initial={{ 
                  x: 0, 
                  y: 0, 
                  opacity: 0.7,
                  scale: Math.random() * 0.5 + 0.5 
                }}
                animate={{ 
                  x: (Math.random() - 0.5) * 60, 
                  y: (Math.random() - 0.5) * 60,
                  opacity: 0,
                  scale: 0
                }}
                transition={{ 
                  duration: 1 + Math.random(),
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: i * 0.1
                }}
              />
            ))}
          </motion.div>
        )}
      </div>
    );
    
    // Apply framer motion animations for more complex effects
    if (withAnimation && animationType !== 'none' && animationType !== 'pulse' && animationType !== 'futuristic' && animationType !== 'holographic') {
      let animationProps = {};
      
      switch (animationType) {
        case 'float':
          animationProps = {
            y: [0, -8, 0],
            transition: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }
          };
          break;
        case 'rotate':
          animationProps = {
            rotateY: [0, 10, 0, -10, 0],
            transition: {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          };
          break;
        case 'glow':
          animationProps = {
            filter: ["drop-shadow(0 0 2px rgba(57,255,20,0.3))", "drop-shadow(0 0 8px rgba(57,255,20,0.7))", "drop-shadow(0 0 2px rgba(57,255,20,0.3))"],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          };
          break;
      }
      
      return (
        <motion.div animate={animationProps}>
          {baseContent}
        </motion.div>
      );
    }
    
    // Special animations for futuristic and holographic
    if (animationType === 'futuristic') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: {
              duration: 0.6,
              ease: "easeOut"
            }
          }}
        >
          {baseContent}
        </motion.div>
      );
    }
    
    if (animationType === 'holographic') {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: {
              duration: 0.5,
              ease: "easeOut"
            }
          }}
          whileHover={{
            scale: 1.05,
            transition: {
              duration: 0.2,
              ease: "easeOut"
            }
          }}
        >
          {baseContent}
        </motion.div>
      );
    }
    
    return baseContent;
  };

  // Return with or without Link based on linkToHome prop
  return linkToHome ? (
    <Link to="/">
      <LogoContent />
    </Link>
  ) : (
    <LogoContent />
  );
}