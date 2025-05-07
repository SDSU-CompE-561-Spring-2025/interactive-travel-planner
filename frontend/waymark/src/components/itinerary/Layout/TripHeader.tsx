import React from 'react';
import { PenTool, Save, Calendar } from 'lucide-react';
import { Itinerary } from '../../../lib/api'; // Adjusted the path to match the correct location

interface TripHeaderProps {
  itinerary: Partial<Itinerary>;
  setItinerary: React.Dispatch<React.SetStateAction<Partial<Itinerary>>>;
  isEditingHeader: boolean;
  setIsEditingHeader: (isEditing: boolean) => void;
  handleSaveHeader: () => void;
}

const TripHeader = ({
  itinerary,
  setItinerary,
  isEditingHeader,
  setIsEditingHeader,
  handleSaveHeader,
}: TripHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white w-full">
      <div className="relative px-6 py-8 max-w-6xl mx-auto">
        {isEditingHeader ? (
          <div>
            <input
              type="text"
              value={itinerary.title || ''}
              onChange={e => setItinerary({ ...itinerary, title: e.target.value })}
              className="w-full text-3xl font-bold bg-transparent border-b border-white/50 focus:outline-none focus:border-white mb-4 placeholder-white/70"
              placeholder="Trip Title"
            />
            <div className="flex items-center space-x-4 text-white/90">
              <Calendar className="w-5 h-5 flex-shrink-0" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0 w-full">
                <input
                  type="date"
                  value={itinerary.start || ''}
                  onChange={e => setItinerary({ ...itinerary, start: e.target.value })}
                  className="bg-transparent border-b border-white/50 focus:outline-none focus:border-white px-2 py-1 w-full sm:w-48"
                />
                <span className="hidden sm:inline text-white/80">—</span>
                <input
                  type="date"
                  value={itinerary.end || ''}
                  onChange={e => setItinerary({ ...itinerary, end: e.target.value })}
                  className="bg-transparent border-b border-white/50 focus:outline-none focus:border-white px-2 py-1 w-full sm:w-48"
                />
              </div>
            </div>
            <div className="absolute top-8 right-6 flex space-x-3">
              <button
                onClick={() => setIsEditingHeader(false)}
                className="px-4 py-2 text-sm border border-white/50 rounded hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveHeader}
                className="px-4 py-2 text-sm bg-white text-teal-600 rounded hover:bg-white/90 transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-2" /> Save
              </button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <h1 className="text-3xl font-bold mb-2">{itinerary.title || 'New Trip'}</h1>
            <div className="flex items-center space-x-2 text-white/90">
              <Calendar className="w-5 h-5" />
              <span>
                {itinerary.start && itinerary.end 
                  ? `${itinerary.start} - ${itinerary.end}` 
                  : 'Set trip dates'}
              </span>
            </div>
            <button 
              onClick={() => setIsEditingHeader(true)}
              className="absolute top-0 right-0 p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Edit header"
            >
              <PenTool className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripHeader;