'use client'

import { useState, useEffect } from 'react'
import type { Itinerary } from '../../../lib/api'
import { updateItinerarySection, getItinerary, updateItinerary } from '../../../lib/api'

// Layout Components
import Header from '../../../components/itinerary/Layout/Header'
import Sidebar from '../../../components/itinerary/Layout/Sidebar'
import MobileNav from '../../../components/itinerary/Layout/MobileNav'
import TripHeader from '../../../components/itinerary/Layout/TripHeader'
import Notification from '../../../components/itinerary/Layout/Notification'

// Section Components
import DestinationsSection from '../../../components/itinerary/Sections/DestinationsSection'
import TimelineSection from '../../../components/itinerary/Sections/TimelineSection'
import DayByDaySection from '../../../components/itinerary/Sections/DayByDaySection'


export default function Page() {
  // Main state for itinerary data
  const [itinerary, setItinerary] = useState<Partial<Itinerary>>({
    id: 'new-trip',
    title: 'New Trip',
    start: '',
    end: '',
    destinations: [],
    timeline: [],
    days: []
  });
  
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('destinations');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Syncs destinations' dates into your days array (no duplicates, sorted)
  function syncDaysWithDestinations(
    destinations: { dates: string }[],
    currentDays: { date: string; activities: any[] }[] = []
  ) {
    const map: Record<string, any[]> = Object.fromEntries(
      currentDays.map(d => [d.date, d.activities])
    );
    
    destinations.forEach(dest => {
      dest.dates.split(',').map(s=>s.trim()).forEach(date => {
        if (!map[date]) map[date] = [];
      });
    });
    
    return Object.entries(map)
      .sort(([a],[b]) => a.localeCompare(b))
      .map(([date, activities]) => ({ date, activities }));
  }

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedItinerary = localStorage.getItem('waymark_itinerary');
    if (storedItinerary) {
      try {
        const parsedData = JSON.parse(storedItinerary);
        setItinerary(parsedData);
      } catch (error) {
        console.error('Error parsing stored itinerary:', error);
      }
    }
    
    const storedSection = localStorage.getItem('waymark_active_section');
    if (storedSection) {
      setActiveSection(storedSection);
    }
    
    setInitialLoad(false);
  }, []);

  // Save to localStorage whenever itinerary changes
  useEffect(() => {
    if (!initialLoad) {
      localStorage.setItem('waymark_itinerary', JSON.stringify(itinerary));
    }
  }, [itinerary, initialLoad]);

  // Save active section to localStorage
  useEffect(() => {
    if (!initialLoad) {
      localStorage.setItem('waymark_active_section', activeSection);
    }
  }, [activeSection, initialLoad]);

  // Show notifications
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle header save
  const handleSaveHeader = () => {
    setIsEditingHeader(false);
    showNotification('success', 'Trip details saved!');
    
    if (itinerary.id && itinerary.id !== 'new-trip') {
      updateItinerary(itinerary.id, {
        title: itinerary.title,
        start: itinerary.start,
        end: itinerary.end
      }).catch(error => {
        console.error('Error updating header:', error);
        showNotification('error', 'Failed to save trip details');
      });
    }
  };

  // Handle removing a destination
  const handleRemoveDestination = (index: number) => {
    const newDestinations = [...(itinerary.destinations || [])];
    newDestinations.splice(index, 1);
    setItinerary(prev => ({ ...prev, destinations: newDestinations }));
    showNotification('success', 'Destination removed');
    
    if (itinerary.id && itinerary.id !== 'new-trip') {
      updateItinerarySection(itinerary.id, 'destinations', newDestinations)
        .catch(error => {
          console.error('Error removing destination:', error);
          showNotification('error', 'Failed to remove destination on server');
        });
    }
  };

  // Handle removing a timeline event
  const handleRemoveTimelineEvent = (index: number) => {
    const newTimeline = [...(itinerary.timeline || [])];
    newTimeline.splice(index, 1);
    setItinerary(prev => ({ ...prev, timeline: newTimeline }));
    showNotification('success', 'Timeline event removed');
    
    if (itinerary.id && itinerary.id !== 'new-trip') {
      updateItinerarySection(itinerary.id, 'timeline', newTimeline)
        .catch(error => {
          console.error('Error removing timeline event:', error);
          showNotification('error', 'Failed to remove timeline event on server');
        });
    }
  };

  // Handle removing a day
  const handleRemoveDay = (index: number) => {
    const newDays = [...(itinerary.days || [])];
    newDays.splice(index, 1);
    setItinerary(prev => ({ ...prev, days: newDays }));
    showNotification('success', 'Day removed');
    
    if (itinerary.id && itinerary.id !== 'new-trip') {
      updateItinerarySection(itinerary.id, 'days', newDays)
        .catch(error => {
          console.error('Error removing day:', error);
          showNotification('error', 'Failed to remove day on server');
        });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <TripHeader 
            itinerary={itinerary} 
            setItinerary={setItinerary}
            isEditingHeader={isEditingHeader}
            setIsEditingHeader={setIsEditingHeader}
            handleSaveHeader={handleSaveHeader}
          />
          
          {/* Content Scrollable Area with improved width */}
          <div className="flex-1 overflow-auto pb-20 md:pb-0 w-full">
            <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
              {activeSection === 'destinations' && (
                <DestinationsSection 
                  itinerary={itinerary}
                  setItinerary={setItinerary}
                  editingSection={editingSection}
                  setEditingSection={setEditingSection}
                  loading={loading}
                  setLoading={setLoading}
                  showNotification={showNotification}
                  handleRemoveDestination={handleRemoveDestination}
                  syncDaysWithDestinations={syncDaysWithDestinations}
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
                  handleRemoveTimelineEvent={handleRemoveTimelineEvent}
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
                  handleRemoveDay={handleRemoveDay}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav activeSection={activeSection} setActiveSection={setActiveSection} />
      
      {/* Notification */}
      {notification && (
        <Notification 
          type={notification.type} 
          message={notification.message} 
        />
      )}
    </div>
  );
}