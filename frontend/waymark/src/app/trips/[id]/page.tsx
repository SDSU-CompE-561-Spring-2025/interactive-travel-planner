'use client'

import { useState, useEffect } from 'react'
import type { Itinerary } from '../../../lib/api'
import { getItinerary, updateItinerary, updateItinerarySection } from '../../../lib/api'
import DestinationsMap from '../../../components/itinerary/DestinationsMap'
import TripTimeline from '../../../components/itinerary/TripTimeline'
import DayByDayView from '../../../components/itinerary/DayByDayView'
import { 
  Calendar, 
  MapPin, 
  Share2, 
  ChevronUp, 
  ChevronDown, 
  Edit2,
  Save,
  X
} from 'lucide-react'

interface PageProps {
  params: { id: string }
}

export default function Page({ params }: PageProps) {
  // Fix the params unwrapping issue by immediately extracting the id
  const id = params.id;
  
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [daysCount, setDaysCount] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [mapKey, setMapKey] = useState<number>(0); // Add key for map rerendering
  const [sectionsOpen, setSectionsOpen] = useState<{[key: string]: boolean}>({
    'Destinations': true,
    'Timeline': true,
    'DayByDay': true
  });

  // Load itinerary on component mount
  useEffect(() => {
    async function loadItinerary() {
      try {
        // Use the already extracted id to avoid the warning
        const data = await getItinerary(id);
        setItinerary(data);
        
        // calculate total days
        if (data.start && data.end) {
          const days = Math.floor(
            (new Date(data.end).getTime() - new Date(data.start).getTime()) /
            (1000 * 60 * 60 * 24)
          ) + 1;
          setDaysCount(days);
        }
      } catch (err) {
        console.error('Error loading itinerary:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }
    
    loadItinerary();
  }, [id]); // Use extracted id here

  // Handle map refreshing when collapsing/expanding the section
  const handleSectionToggle = (section: string, isOpen: boolean) => {
    setSectionsOpen(prev => ({
      ...prev,
      [section]: isOpen
    }));
    
    // Increment map key when Destinations section is opened to force a refresh
    if (section === 'Destinations' && isOpen) {
      setTimeout(() => {
        setMapKey(prev => prev + 1);
      }, 100);
    }
  };

  // Handle editing a specific section
  const handleEditSection = (section: string) => {
    setEditingSection(section);
  };
  
  // Handle saving changes to a section
  const handleSaveSection = async (section: string) => {
    if (!itinerary) return;
    
    setIsSaving(true);
    
    try {
      // Now actually update the section in the backend
      switch(section) {
        case 'Destinations':
          await updateItinerarySection(itinerary.id, 'destinations', itinerary.destinations);
          // Force map to reload when destinations are saved
          setMapKey(prev => prev + 1);
          break;
        case 'Timeline':
          await updateItinerarySection(itinerary.id, 'timeline', itinerary.timeline);
          break;
        case 'DayByDay':
          await updateItinerarySection(itinerary.id, 'days', itinerary.days);
          break;
        default:
          // For any other section, update the entire itinerary
          await updateItinerary(itinerary.id, itinerary);
      }
      
      // Reload the itinerary to get the latest data
      const updatedItinerary = await getItinerary(id);
      setItinerary(updatedItinerary);
      
      // Clear editing status
      setEditingSection(null);
      
      // Show success notification
      setNotification({
        type: 'success',
        message: `${section} updated successfully!`
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error(`Error updating ${section}:`, err);
      
      // Show error notification
      setNotification({
        type: 'error',
        message: `Failed to update ${section}. Please try again.`
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Update destinations values - fixed return type
  const handleDestinationsUpdate = async (destinations: any[]): Promise<void> => {
    if (!itinerary) return;
    
    try {
      // Update the local state
      setItinerary({
        ...itinerary,
        destinations
      });
      
      // Update in the backend
      await updateItinerarySection(itinerary.id, 'destinations', destinations);
      
      // Reload the data to ensure consistency
      const updatedItinerary = await getItinerary(id);
      setItinerary(updatedItinerary);
      
      // Show success notification
      setNotification({
        type: 'success',
        message: 'Destinations updated successfully!'
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error updating destinations:', error);
      
      // Show error notification
      setNotification({
        type: 'error',
        message: 'Failed to update destinations. Please try again.'
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    }
  };
  
  // Update timeline events - fixed return type
  const handleTimelineUpdate = async (timeline: any[]): Promise<void> => {
    if (!itinerary) return;
    
    try {
      // Update the local state
      setItinerary({
        ...itinerary,
        timeline
      });
      
      // Update in the backend
      await updateItinerarySection(itinerary.id, 'timeline', timeline);
      
      // Reload the data to ensure consistency
      const updatedItinerary = await getItinerary(id);
      setItinerary(updatedItinerary);
      
      // Show success notification
      setNotification({
        type: 'success',
        message: 'Timeline updated successfully!'
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error updating timeline:', error);
      
      // Show error notification
      setNotification({
        type: 'error',
        message: 'Failed to update timeline. Please try again.'
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    }
  };
  
  // Update days schedule - fixed return type
  const handleDaysUpdate = async (days: any[]): Promise<void> => {
    if (!itinerary) return;
    
    try {
      // Update the local state
      setItinerary({
        ...itinerary,
        days
      });
      
      // Update in the backend
      await updateItinerarySection(itinerary.id, 'days', days);
      
      // Reload the data to ensure consistency
      const updatedItinerary = await getItinerary(id);
      setItinerary(updatedItinerary);
      
      // Show success notification
      setNotification({
        type: 'success',
        message: 'Day by day schedule updated successfully!'
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error updating days:', error);
      
      // Show error notification
      setNotification({
        type: 'error',
        message: 'Failed to update day by day schedule. Please try again.'
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    }
  };
  
  // Handle canceling edits
  const handleCancelEdit = () => {
    setEditingSection(null);
  };

  // Share function with better button
  const handleShare = () => {
    if (navigator.share && itinerary) {
      navigator.share({
        title: itinerary.title,
        text: `Check out my ${itinerary.title} itinerary on WayMark!`,
        url: window.location.href
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href).then(() => {
        setNotification({
          type: 'success',
          message: 'Link copied to clipboard!'
        });
        
        // Clear notification after 3 seconds
        setTimeout(() => setNotification(null), 3000);
      }).catch(err => {
        console.error('Failed to copy link:', err);
        
        setNotification({
          type: 'error',
          message: 'Failed to copy link. Please try again.'
        });
        
        // Clear notification after 3 seconds
        setTimeout(() => setNotification(null), 3000);
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-teal-500 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading itinerary details...</p>
        </div>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="max-w-3xl mx-auto p-8 mt-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Unable to load itinerary</h1>
          <p className="text-gray-700 mb-6">
            We couldn't retrieve the itinerary details. Please try again later.
          </p>
          <div className="mt-4 p-4 bg-white rounded-md border border-gray-200">
            <p className="text-sm text-gray-500 font-mono">
              Error: {error?.message || 'Unknown error'}
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors shadow-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Custom component for Collapsible section with state management
  const CustomCollapsibleSection = ({ title, section, children }: { title: string; section: string; children: React.ReactNode }) => {
    const isOpen = sectionsOpen[section] ?? true;
    
    return (
      <div className="border rounded-lg shadow-sm mb-6 bg-white transition-shadow hover:shadow-md">
        <div className="px-6 py-4 flex justify-between items-center border-b bg-gray-50 rounded-t-lg">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <div className="flex items-center">
            {editMode && editingSection !== section && (
              <button 
                onClick={() => handleEditSection(section)}
                className="text-blue-500 hover:text-blue-700 mr-3 flex items-center bg-white px-3 py-1 rounded-md border border-blue-200 shadow-sm transition-colors"
                aria-label="Edit"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                <span className="text-sm">Edit</span>
              </button>
            )}
            
            {editingSection === section && (
              <div className="flex space-x-2 mr-3">
                <button 
                  onClick={() => handleSaveSection(section)}
                  className="text-white bg-green-500 hover:bg-green-600 flex items-center px-3 py-1 rounded-md shadow-sm transition-colors"
                >
                  <Save className="w-4 h-4 mr-1" />
                  <span className="text-sm">Save</span>
                </button>
                <button 
                  onClick={handleCancelEdit}
                  className="text-gray-700 bg-gray-100 hover:bg-gray-200 flex items-center px-3 py-1 rounded-md shadow-sm transition-colors"
                >
                  <X className="w-4 h-4 mr-1" />
                  <span className="text-sm">Cancel</span>
                </button>
              </div>
            )}
            
            <button 
              onClick={() => handleSectionToggle(section, !isOpen)}
              className="text-gray-500 hover:text-gray-700 bg-white rounded-full w-8 h-8 flex items-center justify-center border border-gray-200 shadow-sm"
              aria-label={isOpen ? "Collapse" : "Expand"}
            >
              {isOpen ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        
        {isOpen && (
          <div className="p-6">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
      {/* Notification toast */}
      {notification && (
        <div 
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md transition-all transform translate-y-0 opacity-100 ${
            notification.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex items-center">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              notification.type === 'success' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'
            }`}>
              {notification.type === 'success' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                notification.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {notification.message}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-center">{itinerary.title}</h1>
        
        <div className="flex flex-col md:flex-row justify-center items-center text-gray-600 gap-3 mb-4 text-sm">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-teal-600" />
            <span>{itinerary.start} – {itinerary.end} • {daysCount} days</span>
          </div>
          
          {itinerary.destinations.length > 0 && (
            <div className="flex items-center md:ml-6">
              <MapPin className="w-4 h-4 mr-2 text-teal-600" />
              <span>
                {itinerary.destinations.map(d => d.name).join(' • ')}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`
              flex items-center px-3 py-1.5 rounded-md shadow-sm transition-colors text-sm font-medium
              ${editMode 
                ? 'bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200' 
                : 'bg-blue-500 text-white hover:bg-blue-600'}
            `}
          >
            <Edit2 className="w-3.5 h-3.5 mr-1.5" />
            {editMode ? "Exit Edit Mode" : "Edit"}
          </button>
          
          <button 
            onClick={handleShare}
            className="flex items-center bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-md px-3 py-1.5 transition-colors shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 mr-1.5" />
            <span>Share</span>
          </button>
        </div>
      </header>

      <div className="mb-6">
        <CustomCollapsibleSection 
          title="Destinations"
          section="Destinations"
        >
          <DestinationsMap 
            key={`destinations-map-${mapKey}`} 
            destinations={itinerary.destinations} 
            editable={editingSection === 'Destinations'}
            onSave={handleDestinationsUpdate}
          />
        </CustomCollapsibleSection>
      </div>
      
      <CustomCollapsibleSection 
        title="Trip Timeline"
        section="Timeline"
      >
        <TripTimeline 
          events={itinerary.timeline} 
          editable={editingSection === 'Timeline'}
          onSave={handleTimelineUpdate}
        />
      </CustomCollapsibleSection>
      
      <CustomCollapsibleSection 
        title="Day by Day"
        section="DayByDay"
      >
        <DayByDayView 
          days={itinerary.days} 
          editable={editingSection === 'DayByDay'}
          onSave={handleDaysUpdate}
        />
      </CustomCollapsibleSection>
      
      <footer className="mt-8 pt-4 border-t text-center text-gray-500 text-xs">
        <p>WayMark - Your Travel Companion</p>
        <p className="mt-1">Plan, organize, and enjoy your trips with ease</p>
      </footer>
    </div>
  );
}