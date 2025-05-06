import { useEffect, useState } from 'react';
import { useNavigate } from 'wouter';
import Logo from '@/components/Logo';

export default function SplashScreen() {
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate()[1];

  useEffect(() => {
    // Start animation after a short delay
    const animationTimer = setTimeout(() => {
      setAnimate(true);
    }, 300);

    // Navigate to home page after animation completes
    const navigationTimer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(navigationTimer);
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <div className="relative">
        {/* Pulsing glow effect */}
        <div className={`absolute inset-0 rounded-full bg-[#39FF14]/20 blur-xl scale-150 transition-opacity duration-2000 ${
          animate ? 'opacity-70 animate-pulse' : 'opacity-0'
        }`}></div>
        
        {/* Logo with scale animation */}
        <div className={`relative transition-all duration-1000 ${
          animate ? 'scale-110' : 'scale-90 opacity-80'
        }`}>
          <Logo size="xl" variant="neon" withText={true} />
        </div>
        
        {/* Neon flicker effect */}
        <div className={`absolute inset-0 bg-[#39FF14]/10 mix-blend-overlay filter blur-md rounded-full transition-opacity duration-300 ${
          animate ? 'opacity-100 animate-neon-flicker' : 'opacity-0'
        }`}></div>
        
        {/* Tagline that fades in */}
        <div className={`absolute -bottom-12 left-0 right-0 text-center text-white font-light text-lg tracking-wider transition-all duration-1000 ${
          animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          نغير كيف تقيم، كيف تستكشف، كيف تستمتع
        </div>
      </div>
    </div>
  );
}