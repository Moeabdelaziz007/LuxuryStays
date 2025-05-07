import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

type LanguageSwitcherProps = {
  variant?: 'icon' | 'text' | 'full';
  className?: string;
};

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'full',
  className = '',
}) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  // Animation variants
  const iconAnimationProps = {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.95 },
    transition: { type: 'spring', stiffness: 400, damping: 10 }
  };

  // Render based on variant
  if (variant === 'icon') {
    return (
      <motion.button
        onClick={toggleLanguage}
        className={`flex items-center justify-center p-2 text-white hover:text-[#39FF14] focus:outline-none ${className}`}
        {...iconAnimationProps}
        aria-label={`Switch to ${language === 'ar' ? 'English' : 'Arabic'}`}
      >
        <Globe size={20} className="mr-1" />
      </motion.button>
    );
  }

  if (variant === 'text') {
    return (
      <motion.button
        onClick={toggleLanguage}
        className={`flex items-center justify-center p-2 text-white hover:text-[#39FF14] focus:outline-none ${className}`}
        {...iconAnimationProps}
        aria-label={`Switch to ${language === 'ar' ? 'English' : 'Arabic'}`}
      >
        {language === 'ar' ? 'English' : 'العربية'}
      </motion.button>
    );
  }

  // Full variant with icon and text
  return (
    <motion.button
      onClick={toggleLanguage}
      className={`flex items-center justify-center px-3 py-2 space-x-2 rtl:space-x-reverse text-sm bg-black/30 border border-[#39FF14]/30 rounded-md text-white hover:bg-black/50 hover:text-[#39FF14] hover:border-[#39FF14]/50 transition-colors focus:outline-none ${className}`}
      {...iconAnimationProps}
      aria-label={`Switch to ${language === 'ar' ? 'English' : 'Arabic'}`}
    >
      <Globe size={16} className={language === 'ar' ? 'ml-2' : 'mr-2'} />
      <span>{language === 'ar' ? 'English' : 'العربية'}</span>
    </motion.button>
  );
};

export default LanguageSwitcher;