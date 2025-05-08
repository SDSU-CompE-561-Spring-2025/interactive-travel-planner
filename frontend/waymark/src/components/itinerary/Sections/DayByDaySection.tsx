import React, { useState, useEffect } from 'react';
import { Edit, Save, Calendar, Plus, X, MapPin } from 'lucide-react';
import { Itinerary, updateItinerarySection } from '../../../lib/api';

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

const DayByDaySection: React.FC<DayByDaySectionProps> = ({
  itinerary,
  setItinerary,
  editingSection,
  setEditingSection,
  loading,
  setLoading,
  showNotification,
  handleRemoveDay
}) => {
  const [newDay, setNewDay] = useState<{ date: string }>({ date: '' });
  const [newActivity, setNewActivity] = useState<{ 
    dayIndex: number; 
    activity: { time: string; title: string; notes?: string } 
  }>({
    dayIndex: -1,
    activity: { time: '', title: '' }
  });
  const [activeEditDay, setActiveEditDay] = useState<number>(-1);
  
  // ── AUTOPOPULATE DAYS FROM TRIP START/END ────────────────────────────────────
  /**
   * When the trip has a start & end date but no days yet,
   * build a days[] entry for each calendar day in between.
   */
  useEffect(() => {
    if (
      itinerary.start &&
      itinerary.end &&
      (!itinerary.days || itinerary.days.length === 0)
    ) {
      const start = new Date(itinerary.start);
      const end = new Date(itinerary.end);
      const daysArr: typeof itinerary.days = [];

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const iso = d.toISOString().split('T')[0];
        // carry over any existing activities (if you re-open the editor)
        const existing = itinerary.days?.find((dd) => dd.date === iso)?.activities || [];
        daysArr.push({ date: iso, activities: existing });
      }
      setItinerary((prev) => ({ ...prev, days: daysArr }));
    }
  }, [itinerary.start, itinerary.end, setItinerary]);
  // ─────────────────────────────────────────────────────────────────────────────
  
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
  
  const handleAddDay = () => {
    if (newDay.date) {
      // Check if date already exists
      const exists = (itinerary.days || []).some(day => day.date === newDay.date);
      if (exists) {
        showNotification('error', 'This date already exists in your itinerary');
        return;
      }
      
      const updatedDays = [...(itinerary.days || []), { date: newDay.date, activities: [] }];
      // Sort by date
      updatedDays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setItinerary(prev => ({ ...prev, days: updatedDays }));
      setNewDay({ date: '' });
      showNotification('success', 'Day added to itinerary');
    }
  };

  // Function to get default time
  const getDefaultTime = (dayIndex: number) => {
    if (!itinerary.days || !itinerary.days[dayIndex] || itinerary.days[dayIndex].activities.length === 0) {
      return "9:00 AM"; // Default to 9:00 AM for first activity
    } 
    
    // Get the last activity's time and add 30 minutes
    const activities = [...itinerary.days[dayIndex].activities];
    if (activities.length === 0) return "9:00 AM";
    
    const lastActivity = activities.sort((a, b) => {
      const parseTime = (timeStr: string) => {
        if (!timeStr) return 0;
        try {
          const [timePart, ampm] = timeStr.split(' ');
          const [hourStr, minuteStr] = timePart.split(':');
          let hour = parseInt(hourStr);
          const minute = parseInt(minuteStr);
          
          // Convert to 24-hour format for comparison
          if (ampm === 'PM' && hour < 12) hour += 12;
          if (ampm === 'AM' && hour === 12) hour = 0;
          
          return hour * 60 + minute; // minutes since midnight
        } catch (e) {
          return 0;
        }
      };
      return parseTime(b.time) - parseTime(a.time);
    })[0];
    
    if (!lastActivity || !lastActivity.time) return "9:00 AM";
    
    // Parse last time
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
    
    return `${hour}:${minute.toString().padStart(2, '0')} ${newAmPm}`;
  };
  
  const handleAddActivity = () => {
    if (newActivity.dayIndex >= 0 && newActivity.activity.time && newActivity.activity.title) {
      const updatedDays = [...(itinerary.days || [])];
      updatedDays[newActivity.dayIndex].activities.push({...newActivity.activity});
      
      // Ensure times are sorted chronologically
      updatedDays[newActivity.dayIndex].activities.sort((a, b) => {
        // Parse times to compare them properly
        const parseTime = (timeStr: string) => {
          if (!timeStr) return 0;
          
          try {
            const [timePart, ampm] = timeStr.split(' ');
            const [hourStr, minuteStr] = timePart.split(':');
            let hour = parseInt(hourStr);
            const minute = parseInt(minuteStr);
            
            // Convert to 24-hour format for comparison
            if (ampm === 'PM' && hour < 12) hour += 12;
            if (ampm === 'AM' && hour === 12) hour = 0;
            
            return hour * 60 + minute; // minutes since midnight
          } catch (e) {
            return 0;
          }
        };
        
        return parseTime(a.time) - parseTime(b.time);
      });
      
      setItinerary(prev => ({ ...prev, days: updatedDays }));
      setNewActivity({ dayIndex: -1, activity: { time: '', title: '' } });
      setActiveEditDay(-1);
      showNotification('success', 'Activity added');
    }
  };
  
  const handleRemoveActivity = (dayIndex: number, activityIndex: number) => {
    const updatedDays = [...(itinerary.days || [])];
    updatedDays[dayIndex].activities.splice(activityIndex, 1);
    setItinerary(prev => ({ ...prev, days: updatedDays }));
    showNotification('success', 'Activity removed');
  };
  
  // Format date as "Jun 11,2025"
  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day},${year}`;
  };
  
  // Get the location for a day from destinations
  const getLocationForDay = (date: string): string => {
    const destinations = itinerary.destinations || [];
    
    for (const dest of destinations) {
      const [start, end] = dest.dates.split(',').map(d => d.trim());
      const dayDate = new Date(date);
      const startDate = new Date(start);
      const endDate = new Date(end);
      
      if (dayDate >= startDate && dayDate <= endDate) {
        return dest.name;
      }
    }
    
    return '';
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

      {(itinerary.days || []).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* ── ADD A NEW DAY ───────────────────────────────────*/}
          {editingSection === 'days' && (
            <div className="flex items-center space-x-2 mb-6">
              <label className="text-sm text-gray-700">New Day:</label>
              <input
                type="date"
                className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring focus:ring-teal-200"
                value={newDay.date}
                onChange={(e) => setNewDay({ date: e.target.value })}
              />
              <button
                className="inline-flex items-center bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded-md shadow-sm text-sm"
                onClick={handleAddDay}
                disabled={!newDay.date}
              >
                <Plus size={14} className="mr-1" /> Add Day
              </button>
            </div>
          )}
          {/* ── YOUR EXISTING DAY CARDS BELOW HERE ──────────────── */}
          {(itinerary.days || []).map((day, dayIndex) => (
            <div 
              key={dayIndex} 
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
              style={{ 
                borderTopWidth: '16px',
                borderTopColor: dayIndex % 4 === 0 ? '#DCB0F2' : 
                              dayIndex % 4 === 1 ? '#F6C571' : 
                              dayIndex % 4 === 2 ? '#87C55F' : 
                              '#9EB9F3'
              }}
            >
              <div className="p-2">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-xl font-bold">Day {dayIndex + 1}</h3>
                  {editingSection === 'days' && (
                    <button 
                      onClick={() => handleRemoveDay(dayIndex)}
                      className="text-gray-400 hover:text-red-500 p-1"
                      title="Delete this day"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
                
                <div className="flex items-center mb-2 text-sm">
                  <span className="text-gray-500 mr-1">
                    <MapPin size={14} />
                  </span>
                  <span className="text-gray-700">{getLocationForDay(day.date)}</span>
                  <span className="text-gray-500 ml-auto">{formatShortDate(day.date)}</span>
                </div>
                
                <div className="space-y-0.5">
                  {day.activities.map((activity, actIndex) => (
                    <div key={actIndex} className="flex items-start py-0.5">
                      <div className="w-20 flex-shrink-0">
                        <span className="text-gray-600 text-xs">{activity.time}</span>
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <span className="font-medium text-sm">{activity.title}</span>
                          {editingSection === 'days' && (
                            <button 
                              onClick={() => handleRemoveActivity(dayIndex, actIndex)}
                              className="text-gray-400 hover:text-red-500 ml-1"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                        {activity.notes && (
                          <p className="text-gray-500 text-xs">{activity.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {day.activities.length === 0 && (
                    <div className="text-gray-400 text-center py-1 text-xs">
                      No activities planned
                    </div>
                  )}
                  
                  {/* Add activity button (when editing) */}
                  {editingSection === 'days' && (
                    <div className="text-center mt-2">
                      {activeEditDay === dayIndex ? (
                        <div className="space-y-2 bg-gray-50 p-3 rounded-md">
                          <div className="flex space-x-2">
                            <div className="inline-flex bg-white shadow-sm rounded-md overflow-hidden border border-gray-200" style={{ width: '110px' }}>
                              {/* Hour selector with left alignment */}
                              <select 
                                className="py-2 pl-2 pr-1 text-xs focus:outline-none appearance-none bg-transparent"
                                style={{ 
                                  width: '35px', 
                                  textAlign: 'left'
                                }}
                                value={
                                  newActivity.activity.time ? 
                                  newActivity.activity.time.split(':')[0] : 
                                  getDefaultTime(dayIndex).split(':')[0]
                                }
                                onChange={(e) => {
                                  const newHour = e.target.value;
                                  const oldTime = newActivity.activity.time || getDefaultTime(dayIndex);
                                  const [_, oldMinutes, oldAmPm] = oldTime.split(/[:\s]/);
                                  const newTime = `${newHour}:${oldMinutes || "00"} ${oldAmPm || "AM"}`;
                                  setNewActivity({
                                    ...newActivity,
                                    activity: { ...newActivity.activity, time: newTime }
                                  });
                                }}
                              >
                                {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(hour => (
                                  <option key={hour} value={hour}>
                                    {hour}
                                  </option>
                                ))}
                              </select>
                              
                              <div className="text-gray-400 flex items-center font-medium">:</div>
                              
                              {/* Minute selector with left alignment */}
                              <select 
                                className="py-2 px-1 text-xs focus:outline-none appearance-none bg-transparent"
                                style={{ 
                                  width: '35px',
                                  textAlign: 'left'
                                }}
                                value={
                                  newActivity.activity.time ? 
                                  (newActivity.activity.time.split(':')[1] || "").split(' ')[0] : 
                                  getDefaultTime(dayIndex).split(':')[1].split(' ')[0]
                                }
                                onChange={(e) => {
                                  const newMinute = e.target.value;
                                  const oldTime = newActivity.activity.time || getDefaultTime(dayIndex);
                                  const [oldHour, _, oldAmPm] = oldTime.split(/[:\s]/);
                                  const newTime = `${oldHour || "12"}:${newMinute} ${oldAmPm || "AM"}`;
                                  setNewActivity({
                                    ...newActivity,
                                    activity: { ...newActivity.activity, time: newTime }
                                  });
                                }}
                              >
                                {Array.from({ length: 12 }, (_, i) => i * 5).map(minute => (
                                  <option key={minute} value={minute.toString().padStart(2, '0')}>
                                    {minute.toString().padStart(2, '0')}
                                  </option>
                                ))}
                              </select>
                              
                              {/* AM/PM selector with left alignment */}
                              <div className="flex flex-col relative border-l border-gray-100">
                                <select 
                                  className="py-2 pl-1 pr-2 text-xs focus:outline-none appearance-none bg-transparent"
                                  style={{ 
                                    width: '40px',
                                    textAlign: 'left'
                                  }}
                                  value={
                                    newActivity.activity.time ? 
                                    (newActivity.activity.time.split(' ')[1] || "") : 
                                    getDefaultTime(dayIndex).split(' ')[1]
                                  }
                                  onChange={(e) => {
                                    const newAmPm = e.target.value;
                                    const oldTime = newActivity.activity.time || getDefaultTime(dayIndex);
                                    const [oldHour, oldMinutes] = oldTime.split(/[:\s]/);
                                    const newTime = `${oldHour || "12"}:${oldMinutes || "00"} ${newAmPm}`;
                                    setNewActivity({
                                      ...newActivity,
                                      activity: { ...newActivity.activity, time: newTime }
                                    });
                                  }}
                                >
                                  <option value="AM">AM</option>
                                  <option value="PM">PM</option>
                                </select>
                              </div>
                            </div>
                            
                            {/* Activity name input */}
                            <input
                              type="text"
                              placeholder="Activity name"
                              className="border border-gray-200 rounded-md shadow-sm py-2 px-3 text-xs flex-grow focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                              value={newActivity.activity.title}
                              onChange={(e) => setNewActivity({
                                ...newActivity,
                                activity: { ...newActivity.activity, title: e.target.value }
                              })}
                            />
                          </div>
                          
                          {/* Notes input */}
                          <input
                            type="text"
                            placeholder="Notes (optional)"
                            className="border border-gray-200 rounded-md shadow-sm py-2 px-3 text-xs w-full focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                            value={newActivity.activity.notes || ''}
                            onChange={(e) => setNewActivity({
                              ...newActivity,
                              activity: { ...newActivity.activity, notes: e.target.value }
                            })}
                          />
                          
                          {/* Action buttons */}
                          <div className="flex justify-end space-x-2 mt-2">
                            <button 
                              className="text-gray-500 text-xs px-3 py-2 rounded-md hover:bg-gray-100"
                              onClick={() => setActiveEditDay(-1)}
                            >
                              Cancel
                            </button>
                            <button 
                              className="bg-teal-500 text-white text-xs py-2 px-4 rounded-md shadow-sm hover:bg-teal-600 transition-colors"
                              onClick={handleAddActivity}
                              disabled={!newActivity.activity.time || !newActivity.activity.title}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          className="text-teal-500 hover:text-teal-600 flex items-center justify-center w-full text-xs"
                          onClick={() => {
                            setActiveEditDay(dayIndex);
                            setNewActivity({dayIndex, activity: {time: '', title: ''}});
                          }}
                        >
                          <Plus size={12} className="mr-1" />
                          <span>Add Activity</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Add new day card (when editing) */}
          {editingSection === 'days' && (
            <div className="bg-white rounded-lg shadow-sm border border-dashed border-gray-300 flex flex-col justify-center items-center p-4">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mb-3">
                <Plus size={20} className="text-teal-600" />
              </div>
              <input
                type="date"
                className="border border-gray-200 rounded-md shadow-sm p-1 text-sm mb-3 w-full focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                value={newDay.date}
                onChange={(e) => setNewDay({ date: e.target.value })}
              />
              <button 
                className="bg-teal-500 text-white py-1 px-3 rounded text-sm flex items-center"
                onClick={handleAddDay}
                disabled={!newDay.date}
              >
                <Plus size={14} className="mr-1" />
                Add Day
              </button>
            </div>
          )}
        </div>
      ) : (
        // Empty state
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
    </div>
  );
};

export default DayByDaySection;