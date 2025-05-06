'use client'
// src/components/itinerary/DayByDayView.tsx
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Clock, Calendar, Info } from 'lucide-react'

type Activity = { title: string; time: string; duration: string; notes?: string }
type Day = { date: string; activities: Activity[] }

export default function DayByDayView({ days }: { days: Day[] }) {
  const [idx, setIdx] = useState(0)

  // Helper to get day of week from date string
  const getDayOfWeek = (dateStr: string) => {
    return dateStr.split(',')[0];
  }
  
  // Helper to get formatted date
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

  return (
    <Card className="shadow-md overflow-hidden">
      <div className="p-6 pb-3 border-b">
        <h2 className="text-xl font-semibold">Day by Day</h2>
      </div>
      
      <div className="px-6 py-3 border-b bg-gray-50 overflow-x-auto">
        <div className="flex space-x-1 min-w-max">
          {days.map((d, i) => {
            const isActive = i === idx;
            const dayOfWeek = getDayOfWeek(d.date);
            const date = getFormattedDate(d.date);
            
            return (
              <button
                key={d.date}
                onClick={() => setIdx(i)}
                className={`
                  flex flex-col items-center px-4 py-2 rounded-md transition-colors
                  ${isActive 
                    ? 'bg-teal-500 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'}
                `}
              >
                <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-900'}`}>
                  {dayOfWeek}
                </span>
                <span className={`text-xs ${isActive ? 'text-white' : 'text-gray-500'}`}>
                  {date}
                </span>
              </button>
            )
          })}
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">
            <span className="inline-flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {days[idx].date}
            </span>
          </h3>
          <span className="text-sm text-gray-500">
            {days[idx].activities.length} activities
          </span>
        </div>
        
        {days[idx].activities.map((a, i) => (
          <div 
            key={i} 
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center bg-gray-50 px-4 py-2 border-b">
              <Clock className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-sm font-medium">{a.time}</span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-sm text-gray-500">
                {formatDuration(a.duration)}
              </span>
            </div>
            
            <div className="p-4">
              <h4 className="text-lg font-medium">{a.title}</h4>
              
              {a.notes && (
                <div className="mt-3 flex items-start">
                  <span className="flex-shrink-0 text-teal-500 mt-0.5">
                    <Info className="w-4 h-4" />
                  </span>
                  <p className="ml-2 text-sm text-gray-700">{a.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}