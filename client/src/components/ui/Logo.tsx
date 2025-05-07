import React from "react";
import { Link } from "wouter";

interface LogoProps {
  linkToHome?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light' | 'neon';
  withText?: boolean;
  position?: 'default' | 'top-right' | 'top-left' | 'center';
  withAnimation?: boolean;
}

export default function Logo({ 
  linkToHome = true,
  className = "",
  size = 'md',
  variant = 'light',
  withText = true,
  position = 'default',
  withAnimation = false
}: LogoProps) {
  
  // Map sizes to tailwind classes
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
    xl: "text-5xl"
  };
  
  // Map variants to tailwind classes
  const variantClasses = {
    dark: "text-gray-900",
    light: "text-white",
    neon: "text-[#39FF14] filter drop-shadow-[0_0_8px_rgba(57,255,20,0.7)]"
  };
  
  // Map positions to tailwind classes
  const positionClasses = {
    default: "",
    "top-right": "absolute top-4 right-4",
    "top-left": "absolute top-4 left-4",
    center: "mx-auto"
  };
  
  // Animation classes
  const animationClass = withAnimation ? "animate-pulse" : "";
  
  // Logo content
  const logoContent = (
    <div className={`font-bold flex items-center ${sizeClasses[size]} ${variantClasses[variant]} ${positionClasses[position]} ${animationClass} ${className}`}>
      <span>Stay</span>
      <span className="text-white">X</span>
    </div>
  );
  
  // Return logo with or without link
  return linkToHome ? (
    <Link href="/">
      {logoContent}
    </Link>
  ) : (
    logoContent
  );
}