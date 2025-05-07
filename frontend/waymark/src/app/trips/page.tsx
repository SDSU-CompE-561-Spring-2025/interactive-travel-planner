'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Calendar, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type Trip = {
  id: number
  name: string
  destination: string
  start_date: string
  end_date: string
  image?: string
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const userRes = await fetch("http://localhost:8000/users/me", {
          method: "GET",
          credentials: "include",
        })

        if (!userRes.ok) throw new Error("Unauthorized. Please log in.")

        const user = await userRes.json()
        const userId = user.id

        const tripsRes = await fetch(`http://localhost:8000/users/${userId}/trips`, {
          method: "GET",
          credentials: "include",
        })

        if (!tripsRes.ok) throw new Error("Failed to fetch trips.")

        const tripData = await tripsRes.json()
        setTrips(tripData)
      } catch (err: any) {
        console.error("Fetch error:", err)
        setError(err.message || "Failed to load your trips.")
      } finally {
        setLoading(false)
      }
    }

    fetchTrips()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const month = date.toLocaleString("default", { month: "short" })
    const day = date.getDate()
    return `${month} ${day}`
  }

  const getDaysUntil = (dateString: string) => {
    const today = new Date()
    const tripDate = new Date(dateString)
    const diffTime = tripDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="bg-[#fff8f0] min-h-screen">
      {/* Header */}
      <div className="bg-[#377c68] py-8 px-6">
        <div className="container mx-auto">
          <h1 className="text-4xl font-normal text-white">My Trips</h1>
          <p className="text-white/90 mt-1">Your journey begins with a single step</p>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <p className="text-[#4ba46c] text-base">You have {trips.length} upcoming adventures</p>
          <Button className="bg-white hover:bg-white/90 text-black border-0 font-normal text-base">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Trip
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-[#4ba46c]">Loading your trips...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">You don't have any trips planned yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => {
              const daysUntil = getDaysUntil(trip.start_date)

              return (
                <Link key={trip.id} href={`/trips/${trip.id}`}>
                  <Card className="overflow-hidden h-full cursor-pointer hover:shadow-md transition-all duration-300 border-[#f3a034]/20 hover:border-[#f3a034]/40">
                    <div className="relative w-full h-[200px] overflow-hidden">
                      <img
                        src={trip.image || "https://via.placeholder.com/400x250?text=Trip"}
                        alt={trip.name}
                        className="w-full h-full object-cover object-center"
                      />
                      {daysUntil > 0 && daysUntil < 30 && (
                        <Badge className="absolute top-3 right-3 z-20 bg-[#f3a034] hover:bg-[#f3a034] text-white font-normal text-xs">
                          In {daysUntil} days
                        </Badge>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <h2 className="text-xl font-semibold text-[#377c68]">{trip.name}</h2>
                      <div className="flex items-center text-[#4ba46c] text-lg">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <p className="font-normal">{trip.destination}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-6 text-lg text-gray-600 font-normal">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-1 flex-shrink-0" />
                        <p>
                          {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                        </p>
                      </div>
                      <div className="mt-4">
                        <p className="text-[#377c68] underline text-lg">View details</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
