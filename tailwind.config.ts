import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "gradient-x": {
          "0%, 100%": {
            "background-position": "0% 50%",
          },
          "50%": {
            "background-position": "100% 50%",
          },
        },
        "gradient-xy": {
          "0%, 100%": {
            "background-position": "0% 0%",
          },
          "50%": {
            "background-position": "100% 100%",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            opacity: "0.4",
          },
          "50%": {
            opacity: "0.8",
          },
        },
        "text-glow": {
          "0%, 100%": {
            "text-shadow": "0 0 4px rgba(57, 255, 20, 0.3)",
          },
          "50%": {
            "text-shadow": "0 0 16px rgba(57, 255, 20, 0.6)",
          },
        },
        "border-flow": {
          "0%": {
            "background-position": "0% 50%",
          },
          "50%": {
            "background-position": "100% 50%",
          },
          "100%": {
            "background-position": "0% 50%",
          },
        },
        "float": {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        "fadeIn": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        "slideUpAndFade": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "pulse-slow": {
          "0%, 100%": {
            opacity: "0.4",
          },
          "50%": {
            opacity: "0.7",
          },
        },
        "pulse-very-slow": {
          "0%, 100%": {
            opacity: "0.3",
          },
          "50%": {
            opacity: "0.5",
          },
        },
        "glow": {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(100%)",
          },
        },
        // New animations for the hero section
        "blink": {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.3",
          },
        },
        "scan": {
          "0%": {
            transform: "translateY(-100%)",
          },
          "100%": {
            transform: "translateY(100%)",
          },
        },
        "scrolldown": {
          "0%": {
            transform: "translateY(0)",
            opacity: "1",
          },
          "30%": {
            opacity: "1",
          },
          "60%": {
            opacity: "0",
          },
          "100%": {
            transform: "translateY(6px)",
            opacity: "0",
          },
        },
        "typewriter": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "10%": {
            opacity: "1",
            transform: "translateY(0)",
          },
          "90%": {
            opacity: "1",
            transform: "translateY(0)",
          },
          "100%": {
            opacity: "0",
            transform: "translateY(-20px)",
          },
        },
        "matrix-text": {
          "0%": {
            transform: "translateY(0)",
          },
          "100%": {
            transform: "translateY(-50%)",
          },
        },
        "panGrid": {
          "from": {
            backgroundPosition: "0 0",
          },
          "to": {
            backgroundPosition: "100px 0",
          },
        },
        "pulse": {
          "0%": {
            transform: "scale(1)",
          },
          "100%": {
            transform: "scale(1.5)",
          },
        },
        "neon-pulse": {
          "0%, 100%": {
            textShadow: "0 0 4px rgba(57, 255, 20, 0.3), 0 0 11px rgba(57, 255, 20, 0.3), 0 0 19px rgba(57, 255, 20, 0.3)",
          }, 
          "50%": {
            textShadow: "0 0 8px rgba(57, 255, 20, 0.5), 0 0 22px rgba(57, 255, 20, 0.5), 0 0 38px rgba(57, 255, 20, 0.5)",
          }
        },
        "ping": {
          "0%": {
            transform: "scale(1)",
            opacity: "1",
          },
          "75%, 100%": {
            transform: "scale(2)",
            opacity: "0",
          },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-x": "gradient-x 3s ease infinite",
        "gradient-xy": "gradient-xy 6s ease infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "text-glow": "text-glow 2s ease-in-out infinite",
        "border-flow": "border-flow 3s ease infinite",
        "float": "float 3s ease-in-out infinite",
        "fadeIn": "fadeIn 0.7s ease-out forwards",
        "slideUpAndFade": "slideUpAndFade 0.8s ease-out forwards",
        "pulse-slow": "pulse-slow 6s ease-in-out infinite",
        "pulse-very-slow": "pulse-very-slow 8s ease-in-out infinite",
        "glow": "glow 4s ease-in-out infinite",
        "ping": "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
        // New animations for the hero section
        "blink": "blink 1.5s infinite",
        "scan": "scan 2s linear infinite",
        "scrolldown": "scrolldown 2s ease infinite",
        "typewriter": "typewriter 9s ease-in-out infinite",
        "matrix-text": "matrix-text 20s linear infinite",
        "panGrid": "panGrid 30s linear infinite",
        "neon-pulse": "neon-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
