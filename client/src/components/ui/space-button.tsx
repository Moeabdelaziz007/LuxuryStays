import { forwardRef, ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// تعريف المتغيرات المتنوعة للأزرار الفضائية
const spaceButtonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#39FF14] disabled:pointer-events-none overflow-hidden group",
  {
    variants: {
      variant: {
        // زر فضائي رئيسي بخلفية النيون
        primary: 
          "bg-[#39FF14] hover:bg-[#45ff25] text-black font-bold border border-[#39FF14]/20 shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_20px_rgba(57,255,20,0.5)]",
        
        // زر فضائي مع تأثير الزجاج
        glass: 
          "bg-black/30 backdrop-blur-md text-white hover:text-[#39FF14] border border-gray-700 hover:border-[#39FF14]/30 shadow-[0_0_10px_rgba(0,0,0,0.3)]",
        
        // زر فضائي قيادة المركبة (هولوغرامي)
        hologram: 
          "bg-black/20 text-[#39FF14] border border-[#39FF14]/50 backdrop-blur-md shadow-[0_0_12px_rgba(57,255,20,0.15)] hover:shadow-[0_0_15px_rgba(57,255,20,0.3)]",
        
        // زر فضائي خطر/تحذير
        danger: 
          "bg-red-500/80 text-white border border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)] hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]",
        
        // زر قيادة/تحكم
        command: 
          "bg-gradient-to-r from-gray-900 to-gray-800 text-[#39FF14] border border-gray-700 hover:border-[#39FF14]/30",
        
        // زر شفاف بخطوط مضيئة
        outline: 
          "bg-transparent border border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14]/10",
        
        // زر أسود أنيق
        stealth: 
          "bg-gray-950 text-gray-100 hover:text-[#39FF14] border border-gray-800 hover:border-[#39FF14]/20",
      },
      size: {
        xs: "h-7 rounded-md px-2 text-xs",
        sm: "h-8 rounded-md px-3 text-xs",
        default: "h-10 px-4 py-2",
        lg: "h-12 rounded-md px-5 text-base",
        xl: "h-14 rounded-md px-6 text-lg",
        icon: "h-9 w-9"
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

// إضافة تأثيرات الكهرباء والإشعاعات الفضائية للزر
const SpaceButtonElements = ({
  showScanline = true,
  showParticles = true,
  showGlow = true,
  showWave = true,
  variant = "primary",
}: {
  showScanline?: boolean;
  showParticles?: boolean;
  showGlow?: boolean;
  showWave?: boolean;
  variant?: string;
}) => {
  const isNeon = variant === "primary" || variant === "hologram" || variant === "outline";
  const isDanger = variant === "danger";
  
  return (
    <>
      {/* خط المسح الفضائي */}
      {showScanline && (
        <span className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none before:absolute before:h-[1px] before:w-full before:bg-[#39FF14]/70 before:shadow-[0_0_8px_rgba(57,255,20,0.8)] before:-translate-x-full before:animate-[scanline_2s_ease-in-out_infinite_alternate] group-hover:before:translate-x-0"></span>
      )}
      
      {/* تموجات الطاقة الفضائية */}
      {showWave && (
        <span className="absolute inset-0 w-full h-full">
          <span className={`absolute -left-5 -right-5 -translate-y-1/2 h-px bg-gradient-to-r ${isNeon ? 'from-transparent via-[#39FF14]/50 to-transparent' : isDanger ? 'from-transparent via-red-500/50 to-transparent' : 'from-transparent via-white/30 to-transparent'} transform top-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100`}></span>
          <span className={`absolute -left-5 -right-5 -translate-y-1/2 h-px bg-gradient-to-r ${isNeon ? 'from-transparent via-[#39FF14]/50 to-transparent' : isDanger ? 'from-transparent via-red-500/50 to-transparent' : 'from-transparent via-white/30 to-transparent'} transform bottom-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100`}></span>
        </span>
      )}

      {/* توهج شعاعي عند التحويم */}
      {showGlow && (
        <span 
          className={`absolute inset-0 translate-y-full transition-transform duration-300 ${isNeon ? 'bg-[#39FF14]/20' : isDanger ? 'bg-red-500/20' : 'bg-white/10'} group-hover:translate-y-0`}
        ></span>
      )}
      
      {/* جسيمات فضائية متوهجة */}
      {showParticles && (
        <span className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-20">
          <span className={`absolute top-1/2 left-1/2 h-1 w-1 rounded-full ${isNeon ? 'bg-[#39FF14]' : isDanger ? 'bg-red-500' : 'bg-white'} shadow-glow animate-particle1`}></span>
          <span className={`absolute top-1/2 left-1/2 h-px w-px rounded-full ${isNeon ? 'bg-[#39FF14]' : isDanger ? 'bg-red-500' : 'bg-white'} shadow-glow animate-particle2`}></span>
          <span className={`absolute top-1/2 left-1/2 h-[2px] w-[2px] rounded-full ${isNeon ? 'bg-[#39FF14]' : isDanger ? 'bg-red-500' : 'bg-white'} shadow-glow animate-particle3`}></span>
        </span>
      )}
    </>
  );
};

export interface SpaceButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof spaceButtonVariants> {
  showScanline?: boolean;
  showParticles?: boolean;
  showGlow?: boolean;
  showWave?: boolean;
  icon?: React.ReactNode;
}

// مكون الزر الفضائي
const SpaceButton = forwardRef<HTMLButtonElement, SpaceButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    showScanline = true,
    showParticles = true,
    showGlow = true,
    showWave = true,
    icon,
    children,
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(spaceButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <SpaceButtonElements 
          showScanline={showScanline}
          showParticles={showParticles}
          showGlow={showGlow}
          showWave={showWave}
          variant={variant as string}
        />
        <span className="relative z-10 flex items-center gap-2">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </span>
      </button>
    );
  }
);

SpaceButton.displayName = "SpaceButton";

export { SpaceButton, spaceButtonVariants };