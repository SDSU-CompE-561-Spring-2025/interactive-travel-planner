'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { PlaneTakeoff } from 'lucide-react'
import PlannerLayout from './PlannerLayout'

export default function StartStep() {
  const router = useRouter()

  return (
    <PlannerLayout currentStep={0}>
      <main className="min-h-screen bg-[#fff8f0] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-4xl px-16 py-20 text-center"
        >
          <h1 className="text-5xl font-semibold text-[#377c68] mb-10">
            Ready to plan your adventure?
          </h1>

          <p className="text-gray-600 text-lg mb-12">
            We’ll guide you step-by-step through your perfect trip.
          </p>

          <button
            onClick={() => router.push('/planner/name')}
            className="!bg-[#f3a034] hover:!bg-[#e3962e] !text-white text-2xl font-bold px-12 py-6 rounded-full inline-flex items-center justify-center transition-all"
          >
            <PlaneTakeoff className="w-7 h-7 mr-3" />
            <span>Start Planning</span>
          </button>
        </motion.div>
      </main>
    </PlannerLayout>
  )
}
