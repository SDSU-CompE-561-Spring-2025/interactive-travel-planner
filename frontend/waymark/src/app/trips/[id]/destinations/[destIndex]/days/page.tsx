// src/app/trips/[id]/destinations/[destIndex]/days/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState, Dispatch, SetStateAction } from 'react'
import DayByDaySection from '@/components/itinerary/Sections/DayByDaySection'
import {
  getItinerary,
  updateItinerarySection,
  type Itinerary,
} from '@/lib/api'

// 1️⃣ Derive the day type directly from Itinerary
type ItineraryDay = Itinerary['days'][number]

export default function DestinationDaysPage() {
  // 2️⃣ Narrow params
  const params     = useParams() as { id: string; destIndex: string }
  const tripId     = params.id
  const destIndexN = parseInt(params.destIndex, 10)

  // 3️⃣ State
  const [itinerary, setItinerary]    = useState<Itinerary | null>(null)
  const [editingSection, setEditing] = useState<string | null>(null)
  const [loading, setLoading]        = useState(false)

  // 4️⃣ Load data once
  useEffect(() => {
    if (!tripId) return
    getItinerary(tripId).then(setItinerary)
  }, [tripId])

  if (!itinerary) return <p>Loading…</p>

  // 5️⃣ Pick current dest + date window
  const dest      = itinerary.destinations[destIndexN]
  const [s, e]    = dest.dates.split(',').map(d => d.trim())
  const startDate = new Date(s)
  const endDate   = new Date(e)

  // 6️⃣ Filter only days in that window
  const filteredDays: ItineraryDay[] = itinerary.days.filter(d => {
    const dt = new Date(d.date)
    return dt >= startDate && dt <= endDate
  })

  // 7️⃣ Wrap our setter to match Partial<Itinerary>
  const handleSetItinerary: Dispatch<SetStateAction<Partial<Itinerary>>> = partial => {
    const newDays = typeof partial === 'function' 
      ? partial(itinerary).days ?? [] 
      : partial.days ?? []
    const otherDays = itinerary.days.filter(d => {
      const dt = new Date(d.date)
      return dt < startDate || dt > endDate
    })
    const allDays: ItineraryDay[] = [...otherDays, ...newDays]

    updateItinerarySection(tripId, 'days', allDays)
      .then(() => setItinerary({ ...itinerary, days: allDays }))
  }

  return (
    <DayByDaySection
      itinerary={{ ...itinerary, days: filteredDays }}
      setItinerary={handleSetItinerary}
      editingSection={editingSection}
      setEditingSection={setEditing}
      loading={loading}
      setLoading={setLoading}
      showNotification={(type, msg) => {
        /* your toast logic */
      }}
      handleRemoveDay={dayIdx => {
        const newFiltered = filteredDays.filter((_, i) => i !== dayIdx)
        handleSetItinerary({ days: newFiltered })
      }}
    />
  )
}
