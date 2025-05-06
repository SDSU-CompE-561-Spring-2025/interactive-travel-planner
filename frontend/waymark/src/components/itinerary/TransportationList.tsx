// src/components/itinerary/TransportationList.tsx
import { Card }  from '../ui/card'
import { Badge } from '../ui/badge'


type T = {
  mode:     string
  provider: string
  from:     string
  to:       string
  date:     string
  code:     string
  details:  string
}

export default function TransportationList({ transports }: { transports: T[] }) {
  return (
    <Card className="space-y-4">
      <h2 className="text-xl font-semibold">Transportation</h2>
      <ul className="space-y-4">
        {transports.map((t, i) => (
          <li key={i} className="flex justify-between items-center p-4 border rounded">
            <div>
              <Badge>{t.mode}</Badge>
              <p className="font-medium">{t.provider}</p>
              <p className="text-sm text-gray-500">{t.from} → {t.to}</p>
              <p className="text-sm text-gray-500">{t.date}</p>
            </div>
            <div className="text-right">
              <p className="font-mono">{t.code}</p>
              <p className="text-sm text-gray-500">{t.details}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
