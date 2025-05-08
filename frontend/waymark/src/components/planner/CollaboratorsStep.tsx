'use client'

import { useRouter } from 'next/navigation'
import { usePlannerStore } from '@/store/plannerStore'
import { useState } from 'react'
import { motion } from 'framer-motion'
import PlannerLayout from './PlannerLayout'

export default function CollaboratorsStep() {
  const router = useRouter()
  const { collaborators, setField } = usePlannerStore()
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<{ name: string; id: string }[]>([])
  const [loading, setLoading] = useState(false)

  const searchUsers = async () => {
    if (!search.trim()) return
    setLoading(true)

    try {
      const res = await fetch(`http://localhost:8000/users/search?query=${search}`)
      const data = await res.json()
      setResults(data)
    } catch (err) {
      console.error('Search failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const addCollaborator = (user: { id: string; name: string }) => {
    const alreadyAdded = collaborators.some((c) => c.id === user.id)
    if (!alreadyAdded) {
      setField('collaborators', [...collaborators, user])
    }
    setSearch('')
    setResults([])
  }

  const handleBack = () => router.back()

  return (
    <PlannerLayout currentStep={6}>
      <main className="min-h-screen w-full flex items-center justify-center bg-[#fff8f0] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-4xl px-16 py-20 text-center"
        >
          <h1 className="text-5xl font-semibold text-[#377c68] mb-10">
            Invite your friends to plan!
          </h1>

          {/* Search input and button */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-8 w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name"
              className="w-full sm:w-96 rounded-lg border border-gray-300 px-4 py-2 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#f3a034]"
            />
            <button
              onClick={searchUsers}
              className="!bg-[#f3a034] hover:!bg-[#e3962e] !text-white !text-base !font-medium !px-8 !py-3 !rounded-full !transition-all"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Suggestions */}
          {results.length > 0 && (
            <ul className="border border-gray-200 rounded p-4 mb-8 max-w-xl mx-auto text-left shadow-sm">
              {results.map((user) => (
                <li
                  key={user.id}
                  className="flex justify-between items-center py-2 border-b last:border-none"
                >
                  <span className="text-gray-700">{user.name}</span>
                  <button
                    onClick={() => addCollaborator(user)}
                    className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full"
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Selected Collaborators (centered) */}
          <div className="w-full flex flex-col items-center mb-10">
            <h2 className="text-xl font-semibold text-[#377c68] mb-3">
              Selected Collaborators:
            </h2>
            {collaborators.length > 0 ? (
              <ul className="w-full max-w-md list-disc list-inside space-y-2 text-sm text-gray-700 text-left">
                {collaborators.map((c) => (
                  <li key={c.id} className="flex justify-between items-center">
                    <span>{c.name}</span>
                    <button
                      onClick={() =>
                        setField(
                          'collaborators',
                          collaborators.filter((x) => x.id !== c.id)
                        )
                      }
                      className="text-red-500 text-xs ml-4 hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic text-center">
                No collaborators added yet.
              </p>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-center gap-6">
            <button
              onClick={handleBack}
              className="!bg-gray-300 !text-gray-800 !text-base !font-medium !px-8 !py-3 !rounded-full !transition-all"
            >
              Back
            </button>

            <button
              onClick={() => router.push('/planner/review')}
              className="!bg-[#f3a034] hover:!bg-[#e3962e] !text-white !text-base !font-medium !px-8 !py-3 !rounded-full !transition-all"
            >
              Next Step
            </button>
          </div>
        </motion.div>
      </main>
    </PlannerLayout>
  )
}
