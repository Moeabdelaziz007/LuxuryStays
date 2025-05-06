import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light' | 'neon';
  withText?: boolean;
}

export default function Logo({ className, size = 'md', variant = 'neon', withText = true }: LogoProps) {
  // Size mapping
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
    xl: 'h-16',
  };
  
  // X size is slightly bigger for visual balance
  const xSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };
  
  // Text size is matched to logo size
  const textSizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
  };
  
  // Determine colors based on variant
  const colorClasses = {
    dark: {
      text: 'text-white',
      x: 'text-white', 
    },
    light: {
      text: 'text-black',
      x: 'text-black',
    },
    neon: {
      text: 'text-white',
      x: 'text-[#39FF14] drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]', 
    },
  };
  
  return (
    <div className={cn('flex items-center', className)}>
      {withText ? (
        <div className={cn('font-bold tracking-tight flex items-center', textSizeClasses[size])}>
          <span className={colorClasses[variant].text}>
            Stay
          </span>
          <span className={cn(
            colorClasses[variant].x,
            xSizeClasses[size],
            'font-extrabold relative'
          )}>
            <span className="relative z-10">X</span>
            {variant === 'neon' && (
              <span className="absolute inset-0 z-0 blur-[2px] text-[#39FF14]/70">X</span>
            )}
          </span>
        </div>
      ) : (
        <div className={cn(
          'font-extrabold relative',
          colorClasses[variant].x,
          xSizeClasses[size]
        )}>
          <span className="relative z-10">X</span>
          {variant === 'neon' && (
            <span className="absolute inset-0 z-0 blur-[2px] text-[#39FF14]/70">X</span>
          )}
        </div>
      )}
    </div>
  );
}