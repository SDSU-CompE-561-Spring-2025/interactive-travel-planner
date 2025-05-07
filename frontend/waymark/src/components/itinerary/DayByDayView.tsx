'use client'
// src/components/itinerary/DayByDayView.tsx
import { useState, useEffect } from 'react'
import { 
  Clock, 
  Calendar, 
  Info, 
  Edit2, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

// Update the interface in DayByDayView.tsx
type Activity = { 
  title: string; 
  time: string; 
  duration: string; 
  notes?: string 
}

type Day = { 
  date: string; 
  activities: Activity[] 
}

interface DayByDayProps {
  days: Day[];
  editable?: boolean;
  onSave?: (days: Day[]) => Promise<void>; // Fixed return type
}

export default function DayByDayView({ days, editable = false, onSave }: DayByDayProps) {
  const [idx, setIdx] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDays, setEditingDays] = useState<Day[]>([...days]);
  const [editingActivityIndex, setEditingActivityIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Reset editing days when props change
  useEffect(() => {
    if (!isEditing) {
      setEditingDays([...days]);
    }
  }, [days, isEditing]);
  
  // Get day of week from date string
  const getDayOfWeek = (dateStr: string) => {
    return dateStr.split(',')[0];
  }
  
  // Get formatted date
  const getFormattedDate = (dateStr: string) => {
    const parts = dateStr.split(',');
    return parts.length > 1 ? parts[1].trim() : '';
  }
  
  // Format time for display (e.g. "1h 30m" from "1.5h")
  const formatDuration = (duration: string) => {
    if (duration.includes('h') && !duration.includes('m')) {
      const value = parseFloat(duration.replace('h', ''));
      const hours = Math.floor(value);
      const minutes = Math.round((value - hours) * 60);
      
      if (minutes === 0) return `${hours}h`;
      return `${hours}h ${minutes}m`;
    }
    return duration;
  }

  // Get highlight class for days with activities
  const getDayHighlightClass = (day: Day, isActiveDay: boolean) => {
    if (!day) return '';
    
    if (isActiveDay) {
      return 'bg-blue-500 text-white shadow-md transform scale-105';
    }
    
    // Return a highlight class if the day has activities
    if (day.activities && day.activities.length > 0) {
      return 'bg-white border-l-4 border-blue-500 text-gray-700';
    }
    
    return 'text-gray-700 hover:bg-gray-100 shadow-sm';
  }
  
  // Toggle edit mode
  const toggleEditMode = () => {
    if (!editable) return;
    
    if (isEditing) {
      handleSaveChanges();
    } else {
      // Reset to original data when entering edit mode
      setEditingDays([...days]);
      setIsEditing(true);
      setError(null);
    }
  }
  
  // Handle saving all changes
  const handleSaveChanges = async () => {
    if (!onSave) {
      setIsEditing(false);
      return;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      await onSave(editingDays);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save daily activities. Please try again.');
      console.error('Error saving daily activities:', err);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle activity edit
  const handleActivityEdit = (activityIndex: number) => {
    setEditingActivityIndex(activityIndex);
  }
  
  // Handle activity save
  const handleActivitySave = (activityIndex: number) => {
    setEditingActivityIndex(null);
  }
  
  // Update activity
  const updateActivity = (field: keyof Activity, value: string, activityIndex: number) => {
    const newDays = [...editingDays];
    newDays[idx].activities[activityIndex] = {
      ...newDays[idx].activities[activityIndex],
      [field]: value
    };
    setEditingDays(newDays);
  }
  
  // Add new activity
  const addActivity = () => {
    const newDays = [...editingDays];
    newDays[idx].activities.push({
      title: "New Activity",
      time: "12:00 PM",
      duration: "1h",
      notes: "Add details here"
    });
    setEditingDays(newDays);
    // Start editing the new activity immediately
    setEditingActivityIndex(newDays[idx].activities.length - 1);
  }
  
  // Delete activity
  const deleteActivity = (activityIndex: number) => {
    const newDays = [...editingDays];
    newDays[idx].activities.splice(activityIndex, 1);
    setEditingDays(newDays);
  }
  
  // Add new day
  const addDay = () => {
    // Find the latest date to determine next day
    let nextDay: string;
    const today = new Date();
    
    if (editingDays.length > 0) {
      const lastDayStr = editingDays[editingDays.length - 1].date;
      const parsedDate = new Date(lastDayStr);
      
      // If we can parse the date, add one day
      if (!isNaN(parsedDate.getTime())) {
        const nextDate = new Date(parsedDate);
        nextDate.setDate(nextDate.getDate() + 1);
        
        const dayName = nextDate.toLocaleDateString('en-US', { weekday: 'long' });
        const month = nextDate.toLocaleDateString('en-US', { month: 'long' });
        const day = nextDate.getDate();
        const year = nextDate.getFullYear();
        
        nextDay = `${dayName}, ${month} ${day}, ${year}`;
      } else {
        // Fallback to today's date if parsing fails
        const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
        const month = today.toLocaleDateString('en-US', { month: 'long' });
        const day = today.getDate();
        const year = today.getFullYear();
        
        nextDay = `${dayName}, ${month} ${day}, ${year}`;
      }
    } else {
      // If no days exist, use today's date
      const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
      const month = today.toLocaleDateString('en-US', { month: 'long' });
      const day = today.getDate();
      const year = today.getFullYear();
      
      nextDay = `${dayName}, ${month} ${day}, ${year}`;
    }
    
    const newDay: Day = {
      date: nextDay,
      activities: []
    };
    
    const newDays = [...editingDays, newDay];
    setEditingDays(newDays);
    
    // Switch to the new day
    setIdx(newDays.length - 1);
  }
  
  // Delete day
  const deleteDay = () => {
    if (editingDays.length <= 1) {
      setError("Cannot delete the only day. Add another day first.");
      return;
    }
    
    const newDays = [...editingDays];
    newDays.splice(idx, 1);
    setEditingDays(newDays);
    
    // Adjust index if needed
    if (idx >= newDays.length) {
      setIdx(newDays.length - 1);
    }
  }
  
  // Discard changes
  const discardChanges = () => {
    setEditingDays([...days]);
    setIsEditing(false);
    setEditingActivityIndex(null);
    setError(null);
  }
  
  // Navigate days with keyboard arrows
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && idx > 0) {
      setIdx(idx - 1);
      setEditingActivityIndex(null);
    } else if (e.key === 'ArrowRight' && idx < (isEditing ? editingDays : days).length - 1) {
      setIdx(idx + 1);
      setEditingActivityIndex(null);
    }
  }

  return (
    <div className="text-center" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="flex justify-between items-center mb-4">
        {isEditing ? (
          <div className="flex space-x-2">
            <button 
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="flex items-center text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </button>
            <button
              onClick={discardChanges}
              disabled={isSaving}
              className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        ) : (
          editable && (
            <button
              onClick={toggleEditMode}
              className="flex items-center text-sm text-blue-500 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-2 rounded-md shadow-sm transition-colors"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Activities
            </button>
          )
        )}
        <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
          {(isEditing ? editingDays : days)[idx]?.activities.length || 0} activities
        </span>
        
        {isEditing && (
          <div className="flex space-x-2">
            <button
              onClick={addDay}
              className="flex items-center text-sm bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 rounded-md shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Day
            </button>
            <button
              onClick={deleteDay}
              className="flex items-center text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md shadow-sm transition-colors"
              disabled={editingDays.length <= 1}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Day
            </button>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}
      
      <div className="relative border-b bg-gray-50 rounded-t-lg overflow-x-auto mb-4 shadow-sm">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
          <button 
            onClick={() => {
              if (idx > 0) {
                setIdx(idx - 1);
                setEditingActivityIndex(null);
              }
            }}
            disabled={idx === 0}
            className="ml-1 p-1 rounded-full bg-white shadow border border-gray-200 text-gray-600 hover:text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous day"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
        
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
          <button 
            onClick={() => {
              if (idx < (isEditing ? editingDays : days).length - 1) {
                setIdx(idx + 1);
                setEditingActivityIndex(null);
              }
            }}
            disabled={idx === (isEditing ? editingDays : days).length - 1}
            className="mr-1 p-1 rounded-full bg-white shadow border border-gray-200 text-gray-600 hover:text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next day"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex space-x-1 min-w-max justify-center p-2 px-12">
          {(isEditing ? editingDays : days).map((d, i) => {
            const isActive = i === idx;
            const dayOfWeek = getDayOfWeek(d.date);
            const date = getFormattedDate(d.date);
            const hasActivities = d.activities.length > 0;
            const highlightClass = getDayHighlightClass(d, isActive);
            
            return (
              <button
                key={d.date}
                onClick={() => {
                  setIdx(i);
                  setEditingActivityIndex(null);
                }}
                className={`
                  flex flex-col items-center px-4 py-2 rounded-md transition-colors
                  ${highlightClass}
                  ${hasActivities && !isActive ? 'border-l-4 border-blue-500' : ''}
                  ${!hasActivities && !isActive ? 'border border-gray-200' : ''}
                `}
              >
                <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-900'}`}>
                  {dayOfWeek}
                </span>
                <span className={`text-xs ${isActive ? 'text-white' : 'text-gray-500'}`}>
                  {date}
                </span>
                {/* Activity indicator dot */}
                {hasActivities && !isActive && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></span>
                )}
              </button>
            )
          })}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-medium text-left">
            <span className="inline-flex items-center text-gray-800">
              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
              {(isEditing ? editingDays : days)[idx]?.date || 'No date selected'}
            </span>
          </h3>
          
          {isEditing && (
            <button
              onClick={addActivity}
              className="flex items-center text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Activity
            </button>
          )}
        </div>
        
        {((isEditing ? editingDays : days)[idx]?.activities || []).map((a, i) => (
          <div 
            key={i} 
            className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left ${
              editingActivityIndex === i ? 'ring-2 ring-blue-200' : ''
            }`}
          >
            <div className="flex items-center justify-between bg-gray-50 px-3 py-2 border-b">
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-500 mr-2" />
                {editingActivityIndex === i ? (
                  <input
                    type="text"
                    value={editingDays[idx].activities[i].time}
                    onChange={(e) => updateActivity('time', e.target.value, i)}
                    className="text-sm font-medium border rounded px-2 py-1 w-24 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
                  />
                ) : (
                  <span className="text-sm font-medium">{a.time}</span>
                )}
                <span className="mx-2 text-gray-400">•</span>
                {editingActivityIndex === i ? (
                  <input
                    type="text"
                    value={editingDays[idx].activities[i].duration}
                    onChange={(e) => updateActivity('duration', e.target.value, i)}
                    className="text-sm text-gray-500 border rounded px-2 py-1 w-16 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
                  />
                ) : (
                  <span className="text-sm text-gray-500">
                    {formatDuration(a.duration)}
                  </span>
                )}
              </div>
              
              {isEditing && (
                <div className="flex space-x-1">
                  {editingActivityIndex === i ? (
                    <button
                      onClick={() => handleActivitySave(i)}
                      className="text-green-500 hover:text-green-700 p-1 rounded-full hover:bg-green-50"
                      aria-label="Save activity"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleActivityEdit(i)}
                        className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                        aria-label="Edit activity"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteActivity(i)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                        aria-label="Delete activity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-3">
              {editingActivityIndex === i ? (
                <input
                  type="text"
                  value={editingDays[idx].activities[i].title}
                  onChange={(e) => updateActivity('title', e.target.value, i)}
                  className="text-base font-medium border rounded px-3 py-1.5 w-full mb-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
                />
              ) : (
                <h4 className="text-base font-medium text-gray-800">{a.title}</h4>
              )}
              
              {(a.notes || editingActivityIndex === i) && (
                <div className="mt-2 flex items-start">
                  <span className="flex-shrink-0 text-teal-500 mt-0.5">
                    <Info className="w-4 h-4" />
                  </span>
                  {editingActivityIndex === i ? (
                    <textarea
                      value={editingDays[idx].activities[i].notes || ''}
                      onChange={(e) => updateActivity('notes', e.target.value, i)}
                      className="ml-2 text-sm text-gray-700 border rounded px-3 py-2 w-full min-h-[60px] focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
                      placeholder="Add notes or details about this activity"
                    />
                  ) : (
                    <p className="ml-2 text-sm text-gray-700">{a.notes}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {((isEditing ? editingDays : days)[idx]?.activities.length === 0 || !(isEditing ? editingDays : days)[idx]) && (
          <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">No activities for this day yet.</p>
            {isEditing && (
              <button
                onClick={addActivity}
                className="mt-3 flex items-center text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md transition-colors shadow-sm mx-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="flex justify-center mt-4 space-x-1">
        {(isEditing ? editingDays : days).map((day, i) => (
          <button 
            key={i}
            className={`w-2 h-2 rounded-full ${
              i === idx 
                ? 'bg-blue-500' 
                : day.activities.length > 0 
                  ? 'bg-blue-300 hover:bg-blue-400' 
                  : 'bg-gray-300 hover:bg-gray-400'
            }`}
            onClick={() => {
              setIdx(i);
              setEditingActivityIndex(null);
            }}
            aria-label={`Go to day ${i + 1}`}
          />
        ))}
      </div>
      
      <div className="text-xs text-gray-400 mt-2">
        Use arrow keys ← → to navigate between days
      </div>
    </div>
  )
}