'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Slider } from '../ui/slider'
import { usePlannerStore } from '@/store/plannerStore'
import { useState } from 'react'
import { motion } from 'framer-motion'
import PlannerLayout from './PlannerLayout'

export default function BudgetStep() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnToReview = searchParams.get('return') === 'true'

  const { budget, setField } = usePlannerStore()
  const [value, setValue] = useState([Number(budget) || 100])
  const [error, setError] = useState('')

  const handleNext = () => {
    if (value[0] < 100) {
      setError('Please select a budget of at least $100.')
      return
    }

    setField('budget', value[0].toString())
    if (returnToReview) {
      router.push('/planner/review')
    } else {
      router.push('/planner/collab')
    }
  }

  const handleBack = () => router.back()

  return (
    <PlannerLayout currentStep={5}>
      <main className="min-h-screen w-full flex items-center justify-center bg-[#fff8f0] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-4xl px-16 py-20 text-center"
        >
          <h1 className="text-5xl font-semibold text-[#377c68] mb-12">
            Let’s choose your budget
          </h1>

          {/* ✅ Centered slider with fixed width */}
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-md">
              <Slider
                min={100}
                max={10000}
                step={50}
                value={value}
                onValueChange={(val) => setValue(val)}
              />
            </div>
          </div>

          {/* Selected value */}
          <div className="text-lg font-medium text-[#4ba46c] mb-6">
            Selected budget: ${value[0]}
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-600 text-sm mb-6 text-center">{error}</p>
          )}

          {/* Buttons */}
          <div className="flex justify-center gap-6">
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
        </motion.div>
      </main>
    </PlannerLayout>
  )
}
