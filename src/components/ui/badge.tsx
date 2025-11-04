import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Extended color variants for convenience across the app
        yellow: "border-transparent bg-yellow-500 text-white hover:bg-yellow-500/90",
        blue: "border-transparent bg-blue-500 text-white hover:bg-blue-500/90",
        purple: "border-transparent bg-purple-500 text-white hover:bg-purple-500/90",
        indigo: "border-transparent bg-indigo-500 text-white hover:bg-indigo-500/90",
        green: "border-transparent bg-green-500 text-white hover:bg-green-500/90",
        orange: "border-transparent bg-orange-500 text-white hover:bg-orange-500/90",
        red: "border-transparent bg-red-600 text-white hover:bg-red-600/90",
        gray: "border-transparent bg-gray-500 text-white hover:bg-gray-500/90",
        // Soft pastel variants (light background, colored text) for status pills
        "soft-yellow": "border-transparent bg-yellow-50 text-yellow-700",
        "soft-blue": "border-transparent bg-blue-50 text-blue-700",
        "soft-purple": "border-transparent bg-purple-50 text-purple-700",
        "soft-indigo": "border-transparent bg-indigo-50 text-indigo-700",
        "soft-green": "border-transparent bg-green-50 text-green-700",
        "soft-orange": "border-transparent bg-orange-50 text-orange-700",
        "soft-red": "border-transparent bg-red-50 text-red-700",
        "soft-gray": "border-transparent bg-gray-100 text-gray-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
