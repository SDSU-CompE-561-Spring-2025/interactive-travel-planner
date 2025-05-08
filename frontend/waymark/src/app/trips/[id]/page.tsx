// File: src/app/trips/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import type { Itinerary } from '@/lib/api'
import { getItinerary } from '@/lib/api'

// Layout & Section Components
import Sidebar from '@/components/itinerary/Layout/Sidebar'
import MobileNav from '@/components/itinerary/Layout/MobileNav'
import TripHeader from '@/components/itinerary/Layout/TripHeader'
import DestinationsSection from '@/components/itinerary/Sections/DestinationsSection'
import TimelineSection from '@/components/itinerary/Sections/TimelineSection'
import DayByDaySection from '@/components/itinerary/Sections/DayByDaySection'

export default function TripPage() {
  const { id: tripId } = useParams() as { id: string }

  const [itinerary, setItinerary] = useState<Partial<Itinerary>>({})
  const [activeSection, setActiveSection] = useState<'destinations' | 'timeline' | 'days'>('destinations')
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [isEditingHeader, setIsEditingHeader] = useState(false)

  useEffect(() => {
    if (!tripId) return
    getItinerary(tripId).then(data => setItinerary(data))
  }, [tripId])

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  // Accept any string but only react to known section keys
  const handleSectionChange = (section: string) => {
    if (section === 'destinations' || section === 'timeline' || section === 'days') {
      setActiveSection(section)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeSection={activeSection} setActiveSection={handleSectionChange} />

        {/* Centered main content */}
        <main className="flex-1 overflow-hidden max-w-4xl mx-auto px-4">
          {/* Header: shows trip name or dates */}
          <TripHeader
            itinerary={itinerary}
            setItinerary={setItinerary}
            isEditingHeader={isEditingHeader}
            setIsEditingHeader={setIsEditingHeader}
            handleSaveHeader={() => setIsEditingHeader(false)}
          />

          <div className="flex-1 overflow-auto mt-6">
            {activeSection === 'destinations' && (
              <DestinationsSection
                itinerary={itinerary}
                setItinerary={setItinerary}
                syncDaysWithDestinations={(destinations, currentDays) => currentDays || []}
                showNotification={showNotification}
                loading={loading}
                setLoading={setLoading}
                handleRemoveDestination={() => {}}
              />
            )}

            {activeSection === 'timeline' && (
              <TimelineSection
                itinerary={itinerary}
                setItinerary={setItinerary}
                editingSection={editingSection}
                setEditingSection={setEditingSection}
                loading={loading}
                setLoading={setLoading}
                showNotification={showNotification}
                handleRemoveTimelineEvent={() => {}}
              />
            )}

            {activeSection === 'days' && (
              <DayByDaySection
                itinerary={itinerary}
                setItinerary={setItinerary}
                editingSection={editingSection}
                setEditingSection={setEditingSection}
                loading={loading}
                setLoading={setLoading}
                showNotification={showNotification}
                handleRemoveDay={() => {}}
              />
            )}
          </div>
        </main>
      </div>

      {/* Mobile navigation */}
      <MobileNav activeSection={activeSection} setActiveSection={handleSectionChange} />

      {/* Toast notification */}
      {notification && (
        <div className="fixed bottom-4 inset-x-0 mx-auto w-full max-w-md px-4">
          <div className={`flex items-center justify-between p-3 rounded shadow-lg bg-${notification.type}`}>
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}
