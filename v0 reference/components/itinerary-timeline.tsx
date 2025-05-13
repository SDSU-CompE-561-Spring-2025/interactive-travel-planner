"use client"

import { Clock, MapPin } from "lucide-react"

interface Destination {
  id: number
  name: string
  startDate: string
  endDate: string
}

interface Transportation {
  id: number
  type: string
  from: string
  to: string
  departureDate: string
  departureTime: string
  arrivalDate: string
  arrivalTime: string
  provider: string
}

interface ItineraryTimelineProps {
  destinations: Destination[]
  transportation: Transportation[]
}

export function ItineraryTimeline({ destinations, transportation }: ItineraryTimelineProps) {
  // Combine destinations and transportation into a single timeline
  const createTimelineItems = () => {
    const items: Array<{
      type: "destination" | "transportation"
      data: Destination | Transportation
      date: string
    }> = []

    // Add destinations to timeline
    destinations.forEach((destination) => {
      items.push({
        type: "destination",
        data: destination,
        date: destination.startDate,
      })
    })

    // Add transportation to timeline
    transportation.forEach((transport) => {
      items.push({
        type: "transportation",
        data: transport,
        date: transport.departureDate,
      })
    })

    // Sort by date
    return items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const timelineItems = createTimelineItems()

  return (
    <div className="relative pl-6 pb-6">
      {/* Vertical line */}
      <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-border" />

      <div className="space-y-8">
        {timelineItems.map((item, index) => (
          <div key={index} className="relative">
            {/* Timeline dot */}
            <div className="absolute -left-6 mt-1.5 h-5 w-5 rounded-full border-2 border-background bg-primary" />

            {item.type === "destination" ? (
              <DestinationTimelineItem destination={item.data as Destination} />
            ) : (
              <TransportationTimelineItem transportation={item.data as Transportation} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function DestinationTimelineItem({ destination }: { destination: Destination }) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start gap-3">
        <MapPin className="mt-0.5 h-5 w-5 text-primary" />
        <div>
          <h3 className="font-medium">{destination.name}</h3>
          <p className="text-sm text-muted-foreground">
            {formatDate(destination.startDate)} - {formatDate(destination.endDate)}
          </p>
        </div>
      </div>
    </div>
  )
}

function TransportationTimelineItem({ transportation }: { transportation: Transportation }) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="rounded-lg border p-4 bg-muted/30">
      <div className="flex items-start gap-3">
        <Clock className="mt-0.5 h-5 w-5 text-primary" />
        <div>
          <h3 className="font-medium">
            {transportation.type}: {transportation.from} to {transportation.to}
          </h3>
          <p className="text-sm text-muted-foreground">
            {formatDate(transportation.departureDate)}, {transportation.departureTime}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="rounded-full bg-teal-100 px-2 py-0.5 text-teal-800">{transportation.provider}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
