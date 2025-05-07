import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// تعريف متغيرات أنماط حقل الإدخال التقني
const techInputVariants = cva(
  "flex w-full rounded-md border bg-black/50 px-3 py-2 text-sm text-white shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 relative backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "border-[#39FF14]/30 focus:border-[#39FF14]/60 focus:ring-[#39FF14]/20",
        cyber: "border-[#39FF14]/40 focus:border-[#39FF14] focus:ring-[#39FF14]/40 focus:shadow-[0_0_10px_rgba(57,255,20,0.2)]",
        minimal: "border-gray-700 focus:border-[#39FF14]/50 focus:ring-[#39FF14]/10",
        outline: "border-gray-800 focus:border-[#39FF14]/70 bg-transparent",
      },
      withGlow: {
        true: "focus:shadow-[0_0_15px_rgba(57,255,20,0.3)]",
        false: "",
      },
      withIcon: {
        true: "pl-10",
        false: "",
      },
      withStatusIndicator: {
        true: "pr-10",
        false: "",
      },
      size: {
        default: "h-10",
        sm: "h-8 px-2 py-1 text-xs rounded-md",
        lg: "h-12 px-4 py-3 text-base rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      withGlow: false,
      withIcon: false,
      withStatusIndicator: false,
      size: "default",
    },
  }
);

export interface TechInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof techInputVariants> {
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  wrapperClassName?: string;
}

/**
 * حقل إدخال بتصميم تقني متطور يتماشى مع التصميم العام للتطبيق
 * يدعم إضافة أيقونات وعناصر تفاعلية
 */
const TechInput = React.forwardRef<HTMLInputElement, TechInputProps>(
  ({ 
    className, 
    variant, 
    withGlow, 
    withIcon, 
    withStatusIndicator, 
    size,
    leftIcon,
    rightElement,
    wrapperClassName,
    ...props 
  }, ref) => {
    // تحديد حالة وجود أيقونة استناداً على الخصائص المقدمة
    const hasLeftIcon = leftIcon ? true : withIcon;
    const hasRightElement = rightElement ? true : withStatusIndicator;
    
    return (
      <div className={cn("relative", wrapperClassName)}>
        {leftIcon && (
          <div className="absolute left-3 top-0 h-full flex items-center text-gray-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          className={cn(
            techInputVariants({ 
              variant, 
              withGlow, 
              withIcon: hasLeftIcon, 
              withStatusIndicator: hasRightElement, 
              size,
              className 
            })
          )}
          ref={ref}
          {...props}
        />
        
        {rightElement && (
          <div className="absolute right-3 top-0 h-full flex items-center">
            {rightElement}
          </div>
        )}
        
        {/* خط توهج عند التركيز */}
        {withGlow && (
          <div className="absolute -inset-[1px] bg-[#39FF14]/10 rounded-md opacity-0 focus-within:opacity-100 transition-opacity pointer-events-none blur-sm"></div>
        )}
      </div>
    );
  }
);
TechInput.displayName = "TechInput";

export { TechInput, techInputVariants };