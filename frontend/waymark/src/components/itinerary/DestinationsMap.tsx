// src/components/itinerary/DestinationsMap.tsx
import { Card } from '@/components/ui/card'

interface Dest { name: string; dates: string; coords: [number, number] }

export default function DestinationsMap({ destinations }: { destinations: Dest[] }) {
  return (
    <Card className="space-y-4">
      <h2 className="text-xl font-semibold">Destinations</h2>
      <ul className="space-y-2">
        {destinations.map((d) => (
          <li key={d.name} className="flex items-center">
            <span className="w-2 h-2 bg-teal-500 rounded-full mr-2" />
            <div>
              <p className="font-medium">{d.name}</p>
              <p className="text-sm text-gray-500">{d.dates}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400">
        Interactive map placeholder
      </div>
    </Card>
  )
}
