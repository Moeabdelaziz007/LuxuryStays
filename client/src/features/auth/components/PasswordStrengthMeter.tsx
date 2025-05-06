import React, { useMemo } from 'react';
import { getPasswordStrength, PasswordStrength } from '@/lib/passwordValidation';

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

export default function PasswordStrengthMeter({ password, className = '' }: PasswordStrengthMeterProps) {
  const strength: PasswordStrength = useMemo(() => {
    return getPasswordStrength(password);
  }, [password]);

  // Messages in Arabic
  const strengthLabels = {
    'weak': 'ضعيفة',
    'medium': 'متوسطة',
    'strong': 'قوية',
    'very-strong': 'قوية جدًا'
  };

  // Colors based on password strength with neon tech aesthetic
  const getStrengthColor = (strength: PasswordStrength) => {
    switch (strength) {
      case 'weak':
        return 'from-red-900/50 to-red-500/30 border-red-500/30';
      case 'medium':
        return 'from-yellow-900/50 to-yellow-500/30 border-yellow-500/30';
      case 'strong':
        return 'from-blue-900/50 to-blue-500/30 border-blue-500/30';
      case 'very-strong':
        return 'from-[#0D3922]/80 to-[#39FF14]/30 border-[#39FF14]/30 shadow-[0_0_10px_rgba(57,255,20,0.3)]';
      default:
        return 'from-gray-900/50 to-gray-500/30 border-gray-500/30';
    }
  };

  // Calculate fill percentage based on strength
  const getFillPercentage = (strength: PasswordStrength) => {
    switch (strength) {
      case 'weak': return '25%';
      case 'medium': return '50%';
      case 'strong': return '75%';
      case 'very-strong': return '100%';
      default: return '0%';
    }
  };

  const getStrengthText = () => {
    if (!password) return '';
    return strengthLabels[strength];
  };

  return (
    <div className={`mt-2 ${className}`}>
      <div className="flex justify-between items-center mb-1 text-xs">
        <span className="text-gray-400">قوة كلمة المرور:</span>
        <span 
          className={`font-semibold transition-colors duration-300 ${
            strength === 'weak' ? 'text-red-400' : 
            strength === 'medium' ? 'text-yellow-400' : 
            strength === 'strong' ? 'text-blue-400' : 
            strength === 'very-strong' ? 'text-[#39FF14]' : 'text-gray-400'
          }`}
        >
          {getStrengthText()}
        </span>
      </div>
      
      <div className="h-2 bg-black/60 rounded-full overflow-hidden border border-gray-700 backdrop-blur-sm relative">
        <div 
          className={`h-full bg-gradient-to-r ${getStrengthColor(strength)} transition-all duration-300 ease-in-out rounded-full`}
          style={{ width: getFillPercentage(strength) }}
        />
      </div>
    </div>
  );
}