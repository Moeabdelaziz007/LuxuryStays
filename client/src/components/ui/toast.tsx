import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-6 pr-8 shadow-xl transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full backdrop-blur-md",
  {
    variants: {
      variant: {
        default: "border border-gray-800 bg-gray-900/90 text-white",
        destructive:
          "destructive group border-red-900/50 bg-red-950/90 text-red-50",
        success:
          "success group border-green-900/50 bg-green-950/90 text-green-50",
        warning:
          "warning group border-yellow-900/50 bg-yellow-950/90 text-yellow-50",
        info:
          "info group border-blue-900/50 bg-blue-950/90 text-blue-50",
        neon:
          "neon group border-[#39FF14]/20 bg-black/90 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 px-3 text-sm font-medium ring-offset-background transition-all duration-300 hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-white/30 focus:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-red-900/30 group-[.destructive]:hover:border-red-900/50 group-[.destructive]:hover:bg-red-900/20 group-[.destructive]:focus:ring-red-500/40 group-[.success]:border-green-900/30 group-[.success]:hover:border-green-900/50 group-[.success]:hover:bg-green-900/20 group-[.success]:focus:ring-green-500/40 group-[.warning]:border-yellow-900/30 group-[.warning]:hover:border-yellow-900/50 group-[.warning]:hover:bg-yellow-900/20 group-[.warning]:focus:ring-yellow-500/40 group-[.info]:border-blue-900/30 group-[.info]:hover:border-blue-900/50 group-[.info]:hover:bg-blue-900/20 group-[.info]:focus:ring-blue-500/40 group-[.neon]:border-[#39FF14]/20 group-[.neon]:hover:border-[#39FF14]/30 group-[.neon]:hover:bg-[#39FF14]/10 group-[.neon]:text-[#39FF14] group-[.neon]:focus:ring-[#39FF14]/30",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-white/70 opacity-0 transition-all duration-300 hover:text-white hover:bg-white/10 focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600 group-[.success]:text-green-300 group-[.warning]:text-yellow-300 group-[.info]:text-blue-300 group-[.neon]:text-[#39FF14]/80 group-[.neon]:hover:text-[#39FF14]",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-bold tracking-tight group-[.neon]:text-[#39FF14] group-[.success]:text-green-300 group-[.destructive]:text-red-300 group-[.warning]:text-yellow-300 group-[.info]:text-blue-300", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90 mt-1", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
