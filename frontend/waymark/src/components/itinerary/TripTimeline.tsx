// src/components/itinerary/TripTimeline.tsx
import { Card } from '@/components/ui/card'

type Event = { type: 'stay' | 'flight' | 'train'; label: string; date: string; sub?: string }

export default function TripTimeline({ events }: { events: Event[] }) {
  return (
    <Card className="space-y-4">
      <h2 className="text-xl font-semibold">Trip Timeline</h2>
      <ol className="border-l-2 border-gray-200">
        {events.map((e, i) => (
          <li key={i} className="pl-4 mb-6 relative">
            <span className="absolute -left-1.5 top-1 w-3 h-3 bg-white border-2 border-teal-500 rounded-full" />
            <p className="font-medium">{e.label}</p>
            <p className="text-sm text-gray-500">{e.date}</p>
            {e.sub && <p className="text-sm text-teal-600">{e.sub}</p>}
          </li>
        ))}
      </ol>
    </Card>
  )
}
