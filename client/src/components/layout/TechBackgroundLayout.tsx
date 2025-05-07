import React from "react";
import TechSpaceBackground from "@/features/home/TechSpaceBackground";

interface TechBackgroundLayoutProps {
  children: React.ReactNode;
}

/**
 * A layout component that applies the tech/space background to all pages
 * Includes the animated tech elements and StayX branding
 */
export default function TechBackgroundLayout({ children }: TechBackgroundLayoutProps) {
  return (
    <div className="min-h-screen text-white relative">
      {/* Apply the tech space background to the entire app */}
      <TechSpaceBackground className="fixed" />
      
      {/* Content container with proper z-index */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}