import React from 'react';

const Header = () => {
  return (
    <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
      <div className="flex items-center">
        <div className="bg-teal-500 text-white p-2 rounded mr-3">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <span className="font-bold text-2xl">
          <span className="text-gray-800">Way</span>
          <span className="text-teal-500">Mark</span>
        </span>
      </div>
      
      <nav className="hidden md:flex items-center space-x-8">
        <a href="#" className="px-3 py-2 text-gray-600 hover:text-teal-500 font-medium transition-colors">New Trip</a>
        <a href="#" className="px-3 py-2 text-gray-600 hover:text-teal-500 font-medium transition-colors">My Itinerary</a>
        <a href="#" className="px-3 py-2 text-gray-600 hover:text-teal-500 font-medium transition-colors">About</a>
        <a href="#" className="px-3 py-2 text-gray-600 hover:text-teal-500 font-medium transition-colors">Support</a>
      </nav>
      
      <div className="flex items-center space-x-4">
        <button className="hidden md:block p-2 rounded-full text-gray-500 hover:bg-gray-100">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
        <button className="hidden md:block p-2 rounded-full text-gray-500 hover:bg-gray-100">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;