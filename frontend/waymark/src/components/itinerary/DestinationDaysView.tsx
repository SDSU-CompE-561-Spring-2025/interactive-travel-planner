import React from 'react';
import { ChevronLeft, Calendar, Edit, Save } from 'lucide-react';
import { Itinerary, updateItinerarySection } from '../../lib/api';

interface DestinationDaysViewProps {
  itinerary: Partial<Itinerary>;
  setItinerary: React.Dispatch<React.SetStateAction<Partial<Itinerary>>>;
  destinationName: string;
  destinationDates: string[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  showNotification: (type: 'success' | 'error', message: string) => void;
  onBack: () => void;
}

const DestinationDaysView: React.FC<DestinationDaysViewProps> = ({
  itinerary,
  setItinerary,
  destinationName,
  destinationDates,
  loading,
  setLoading,
  showNotification,
  onBack
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedDays, setEditedDays] = React.useState<NonNullable<Itinerary["days"]>>(
    itinerary.days || []
  );

  // Filter days that are part of this destination
  const destinationDays = (itinerary.days || []).filter(day => 
    destinationDates.includes(day.date)
  );

  // Handle saving edited activities
  const handleSave = () => {
    if (itinerary.id && itinerary.id !== 'new-trip') {
      setLoading(true);
      
      // Update only the days that are part of this destination,
      // preserve other days
      const updatedDays = (itinerary.days || []).map(day => {
        if (destinationDates.includes(day.date)) {
          // Find the edited version of this day
          const editedDay = editedDays.find(d => d.date === day.date);
          return editedDay || day;
        }
        return day;
      });
      
      updateItinerarySection(itinerary.id, 'days', updatedDays)
        .then(() => {
          setItinerary((prev: Partial<Itinerary>) => ({
            ...prev,
            days: updatedDays
          }));
          setIsEditing(false);
          showNotification('success', 'Activities saved!');
        })
        .catch(error => {
          console.error('Error saving activities:', error);
          showNotification('error', 'Failed to save activities.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // For new trips, just update the local state
      const updatedDays = (itinerary.days || []).map(day => {
        if (destinationDates.includes(day.date)) {
          // Find the edited version of this day
          const editedDay = editedDays.find(d => d.date === day.date);
          return editedDay || day;
        }
        return day;
      });
      
      setItinerary((prev: Partial<Itinerary>) => ({
        ...prev,
        days: updatedDays
      }));
      
      setIsEditing(false);
      showNotification('success', 'Activities saved!');
    }
  };

  // Handle editing an activity
  const handleEditActivity = (dayIndex: number, activityIndex: number, field: string, value: string) => {
    const newEditedDays = [...editedDays];
    if (newEditedDays[dayIndex] && newEditedDays[dayIndex].activities) {
      newEditedDays[dayIndex].activities[activityIndex] = {
        ...newEditedDays[dayIndex].activities[activityIndex],
        [field]: value
      };
      setEditedDays(newEditedDays);
    }
  };

  // Handle adding a new activity
  const handleAddActivity = (dayIndex: number) => {
    const newEditedDays = [...editedDays];
    if (newEditedDays[dayIndex]) {
      // Get default time (9:00 AM or 30 minutes after last activity)
      let defaultTime = "9:00 AM";
      
      if (newEditedDays[dayIndex].activities.length > 0) {
        // Sort activities by time
        const sortedActivities = [...newEditedDays[dayIndex].activities].sort((a, b) => {
          const parseTime = (timeStr: string) => {
            if (!timeStr) return 0;
            try {
              const [timePart, ampm] = timeStr.split(' ');
              const [hourStr, minuteStr] = timePart.split(':');
              let hour = parseInt(hourStr);
              const minute = parseInt(minuteStr);
              
              // Convert to 24-hour format
              if (ampm === 'PM' && hour < 12) hour += 12;
              if (ampm === 'AM' && hour === 12) hour = 0;
              
              return hour * 60 + minute; // minutes since midnight
            } catch (e) {
              return 0;
            }
          };
          
          return parseTime(a.time) - parseTime(b.time);
        });
        
        // Get the last activity time
        const lastActivity = sortedActivities[sortedActivities.length - 1];
        if (lastActivity && lastActivity.time) {
          const [timePart, ampm] = lastActivity.time.split(' ');
          const [hourStr, minuteStr] = timePart.split(':');
          let hour = parseInt(hourStr);
          let minute = parseInt(minuteStr);
          
          // Add 30 minutes
          minute += 30;
          if (minute >= 60) {
            minute -= 60;
            hour += 1;
          }
          
          // Handle hour rollover and AM/PM change
          let newAmPm = ampm;
          if (hour > 12) {
            hour = 1;
          } else if (hour === 12) {
            newAmPm = ampm === 'AM' ? 'PM' : 'AM';
          }
          
          defaultTime = `${hour}:${minute.toString().padStart(2, '0')} ${newAmPm}`;
        }
      }
      
      newEditedDays[dayIndex].activities.push({
        time: defaultTime,
        title: "New Activity",
        notes: ""
      });
      
      setEditedDays(newEditedDays);
    }
  };

  // Handle removing an activity
  const handleRemoveActivity = (dayIndex: number, activityIndex: number) => {
    const newEditedDays = [...editedDays];
    if (newEditedDays[dayIndex] && newEditedDays[dayIndex].activities) {
      newEditedDays[dayIndex].activities.splice(activityIndex, 1);
      setEditedDays(newEditedDays);
    }
  };

  // Initialize edited days when entering edit mode
  React.useEffect(() => {
    if (isEditing) {
      setEditedDays(itinerary.days || []);
    }
  }, [isEditing, itinerary.days]);

  // Find destination color
  const destinationColor = React.useMemo(() => {
    const dest = (itinerary.destinations || []).find(d => d.name === destinationName);
    return (dest as { name: string; dates: string; lat?: number; lng?: number; color?: string } | undefined)?.color || '#66C5CC'; // Default color
  }, [destinationName, itinerary.destinations]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="mr-3 p-2 rounded-full hover:bg-gray-100 text-gray-600"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-semibold text-gray-800">
            {destinationName}
          </h2>
        </div>
        <div>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm flex items-center"
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
                  <Save className="w-4 h-4 mr-2" /> Save Activities
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-md font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm flex items-center"
            >
              <Edit className="w-4 h-4 mr-2" /> Edit Activities
            </button>
          )}
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
        <p className="text-blue-800 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Viewing schedule for your stay in {destinationName} from {' '}
          <span className="font-medium mx-1">
            {new Date(destinationDates[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span> 
          to 
          <span className="font-medium mx-1">
            {new Date(destinationDates[destinationDates.length-1]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          ({destinationDates.length} days)
        </p>
      </div>

      {destinationDays.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No days scheduled</h3>
          <p className="text-gray-500">This destination doesn't have any days scheduled yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinationDays.map((day, dayIndex) => {
            // Find the corresponding edited day
            const editedDay = isEditing ? 
              editedDays.find(d => d.date === day.date) : 
              day;
            
            if (!editedDay) return null;
            
            // Calculate the actual index in the editedDays array
            const editedDayIndex = editedDays.findIndex(d => d.date === day.date);
            
            return (
              <div 
                key={day.date} 
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
                style={{ 
                  borderTopWidth: '16px',
                  borderTopColor: destinationColor
                }}
              >
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </h3>
                  
                  {isEditing ? (
                    <div className="space-y-3">
                      {editedDay.activities.map((activity, actIndex) => (
                        <div key={actIndex} className="p-3 bg-gray-50 rounded-md">
                          <div className="grid grid-cols-3 gap-2 mb-2">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Time</label>
                              <input 
                                type="text" 
                                value={activity.time || ''} 
                                onChange={(e) => handleEditActivity(editedDayIndex, actIndex, 'time', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-xs text-gray-500 mb-1">Activity</label>
                              <input 
                                type="text" 
                                value={activity.title || ''} 
                                onChange={(e) => handleEditActivity(editedDayIndex, actIndex, 'title', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Notes</label>
                            <input 
                              type="text" 
                              value={activity.notes || ''} 
                              onChange={(e) => handleEditActivity(editedDayIndex, actIndex, 'notes', e.target.value)}
                              placeholder="Optional notes"
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div className="mt-2 text-right">
                            <button 
                              onClick={() => handleRemoveActivity(editedDayIndex, actIndex)}
                              className="text-xs text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <button
                        onClick={() => handleAddActivity(editedDayIndex)}
                        className="w-full py-2 text-center text-sm text-blue-600 hover:text-blue-800 border border-dashed border-blue-300 rounded-md hover:bg-blue-50"
                      >
                        + Add Activity
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {day.activities && day.activities.length > 0 ? (
                        day.activities.map((activity: any, actIndex: number) => (
                          <div key={actIndex} className="flex">
                            <div className="w-20 flex-shrink-0">
                              <span className="text-gray-600 text-sm">{activity.time}</span>
                            </div>
                            <div>
                              <div className="font-medium text-sm">{activity.title}</div>
                              {activity.notes && (
                                <p className="text-xs text-gray-500">{activity.notes}</p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">
                          No activities planned for this day.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DestinationDaysView;