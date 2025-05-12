// src/components/ui/progress.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** value between 0 and max (default 100) */
  value?: number
  max?: number
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    const pct = Math.round((value / max) * 100)

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className={cn("w-full h-2 bg-muted rounded-full overflow-hidden", className)}
        {...props}
      >
        <div
          className="h-full bg-primary"
          style={{ width: `${Math.min(Math.max(pct, 0), 100)}%` }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"
