// src/app/itinerary/[id]/page.tsx

import type { Itinerary } from '../../../lib/api'
import { getItinerary } from '../../../lib/api'
import BudgetOverview from '../../../components/itinerary/BudgetOverview'
import DestinationsMap from '../../../components/itinerary/DestinationsMap'
import TripTimeline from '../../../components/itinerary/TripTimeline'
import DayByDayView from '../../../components/itinerary/DayByDayView'
import TransportationList from '../../../components/itinerary/TransportationList'

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
      <div className="space-y-8 p-6">
        <header>
          <h1 className="text-3xl font-bold">{it.title}</h1>
          <p className="text-gray-600">
            {it.start} – {it.end} • {daysCount} days
          </p>
        </header>

        <BudgetOverview total={it.budget.total} spent={it.budget.spent} />
        <DestinationsMap destinations={it.destinations} />
        <TripTimeline events={it.timeline} />
        <DayByDayView days={it.days} />
        <TransportationList transports={it.transports} />
      </div>
    )
  } catch (error) {
    // Handle errors with a user-friendly message
    console.error('Error loading itinerary:', error)
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-500">Unable to load itinerary</h1>
        <p className="text-gray-600 mt-2">
          We couldn't retrieve the itinerary details. Please try again later.
        </p>
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <p className="text-sm text-gray-500 font-mono">
            Error: {error instanceof Error ? error.message : String(error)}
          </p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
        >
          Try Again
        </button>
      </div>
    )
  }
}