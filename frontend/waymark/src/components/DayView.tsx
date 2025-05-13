"use client"

import { Clock, MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface Activity {
  id: number
  destinationId: number
  name: string
  date: string
  time: string
  duration: string
  location: string
  notes?: string
  category: string
  coordinates?: {
    lat: number
    lng: number
  }
}

interface Destination {
  id: number
  name: string
  coordinates?: {
    lat: number
    lng: number
  }
}

interface DayViewProps {
  date: string
  activities: Activity[]
  destinations: Destination[]
  onActivityClick?: (activity: Activity) => void
  onDestinationClick?: (destination: Destination) => void
}

export function DayView({ 
  date, 
  activities, 
  destinations,
  onActivityClick,
  onDestinationClick 
}: DayViewProps) {
  // Sort activities by time
  const sortedActivities = [...activities].sort((a, b) => {
    return a.time.localeCompare(b.time)
  })

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  // Get destination name by ID
  const getDestinationName = (destinationId: number) => {
    const destination = destinations.find((d) => d.id === destinationId)
    return destination ? destination.name : "Unknown Location"
  }

  // Get destination by ID
  const getDestination = (destinationId: number) => {
    return destinations.find((d) => d.id === destinationId)
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    const categoryColors: Record<string, string> = {
      Sightseeing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      Museum: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
      Entertainment: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
      "Food & Drink": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
      Shopping: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      Nature: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
      Culture: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100",
      Relaxation: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100",
    }

    return categoryColors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{formatDate(date)}</h2>
      </div>

      {sortedActivities.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No activities planned for this day.</p>
        </div>
      ) : (
        <div className="relative pl-6">
          {/* Vertical timeline line */}
          <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-6">
            {sortedActivities.map((activity) => (
              <div key={activity.id} className="relative">
                {/* Timeline dot */}
                <div className="absolute -left-6 mt-1.5 h-5 w-5 rounded-full border-2 border-background bg-primary" />

                <Card 
                  className="hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onActivityClick?.(activity)}
                >
                  <div className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{activity.name}</h3>
                          <Badge className={getCategoryColor(activity.category)}>{activity.category}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>
                            {activity.time} • {activity.duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{activity.location}</span>
                        </div>
                      </div>
                      <div 
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          const destination = getDestination(activity.destinationId)
                          if (destination) {
                            onDestinationClick?.(destination)
                          }
                        }}
                      >
                        <span className="font-medium text-foreground">
                          {getDestinationName(activity.destinationId)}
                        </span>
                      </div>
                    </div>

                    {activity.notes && (
                      <>
                        <Separator className="my-3" />
                        <div className="text-sm">
                          <p className="font-medium">Notes:</p>
                          <p className="text-muted-foreground">{activity.notes}</p>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 