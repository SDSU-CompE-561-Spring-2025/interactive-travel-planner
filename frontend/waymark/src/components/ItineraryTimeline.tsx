"use client"

import { Clock, MapPin } from "lucide-react"

interface Location {
  id: number
  name: string
  coordinates: {
    lat: number
    lng: number
  }
  date: string
  start_date: string
  end_date: string
}

interface Transportation {
  id: number
  type: string
  from_location: string
  to_location: string
  departure_date: string
  departure_time: string
  arrival_date: string
  arrival_time: string
  provider: string
}

interface ItineraryTimelineProps {
  locations: Location[]
  transportation: Transportation[]
  onLocationClick?: (location: Location) => void
  onTransportationClick?: (transportation: Transportation) => void
}

export function ItineraryTimeline({
  locations,
  transportation,
  onLocationClick,
  onTransportationClick
}: ItineraryTimelineProps) {
  // Combine locations and transportation into a single timeline
  const createTimelineItems = () => {
    const items: Array<{
      type: "location" | "transportation"
      data: Location | Transportation
      date: string
    }> = []

    // Add locations to timeline
    locations.forEach((location) => {
      items.push({
        type: "location",
        data: location,
        date: location.start_date,
      })
    })

    // Add transportation to timeline
    transportation.forEach((transport) => {
      items.push({
        type: "transportation",
        data: transport,
        date: transport.departure_date,
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

      <div className="space-y-4">
        {timelineItems.map((item, index) => (
          <div key={index} className="relative">
            {/* Timeline dot */}
            <div className="absolute -left-6 mt-1.5 h-5 w-5 rounded-full border-2 border-background bg-primary" />

            {item.type === "location" ? (
              <LocationTimelineItem
                location={item.data as Location}
                onClick={() => onLocationClick?.(item.data as Location)}
              />
            ) : (
              <TransportationTimelineItem
                transportation={item.data as Transportation}
                onClick={() => onTransportationClick?.(item.data as Transportation)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function LocationTimelineItem({
  location,
  onClick
}: {
  location: Location
  onClick?: () => void
}) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div
      className="rounded-lg border p-4 hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <MapPin className="mt-0.5 h-5 w-5 text-primary" />
        <div>
          <h3 className="font-medium">{location.name}</h3>
          <p className="text-sm text-muted-foreground">
            {formatDate(location.start_date)} - {formatDate(location.end_date)}
          </p>
        </div>
      </div>
    </div>
  )
}

function TransportationTimelineItem({
  transportation,
  onClick
}: {
  transportation: Transportation
  onClick?: () => void
}) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div
      className="rounded-lg border p-4 bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <Clock className="mt-0.5 h-5 w-5 text-primary" />
        <div>
          <h3 className="font-medium">
            {transportation.type}: {transportation.from_location} to {transportation.to_location}
          </h3>
          <p className="text-sm text-muted-foreground">
            {formatDate(transportation.departure_date)}, {transportation.departure_time}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="rounded-full bg-teal-100 px-2 py-0.5 text-teal-800 dark:bg-teal-900 dark:text-teal-100">
              {transportation.provider}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
