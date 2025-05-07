import { cn } from '@/lib/utils';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

interface LogoProps {
  linkToHome?: boolean;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'dark' | 'light' | 'neon' | 'glass';
  withText?: boolean;
  position?: 'default' | 'top-right' | 'top-left' | 'center';
  withAnimation?: boolean;
  animationType?: 'pulse' | 'float' | 'rotate' | 'glow' | 'none';
}

export default function Logo({ 
  className, 
  size = 'md', 
  variant = 'neon', 
  withText = true, 
  position = 'default',
  withAnimation = false,
  animationType = 'pulse',
  linkToHome = true
}: LogoProps) {
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
    ? variant === 'neon' 
      ? animationType === 'pulse' ? 'animate-neon-pulse' 
        : animationType === 'float' ? 'animate-float' 
        : animationType === 'rotate' ? 'animate-spin-slow' 
        : animationType === 'glow' ? 'animate-glow' 
        : ''
      : 'animate-pulse'
    : '';

  const getXElement = () => (
    <span className={cn(
      colorClasses[variant].x,
      xSizeClasses[size],
      'font-extrabold relative'
    )}>
      <span className="relative z-10">X</span>
      {variant === 'neon' && (
        <>
          <span className="absolute inset-0 z-0 blur-[2px] text-[#39FF14]/70">X</span>
          <span className="absolute inset-0 z-0 blur-[4px] text-[#39FF14]/30 animate-neon-pulse" style={{ animationDelay: '0.5s' }}>X</span>
          <span className="absolute inset-0 z-0 blur-[8px] text-[#39FF14]/10 animate-pulse" style={{ animationDelay: '1s' }}>X</span>
        </>
      )}
      {variant === 'glass' && (
        <>
          <span className="absolute inset-0 z-0 blur-[2px] text-[#39FF14]/60">X</span>
          <span className="absolute inset-0 z-0 blur-[6px] text-[#39FF14]/20 animate-neon-pulse" style={{ animationDelay: '0.7s' }}>X</span>
        </>
      )}
    </span>
  );

  // Branded tech accent lines
  const brandAccent = (
    <div className="absolute -bottom-1 left-0 right-0 flex justify-between items-center opacity-70 pointer-events-none">
      <div className="h-px w-3/5 bg-gradient-to-r from-[#39FF14]/80 to-transparent"></div>
      <div className="h-1 w-1 rounded-full bg-[#39FF14]"></div>
    </div>
  );

  // Content wrapper based on linkToHome
  const LogoContent = () => {
    // Base content without animations
    const baseContent = (
      <div className={cn(
        'flex items-center cursor-pointer relative group', 
        positionClasses[position],
        animationClass,
        className
      )}>
        {withText ? (
          <div className={cn('font-bold tracking-tight flex items-center relative', textSizeClasses[size])}>
            <span className={cn(colorClasses[variant].text, "mr-0.5")}>
              Stay
            </span>
            {getXElement()}
            {variant === 'neon' && brandAccent}
          </div>
        ) : (
          <div className="relative">
            {getXElement()}
            {variant === 'neon' && brandAccent}
          </div>
        )}
        
        {/* Subtle hover effect */}
        {variant === 'neon' && (
          <div className="absolute -inset-1 bg-[#39FF14]/0 group-hover:bg-[#39FF14]/5 rounded-md transition-all duration-300 pointer-events-none"></div>
        )}
      </div>
    );
    
    // Apply framer motion animations for more complex effects
    if (withAnimation && animationType !== 'none' && animationType !== 'pulse') {
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