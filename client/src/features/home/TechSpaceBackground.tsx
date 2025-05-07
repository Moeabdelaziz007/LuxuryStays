import React from "react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

interface TechSpaceBackgroundProps {
  className?: string;
}

export default function TechSpaceBackground({ className = "" }: TechSpaceBackgroundProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Enhanced dark space gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-gray-900 z-0"></div>
      
      {/* Enhanced tech grid pattern with more defined lines */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzOUZGMTQiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMCAzaDR2MWgtNHYtMXptMCAzaDR2MWgtNHYtMXptLTYtNmg0djFoLTR2LTF6bTAgM2g0djFoLTR2LTF6bTAgM2g0djFoLTR2LTF6bS02LTZoNHYxaC00di0xem0wIDNoNHYxaC00di0xem0wIDNoNHYxaC00di0xem0wLTl2MWgtM1YzMWgzem0wIDNoLTN2MWgzdi0xem0wIDNoLTN2MWgzdi0xeiIvPjwvZz48L2c+PC9zdmc+')] opacity-15 z-1"></div>
      
      {/* Enhanced background pattern - circuit board style */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMzOUZGMTQiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0iMC4wOCIgZD0iTTMwIDEwTDMwIDUwTTEwIDMwTDUwIDMwTTYwIDMwTDcwIDMwTTMwIDYwTDMwIDcwTTcwIDQwTDcwIDcwTTQwIDcwTDYwIDcwTTEwIDQwTDEwIDYwTTIwIDcwTDEwIDcwTS41IC41TDc5LjUgLjVMNzkuNSA3OS41TC41IDc5LjUiLz48L3N2Zz4=')] opacity-10 z-1"></div>
      
      {/* Circular glow elements with enhanced colors and opacity */}
      <motion.div 
        className="absolute top-[25%] left-[20%] w-64 h-64 bg-[#39FF14] rounded-full opacity-[0.04] blur-[120px] z-2"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.04, 0.06, 0.04]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          easings: ["easeInOut"],
        }}
      />
      
      <motion.div 
        className="absolute bottom-[10%] right-[15%] w-80 h-80 bg-[#39FF14] rounded-full opacity-[0.025] blur-[100px] z-2"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.025, 0.04, 0.025]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          easings: ["easeInOut"],
          delay: 2
        }}
      />
      
      {/* Extra ambient glows */}
      <motion.div 
        className="absolute top-[60%] left-[50%] w-40 h-40 bg-blue-500 rounded-full opacity-[0.015] blur-[80px] z-2"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.015, 0.03, 0.015]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          easings: ["easeInOut"],
          delay: 1
        }}
      />
      
      {/* Digital circuit lines with enhanced patterns */}
      <svg className="absolute inset-0 w-full h-full z-3 opacity-15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="none">
        <g stroke="#39FF14" strokeWidth="1" fill="none">
          <motion.path 
            d="M0,540 L1920,540" 
            strokeDasharray="1920"
            strokeDashoffset="1920"
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
          <motion.path 
            d="M960,0 L960,1080" 
            strokeDasharray="1080"
            strokeDashoffset="1080"
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 3, delay: 0.5, ease: "easeInOut" }}
          />
          <motion.path 
            d="M0,270 L1920,270" 
            strokeDasharray="1920"
            strokeDashoffset="1920"
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 3, delay: 1, ease: "easeInOut" }}
            strokeOpacity="0.5"
          />
          <motion.path 
            d="M0,810 L1920,810" 
            strokeDasharray="1920"
            strokeDashoffset="1920"
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 3, delay: 1, ease: "easeInOut" }}
            strokeOpacity="0.5"
          />
          <motion.path 
            d="M480,0 L480,1080" 
            strokeDasharray="1080"
            strokeDashoffset="1080"
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 3, delay: 1.5, ease: "easeInOut" }}
            strokeOpacity="0.5"
          />
          <motion.path 
            d="M1440,0 L1440,1080" 
            strokeDasharray="1080"
            strokeDashoffset="1080"
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 3, delay: 1.5, ease: "easeInOut" }}
            strokeOpacity="0.5"
          />
          
          {/* Add hexagonal circuit pattern around the center of the screen */}
          <motion.path 
            d="M960,540 L1060,590 L1060,690 L960,740 L860,690 L860,590 Z" 
            strokeDasharray="600"
            strokeDashoffset="600"
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2, delay: 3, ease: "easeInOut" }}
            strokeOpacity="0.7"
          />
        </g>
      </svg>
      
      {/* Floating particles with enhanced size and frequency */}
      <div className="absolute inset-0 z-4">
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute bg-[#39FF14] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.max(1, Math.random() * 2)}px`,
              height: `${Math.max(1, Math.random() * 2)}px`,
              opacity: 0.2 + Math.random() * 0.5
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{
              duration: 3 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
      
      {/* StayX Giant Logo watermark with enhanced animation and positioning */}
      <div className="absolute inset-0 flex items-center justify-center z-3 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 2.5 }}
          animate={{ 
            opacity: [0, 0.09, 0.085, 0.09],
            scale: [2.5, 3.2, 3, 3.2],
            rotateY: [0, 5, 0, -5, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Logo size="xl" variant="neon" withText withAnimation={false} />
        </motion.div>
      </div>
      
      {/* Digital binary data flow - dynamic animations with enhanced visibility */}
      <div className="absolute inset-0 z-3 overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <motion.div
            key={`data-flow-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-[#39FF14]/40 to-transparent"
            style={{
              left: 0,
              top: `${12 + i * 15}%`,
              width: '100%',
              opacity: 0
            }}
            animate={{
              opacity: [0, 0.6, 0],
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 4 + i * 0.8,
              repeat: Infinity,
              delay: i * 1.2
            }}
          />
        ))}
      </div>
      
      {/* Tech matrix code rain effect with enhanced density and frequency */}
      <div className="absolute inset-0 z-3 overflow-hidden opacity-15">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`code-rain-${i}`}
            className="absolute w-px bg-gradient-to-b from-transparent via-[#39FF14] to-transparent"
            style={{
              left: `${3 + i * 7}%`,
              top: 0,
              height: '60%',
              opacity: 0
            }}
            animate={{
              opacity: [0, 0.9, 0],
              y: ['-60%', '150%']
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.25,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      {/* StayX brand accents in corners */}
      <div className="absolute top-5 left-5 w-20 h-20 z-4 pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-10 h-0.5 bg-[#39FF14]"></div>
        <div className="absolute top-0 left-0 h-10 w-0.5 bg-[#39FF14]"></div>
      </div>
      
      <div className="absolute top-5 right-5 w-20 h-20 z-4 pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-10 h-0.5 bg-[#39FF14]"></div>
        <div className="absolute top-0 right-0 h-10 w-0.5 bg-[#39FF14]"></div>
      </div>
      
      <div className="absolute bottom-5 left-5 w-20 h-20 z-4 pointer-events-none opacity-30">
        <div className="absolute bottom-0 left-0 w-10 h-0.5 bg-[#39FF14]"></div>
        <div className="absolute bottom-0 left-0 h-10 w-0.5 bg-[#39FF14]"></div>
      </div>
      
      <div className="absolute bottom-5 right-5 w-20 h-20 z-4 pointer-events-none opacity-30">
        <div className="absolute bottom-0 right-0 w-10 h-0.5 bg-[#39FF14]"></div>
        <div className="absolute bottom-0 right-0 h-10 w-0.5 bg-[#39FF14]"></div>
      </div>
      
      {/* Subtle overlay gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-gray-950 opacity-50 z-5"></div>
    </div>
  );
}