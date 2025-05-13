import { Check } from "lucide-react"

interface TripQuizProgressProps {
  currentStep: number
  totalSteps: number
}

export function TripQuizProgress({ currentStep, totalSteps }: TripQuizProgressProps) {
  return (
    <div className="relative">
      <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-muted" />
      <div
        className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-primary transition-all duration-300"
        style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
      />
      <div className="relative flex justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep

          return (
            <div key={stepNumber} className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  isCompleted
                    ? "border-primary bg-primary text-white"
                    : isCurrent
                      ? "border-primary bg-white text-primary"
                      : "border-muted bg-white text-muted-foreground"
                } transition-colors`}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
              </div>
              <span
                className={`mt-2 text-xs ${isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"}`}
              >
                Step {stepNumber}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
