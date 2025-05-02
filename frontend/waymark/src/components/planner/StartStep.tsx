"use client"

import { useRouter } from "next/navigation"
import { ButtonCustom } from "../ui/button-custom"
import PlannerLayout from "./PlannerLayout"
import { MapPin, Calendar, Plane } from "lucide-react"

export default function StartStep() {
  const router = useRouter()

  return (
    <PlannerLayout currentStep={0}>
      <div className="text-center">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">Ready to plan your adventure?</h1>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center rounded-lg bg-[#f3a034]/10 p-6">
            <MapPin className="mb-3 h-10 w-10 text-[#f3a034]" />
            <h3 className="text-lg font-semibold text-gray-800">Choose Destinations</h3>
            <p className="mt-2 text-sm text-gray-600">Discover amazing places to visit on your journey</p>
          </div>

          <div className="flex flex-col items-center rounded-lg bg-[#4ba46c]/10 p-6">
            <Calendar className="mb-3 h-10 w-10 text-[#4ba46c]" />
            <h3 className="text-lg font-semibold text-gray-800">Plan Your Schedule</h3>
            <p className="mt-2 text-sm text-gray-600">Create the perfect itinerary for your trip</p>
          </div>

          <div className="flex flex-col items-center rounded-lg bg-[#377c68]/10 p-6">
            <Plane className="mb-3 h-10 w-10 text-[#377c68]" />
            <h3 className="text-lg font-semibold text-gray-800">Travel Together</h3>
            <p className="mt-2 text-sm text-gray-600">Invite friends and family to join your adventure</p>
          </div>
        </div>

        <ButtonCustom onClick={() => router.push("/planner/name")} size="lg" className="mt-4">
          Start Planning
        </ButtonCustom>
      </div>
    </PlannerLayout>
  )
}
