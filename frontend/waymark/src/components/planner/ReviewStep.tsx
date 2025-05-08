'use client'

import { useRouter } from 'next/navigation'
import { usePlannerStore } from '@/store/plannerStore'
import { motion } from 'framer-motion'
import PlannerLayout from './PlannerLayout'

export default function ReviewStep() {
  const router = useRouter()
  const {
    tripName,
    budget,
    activities,
    destination,
    dates,
    collaborators,
    setField,
  } = usePlannerStore()

  const handleSubmit = async () => {
    const userId = usePlannerStore.getState().user?.id
    if (!userId) {
      alert('You must be logged in to create a trip.')
      return
    }

    const tripRes = await fetch(`http://localhost:8000/users/${userId}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: tripName,
        start_date: dates.start,
        end_date: dates.end,
      }),
    })

    if (!tripRes.ok) {
      alert('Failed to create trip')
      return
    }

    const tripData = await tripRes.json()
    const tripId = tripData.id
    setField('tripId', tripId)

    await fetch(`http://localhost:8000/trips/${tripId}/dates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ start_date: dates.start, end_date: dates.end }),
    })

    await fetch(`http://localhost:8000/trips/${tripId}/budget`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: budget }),
    })

    await fetch(`http://localhost:8000/trips/${tripId}/destinations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination }),
    })

    for (const user of collaborators) {
      const res = await fetch(`http://localhost:8000/trips/${tripId}/collaborators`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id }),
      })

      if (!res.ok) {
        alert(`Failed to add collaborator ${user.name}`)
        return
      }
    }

    router.push(`/trips/${tripId}`)
  }

  const Item = ({
    label,
    value,
    editRoute,
  }: {
    label: string
    value: React.ReactNode
    editRoute: string
  }) => (
    <div className="flex justify-between items-center border-b pb-4 mb-4">
      <div className="text-left">
        <p className="text-sm text-gray-500">{label}</p>
        <div className="text-lg font-medium text-gray-800">{value}</div>
      </div>
      <button
        onClick={() => router.push(`/planner/${editRoute}?return=true`)}
        className="!bg-[#f3a034] hover:!bg-[#e3962e] !text-white !text-sm !font-medium !px-4 !py-1.5 !rounded-full !transition-all"
      >
        Edit
      </button>
    </div>
  )

  return (
    <PlannerLayout currentStep={8}>
      <main className="min-h-screen w-full flex items-center justify-center bg-[#fff8f0] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-4xl px-16 py-20"
        >
          <h1 className="text-5xl font-semibold text-[#377c68] text-center mb-12">
            Review Your Trip
          </h1>

          <div className="max-w-xl mx-auto space-y-6">
            <Item label="🏷️ Trip Name" value={tripName || 'Not set'} editRoute="name" />
            <Item
              label="📅 Dates"
              value={
                dates.start && dates.end
                  ? `${dates.start} → ${dates.end}`
                  : 'Not selected'
              }
              editRoute="dates"
            />
            <Item
              label="📍 Destination"
              value={destination || 'Not chosen'}
              editRoute="destination"
            />
            <Item
              label="🎯 Activities"
              value={activities.length > 0 ? activities.join(', ') : 'None selected'}
              editRoute="activities"
            />
            <Item
              label="🧑‍🤝‍🧑 Collaborators"
              value={
                collaborators.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
                    {collaborators.map((c) => (
                      <li key={c.id}>{c.name}</li>
                    ))}
                  </ul>
                ) : (
                  'None added'
                )
              }
              editRoute="collab"
            />
            <Item
              label="💸 Budget"
              value={budget ? `$${budget}` : 'Not set'}
              editRoute="budget"
            />
          </div>

          {/* Submit button */}
          <div className="flex justify-center mt-12">
            <button
              onClick={handleSubmit}
              className="!bg-[#4ba46c] hover:!bg-[#3f9159] !text-white !text-base !font-semibold !px-10 !py-4 !rounded-full !transition-all"
            >
              Confirm and Create Trip
            </button>
          </div>
        </motion.div>
      </main>
    </PlannerLayout>
  )
}
