import React from 'react';
import { MapPin, Clock, Calendar } from 'lucide-react';

interface MobileNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const MobileNav = ({ activeSection, setActiveSection }: MobileNavProps) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-10 shadow-lg">
      <div className="flex justify-around items-center">
        <button 
          onClick={() => setActiveSection('destinations')}
          className={`flex flex-col items-center justify-center py-3 flex-1 ${
            activeSection === 'destinations' ? 'text-teal-600' : 'text-gray-500'
          }`}
        >
          <MapPin className="h-6 w-6" />
          <span className="text-xs mt-1">Destinations</span>
        </button>
        
        <button 
          onClick={() => setActiveSection('timeline')}
          className={`flex flex-col items-center justify-center py-3 flex-1 ${
            activeSection === 'timeline' ? 'text-teal-600' : 'text-gray-500'
          }`}
        >
          <Clock className="h-6 w-6" />
          <span className="text-xs mt-1">Timeline</span>
        </button>
        
        <button 
          onClick={() => setActiveSection('days')}
          className={`flex flex-col items-center justify-center py-3 flex-1 ${
            activeSection === 'days' ? 'text-teal-600' : 'text-gray-500'
          }`}
        >
          <Calendar className="h-6 w-6" />
          <span className="text-xs mt-1">Day by Day</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNav;