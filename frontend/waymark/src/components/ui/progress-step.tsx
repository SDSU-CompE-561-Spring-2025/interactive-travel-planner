"use client"

import { cn } from "@/lib/utils"

interface ProgressStepsProps {
  steps: string[]
  currentStep: number
  className?: string
}

export function ProgressSteps({ steps, currentStep, className }: ProgressStepsProps) {
  return (
    <div className={cn("w-full py-4", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                index < currentStep
                  ? "bg-[#377c68] text-white"
                  : index === currentStep
                    ? "bg-[#f3a034] text-white"
                    : "border-2 border-gray-300 text-gray-500",
              )}
            >
              {index < currentStep ? "✓" : index + 1}
            </div>
            <span
              className={cn(
                "mt-2 text-xs font-medium",
                index === currentStep ? "text-[#f3a034]" : index < currentStep ? "text-[#377c68]" : "text-gray-500",
              )}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-2">
        <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-gray-200"></div>
        <div
          className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-[#377c68]"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}
