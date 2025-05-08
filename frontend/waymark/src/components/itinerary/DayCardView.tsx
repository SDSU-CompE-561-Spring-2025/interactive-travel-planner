import React, { useState } from 'react';
import { Plus, X, MapPin } from 'lucide-react';

interface Activity {
  time: string;
  title: string;
  notes?: string;
}

interface DayCardViewProps {
  day: {
    date: string;
    activities: Activity[];
  };
  dayNumber: number;
  location: string;
  editable: boolean;
  colorIndex: number;
  onRemoveDay: () => void;
  onAddActivity: (activity: Activity) => void;
  onRemoveActivity: (index: number) => void;
}

const DayCardView: React.FC<DayCardViewProps> = ({
  day,
  dayNumber,
  location,
  editable,
  colorIndex,
  onRemoveDay,
  onAddActivity,
  onRemoveActivity
}) => {
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [newActivity, setNewActivity] = useState<Activity>({ time: '', title: '' });
  
  // Format date to "Jun 01,2025"
  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day},${year}`;
  };
  
  // Get border color based on index
  const getBorderColor = () => {
    switch (colorIndex % 4) {
      case 0: return '#DCB0F2'; // purple
      case 1: return '#F6C571'; // orange
      case 2: return '#87C55F'; // green
      case 3: return '#9EB9F3'; // blue
      default: return '#DCB0F2';
    }
  };
  
  const handleSubmitActivity = () => {
    if (newActivity.time && newActivity.title) {
      onAddActivity(newActivity);
      setNewActivity({ time: '', title: '' });
      setIsAddingActivity(false);
    }
  };
  
  return (
    <div 
      className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
      style={{ 
        borderTopWidth: '8px',
        borderTopColor: getBorderColor()
      }}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold">Day {dayNumber}</h3>
          {editable && (
            <button 
              onClick={onRemoveDay}
              className="text-gray-400 hover:text-red-500"
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        <div className="flex items-center mb-4">
          <span className="text-gray-500 mr-2">
            <MapPin size={16} />
          </span>
          <span className="text-gray-700">{location || 'Unknown'}</span>
          <span className="text-gray-500 ml-auto">{formatShortDate(day.date)}</span>
        </div>
        
        <div className="space-y-3">
          {day.activities.map((activity, index) => (
            <div key={index} className="flex items-start">
              <div className="w-16 flex-shrink-0">
                <span className="text-gray-600 text-sm">{activity.time}</span>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <span className="font-medium">{activity.title}</span>
                  {editable && (
                    <button 
                      onClick={() => onRemoveActivity(index)}
                      className="text-gray-400 hover:text-red-500 ml-2"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                {activity.notes && (
                  <p className="text-gray-500 text-sm mt-1">{activity.notes}</p>
                )}
              </div>
            </div>
          ))}
          
          {day.activities.length === 0 && (
            <div className="text-gray-400 text-center py-2">
              No activities planned
            </div>
          )}
          
          {/* Add activity form */}
          {editable && isAddingActivity && (
            <div className="bg-gray-50 p-3 rounded mt-3">
              <div className="flex space-x-2 mb-2">
                <input
                  type="time"
                  className="border border-gray-300 rounded p-1 text-sm w-20"
                  value={newActivity.time}
                  onChange={(e) => setNewActivity({...newActivity, time: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Activity name"
                  className="border border-gray-300 rounded p-1 text-sm flex-grow"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                />
              </div>
              <input
                type="text"
                placeholder="Notes (optional)"
                className="border border-gray-300 rounded p-1 text-sm w-full mb-2"
                value={newActivity.notes || ''}
                onChange={(e) => setNewActivity({...newActivity, notes: e.target.value})}
              />
              <div className="flex justify-end space-x-2">
                <button 
                  className="text-gray-500 text-sm"
                  onClick={() => setIsAddingActivity(false)}
                >
                  Cancel
                </button>
                <button 
                  className="bg-teal-500 text-white text-sm py-1 px-2 rounded"
                  onClick={handleSubmitActivity}
                  disabled={!newActivity.time || !newActivity.title}
                >
                  Add
                </button>
              </div>
            </div>
          )}
          
          {/* Add activity button */}
          {editable && !isAddingActivity && (
            <button 
              className="text-teal-500 hover:text-teal-600 flex items-center justify-center w-full mt-2"
              onClick={() => setIsAddingActivity(true)}
            >
              <Plus size={16} className="mr-1" />
              <span>Add Activity</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayCardView;