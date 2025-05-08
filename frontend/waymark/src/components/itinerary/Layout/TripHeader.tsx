// File: src/components/itinerary/Layout/TripHeader.tsx
import React from 'react'
import type { Itinerary } from '@/lib/api'

interface TripHeaderProps {
  itinerary: Partial<Itinerary & { startDate?: string, endDate?: string }>
  setItinerary: React.Dispatch<React.SetStateAction<Partial<Itinerary & { startDate?: string, endDate?: string }>>>
  isEditingHeader: boolean
  setIsEditingHeader: React.Dispatch<React.SetStateAction<boolean>>
  handleSaveHeader: () => void
}

export default function TripHeader({
  itinerary,
  setItinerary,
  isEditingHeader,
  setIsEditingHeader,
  handleSaveHeader,
}: TripHeaderProps) {
  // Derive formatted date range if no title
  const start = itinerary?.startDate
  const end = itinerary?.endDate
  const dateRange =
    start && end
      ? `${new Date(start).toLocaleDateString()} – ${new Date(end).toLocaleDateString()}`
      : ''

  return (
    <div className="text-center py-8">
      {isEditingHeader ? (
        <div className="flex items-center justify-center space-x-2">
          <input
            type="text"
            value={itinerary.title || ''}
            onChange={e =>
              setItinerary({ ...itinerary, title: e.target.value })
            }
            placeholder="Trip name"
            className="border rounded px-3 py-1"
          />
          <button
            onClick={handleSaveHeader}
            className="px-4 py-1 rounded bg-blue-600 text-white"
          >
            Save
          </button>
        </div>
      ) : (
        <h1 className="text-3xl font-bold">
          {itinerary.title || dateRange || 'Untitled Trip'}
        </h1>
      )}
    </div>
  )
}