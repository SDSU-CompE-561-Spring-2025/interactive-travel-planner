"use client"

import type React from "react"

import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import StartStep from "@/components/planner/StartStep"
import NameStep from "@/components/planner/NameStep"
import ActivitiesStep from "@/components/planner/ActivitiesStep"
import BudgetStep from "@/components/planner/BudgetStep"
import LocationStep from "@/components/planner/LocationStep"
import DatesStep from "@/components/planner/DatesStep"
import ReviewStep from "@/components/planner/ReviewStep"
import CollaboratorsStep from "@/components/planner/CollaboratorsStep"

export default function PlannerStepPage() {
  const params = useParams()
  const router = useRouter()
  const step = params.step as string

  // Redirect to start if step is invalid
  useEffect(() => {
    const validSteps = ["start", "name", "dates", "location", "activities", "budget", "collab", "review"]
    if (!validSteps.includes(step)) {
      router.push("/planner/start")
    }
  }, [step, router])

  const steps: Record<string, React.ReactNode> = {
    start: <StartStep />,
    name: <NameStep />,
    dates: <DatesStep />,
    location: <LocationStep />,
    activities: <ActivitiesStep />,
    budget: <BudgetStep />,
    collab: <CollaboratorsStep />,
    review: <ReviewStep />,
  }

  return <div className="py-8">{steps[step] || <div>Redirecting...</div>}</div>
}
