import React from 'react';
import { Edit, Save, Calendar, Trash2 } from 'lucide-react';
import { Itinerary, updateItinerarySection } from '../../../lib/api';
import DayByDayView from '../../itinerary/DayByDayView';

interface DayByDaySectionProps {
  itinerary: Partial<Itinerary>;
  setItinerary: React.Dispatch<React.SetStateAction<Partial<Itinerary>>>;
  editingSection: string | null;
  setEditingSection: (section: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  showNotification: (type: 'success' | 'error', message: string) => void;
  handleRemoveDay: (index: number) => void;
}

const DayByDaySection = ({
  itinerary,
  setItinerary,
  editingSection,
  setEditingSection,
  loading,
  setLoading,
  showNotification,
  handleRemoveDay
}: DayByDaySectionProps) => {
  
  const handleSaveDays = () => {
    if (itinerary.id && itinerary.id !== 'new-trip') {
      setLoading(true);
      updateItinerarySection(itinerary.id, 'days', itinerary.days || [])
        .then(() => {
          setEditingSection(null);
          showNotification('success', 'Daily schedule saved!');
        })
        .catch(() => {
          showNotification('error', 'Failed to save daily schedule.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setEditingSection(null);
      showNotification('success', 'Daily schedule saved!');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Day by Day</h2>
        <div className="flex items-center">
          {editingSection === 'days' ? (
            <button
              onClick={handleSaveDays}
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
              onClick={() => setEditingSection('days')}
              className="px-5 py-2 rounded-md font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm flex items-center"
            >
              <Edit className="w-5 h-5 mr-2" /> Edit
            </button>
          )}
        </div>
      </div>

      {editingSection === 'days' ? (
        <div className="border rounded-lg shadow-sm bg-white p-6">
          <DayByDayView
            days={itinerary.days || []}
            editable={true}
            onSave={(d) => {
              setItinerary(prev => ({ ...prev, days: d }));
              return Promise.resolve();
            }}
          />
        </div>
      ) : (
        <>
          {(itinerary.days || []).length > 0 ? (
            <div>
              <div className="border rounded-lg shadow-sm bg-white p-6">
                <DayByDayView
                  days={itinerary.days || []}
                  editable={false}
                  onSave={() => Promise.resolve()}
                />
              </div>
              
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(itinerary.days || []).map((day, i) => (
                  <div key={i} className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-3 flex-shrink-0">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <h3 className="font-medium text-gray-800 text-lg">{day.date}</h3>
                      </div>
                      <p className="text-gray-600">
                        {day.activities.length} {day.activities.length === 1 ? 'activity' : 'activities'} planned
                      </p>
                    </div>
                    <button 
                      onClick={() => handleRemoveDay(i)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                      aria-label="Remove day"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="border border-dashed rounded-lg p-10 text-center bg-gray-50">
              <div className="w-20 h-20 mx-auto mb-5 bg-amber-100 rounded-full flex items-center justify-center">
                <Calendar className="h-10 w-10 text-amber-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">No daily schedule</h3>
              <p className="text-gray-500 mb-8 max-w-lg mx-auto">Plan your daily activities for a more organized trip</p>
              <button
                onClick={() => setEditingSection('days')}
                className="inline-flex items-center px-5 py-2.5 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors shadow font-medium"
              >
                <Edit className="w-5 h-5 mr-2" /> Add Daily Schedule
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DayByDaySection;