import React from 'react';
import { Edit, Save, Clock, Trash2, AlertCircle } from 'lucide-react';
import { Itinerary, updateItinerarySection } from '../../../lib/api';
import TripTimeline from '../../itinerary/TripTimeline';

interface TimelineSectionProps {
  itinerary: Partial<Itinerary>;
  setItinerary: React.Dispatch<React.SetStateAction<Partial<Itinerary>>>;
  editingSection: string | null;
  setEditingSection: (section: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  showNotification: (type: 'success' | 'error', message: string) => void;
  handleRemoveTimelineEvent: (index: number) => void;
}

const TimelineSection = ({
  itinerary,
  setItinerary,
  editingSection,
  setEditingSection,
  loading,
  setLoading,
  showNotification,
  handleRemoveTimelineEvent
}: TimelineSectionProps) => {
  
  const handleSaveTimeline = () => {
    if (itinerary.id && itinerary.id !== 'new-trip') {
      setLoading(true);
      updateItinerarySection(itinerary.id, 'timeline', itinerary.timeline || [])
        .then(() => {
          setEditingSection(null);
          showNotification('success', 'Timeline saved!');
        })
        .catch(() => {
          showNotification('error', 'Failed to save timeline.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setEditingSection(null);
      showNotification('success', 'Timeline saved!');
    }
  };
  
  const getEventIcon = (type: string) => {
    switch(type) {
      case 'flight':
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 12.5C22 11.1193 20.8807 10 19.5 10H9C8.44771 10 8 9.55228 8 9V7C8 5.89543 7.10457 5 6 5H4.5C3.11929 5 2 6.11929 2 7.5V21.5C2 21.7761 2.22386 22 2.5 22H4C4.27614 22 4.5 21.7761 4.5 21.5V17C4.5 16.4477 4.94772 16 5.5 16H18.5C19.8807 16 21 14.8807 21 13.5" />
          <path d="M16 10L16 6M16 2L16 6M16 6L12 6M16 6L20 6" />
        </svg>;
      case 'train':
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="3" width="16" height="16" rx="2" />
          <path d="M4 11H20" />
          <path d="M12 3V19" />
          <path d="M8 19L6 22" />
          <path d="M16 19L18 22" />
        </svg>;
      case 'stay':
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" />
          <path d="M9 22V12H15V22" />
        </svg>;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };
  
  const getEventColor = (type: string) => {
    switch(type) {
      case 'flight':
        return 'bg-blue-500 text-white';
      case 'train':
        return 'bg-green-500 text-white';
      case 'stay':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Timeline</h2>
        <div className="flex items-center">
          {editingSection === 'timeline' ? (
            <button
              onClick={handleSaveTimeline}
              className="px-5 py-2 rounded-md font-medium bg-teal-500 text-white hover:bg-teal-600 transition-colors shadow-sm flex items-center"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" /> Save
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setEditingSection('timeline')}
              className="px-5 py-2 rounded-md font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm flex items-center"
            >
              <Edit className="w-5 h-5 mr-2" /> Edit
            </button>
          )}
        </div>
      </div>

      {editingSection === 'timeline' ? (
        <div className="border rounded-lg shadow-sm bg-white p-6">
          <TripTimeline
            events={itinerary.timeline || []}
            editable={true}
            onSave={(ev) => {
              setItinerary(prev => ({ ...prev, timeline: ev }));
              return Promise.resolve();
            }}
          />
        </div>
      ) : (
        <>
          {(itinerary.timeline || []).length > 0 ? (
            <div>
              <div className="border rounded-lg shadow-sm bg-white p-6">
                <TripTimeline
                  events={itinerary.timeline || []}
                  editable={false}
                  onSave={() => Promise.resolve()}
                />
              </div>
              
              <div className="mt-8 space-y-4">
                {(itinerary.timeline || []).map((event, i) => (
                  <div key={i} className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-3">
                        <div className={`w-10 h-10 rounded-full ${getEventColor(event.type)} flex items-center justify-center mr-3 flex-shrink-0`}>
                          {getEventIcon(event.type)}
                        </div>
                        <h3 className="font-medium text-gray-800 text-lg">{event.label}</h3>
                      </div>
                      <p className="text-gray-600">{event.date}</p>
                      {event.sub && <p className="text-sm text-teal-600 mt-2">{event.sub}</p>}
                    </div>
                    <button 
                      onClick={() => handleRemoveTimelineEvent(i)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                      aria-label="Remove timeline event"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="border border-dashed rounded-lg p-10 text-center bg-gray-50">
              <div className="w-20 h-20 mx-auto mb-5 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">No timeline events</h3>
              <p className="text-gray-500 mb-8 max-w-lg mx-auto">Create a timeline for your trip to organize your travel events</p>
              <button
                onClick={() => setEditingSection('timeline')}
                className="inline-flex items-center px-5 py-2.5 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors shadow font-medium"
              >
                <Edit className="w-5 h-5 mr-2" /> Add Timeline Events
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TimelineSection;