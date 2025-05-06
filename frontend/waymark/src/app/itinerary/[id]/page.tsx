// src/app/itinerary/[id]/page.tsx

import type { Itinerary } from '../../../lib/api'
import { getItinerary } from '../../../lib/api'
import BudgetOverview from '../../../components/itinerary/BudgetOverview'
import DestinationsMap from '../../../components/itinerary/DestinationsMap'
import TripTimeline from '../../../components/itinerary/TripTimeline'
import DayByDayView from '../../../components/itinerary/DayByDayView'
import TransportationList from '../../../components/itinerary/TransportationList'
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react'

interface PageProps {
  params: { id: string }
}

export default async function Page({ params }: PageProps) {
  try {
    // Make sure params is fully resolved by destructuring the id
    const { id } = params;
    
    // fetch the real itinerary by its ID
    const it: Itinerary = await getItinerary(id)

    // calculate total days
    const daysCount =
      Math.floor(
        (new Date(it.end).getTime() - new Date(it.start).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1

    return (
      <div className="max-w-7xl mx-auto space-y-8 p-6">
        <header className="mb-8 border-b pb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{it.title}</h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center text-gray-600 gap-3">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-teal-600" />
              <span>{it.start} – {it.end} • {daysCount} days</span>
            </div>
            
            {it.destinations.length > 0 && (
              <div className="flex items-center sm:ml-6">
                <MapPin className="w-5 h-5 mr-2 text-teal-600" />
                <span>
                  {it.destinations.map(d => d.name).join(' • ')}
                </span>
              </div>
            )}
            
            <button className="flex items-center text-teal-600 hover:text-teal-800 transition-colors ml-auto">
              <span>Share</span>
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <BudgetOverview total={it.budget.total} spent={it.budget.spent} />
          </div>
          <div className="lg:col-span-2">
            <DestinationsMap destinations={it.destinations} />
          </div>
        </div>
        
        <TripTimeline events={it.timeline} />
        <DayByDayView days={it.days} />
        <TransportationList transports={it.transports} />
        
        <footer className="mt-16 pt-8 border-t text-center text-gray-500 text-sm">
          <p>WayMark - Your Travel Companion</p>
          <p className="mt-1">Plan, organize, and enjoy your trips with ease</p>
        </footer>
      </div>
    )
  } catch (error) {
    // Handle errors with a user-friendly message
    console.error('Error loading itinerary:', error)
    return (
      <div className="max-w-3xl mx-auto p-8 mt-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Unable to load itinerary</h1>
          <p className="text-gray-700 mb-6">
            We couldn't retrieve the itinerary details. Please try again later.
          </p>
          <div className="mt-4 p-4 bg-white rounded-md border border-gray-200">
            <p className="text-sm text-gray-500 font-mono">
              Error: {error instanceof Error ? error.message : String(error)}
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors shadow-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }
}