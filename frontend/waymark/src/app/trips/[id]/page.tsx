'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import type { Itinerary } from '@/lib/api'
import { getItinerary, updateItinerary } from '@/lib/api'

// Layout & Section Components
import MobileNav from '@/components/itinerary/Layout/MobileNav'
import DestinationsSection from '@/components/itinerary/Sections/DestinationsSection'

export default function TripPage() {
  const { id: tripId } = useParams() as { id: string }

  const [itinerary, setItinerary] = useState<Partial<Itinerary>>({})
  const [activeSection, setActiveSection] = useState<'destinations' | 'timeline' | 'days'>('destinations')
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState<{ type: 'info' | 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    if (!tripId) return
    const fetchItinerary = async () => {
      setLoading(true)
      try {
        const data = await getItinerary(tripId)
        setItinerary(data)
      } catch (error) {
        console.error('Failed to fetch itinerary:', error)
        showNotification('error', 'Failed to load trip data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchItinerary()
  }, [tripId])

  const showNotification = (type: 'info' | 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  // Accept any string but only react to known section keys
  const handleSectionChange = (section: string) => {
    if (section === 'destinations' || section === 'timeline' || section === 'days') {
      setActiveSection(section)
    }
  }

  // Synchronize days with destinations
  const syncDaysWithDestinations = (
    destinations: { dates: string }[],
    currentDays?: { date: string; activities: any[] }[]
  ) => {
    if (!destinations.length) return currentDays || [];
    
    // Extract unique dates from all destinations
    const allDatesSet = new Set<string>();
    
    destinations.forEach(dest => {
      if (!dest.dates) return;
      
      try {
        const [startStr, endStr] = dest.dates.split(',').map(d => d.trim());
        const start = new Date(startStr);
        const end = new Date(endStr);
        
        // Loop through days between start and end
        const currentDate = new Date(start);
        while (currentDate <= end) {
          allDatesSet.add(currentDate.toISOString().split('T')[0]);
          currentDate.setDate(currentDate.getDate() + 1);
        }
      } catch (e) {
        console.error('Error processing dates:', e);
      }
    });
    
    // Convert to array and sort
    const allDates = Array.from(allDatesSet).sort();
    
    // Create or update days array
    const existingDays = currentDays || [];
    const existingDatesMap = new Map(
      existingDays.map(day => [day.date, day.activities])
    );
    
    const updatedDays = allDates.map(date => ({
      date,
      activities: existingDatesMap.get(date) || []
    }));
    
    return updatedDays;
  }

  // Handle destination removal
  const handleRemoveDestination = (index: number) => {
    // This is handled by the DestinationsSection component
    console.log('Destination removed at index:', index);
  }
  
  // Handle itinerary title update
  const handleTitleUpdate = async (newTitle: string) => {
    if (!tripId) return;
    
    setItinerary(prev => ({
      ...prev,
      title: newTitle
    }));
    
    setLoading(true);
    try {
      await updateItinerary(tripId, { ...itinerary, title: newTitle });
      showNotification('success', 'Trip title updated');
    } catch (error) {
      console.error('Failed to update title:', error);
      showNotification('error', 'Failed to update title');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Trip title */}
      <div className="text-center py-8 border-b">
        <h1 
          className="text-3xl font-bold cursor-pointer hover:text-blue-500" 
          onClick={() => {
            const newTitle = prompt('Enter trip title:', itinerary.title);
            if (newTitle && newTitle !== itinerary.title) {
              handleTitleUpdate(newTitle);
            }
          }}
        >
          {itinerary.title || 'My Trip'}
        </h1>
        {loading && (
          <div className="mt-2 text-gray-500 text-sm">Loading...</div>
        )}
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-hidden max-w-4xl mx-auto px-4 py-6">
        {activeSection === 'destinations' && (
          <DestinationsSection
            itinerary={itinerary}
            setItinerary={setItinerary}
            syncDaysWithDestinations={syncDaysWithDestinations}
            showNotification={showNotification}
            loading={loading}
            setLoading={setLoading}
            handleRemoveDestination={handleRemoveDestination}
          />
        )}
        
        {/* Placeholder for other sections */}
        {activeSection === 'timeline' && (
          <div className="py-8 text-center">
            <p className="text-lg text-gray-600">Timeline section will go here</p>
          </div>
        )}
        
        {activeSection === 'days' && (
          <div className="py-8 text-center">
            <p className="text-lg text-gray-600">Day by day planner will go here</p>
          </div>
        )}
      </main>

      {/* Mobile navigation */}
      <MobileNav activeSection={activeSection} setActiveSection={handleSectionChange} />

      {/* Toast notification */}
      {notification && (
        <div className="fixed bottom-16 md:bottom-4 inset-x-0 mx-auto w-full max-w-md px-4 z-50">
          <div 
            className={`flex items-center justify-between p-4 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
          >
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}