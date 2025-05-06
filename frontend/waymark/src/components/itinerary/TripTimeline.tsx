// src/components/itinerary/TripTimeline.tsx
import { Card } from '@/components/ui/card'
import { Plane, Train, Home, AlertCircle } from 'lucide-react'

type Event = { type: 'stay' | 'flight' | 'train'; label: string; date: string; sub?: string }

export default function TripTimeline({ events }: { events: Event[] }) {
  // Get icon based on event type
  const getEventIcon = (type: string) => {
    switch(type) {
      case 'flight':
        return <Plane className="w-5 h-5" />;
      case 'train':
        return <Train className="w-5 h-5" />;
      case 'stay':
        return <Home className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  // Get color based on event type
  const getEventColor = (type: string) => {
    switch(type) {
      case 'flight':
        return 'bg-blue-500 text-white';
      case 'train':
        return 'bg-green-500 text-white';
      case 'stay':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Card className="p-6 space-y-6 shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Trip Timeline</h2>
        <span className="text-sm text-gray-500">
          {events.length} events
        </span>
      </div>
      
      <ol className="relative border-l-2 border-gray-200 ml-3">
        {events.map((e, i) => (
          <li key={i} className="mb-8 ml-6">
            <div className="absolute flex items-center justify-center w-10 h-10 rounded-full -left-5 ring-8 ring-white">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getEventColor(e.type)}`}>
                {getEventIcon(e.type)}
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow ml-2">
              <div className="flex justify-between items-start mb-1">
                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                  {e.label}
                </h3>
                <time className="block mb-2 text-sm font-normal leading-none text-gray-500">
                  {e.date}
                </time>
              </div>
              {e.sub && (
                <p className="text-sm font-medium text-teal-600 mt-1">
                  {e.sub}
                </p>
              )}
              
              {/* If it's the last item, add a "End of journey" note */}
              {i === events.length - 1 && (
                <div className="mt-3 pt-3 border-t border-dashed border-gray-200 text-sm text-gray-500">
                  End of journey
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Card>
  )
}