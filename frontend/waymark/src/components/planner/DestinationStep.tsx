'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import PlannerLayout from './PlannerLayout'
import { usePlannerStore } from '@/store/plannerStore'

const CITY_SUGGESTIONS = [
  'New York', 'Los Angeles', 'London', 'Paris', 'Tokyo', 'Barcelona', 'Rome',
  'Sydney', 'Berlin', 'Toronto', 'San Francisco', 'Singapore', 'Dubai', 'Amsterdam',
  'Jakarta', 'Okinawa', 'Ho Chi Minh City', 'Seattle', 'San Diego', 'Osaka', 'Niger'
]

export default function DestinationStep() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnToReview = searchParams.get('return') === 'true'

  const { destination, setField } = usePlannerStore()
  const [name, setName] = useState(destination)
  const [error, setError] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])

  const handleInputChange = (value: string) => {
    setName(value)
    if (value.length > 0) {
      const matches = CITY_SUGGESTIONS.filter(city =>
        city.toLowerCase().startsWith(value.toLowerCase())
      )
      setSuggestions(matches.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }

  const handleSelectSuggestion = (city: string) => {
    setName(city)
    setSuggestions([])
  }

  const handleNext = () => {
    if (!name.trim()) {
      setError('Please enter a destination.')
      return
    }

    setField('destination', name)
    if (returnToReview) {
      router.push('/planner/review')
    } else {
      router.push('/planner/budget')
    }
  }

  const handleBack = () => router.back()

  return (
    <PlannerLayout currentStep={3}>
      <main className="min-h-screen bg-[#fff8f0] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-4xl px-16 py-20 text-center"
        >
          <h1 className="text-5xl font-semibold text-[#377c68] mb-10">
            Where do you want to go?
          </h1>

          <div className="flex flex-col items-center space-y-6 w-full">
            <div className="w-full max-w-lg relative">
              <input
                type="text"
                value={name}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={destination || 'Enter a destination'}
                className="w-full rounded-lg border border-gray-300 px-5 py-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#f3a034]"
              />
              {suggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded shadow z-10 mt-1 text-left">
                  {suggestions.map((city) => (
                    <li
                      key={city}
                      onClick={() => handleSelectSuggestion(city)}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {error && (
              <p className="text-red-600 text-sm -mt-2 text-center">{error}</p>
            )}

            <div className="flex justify-center gap-6 pt-4">
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
