'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { usePlannerStore } from '@/store/plannerStore'
import { useState } from 'react'
import { motion } from 'framer-motion'
import PlannerLayout from './PlannerLayout'

export default function NameStep() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnToReview = searchParams.get('return') === 'true'

  const { tripName, setField } = usePlannerStore()
  const [name, setName] = useState(tripName)
  const [error, setError] = useState('')

  const handleNext = () => {
    if (!name.trim()) {
      setError('Name your trip!')
      return
    }

    setField('tripName', name)
    if (returnToReview) {
      router.push('/planner/review')
    } else {
      router.push('/planner/dates')
    }
  }

  const handleBack = () => router.back()

  return (
    <PlannerLayout currentStep={1}>
      <main className="min-h-screen w-full flex items-center justify-center bg-[#fff8f0] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-4xl px-16 py-20 text-center"
        >
          <h1 className="text-5xl font-semibold text-[#377c68] mb-10">
            Let’s name your trip!
          </h1>

          <div className="flex flex-col items-center space-y-6 w-full">
            <div className="w-full max-w-lg">
              <label
                htmlFor="tripNameInput"
                className="block mb-6 text-2xl font-semibold text-[#377c68] text-center"
              >
                Trip Name
              </label>
              <input
                id="tripNameInput"
                type="text"
                placeholder={tripName || 'Enter trip name here'}
                className="w-full rounded-lg border border-gray-300 px-5 py-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#f3a034]"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {error && (
                <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
              )}
            </div>

            <div className="flex justify-center gap-6 mt-8">
              <button
                onClick={handleBack}
                className="!bg-gray-300 !text-gray-800 !text-base !font-medium !px-8 !py-3 !rounded-full !transition-all"
              >
                Back
              </button>

              <button
                onClick={handleNext}
                className="!bg-[#f3a034] hover:!bg-[#e3962e] !text-white !text-base !font-semibold !px-10 !py-4 !rounded-full !transition-all"
              >
                {returnToReview ? 'Return to Review' : 'Next Step'}
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </PlannerLayout>
  )
}
