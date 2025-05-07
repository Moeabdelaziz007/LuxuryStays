import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Futuristic Branding component to showcase StayX visual identity
 * with tech/space themed animations and styles
 */
export default function FuturisticBranding() {
  const [activeVariant, setActiveVariant] = useState<string>('futuristic');
  const [activeAnimation, setActiveAnimation] = useState<string>('futuristic');
  const [activeSize, setActiveSize] = useState<string>('xl');
  
  // List of available logo variants
  const variants = [
    { id: 'futuristic', name: 'Futuristic', description: 'Stay in green, X in white with tech circuit accents' },
    { id: 'neon', name: 'Neon', description: 'Classic neon effect with glowing elements' },
    { id: 'holographic', name: 'Holographic', description: 'Holographic effect with scan lines and depth' },
    { id: 'glass', name: 'Glass', description: 'Glass morphism effect with transparency' },
    { id: 'dark', name: 'Dark', description: 'Dark mode variant for contrast' },
    { id: 'light', name: 'Light', description: 'Light mode variant' },
  ];
  
  // List of animations
  const animations = [
    { id: 'futuristic', name: 'Tech Aura', description: 'Dynamic futuristic animation with tech details' },
    { id: 'holographic', name: 'Hologram', description: 'Holographic scan effect with depth' },
    { id: 'float', name: 'Float', description: 'Gentle floating motion' },
    { id: 'pulse', name: 'Pulse', description: 'Subtle pulsing glow effect' },
    { id: 'glow', name: 'Glow', description: 'Radiating glow effect' },
    { id: 'rotate', name: 'Rotate', description: '3D perspective rotation' },
    { id: 'none', name: 'None', description: 'No animation' },
  ];
  
  // Available sizes
  const sizes = [
    { id: 'sm', name: 'Small' },
    { id: 'md', name: 'Medium' },
    { id: 'lg', name: 'Large' },
    { id: 'xl', name: 'Extra Large' },
    { id: '2xl', name: 'Huge' },
  ];
  
  // Randomize settings
  const randomize = () => {
    setActiveVariant(variants[Math.floor(Math.random() * variants.length)].id);
    setActiveAnimation(animations[Math.floor(Math.random() * animations.length)].id);
    setActiveSize(sizes[Math.floor(Math.random() * sizes.length)].id);
  };
  
  return (
    <div className="w-full space-y-8 py-8">
      {/* Logo Showcase Section */}
      <div className="relative rounded-xl border border-[#39FF14]/20 bg-black p-8 overflow-hidden">
        {/* Tech Grid Background */}
        <div className="absolute inset-0 tech-grid-bg opacity-20"></div>
        
        {/* Animated Particle Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 bg-[#39FF14] rounded-full animate-star-twinkle"
              style={{ 
                top: `${Math.random() * 100}%`, 
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        
        {/* Scan Effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[#39FF14]/5 to-transparent"
          animate={{ 
            top: ['-100%', '100%'],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 5,
            ease: 'linear',
            repeatDelay: 5
          }}
        />
        
        {/* Logo Showcase */}
        <div className="relative flex flex-col items-center justify-center min-h-[300px]">
          <Logo 
            size={activeSize as any}
            variant={activeVariant as any}
            withAnimation={activeAnimation !== 'none'}
            animationType={activeAnimation as any}
            interactive={true}
          />
          
          <div className="mt-10 text-center">
            <h3 className="text-[#39FF14] font-bold">StayX Futuristic Space Branding</h3>
            <p className="text-gray-400 text-sm mt-2">Variant: {activeVariant} | Animation: {activeAnimation} | Size: {activeSize}</p>
          </div>
        </div>
      </div>
      
      {/* Controls for Logo Customization */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Variant Selection */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="border-b border-gray-800 pb-3">
            <CardTitle className="text-[#39FF14] text-lg">Logo Variant</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-2">
              {variants.map(variant => (
                <button
                  key={variant.id}
                  className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                    activeVariant === variant.id 
                      ? 'bg-[#39FF14] text-black font-medium' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveVariant(variant.id)}
                  title={variant.description}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Animation Selection */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="border-b border-gray-800 pb-3">
            <CardTitle className="text-[#39FF14] text-lg">Animation Style</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-2">
              {animations.map(animation => (
                <button
                  key={animation.id}
                  className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                    activeAnimation === animation.id 
                      ? 'bg-[#39FF14] text-black font-medium' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveAnimation(animation.id)}
                  title={animation.description}
                >
                  {animation.name}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Size Selection */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="border-b border-gray-800 pb-3">
            <CardTitle className="text-[#39FF14] text-lg">Logo Size</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => (
                <button
                  key={size.id}
                  className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                    activeSize === size.id 
                      ? 'bg-[#39FF14] text-black font-medium' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveSize(size.id)}
                >
                  {size.name}
                </button>
              ))}
            </div>
            
            <button
              className="mt-4 w-full bg-gray-800 text-[#39FF14] py-2 rounded-md hover:bg-gray-700 transition-colors border border-[#39FF14]/30"
              onClick={randomize}
            >
              Randomize
            </button>
          </CardContent>
        </Card>
      </div>
      
      {/* Futuristic Tech Details */}
      <div className="mt-8">
        <div className="flex items-center space-x-2 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-[#39FF14]/80 to-transparent"></div>
          <span className="text-[#39FF14] text-xs font-mono px-2 py-1 bg-black border border-[#39FF14]/30 rounded">Tech/Space Theme Details</span>
          <div className="h-px flex-1 bg-gradient-to-l from-[#39FF14]/80 to-transparent"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-900/60 border border-[#39FF14]/20 rounded-lg p-4 shadow-[0_0_15px_rgba(57,255,20,0.1)]">
            <h3 className="text-white font-medium mb-2 flex items-center">
              <span className="inline-block h-2 w-2 rounded-full bg-[#39FF14] mr-2 animate-pulse-slow"></span>
              Neon Tech Elements
            </h3>
            <p className="text-gray-400 text-sm">Electric neon effects with glowing elements and hover interactions</p>
          </div>
          
          <div className="bg-gray-900/60 border border-[#39FF14]/20 rounded-lg p-4 shadow-[0_0_15px_rgba(57,255,20,0.1)]">
            <h3 className="text-white font-medium mb-2 flex items-center">
              <span className="inline-block h-2 w-2 rounded-full bg-[#39FF14] mr-2 animate-pulse-slow"></span>
              Circuit Patterns
            </h3>
            <p className="text-gray-400 text-sm">Subtle tech circuit details that appear on hover and interaction</p>
          </div>
          
          <div className="bg-gray-900/60 border border-[#39FF14]/20 rounded-lg p-4 shadow-[0_0_15px_rgba(57,255,20,0.1)]">
            <h3 className="text-white font-medium mb-2 flex items-center">
              <span className="inline-block h-2 w-2 rounded-full bg-[#39FF14] mr-2 animate-pulse-slow"></span>
              Space Background
            </h3>
            <p className="text-gray-400 text-sm">Dark space background with subtle grid and particle animations</p>
          </div>
          
          <div className="bg-gray-900/60 border border-[#39FF14]/20 rounded-lg p-4 shadow-[0_0_15px_rgba(57,255,20,0.1)]">
            <h3 className="text-white font-medium mb-2 flex items-center">
              <span className="inline-block h-2 w-2 rounded-full bg-[#39FF14] mr-2 animate-pulse-slow"></span>
              Holographic Effects
            </h3>
            <p className="text-gray-400 text-sm">Advanced holographic animations with scan lines and 3D depth perception</p>
          </div>
        </div>
      </div>
    </div>
  );
}