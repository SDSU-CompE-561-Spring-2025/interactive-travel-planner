import { cn } from "@/lib/utils"
import { type ButtonHTMLAttributes, forwardRef } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline"
  size?: "sm" | "md" | "lg"
}

const ButtonCustom = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
          {
            "bg-[#f3a034] text-white hover:bg-[#e08b20] focus:ring-[#f3a034]/50": variant === "primary",
            "bg-[#4ba46c] text-white hover:bg-[#3d8a59] focus:ring-[#4ba46c]/50": variant === "secondary",
            "bg-[#377c68] text-white hover:bg-[#2c6553] focus:ring-[#377c68]/50": variant === "accent",
            "border-2 border-[#f3a034] bg-transparent text-[#f3a034] hover:bg-[#f3a034]/10 focus:ring-[#f3a034]/50":
              variant === "outline",
          },
          {
            "px-3 py-1.5 text-sm": size === "sm",
            "px-4 py-2": size === "md",
            "px-6 py-3 text-lg": size === "lg",
          },
          className,
        )}
        {...props}
      />
    )
  },
)

ButtonCustom.displayName = "ButtonCustom"

export { ButtonCustom }
