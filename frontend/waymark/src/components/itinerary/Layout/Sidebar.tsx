import React from 'react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar = ({ activeSection, setActiveSection }: SidebarProps) => {
  return (
    <aside className="w-56 bg-white border-r hidden md:flex flex-col">
      <div className="p-5 border-b">
        <div className="flex items-center">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-teal-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="font-medium text-gray-700">WayMark</span>
        </div>
        <p className="text-xs text-gray-500 ml-7">Travel Companion</p>
      </div>
      
      <nav className="flex-1 py-6">
        <button 
          onClick={() => setActiveSection('destinations')}
          className={`w-full text-left px-5 py-3 flex items-center ${
            activeSection === 'destinations' 
              ? 'text-teal-600 border-r-2 border-teal-500 bg-teal-50 font-medium' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className="text-base">Destinations</span>
        </button>
        
        <button 
          onClick={() => setActiveSection('timeline')}
          className={`w-full text-left px-5 py-3 flex items-center ${
            activeSection === 'timeline' 
              ? 'text-teal-600 border-r-2 border-teal-500 bg-teal-50 font-medium' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className="text-base">Timeline</span>
        </button>
        
        <button 
          onClick={() => setActiveSection('days')}
          className={`w-full text-left px-5 py-3 flex items-center ${
            activeSection === 'days' 
              ? 'text-teal-600 border-r-2 border-teal-500 bg-teal-50 font-medium' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className="text-base">Day by Day</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;