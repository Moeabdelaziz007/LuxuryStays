import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import Logo from '@/components/Logo';
import SpaceBackground from '@/components/ui/space-background';

export default function SplashScreen() {
  const [animate, setAnimate] = useState(false);
  const [_, navigate] = useLocation();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start animation after a short delay
    const animationTimer = setTimeout(() => {
      setAnimate(true);
    }, 500);

    // ProgressBar simulation
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + (Math.random() * 5);
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 150);

    // Navigate to home page after animation completes
    const navigationTimer = setTimeout(() => {
      navigate('/');
    }, 5500);

    // Animate grid - tech effect
    if (gridRef.current) {
      const grid = gridRef.current;
      const onMouseMove = (e: MouseEvent) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        grid.style.setProperty('--x-offset', `${x * 10}px`);
        grid.style.setProperty('--y-offset', `${y * 10}px`);
      };
      
      window.addEventListener('mousemove', onMouseMove);
      
      return () => {
        clearTimeout(animationTimer);
        clearTimeout(navigationTimer);
        clearInterval(progressInterval);
        window.removeEventListener('mousemove', onMouseMove);
      };
    }

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(navigationTimer);
      clearInterval(progressInterval);
    };
  }, [navigate]);

  return (
    <SpaceBackground withGrid={true} withNebula={true} density="high" withScanlines={true}>
      <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-transparent">
        {/* Interactive Grid Layer */}
        <div 
          ref={gridRef}
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(57, 255, 20, 0.3) 1px, transparent 1px), 
                              linear-gradient(90deg, rgba(57, 255, 20, 0.3) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            backgroundPosition: 'calc(50% + var(--x-offset, 0px)) calc(50% + var(--y-offset, 0px))',
            transition: 'background-position 0.2s ease',
          }}
        />
        
        {/* Hexagonal Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(5)">
              <polygon 
                points="24.8,22 37.3,29.2 37.3,43.7 24.8,50.9 12.4,43.7 12.4,29.2" 
                fill="none" 
                stroke="#39FF14" 
                strokeWidth="0.5" 
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#hexagons)" />
          </svg>
        </div>
        
        {/* Central Elements Container */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Circular Glow Effect */}
          <div className={`absolute inset-0 rounded-full bg-[#39FF14]/20 blur-3xl scale-150 transition-all duration-2000 ${
            animate ? 'opacity-70 animate-pulse-slow' : 'opacity-0'
          }`}></div>
          
          {/* Rotating Border Effect */}
          <div className={`absolute w-80 h-80 border border-[#39FF14]/30 rounded-full transition-all duration-2000 ${
            animate ? 'opacity-50 animate-spin-slow' : 'opacity-0 scale-95'
          }`} style={{ animationDuration: '20s' }}></div>
          
          <div className={`absolute w-96 h-96 border border-[#39FF14]/20 rounded-full transition-all duration-2000 ${
            animate ? 'opacity-40 animate-spin-slow' : 'opacity-0 scale-95'
          }`} style={{ animationDirection: 'reverse', animationDuration: '25s' }}></div>
          
          {/* Scanner Light Effect */}
          <div className={`absolute h-full w-2 bg-gradient-to-b from-transparent via-[#39FF14]/70 to-transparent transition-opacity duration-500 ${
            animate ? 'opacity-70 animate-scanner' : 'opacity-0'
          }`} style={{ 
            animation: animate ? 'scanner 3s ease-in-out infinite alternate' : 'none',
          }}></div>

          <style jsx>{`
            @keyframes scanner {
              0%, 100% { transform: translateX(-100px) scaleY(1.2); }
              50% { transform: translateX(100px) scaleY(0.8); }
            }
            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
          
          {/* Logo with Scale Animation */}
          <div className={`relative transition-all duration-1000 splash-logo-glow ${
            animate ? 'scale-110' : 'scale-90 opacity-80'
          }`}>
            <Logo 
              size="xl" 
              variant="neon" 
              withText={true} 
              withAnimation={animate}
            />
          </div>
          
          {/* Neon Flicker Effect */}
          <div className={`absolute inset-0 bg-[#39FF14]/10 mix-blend-overlay filter blur-md rounded-full transition-opacity duration-300 ${
            animate ? 'opacity-100 animate-neon-flicker' : 'opacity-0'
          }`}></div>
          
          {/* Tagline with Fade-in Effect */}
          <div className={`mt-16 text-center transition-all duration-1000 ${
            animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="text-[#39FF14]/90 mb-2 tracking-widest font-medium text-xl">
              صيف ٢٠٢٥
            </div>
            <div className="text-white/90 font-light text-lg tracking-wider rtl-text">
              نغير كيف تقيم، كيف تستكشف، كيف تستمتع
            </div>
          </div>
          
          {/* Tech-style Loading Progress Bar */}
          <div className={`mt-10 w-64 h-1 bg-gray-800/50 rounded-full overflow-hidden transition-opacity duration-1000 ${
            loadingProgress < 100 ? 'opacity-100' : 'opacity-0'
          }`}>
            <div 
              className="h-full bg-[#39FF14] rounded-full"
              style={{ 
                width: `${loadingProgress}%`,
                transition: 'width 0.3s ease-out',
                boxShadow: '0 0 8px rgba(57, 255, 20, 0.7)'
              }}
            ></div>
          </div>
          
          {/* System Initialization Text */}
          <div className={`mt-3 text-xs text-white/60 font-mono transition-opacity duration-300 ${
            loadingProgress < 100 ? 'opacity-70' : 'opacity-0'
          }`}>
            جاري تهيئة النظام... {Math.floor(loadingProgress)}%
          </div>
        </div>
        
        {/* Bottom Horizontal Line */}
        <div className={`absolute bottom-24 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/70 to-transparent transition-opacity duration-1000 ${
          animate ? 'opacity-80' : 'opacity-0'
        }`}></div>
        
        {/* Small Circular Elements */}
        <div className={`absolute bottom-36 left-1/2 transform -translate-x-1/2 flex space-x-3 transition-opacity duration-1000 ${
          animate ? 'opacity-100' : 'opacity-0'
        }`}>
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className="w-2 h-2 rounded-full bg-[#39FF14]/80"
              style={{ 
                animationDelay: `${i * 0.3}s`,
                animation: animate ? 'pulse-subtle 1.5s infinite' : 'none'
              }}
            ></div>
          ))}
        </div>
      </div>
    </SpaceBackground>
  );
}