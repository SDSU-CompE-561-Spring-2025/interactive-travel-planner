"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Calendar, MapPin, Clock } from "lucide-react"
import { formatDate } from "@/lib/utils"

// Mock data for trips
const mockTrips = [
  {
    id: 1,
    name: "Japan Adventure",
    description: "Exploring Tokyo, Kyoto, and Osaka",
    start_date: "2025-06-01T00:00:00.000Z",
    end_date: "2025-06-15T00:00:00.000Z",
  },
  {
    id: 2,
    name: "European Tour",
    description: "Visiting Paris, Rome, and Barcelona",
    start_date: "2025-07-10T00:00:00.000Z",
    end_date: "2025-07-24T00:00:00.000Z",
  },
  {
    id: 3,
    name: "Beach Getaway",
    description: "Relaxing in Bali",
    start_date: "2025-08-05T00:00:00.000Z",
    end_date: "2025-08-12T00:00:00.000Z",
  },
]

type Trip = {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
}

export default function DashboardPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch from your API
    const fetchTrips = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setTrips(mockTrips)
      } catch (error) {
        console.error("Failed to fetch trips:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrips()
  }, [])

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Trips</h1>
          <p className="text-muted-foreground">Manage and organize your travel plans</p>
        </div>
        <Link href="/new-trip">
          <Button className="mt-4 md:mt-0 bg-primary text-white hover:bg-primary/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Trip
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="bg-muted h-24"></CardHeader>
              <CardContent className="pt-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-muted rounded w-full mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="h-8 bg-muted rounded w-24"></div>
                <div className="h-8 bg-muted rounded w-24"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Card key={trip.id} className="overflow-hidden border border-border hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-primary/20 to-secondary/20 pb-4">
                <CardTitle className="text-xl">{trip.name}</CardTitle>
                <CardDescription className="text-foreground/70">{trip.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Calendar className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Dates</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Clock className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">
                        {calculateDuration(trip.start_date, trip.end_date)} days
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-primary border-primary hover:bg-primary hover:text-white"
                >
                  Edit
                </Button>
                <Link href={`/trips/${trip.id}`}>
                  <Button size="sm" className="bg-secondary text-white hover:bg-secondary/90">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/30 rounded-lg border border-dashed border-muted">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No trips found</h3>
          <p className="text-muted-foreground mb-6">
            You haven&apos;t created any trips yet. Start planning your next adventure!
          </p>
          <Link href="/new-trip">
            <Button className="bg-primary text-white hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Your First Trip
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
