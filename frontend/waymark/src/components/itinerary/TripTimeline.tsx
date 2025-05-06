'use client'
// src/components/itinerary/TripTimeline.tsx
import { useState, useEffect } from 'react'
import { 
  Plane, 
  Train, 
  Home, 
  AlertCircle, 
  Edit2, 
  Save, 
  Plus, 
  Trash2, 
  X,
  Check,
  ChevronDown
} from 'lucide-react'

type Event = { 
  type: 'stay' | 'flight' | 'train'; 
  label: string; 
  date: string; 
  sub?: string 
}

interface TimelineProps { 
  events: Event[];
  editable?: boolean;
  onSave?: (events: Event[]) => Promise<void>;
}

export default function TripTimeline({ events, editable = false, onSave }: TimelineProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvents, setEditingEvents] = useState<Event[]>([...events]);
  const [editingEventIndex, setEditingEventIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Reset editing events when props change
  useEffect(() => {
    if (!isEditing) {
      setEditingEvents([...events]);
    }
  }, [events, isEditing]);
  
  // Get icon based on event type
  const getEventIcon = (type: string) => {
    switch(type) {
      case 'flight':
        return <Plane className="w-5 h-5" />;
      case 'train':
        return <Train className="w-5 h-5" />;
      case 'stay':
        return <Home className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  // Get color based on event type
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
  
  // Toggle edit mode
  const toggleEditMode = () => {
    if (!editable) return;
    
    if (isEditing) {
      handleSaveChanges();
    } else {
      // Reset to original data when entering edit mode
      setEditingEvents([...events]);
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
      await onSave(editingEvents);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save timeline changes. Please try again.');
      console.error('Error saving timeline:', err);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle event edit
  const handleEventEdit = (eventIndex: number) => {
    setEditingEventIndex(eventIndex);
  }
  
  // Handle event save
  const handleEventSave = (eventIndex: number) => {
    setEditingEventIndex(null);
  }
  
  // Update event
  const updateEvent = (field: keyof Event, value: string, eventIndex: number) => {
    const newEvents = [...editingEvents];
    newEvents[eventIndex] = {
      ...newEvents[eventIndex],
      [field]: value
    };
    setEditingEvents(newEvents);
  }
  
  // Update event type
  const updateEventType = (value: 'stay' | 'flight' | 'train', eventIndex: number) => {
    const newEvents = [...editingEvents];
    newEvents[eventIndex] = {
      ...newEvents[eventIndex],
      type: value
    };
    setEditingEvents(newEvents);
  }
  
  // Add new event
  const addEvent = () => {
    const newEvents = [...editingEvents];
    
    // Find position to insert based on date order
    const newEvent = {
      type: 'stay' as 'stay', // Explicitly cast to the correct type
      label: "New Event",
      date: new Date().toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      sub: "Add details here"
    };
    
    newEvents.push(newEvent);
    setEditingEvents(newEvents);
    
    // Start editing the new event immediately
    setEditingEventIndex(newEvents.length - 1);
  }
  
  // Delete event
  const deleteEvent = (eventIndex: number) => {
    const newEvents = [...editingEvents];
    newEvents.splice(eventIndex, 1);
    setEditingEvents(newEvents);
  }
  
  // Discard changes
  const discardChanges = () => {
    setEditingEvents([...events]);
    setIsEditing(false);
    setEditingEventIndex(null);
    setError(null);
  }

  return (
    <div className="text-center">
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
              Edit Timeline
            </button>
          )
        )}
        
        <div className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
          {(isEditing ? editingEvents : events).length} events
        </div>
        
        {isEditing && (
          <button
            onClick={addEvent}
            className="flex items-center text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </button>
        )}
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}
      
      <ol className="relative border-l-2 border-gray-200 ml-3 text-left">
        {(isEditing ? editingEvents : events).map((e, i) => (
          <li 
            key={i} 
            className={`mb-6 ml-6 ${
              i === editingEventIndex ? 'ring-2 ring-blue-200 rounded-lg' : ''
            }`}
          >
            <div className="absolute flex items-center justify-center w-10 h-10 rounded-full -left-5 ring-8 ring-white">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getEventColor(e.type)}`}>
                {getEventIcon(e.type)}
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow ml-2">
              <div className="flex justify-between items-start mb-2">
                {editingEventIndex === i ? (
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={editingEvents[i].label}
                      onChange={(e) => updateEvent('label', e.target.value, i)}
                      className="text-base font-semibold border rounded px-3 py-2 w-full mb-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
                    />
                    <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 mb-3">
                      <div className="relative">
                        <select
                          value={editingEvents[i].type}
                          onChange={(e) => updateEventType(e.target.value as 'stay' | 'flight' | 'train', i)}
                          className="appearance-none border rounded px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
                        >
                          <option value="stay">Stay</option>
                          <option value="flight">Flight</option>
                          <option value="train">Train</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                      <input
                        type="text"
                        value={editingEvents[i].date}
                        onChange={(e) => updateEvent('date', e.target.value, i)}
                        className="text-sm border rounded px-3 py-2 flex-grow focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
                        placeholder="Date (e.g. May 20, 2025)"
                      />
                    </div>
                    {(editingEvents[i].sub !== undefined || isEditing) && (
                      <input
                        type="text"
                        value={editingEvents[i].sub || ''}
                        onChange={(e) => updateEvent('sub', e.target.value, i)}
                        className="text-sm border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
                        placeholder="Additional details (optional)"
                      />
                    )}
                  </div>
                ) : (
                  <h3 className="flex items-center text-base font-semibold text-gray-900">
                    {e.label}
                  </h3>
                )}
                
                {!editingEventIndex && isEditing && (
                  <div className="flex space-x-1 ml-2">
                    <button
                      onClick={() => handleEventEdit(i)}
                      className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                      aria-label="Edit event"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteEvent(i)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                      aria-label="Delete event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {editingEventIndex === i && (
                  <div className="flex space-x-1 ml-2">
                    <button
                      onClick={() => handleEventSave(i)}
                      className="text-green-500 hover:text-green-700 p-1 rounded-full hover:bg-green-50"
                      aria-label="Save event"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {!isEditing && (
                  <time className="block text-sm font-normal leading-none text-gray-500 mt-0.5">
                    {e.date}
                  </time>
                )}
              </div>
              
              {/* Show sub info when not editing this specific event */}
              {(editingEventIndex !== i || !isEditing) && e.sub && (
                <p className="text-sm font-medium text-teal-600 mt-1">
                  {e.sub}
                </p>
              )}
              
              {/* If it's the last item, add an "End of journey" note */}
              {i === (isEditing ? editingEvents : events).length - 1 && !isEditing && (
                <div className="mt-2 pt-2 border-t border-dashed border-gray-200 text-xs text-gray-500">
                  End of journey
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
      
      {(isEditing ? editingEvents : events).length === 0 && (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">No timeline events yet.</p>
          {isEditing && (
            <button
              onClick={addEvent}
              className="mt-3 flex items-center text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md transition-colors shadow-sm mx-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </button>
          )}
        </div>
      )}
    </div>
  )
}