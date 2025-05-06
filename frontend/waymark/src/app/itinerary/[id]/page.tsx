'use client'

import { useState, useEffect } from 'react'
import type { Itinerary } from '../../../lib/api'
import { getItinerary, updateItinerary } from '../../../lib/api'
import BudgetOverview from '../../../components/itinerary/BudgetOverview'
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

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  editMode?: boolean;
  onEdit?: () => void;
  editingSection?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}

// Collapsible section component
function CollapsibleSection({ 
  title, 
  children, 
  defaultOpen = true, 
  editMode = false, 
  onEdit,
  editingSection = false,
  onSave,
  onCancel 
}: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border rounded-lg shadow-sm mb-6 bg-white transition-shadow hover:shadow-md">
      <div className="px-6 py-4 flex justify-between items-center border-b bg-gray-50 rounded-t-lg">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center">
          {editMode && !editingSection && (
            <button 
              onClick={onEdit}
              className="text-blue-500 hover:text-blue-700 mr-3 flex items-center bg-white px-3 py-1 rounded-md border border-blue-200 shadow-sm transition-colors"
              aria-label="Edit"
            >
              <Edit2 className="w-4 h-4 mr-1" />
              <span className="text-sm">Edit</span>
            </button>
          )}
          
          {editingSection && (
            <div className="flex space-x-2 mr-3">
              <button 
                onClick={onSave}
                className="text-white bg-green-500 hover:bg-green-600 flex items-center px-3 py-1 rounded-md shadow-sm transition-colors"
              >
                <Save className="w-4 h-4 mr-1" />
                <span className="text-sm">Save</span>
              </button>
              <button 
                onClick={onCancel}
                className="text-gray-700 bg-gray-100 hover:bg-gray-200 flex items-center px-3 py-1 rounded-md shadow-sm transition-colors"
              >
                <X className="w-4 h-4 mr-1" />
                <span className="text-sm">Cancel</span>
              </button>
            </div>
          )}
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
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
}

interface PageProps {
  params: { id: string }
}

export default function Page({ params }: PageProps) {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [daysCount, setDaysCount] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  useEffect(() => {
    async function loadItinerary() {
      try {
        // Make sure params is fully resolved by destructuring the id
        const { id } = params;
        
        // fetch the real itinerary by its ID
        const data = await getItinerary(id);
        setItinerary(data);
        
        // calculate total days
        const days = Math.floor(
          (new Date(data.end).getTime() - new Date(data.start).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1;
        setDaysCount(days);
        
      } catch (err) {
        console.error('Error loading itinerary:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }
    
    loadItinerary();
  }, [params]);

  // Handle editing a specific section
  const handleEditSection = (section: string) => {
    setEditingSection(section);
  };
  
  // Handle saving changes to a section
  const handleSaveSection = async (section: string) => {
    if (!itinerary) return;
    
    setIsSaving(true);
    
    try {
      // In a real app, you would update only the changed section
      // For now, we're simulating a successful update
      // await updateItinerary(itinerary.id, itinerary);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
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
      <div className="w-full h-screen flex items-center justify-center">
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
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
      
      <header className="mb-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{itinerary.title}</h1>
          
          <div className="flex flex-col md:flex-row justify-center items-center text-gray-600 gap-3 mb-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-teal-600" />
              <span className="text-sm md:text-base">{itinerary.start} – {itinerary.end} • {daysCount} days</span>
            </div>
            
            {itinerary.destinations.length > 0 && (
              <div className="flex items-center md:ml-6">
                <MapPin className="w-4 h-4 mr-2 text-teal-600" />
                <span className="text-sm md:text-base">
                  {itinerary.destinations.map(d => d.name).join(' • ')}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <button
              onClick={() => setEditMode(!editMode)}
              className={`
                flex items-center px-4 py-2 rounded-md shadow-sm transition-colors
                ${editMode 
                  ? 'bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'}
              `}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editMode ? "Exit Edit Mode" : "Enable Edit Mode"}
            </button>
            
            <button 
              onClick={handleShare}
              className="flex items-center bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-md px-4 py-2 transition-colors shadow-sm"
            >
              <Share2 className="w-4 h-4 mr-2" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-1">
          <CollapsibleSection 
            title="Budget" 
            editMode={editMode}
            editingSection={editingSection === 'Budget'}
            onEdit={() => handleEditSection('Budget')}
            onSave={() => handleSaveSection('Budget')}
            onCancel={handleCancelEdit}
          >
            <BudgetOverview total={itinerary.budget.total} spent={itinerary.budget.spent} />
          </CollapsibleSection>
        </div>
        <div className="md:col-span-2">
          <CollapsibleSection 
            title="Destinations"
            editMode={editMode}
            editingSection={editingSection === 'Destinations'}
            onEdit={() => handleEditSection('Destinations')}
            onSave={() => handleSaveSection('Destinations')}
            onCancel={handleCancelEdit}
          >
            <DestinationsMap destinations={itinerary.destinations} />
          </CollapsibleSection>
        </div>
      </div>
      
      <CollapsibleSection 
        title="Trip Timeline"
        editMode={editMode}
        editingSection={editingSection === 'Timeline'}
        onEdit={() => handleEditSection('Timeline')}
        onSave={() => handleSaveSection('Timeline')}
        onCancel={handleCancelEdit}
      >
        <TripTimeline events={itinerary.timeline} />
      </CollapsibleSection>
      
      <CollapsibleSection 
        title="Day by Day"
        editMode={editMode}
        editingSection={editingSection === 'DayByDay'}
        onEdit={() => handleEditSection('DayByDay')}
        onSave={() => handleSaveSection('DayByDay')}
        onCancel={handleCancelEdit}
      >
        <DayByDayView days={itinerary.days} />
      </CollapsibleSection>
      
      <footer className="mt-12 pt-6 border-t text-center text-gray-500 text-sm">
        <p>WayMark - Your Travel Companion</p>
        <p className="mt-1">Plan, organize, and enjoy your trips with ease</p>
      </footer>
    </div>
  );
}