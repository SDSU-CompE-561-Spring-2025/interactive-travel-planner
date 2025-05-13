"use client"

import { Calendar, MapPin } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Destination {
  id: number
  name: string
  startDate: string
  endDate: string
}

interface DestinationCardProps {
  destination: Destination
  onUpdate: (destination: Partial<Destination>) => void
}

export function DestinationCard({ destination, onUpdate }: DestinationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          <div className="flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-teal-500" />
            <Input
              value={destination.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="h-7 px-2 py-1 text-lg font-semibold"
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`start-date-${destination.id}`}>Arrival Date</Label>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              id={`start-date-${destination.id}`}
              type="date"
              value={destination.startDate}
              onChange={(e) => onUpdate({ startDate: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`end-date-${destination.id}`}>Departure Date</Label>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              id={`end-date-${destination.id}`}
              type="date"
              value={destination.endDate}
              onChange={(e) => onUpdate({ endDate: e.target.value })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
