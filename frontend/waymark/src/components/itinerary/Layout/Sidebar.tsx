// File: src/components/itinerary/Layout/Sidebar.tsx
import React from 'react'
import { MapPin, Clock, CalendarDays } from 'lucide-react'

interface SidebarProps {
  activeSection: 'destinations' | 'timeline' | 'days'
  setActiveSection: (section: 'destinations' | 'timeline' | 'days') => void
}

export default function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const navItems = [
    { key: 'destinations', label: 'Destinations', icon: MapPin },
    { key: 'timeline', label: 'Timeline', icon: Clock },
    { key: 'days', label: 'Day by Day', icon: CalendarDays },
  ] as const

  return (
    <aside className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col min-h-screen">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Itinerary</h2>
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map(({ key, label, icon: Icon }) => {
            const isActive = activeSection === key
            return (
              <li
                key={key}
                onClick={() => setActiveSection(key)}
                className={`flex items-center cursor-pointer p-2 rounded-md transition-all duration-150 ease-in-out ${isActive ? 'bg-blue-100 text-blue-600 font-medium dark:bg-blue-900 dark:text-blue-300' : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700'}`}
              >
                <Icon className="mr-2" size={16} />
                <span className="text-base leading-tight">{label}</span>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}