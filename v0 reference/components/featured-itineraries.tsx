import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, MapPin, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function FeaturedItineraries() {
  const itineraries = [
    {
      id: 1,
      title: "European Capitals Tour",
      image: "/placeholder.svg?height=300&width=500",
      destinations: ["Paris", "Berlin", "Rome", "Madrid"],
      duration: "14 days",
      travelers: 2,
      date: "Jun 2024",
      tags: ["Family Friendly", "Cultural"],
    },
    {
      id: 2,
      title: "Southeast Asia Adventure",
      image: "/placeholder.svg?height=300&width=500",
      destinations: ["Bangkok", "Singapore", "Bali", "Ho Chi Minh"],
      duration: "21 days",
      travelers: 1,
      date: "Sep 2024",
      tags: ["Adventure", "Budget"],
    },
    {
      id: 3,
      title: "Japan Cherry Blossom Tour",
      image: "/placeholder.svg?height=300&width=500",
      destinations: ["Tokyo", "Kyoto", "Osaka", "Hiroshima"],
      duration: "10 days",
      travelers: 2,
      date: "Apr 2024",
      tags: ["Seasonal", "Cultural"],
    },
  ]

  return (
    <section className="container py-16 md:py-24">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Featured Itineraries</h2>
          <p className="text-muted-foreground">Get inspired by these popular travel plans</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/explore">View All</Link>
        </Button>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {itineraries.map((itinerary) => (
          <Card key={itinerary.id} className="overflow-hidden">
            <div className="relative h-48">
              <Image src={itinerary.image || "/placeholder.svg"} alt={itinerary.title} fill className="object-cover" />
            </div>
            <CardHeader>
              <CardTitle>{itinerary.title}</CardTitle>
              <div className="flex flex-wrap gap-2 pt-2">
                {itinerary.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <MapPin className="mr-2 h-4 w-4 text-primary" />
                  <span>{itinerary.destinations.join(", ")}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{itinerary.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      {itinerary.travelers} {itinerary.travelers === 1 ? "traveler" : "travelers"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{itinerary.date}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/itinerary/${itinerary.id}`}>View Itinerary</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
