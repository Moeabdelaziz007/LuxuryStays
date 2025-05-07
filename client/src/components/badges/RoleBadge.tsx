// RoleBadge.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldCheck, Star } from 'lucide-react';

// Props interface for the role badge component
interface RoleBadgeProps {
  role: 'CUSTOMER' | 'PROPERTY_ADMIN' | 'SUPER_ADMIN';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

/**
 * Component for displaying user role badges with animations and special styling
 * PROPERTY_ADMIN: Blue shield badge
 * SUPER_ADMIN: Special green badge with advanced effects
 */
const RoleBadge: React.FC<RoleBadgeProps> = ({
  role,
  size = 'md',
  showLabel = true,
  className = '',
}) => {
  // Determine size dimensions
  const sizeClasses = {
    sm: 'w-5 h-5 text-xs',
    md: 'w-6 h-6 text-sm',
    lg: 'w-8 h-8 text-base',
  };

  // Label text based on role
  const roleLabel = {
    PROPERTY_ADMIN: 'مدير عقارات',
    SUPER_ADMIN: 'مشرف عام',
    CUSTOMER: 'عميل',
  };

  // Badge styling based on role
  const badgeStyles = {
    PROPERTY_ADMIN: {
      container: 'bg-blue-900/40 border-blue-600',
      icon: 'text-blue-400',
      text: 'text-blue-400',
      glow: 'shadow-blue-500/20',
    },
    SUPER_ADMIN: {
      container: 'bg-[#39FF14]/10 border-[#39FF14]/40', 
      icon: 'text-[#39FF14]',
      text: 'text-[#39FF14]',
      glow: 'shadow-[#39FF14]/40',
    },
    CUSTOMER: {
      container: 'bg-gray-800 border-gray-700',
      icon: 'text-gray-400',
      text: 'text-gray-400',
      glow: '',
    },
  };

  // If no role or customer role and not explicitly showing, don't render
  if (!role || (role === 'CUSTOMER' && !showLabel)) {
    return null;
  }

  return (
    <div 
      className={`relative flex items-center gap-1.5 rounded-full px-2 py-1 
        border ${badgeStyles[role].container} ${badgeStyles[role].glow} ${className}`}
    >
      {/* Role icon based on user type */}
      <div className="relative">
        {role === 'SUPER_ADMIN' ? (
          <>
            {/* Special animated icon for Super Admin */}
            <motion.div 
              className="absolute inset-0 rounded-full opacity-50"
              animate={{ 
                boxShadow: ['0 0 0px #39FF14', '0 0 8px #39FF14', '0 0 0px #39FF14']
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <Star className={`${sizeClasses[size]} ${badgeStyles[role].icon}`} />
          </>
        ) : role === 'PROPERTY_ADMIN' ? (
          <>
            {/* Property admin icon with subtle animation */}
            <motion.div 
              className="absolute inset-0 rounded-full opacity-30"
              animate={{ 
                boxShadow: ['0 0 0px #2563eb', '0 0 5px #2563eb', '0 0 0px #2563eb']
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <ShieldCheck className={`${sizeClasses[size]} ${badgeStyles[role].icon}`} />
          </>
        ) : (
          <Shield className={`${sizeClasses[size]} ${badgeStyles[role].icon}`} />
        )}
      </div>

      {/* Badge text label */}
      {showLabel && (
        <span className={`${badgeStyles[role].text} text-xs font-medium whitespace-nowrap`}>
          {roleLabel[role]}
        </span>
      )}
      
      {/* Extra sparkle effect for Super Admin */}
      {role === 'SUPER_ADMIN' && (
        <motion.span 
          className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#39FF14]"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </div>
  );
};

export default RoleBadge;