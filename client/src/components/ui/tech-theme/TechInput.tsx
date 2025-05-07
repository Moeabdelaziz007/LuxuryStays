import React, { forwardRef, useState } from 'react';

interface TechInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'dark' | 'light' | 'neon';
  fullWidth?: boolean;
  withGlow?: boolean;
}

const TechInput = forwardRef<HTMLInputElement, TechInputProps>(
  ({ 
    label, 
    error, 
    icon, 
    variant = 'default', 
    fullWidth = true, 
    withGlow = true,
    className = '', 
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    
    // تحديد الألوان بناءً على المتغير
    const getInputClasses = () => {
      const baseClasses = 'bg-black/40 border text-white py-3 px-4 rounded-lg backdrop-blur-sm placeholder:text-gray-500 focus:outline-none focus:ring-0';
      const widthClass = fullWidth ? 'w-full' : '';
      
      switch (variant) {
        case 'dark':
          return `${baseClasses} border-gray-800 ${isFocused ? 'border-gray-600' : 'hover:border-gray-700'} ${widthClass}`;
        case 'light':
          return `${baseClasses} border-gray-700 ${isFocused ? 'border-gray-500' : 'hover:border-gray-600'} ${widthClass}`;
        case 'neon':
          return `${baseClasses} border-[#39FF14]/30 ${isFocused ? 'border-[#39FF14]/60' : 'hover:border-[#39FF14]/40'} ${widthClass}`;
        default:
          return `${baseClasses} border-gray-800 ${isFocused ? 'border-[#39FF14]/50' : 'hover:border-gray-700'} ${widthClass}`;
      }
    };
    
    const getContainerClass = () => {
      return `relative transition-all ${fullWidth ? 'w-full' : 'inline-block'} ${error ? 'mb-6' : 'mb-4'}`;
    };
    
    const getGlowEffect = () => {
      if (!withGlow) return null;
      
      return (
        <div className={`absolute inset-0 rounded-lg bg-transparent transition-opacity duration-300 pointer-events-none ${isFocused ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 rounded-lg bg-[#39FF14]/5 blur-[2px]"></div>
          {variant === 'neon' && isFocused && (
            <div className="absolute inset-0 rounded-lg shadow-[0_0_8px_rgba(57,255,20,0.3)]"></div>
          )}
        </div>
      );
    };

    return (
      <div className={getContainerClass()}>
        {label && (
          <label className="block text-sm font-medium text-gray-400 mb-1 mr-1">
            {label}
          </label>
        )}
        
        <div className="relative">
          {getGlowEffect()}
          
          <div className="relative">
            {icon && (
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                {icon}
              </div>
            )}
            
            <input
              ref={ref}
              className={`${getInputClasses()} ${icon ? 'pl-10' : ''} ${className}`}
              onFocus={(e) => {
                setIsFocused(true);
                props.onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                props.onBlur?.(e);
              }}
              {...props}
            />
          </div>
          
          {error && (
            <div className="absolute -bottom-6 left-0 text-xs text-red-500 mt-1">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }
);

TechInput.displayName = 'TechInput';

export default TechInput;