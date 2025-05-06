// src/app/itinerary/[id]/page.tsx

import type { Itinerary } from '../../../lib/api'
import { getItinerary }    from '../../../lib/api'
import BudgetOverview      from '../../../components/itinerary/BudgetOverview'
import DestinationsMap     from '../../../components/itinerary/DestinationsMap'
import TripTimeline        from '../../../components/itinerary/TripTimeline'
import DayByDayView        from '../../../components/itinerary/DayByDayView'
import TransportationList  from '../../../components/itinerary/TransportationList'

export default async function Page({
  params,
}: {
  params: { id: string }
}) {
  // fetch the real itinerary by its ID
  const it: Itinerary = await getItinerary(params.id)

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
}
