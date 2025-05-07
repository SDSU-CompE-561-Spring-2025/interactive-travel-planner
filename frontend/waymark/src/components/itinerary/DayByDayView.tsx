import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface DayActivity {
  time: string;
  title: string;
  notes?: string;
}

interface Day {
  date: string;
  activities: DayActivity[];
}

interface DayByDayViewProps {
  days: Day[];
  editable: boolean;
  onSave: (days: Day[]) => Promise<void>;
}

const DayByDayView: React.FC<DayByDayViewProps> = ({ days, editable, onSave }) => {
  const [localDays, setLocalDays] = useState<Day[]>(days || []);
  const [newDay, setNewDay] = useState<{ date: string }>({ date: '' });
  const [newActivity, setNewActivity] = useState<{ dayIndex: number; activity: DayActivity }>({
    dayIndex: -1,
    activity: { time: '', title: '' }
  });
  const [addingActivity, setAddingActivity] = useState<number>(-1);
  
  const handleAddDay = () => {
    if (newDay.date) {
      // Check if date already exists
      const exists = localDays.some(day => day.date === newDay.date);
      if (exists) {
        alert('This date already exists in your itinerary');
        return;
      }
      
      const updatedDays = [...localDays, { date: newDay.date, activities: [] }];
      // Sort by date
      updatedDays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setLocalDays(updatedDays);
      setNewDay({ date: '' });
      onSave(updatedDays);
    }
  };
  
  const handleRemoveDay = (index: number) => {
    const updated = [...localDays];
    updated.splice(index, 1);
    setLocalDays(updated);
    onSave(updated);
  };
  
  const handleAddActivity = () => {
    if (newActivity.dayIndex >= 0 && newActivity.activity.time && newActivity.activity.title) {
      const updated = [...localDays];
      updated[newActivity.dayIndex].activities.push({...newActivity.activity});
      // Sort by time
      updated[newActivity.dayIndex].activities.sort((a, b) => {
        if (!a.time || !b.time) return 0;
        return a.time.localeCompare(b.time);
      });
      
      setLocalDays(updated);
      setNewActivity({ dayIndex: -1, activity: { time: '', title: '' } });
      setAddingActivity(-1);
      onSave(updated);
    }
  };
  
  const handleRemoveActivity = (dayIndex: number, activityIndex: number) => {
    const updated = [...localDays];
    updated[dayIndex].activities.splice(activityIndex, 1);
    setLocalDays(updated);
    onSave(updated);
  };
  
  return (
    <div className="space-y-8 pb-4">
      {/* Days */}
      {localDays.length > 0 ? (
        <div className="space-y-10">
          {localDays.map((day, dayIndex) => (
            <div key={dayIndex} className="border-l-4 border-teal-500 pl-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-lg text-gray-800">
                  {new Date(day.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                
                {editable && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setAddingActivity(addingActivity === dayIndex ? -1 : dayIndex);
                        setNewActivity({ dayIndex, activity: { time: '', title: '' } });
                      }}
                      className="text-teal-500 hover:text-teal-600 p-1"
                    >
                      <Plus size={20} />
                    </button>
                    <button
                      onClick={() => handleRemoveDay(dayIndex)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Activities */}
              <div className="space-y-4 pl-2">
                {day.activities.length > 0 ? (
                  day.activities.map((activity, actIndex) => (
                    <div key={actIndex} className="relative bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center">
                            <span className="inline-block w-20 text-gray-500 text-sm">{activity.time}</span>
                            <h4 className="font-medium ml-2">{activity.title}</h4>
                          </div>
                          {activity.notes && (
                            <p className="text-gray-600 text-sm mt-2 ml-24">{activity.notes}</p>
                          )}
                        </div>
                        
                        {editable && (
                          <button
                            onClick={() => handleRemoveActivity(dayIndex, actIndex)}
                            className="text-gray-400 hover:text-red-500 p-1"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-6 bg-gray-50 rounded-lg">
                    No activities planned for this day
                  </div>
                )}
                
                {/* Add Activity Form */}
                {editable && addingActivity === dayIndex && (
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mt-4">
                    <h4 className="font-medium text-gray-700 mb-3">Add Activity</h4>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                        <div className="sm:w-1/4">
                          <label className="block text-sm text-gray-600 mb-1">Time</label>
                          <input
                            type="time"
                            className="border p-2 rounded w-full"
                            value={newActivity.activity.time}
                            onChange={(e) => setNewActivity({
                              ...newActivity,
                              activity: { ...newActivity.activity, time: e.target.value }
                            })}
                          />
                        </div>
                        <div className="sm:flex-1">
                          <label className="block text-sm text-gray-600 mb-1">Activity</label>
                          <input
                            type="text"
                            placeholder="E.g., Visit Eiffel Tower"
                            className="border p-2 rounded w-full"
                            value={newActivity.activity.title}
                            onChange={(e) => setNewActivity({
                              ...newActivity,
                              activity: { ...newActivity.activity, title: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Notes (optional)</label>
                        <textarea
                          placeholder="Additional details..."
                          className="border p-2 rounded w-full h-20"
                          value={newActivity.activity.notes || ''}
                          onChange={(e) => setNewActivity({
                            ...newActivity,
                            activity: { ...newActivity.activity, notes: e.target.value }
                          })}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          onClick={handleAddActivity}
                          className="bg-teal-500 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-teal-600 transition-colors"
                          disabled={!newActivity.activity.time || !newActivity.activity.title}
                        >
                          <Plus size={18} />
                          <span>Add Activity</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-lg">
          {editable ? 'Add your first day below' : 'No days in the itinerary yet'}
        </div>
      )}
      
      {/* Add Day Form (only visible in edit mode) */}
      {editable && (
        <div className="border-t pt-6">
          <h3 className="font-medium text-gray-700 mb-4">Add Day to Itinerary</h3>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-grow max-w-xs">
              <label className="block text-sm text-gray-600 mb-1">Date</label>
              <input
                type="date"
                className="border p-2 rounded w-full"
                value={newDay.date}
                onChange={(e) => setNewDay({ date: e.target.value })}
              />
            </div>
            
            <button
              onClick={handleAddDay}
              className="bg-teal-500 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-teal-600 transition-colors"
              disabled={!newDay.date}
            >
              <Plus size={18} />
              <span>Add Day</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayByDayView;