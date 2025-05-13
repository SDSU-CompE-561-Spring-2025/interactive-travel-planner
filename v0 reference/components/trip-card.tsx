import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AvatarGroup } from "@/components/ui/avatar-group"

interface Trip {
  id: string
  title: string
  image: string
  destinations: string[]
  startDate: string
  endDate: string
  collaborators: {
    id: string
    name: string
    avatar: string
  }[]
}

interface TripCardProps {
  trip: Trip
}

export function TripCard({ trip }: TripCardProps) {
  // Format date range for display
  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image src={trip.image || "/placeholder.svg"} alt={trip.title} fill className="object-cover" />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1">{trip.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pb-2">
        <div className="flex items-center text-sm">
          <MapPin className="mr-2 h-4 w-4 text-teal-500" />
          <span className="line-clamp-1">{trip.destinations.join(", ")}</span>
        </div>
        <div className="flex items-center text-sm">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
        </div>
        {trip.collaborators.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Collaborators:</span>
            <AvatarGroup>
              {trip.collaborators.map((collaborator) => (
                <Avatar key={collaborator.id} className="h-6 w-6 border-2 border-background">
                  <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                  <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/itinerary/${trip.id}`}>View Trip</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
