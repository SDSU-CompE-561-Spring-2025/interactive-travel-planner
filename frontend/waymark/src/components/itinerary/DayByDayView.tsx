// src/components/itinerary/DayByDayView.tsx
'use client'
import { useState } from 'react'
import { Card }     from '@/components/ui/card'

type Activity = { title: string; time: string; duration: string; notes?: string }
type Day      = { date: string; activities: Activity[] }

export default function DayByDayView({ days }: { days: Day[] }) {
  const [idx, setIdx] = useState(0)

  return (
    <Card className="space-y-4">
      <h2 className="text-xl font-semibold">Day by Day</h2>
      <nav className="flex space-x-4 overflow-x-auto">
        {days.map((d, i) => (
          <button
            key={d.date}
            onClick={() => setIdx(i)}
            className={`pb-2 ${i === idx ? 'border-b-2 border-teal-500' : 'text-gray-500'}`}
          >
            {d.date.split(',')[0]}
          </button>
        ))}
      </nav>
      <div className="space-y-4">
        {days[idx].activities.map((a, i) => (
          <div key={i} className="border rounded p-4">
            <p className="font-medium">
              {a.title}{' '}
              <span className="text-sm text-gray-500">({a.duration})</span>
            </p>
            <p className="text-sm text-gray-500">{a.time}</p>
            {a.notes && <p className="text-sm mt-1 text-gray-700">{a.notes}</p>}
          </div>
        ))}
      </div>
    </Card>
  )
}
