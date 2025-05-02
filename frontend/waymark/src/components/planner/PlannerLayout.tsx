import type { ReactNode } from "react"
import { ProgressSteps } from "../ui/progress-step"

interface PlannerLayoutProps {
  children: ReactNode
  currentStep: number
}

const steps = ["Start", "Name", "Dates", "Location", "Activities", "Budget", "Collaborators", "Review"]

export default function PlannerLayout({ children, currentStep }: PlannerLayoutProps) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-start">
      <div className="mb-8 w-full max-w-3xl px-4">
        <ProgressSteps steps={steps} currentStep={currentStep} />
      </div>
      <div className="w-full max-w-2xl rounded-xl border border-gray-100 bg-white p-8 shadow-md">{children}</div>
    </div>
  )
}
