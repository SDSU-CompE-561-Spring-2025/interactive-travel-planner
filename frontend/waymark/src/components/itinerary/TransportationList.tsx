// src/components/itinerary/TransportationList.tsx
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Clock, MapPin, Ticket, Info } from 'lucide-react'

type T = {
  mode: string
  provider: string
  from: string
  to: string
  date: string
  code: string
  details: string
}

export default function TransportationList({ transports }: { transports: T[] }) {
  // Helper to get icon based on transport mode
  const getTransportIcon = (mode: string) => {
    switch(mode.toLowerCase()) {
      case 'flight':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"></path>
          </svg>
        );
      case 'train':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2l2-2h4l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm5.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-7h-5V6h5v4z"></path>
          </svg>
        );
      case 'bus':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"></path>
          </svg>
        );
      case 'ferry':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.5 4.5c-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .65.73.45.75.45C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.41.21.75-.19.75-.45V6c-1.49-1.12-3.63-1.5-5.5-1.5zm3.5 14c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"></path>
          </svg>
        );
    }
  };
  
  // Helper to get badge color based on transport mode
  const getBadgeColor = (mode: string) => {
    switch(mode.toLowerCase()) {
      case 'flight':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'train':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'bus':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'ferry':
        return 'bg-sky-100 text-sky-800 hover:bg-sky-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <Card className="shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Transportation</h2>
          <span className="text-sm text-gray-500">{transports.length} bookings</span>
        </div>
      </div>
      
      <div className="divide-y">
        {transports.map((t, i) => (
          <div key={i} className="p-5 hover:bg-gray-50 transition-colors">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              {/* Left side - transport info */}
              <div className="flex items-start">
                <div className="mr-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getBadgeColor(t.mode)}`}>
                    {getTransportIcon(t.mode)}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center mb-1">
                    <Badge className={`mr-2 font-medium ${getBadgeColor(t.mode)}`}>
                      {t.mode}
                    </Badge>
                    <h3 className="text-lg font-medium">{t.provider}</h3>
                  </div>
                  
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{t.from}</span>
                    <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                    <span>{t.to}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{t.date}</span>
                  </div>
                </div>
              </div>
              
              {/* Right side - code and details */}
              <div className="bg-gray-50 p-3 rounded-lg md:text-right">
                <div className="flex items-center md:justify-end mb-1">
                  <Ticket className="w-4 h-4 mr-1 text-gray-500" />
                  <span className="font-mono text-lg font-bold">{t.code}</span>
                </div>
                
                <div className="flex items-center md:justify-end text-sm text-gray-600">
                  <Info className="w-4 h-4 mr-1" />
                  <span>{t.details}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}