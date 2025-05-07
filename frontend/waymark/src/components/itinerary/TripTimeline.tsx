import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface TimelineEvent {
  date: string;
  label: string;
  type: string;
  sub?: string;
}

interface TripTimelineProps {
  events: TimelineEvent[];
  editable: boolean;
  onSave: (events: TimelineEvent[]) => Promise<void>;
}

const TripTimeline: React.FC<TripTimelineProps> = ({ events, editable, onSave }) => {
  const [localEvents, setLocalEvents] = useState<TimelineEvent[]>(events || []);
  const [newEvent, setNewEvent] = useState<TimelineEvent>({
    date: '',
    label: '',
    type: 'flight',
    sub: '',
  });
  
  const handleAddEvent = () => {
    if (newEvent.date && newEvent.label && newEvent.type) {
      const updatedEvents = [...localEvents, { ...newEvent }];
      // Sort by date
      updatedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setLocalEvents(updatedEvents);
      setNewEvent({ date: '', label: '', type: 'flight', sub: '' });
      onSave(updatedEvents);
    }
  };
  
  const handleRemoveEvent = (index: number) => {
    const updated = [...localEvents];
    updated.splice(index, 1);
    setLocalEvents(updated);
    onSave(updated);
  };
  
  return (
    <div className="flex flex-col">
      {/* Timeline display */}
      <div className="min-h-[250px] pb-6">
        {localEvents.length > 0 ? (
          <div className="relative">
            {/* Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            {/* Events */}
            <div className="space-y-6 ml-2">
              {localEvents.map((event, i) => (
                <div key={i} className="relative pl-10 pt-1">
                  <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center
                    ${event.type === 'flight' ? 'bg-blue-100 text-blue-500' : 
                      event.type === 'train' ? 'bg-green-100 text-green-500' : 
                        'bg-amber-100 text-amber-500'}`}
                  >
                    {event.type === 'flight' ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 12.5C22 11.1193 20.8807 10 19.5 10H9C8.44771 10 8 9.55228 8 9V7C8 5.89543 7.10457 5 6 5H4.5C3.11929 5 2 6.11929 2 7.5V21.5C2 21.7761 2.22386 22 2.5 22H4C4.27614 22 4.5 21.7761 4.5 21.5V17C4.5 16.4477 4.94772 16 5.5 16H18.5C19.8807 16 21 14.8807 21 13.5" />
                        <path d="M16 10L16 6M16 2L16 6M16 6L12 6M16 6L20 6" />
                      </svg>
                    ) : event.type === 'train' ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="4" y="3" width="16" height="16" rx="2" />
                        <path d="M4 11H20" />
                        <path d="M12 3V19" />
                        <path d="M8 19L6 22" />
                        <path d="M16 19L18 22" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" />
                        <path d="M9 22V12H15V22" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{event.label}</h3>
                      {editable && (
                        <button
                          onClick={() => handleRemoveEvent(i)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{event.date}</p>
                    {event.sub && <p className="text-xs text-teal-600 mt-1">{event.sub}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">
            {editable ? 
              'Add your first timeline event below' : 
              'No timeline events yet'}
          </div>
        )}
      </div>
      
      {/* Add Event Form (only visible in edit mode) */}
      {editable && (
        <div className="border-t pt-6">
          <h3 className="font-medium text-gray-700 mb-4">Add Timeline Event</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
              <input
                type="date"
                className="border p-2 rounded w-full"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Event Type</label>
              <select
                className="border p-2 rounded w-full"
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
              >
                <option value="flight">Flight</option>
                <option value="train">Train</option>
                <option value="stay">Accommodation</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Event Label</label>
              <input
                type="text"
                placeholder="E.g., Flight to Paris"
                className="border p-2 rounded w-full"
                value={newEvent.label}
                onChange={(e) => setNewEvent({ ...newEvent, label: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Details (optional)</label>
              <input
                type="text"
                placeholder="E.g., Flight number, hotel name"
                className="border p-2 rounded w-full"
                value={newEvent.sub || ''}
                onChange={(e) => setNewEvent({ ...newEvent, sub: e.target.value })}
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAddEvent}
              className="bg-teal-500 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-teal-600 transition-colors"
              disabled={!newEvent.date || !newEvent.label || !newEvent.type}
            >
              <Plus size={18} />
              <span>Add to Timeline</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripTimeline;