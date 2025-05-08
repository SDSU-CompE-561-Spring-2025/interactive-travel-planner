'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import DayByDaySection from '@/components/itinerary/Sections/DayByDaySection'
import {
  getItinerary,
  updateItinerarySection,
  type Itinerary,
  type ItineraryDay
} from '@/lib/api'

export default function DestinationDaysPage() {
  // 1) Narrow params
  const params      = useParams() as { id: string; destIndex: string }
  const tripId      = params.id
  const destIndexN  = parseInt(params.destIndex, 10)

  // 2) Strongly-typed state
  const [itinerary, setItinerary]     = useState<Itinerary | null>(null)
  const [editingSection, setEditing]  = useState<string | null>(null)
  const [loading, setLoading]         = useState(false)

  // 3) Load once
  useEffect(() => {
    if (!tripId) return
    getItinerary(tripId).then(setItinerary)
  }, [tripId])

  if (!itinerary) return <p>Loading…</p>

  // 4) Pick your destination & its date window
  const dest      = itinerary.destinations[destIndexN]
  const [s, e]    = dest.dates.split(',').map(d => d.trim())
  const startDate = new Date(s)
  const endDate   = new Date(e)

  // 5) Filter days into that window
  const filteredDays: ItineraryDay[] = itinerary.days.filter(d => {
    const dt = new Date(d.date)
    return dt >= startDate && dt <= endDate
  })

  return (
    <DayByDaySection
      itinerary={{ ...itinerary, days: filteredDays }}
      setItinerary={(updatedItinerary: Itinerary) => {
        // merge back into full days list
        const otherDays = itinerary.days.filter(d => {
          const dt = new Date(d.date)
          return dt < startDate || dt > endDate
        })
        const allDays: ItineraryDay[] = [
          ...otherDays,
          ...updatedItinerary.days
        ]
        updateItinerarySection(tripId, 'days', allDays)
          .then(() => setItinerary({ ...itinerary, days: allDays }))
      }}
      editingSection={editingSection}
      setEditingSection={setEditing}
      loading={loading}
      setLoading={setLoading}
      showNotification={(type, msg) => {
        /* your toast logic */
      }}
      handleRemoveDay={dayIdx => {
        const newFiltered = filteredDays.filter((_, i) => i !== dayIdx)
        const otherDays   = itinerary.days.filter(d => {
          const dt = new Date(d.date)
          return dt < startDate || dt > endDate
        })
        const allDays: ItineraryDay[] = [...otherDays, ...newFiltered]
        updateItinerarySection(tripId, 'days', allDays)
          .then(() => setItinerary({ ...itinerary, days: allDays }))
      }}
    />
  )
}
