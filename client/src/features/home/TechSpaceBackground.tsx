import React from "react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

interface TechSpaceBackgroundProps {
  className?: string;
}

export default function TechSpaceBackground({ className = "" }: TechSpaceBackgroundProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Dark space gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-gray-900 z-0"></div>
      
      {/* Tech grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzOUZGMTQiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMCAzaDR2MWgtNHYtMXptMCAzaDR2MWgtNHYtMXptLTYtNmg0djFoLTR2LTF6bTAgM2g0djFoLTR2LTF6bTAgM2g0djFoLTR2LTF6bS02LTZoNHYxaC00di0xem0wIDNoNHYxaC00di0xem0wIDNoNHYxaC00di0xem0wLTl2MWgtM1YzMWgzem0wIDNoLTN2MWgzdi0xem0wIDNoLTN2MWgzdi0xeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10 z-1"></div>
      
      {/* Circular glow elements */}
      <motion.div 
        className="absolute top-[25%] left-[20%] w-64 h-64 bg-[#39FF14] rounded-full opacity-[0.03] blur-[120px] z-2"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.03, 0.05, 0.03]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          easings: ["easeInOut"],
        }}
      />
      
      <motion.div 
        className="absolute bottom-[10%] right-[15%] w-80 h-80 bg-[#39FF14] rounded-full opacity-[0.015] blur-[100px] z-2"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.015, 0.03, 0.015]
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
        className="absolute top-[60%] left-[50%] w-40 h-40 bg-blue-500 rounded-full opacity-[0.01] blur-[80px] z-2"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.01, 0.025, 0.01]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          easings: ["easeInOut"],
          delay: 1
        }}
      />
      
      {/* Digital circuit lines */}
      <svg className="absolute inset-0 w-full h-full z-3 opacity-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="none">
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
        </g>
      </svg>
      
      {/* Floating particles */}
      <div className="absolute inset-0 z-4">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-[#39FF14] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.2 + Math.random() * 0.4
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
      
      {/* StayX Giant Logo watermark */}
      <div className="absolute inset-0 flex items-center justify-center z-3 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.07 }}
          transition={{ duration: 2 }}
          className="transform scale-[3]"
        >
          <Logo size="xl" variant="neon" withText withAnimation={false} />
        </motion.div>
      </div>
      
      {/* Digital binary data flow - dynamic animations */}
      <div className="absolute inset-0 z-3 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={`data-flow-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-[#39FF14]/30 to-transparent"
            style={{
              left: 0,
              top: `${15 + i * 20}%`,
              width: '100%',
              opacity: 0
            }}
            animate={{
              opacity: [0, 0.5, 0],
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 1.5
            }}
          />
        ))}
      </div>
      
      {/* Tech matrix code rain effect */}
      <div className="absolute inset-0 z-3 overflow-hidden opacity-10">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={`code-rain-${i}`}
            className="absolute w-px bg-gradient-to-b from-transparent via-[#39FF14] to-transparent"
            style={{
              left: `${5 + i * 10}%`,
              top: 0,
              height: '50%',
              opacity: 0
            }}
            animate={{
              opacity: [0, 0.8, 0],
              y: ['-50%', '100%']
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      {/* Subtle overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950 opacity-40 z-5"></div>
    </div>
  );
}