"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  Download,
  Edit,
  Globe,
  Heart,
  MapPin,
  Printer,
  Share2,
  Sun,
  Umbrella,
  Users,
  Wallet,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ItineraryMap } from "@/components/itinerary-map"
import { ItineraryTimeline } from "@/components/itinerary-timeline"
import { DayView } from "@/components/day-view"
import { ShareDialog } from "@/components/share-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ItineraryPage({ params }: { params: { id: string } }) {
  const [showShareDialog, setShowShareDialog] = useState(false)

  // This would normally be fetched from an API based on the ID
  const itinerary = {
    id: params.id,
    title: "European Capitals Tour",
    description:
      "A two-week adventure through Europe's most beautiful cities, exploring historical landmarks, local cuisine, and cultural experiences.",
    startDate: "2024-06-10",
    endDate: "2024-06-24",
    travelers: 2,
    createdBy: "John Doe",
    createdAt: "2024-03-15",
    tags: ["Family Friendly", "Cultural", "City Break"],
    budget: {
      total: 5000,
      currency: "USD",
      spent: 4250,
    },
    destinations: [
      {
        id: 1,
        name: "Paris, France",
        startDate: "2024-06-10",
        endDate: "2024-06-14",
        accommodation: {
          name: "Hotel de Paris",
          address: "123 Rue de Rivoli, 75001 Paris, France",
          checkIn: "15:00",
          checkOut: "11:00",
          confirmationNumber: "HDP12345",
        },
        coordinates: { lat: 48.8566, lng: 2.3522 },
        weather: { temp: 22, condition: "Sunny", icon: "sun" },
      },
      {
        id: 2,
        name: "Rome, Italy",
        startDate: "2024-06-15",
        endDate: "2024-06-19",
        accommodation: {
          name: "Roma Luxury Suites",
          address: "Via del Corso 123, 00186 Rome, Italy",
          checkIn: "14:00",
          checkOut: "10:00",
          confirmationNumber: "RLS67890",
        },
        coordinates: { lat: 41.9028, lng: 12.4964 },
        weather: { temp: 26, condition: "Sunny", icon: "sun" },
      },
      {
        id: 3,
        name: "Barcelona, Spain",
        startDate: "2024-06-20",
        endDate: "2024-06-24",
        accommodation: {
          name: "Barcelona Beach Resort",
          address: "Passeig Marítim 78, 08003 Barcelona, Spain",
          checkIn: "15:00",
          checkOut: "12:00",
          confirmationNumber: "BBR54321",
        },
        coordinates: { lat: 41.3851, lng: 2.1734 },
        weather: { temp: 24, condition: "Partly Cloudy", icon: "cloud-sun" },
      },
    ],
    activities: [
      {
        id: 1,
        destinationId: 1,
        name: "Eiffel Tower",
        date: "2024-06-11",
        time: "10:00",
        duration: "3 hours",
        location: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris",
        notes: "Book tickets in advance to avoid long queues. Consider going during sunset for spectacular views.",
        category: "Sightseeing",
      },
      {
        id: 2,
        destinationId: 1,
        name: "Louvre Museum",
        date: "2024-06-12",
        time: "09:00",
        duration: "4 hours",
        location: "Rue de Rivoli, 75001 Paris",
        notes: "Focus on key exhibits like Mona Lisa, Venus de Milo, and Winged Victory if short on time.",
        category: "Museum",
      },
      {
        id: 3,
        destinationId: 1,
        name: "Seine River Cruise",
        date: "2024-06-13",
        time: "19:00",
        duration: "1 hour",
        location: "Port de la Conférence, Pont de l'Alma, 75008 Paris",
        notes: "Dinner cruise with live music. Dress code: Smart casual.",
        category: "Entertainment",
      },
      {
        id: 4,
        destinationId: 2,
        name: "Colosseum",
        date: "2024-06-16",
        time: "10:00",
        duration: "2 hours",
        location: "Piazza del Colosseo, 00184 Rome",
        notes: "Guided tour recommended to learn about the history. Wear comfortable shoes.",
        category: "Sightseeing",
      },
      {
        id: 5,
        destinationId: 2,
        name: "Vatican Museums & Sistine Chapel",
        date: "2024-06-17",
        time: "09:00",
        duration: "3 hours",
        location: "Viale Vaticano, 00165 Rome",
        notes: "Book skip-the-line tickets. Dress code: shoulders and knees must be covered.",
        category: "Museum",
      },
      {
        id: 6,
        destinationId: 2,
        name: "Italian Cooking Class",
        date: "2024-06-18",
        time: "17:00",
        duration: "3 hours",
        location: "Via del Governo Vecchio, 00186 Rome",
        notes: "Learn to make authentic pasta and tiramisu. All ingredients provided.",
        category: "Food & Drink",
      },
      {
        id: 7,
        destinationId: 3,
        name: "Sagrada Familia",
        date: "2024-06-21",
        time: "11:00",
        duration: "2 hours",
        location: "Carrer de Mallorca, 401, 08013 Barcelona",
        notes: "Gaudí's masterpiece. Book tickets online with tower access for panoramic views.",
        category: "Sightseeing",
      },
      {
        id: 8,
        destinationId: 3,
        name: "Park Güell",
        date: "2024-06-22",
        time: "14:00",
        duration: "2 hours",
        location: "08024 Barcelona",
        notes: "Another Gaudí marvel. The monumental zone requires tickets, but the rest of the park is free.",
        category: "Sightseeing",
      },
      {
        id: 9,
        destinationId: 3,
        name: "Flamenco Show",
        date: "2024-06-23",
        time: "20:00",
        duration: "1.5 hours",
        location: "Carrer Nou de la Rambla, 08001 Barcelona",
        notes: "Traditional Spanish dance performance with dinner option available.",
        category: "Entertainment",
      },
    ],
    transportation: [
      {
        id: 1,
        type: "Flight",
        from: "New York (JFK)",
        to: "Paris (CDG)",
        departureDate: "2024-06-10",
        departureTime: "18:30",
        arrivalDate: "2024-06-11",
        arrivalTime: "08:15",
        provider: "Air France",
        confirmationNumber: "AF123456",
        notes: "Terminal 1, Economy Class",
      },
      {
        id: 2,
        type: "Train",
        from: "Paris (Gare de Lyon)",
        to: "Rome (Roma Termini)",
        departureDate: "2024-06-14",
        departureTime: "14:45",
        arrivalDate: "2024-06-15",
        arrivalTime: "10:30",
        provider: "Trenitalia",
        confirmationNumber: "TR789012",
        notes: "First Class, Car 4, Seats 15A & 15B",
      },
      {
        id: 3,
        type: "Flight",
        from: "Rome (FCO)",
        to: "Barcelona (BCN)",
        departureDate: "2024-06-19",
        departureTime: "16:20",
        arrivalDate: "2024-06-19",
        arrivalTime: "18:15",
        provider: "Iberia",
        confirmationNumber: "IB345678",
        notes: "Terminal 3, Economy Class",
      },
      {
        id: 4,
        type: "Flight",
        from: "Barcelona (BCN)",
        to: "New York (JFK)",
        departureDate: "2024-06-24",
        departureTime: "11:45",
        arrivalDate: "2024-06-24",
        arrivalTime: "14:30",
        provider: "Delta Airlines",
        confirmationNumber: "DL901234",
        notes: "Terminal 1, Economy Class",
      },
    ],
  }

  // Group activities by date for the day-by-day view
  const dayByDayActivities = itinerary.activities.reduce(
    (acc, activity) => {
      if (!acc[activity.date]) {
        acc[activity.date] = []
      }
      acc[activity.date].push(activity)
      return acc
    },
    {} as Record<string, typeof itinerary.activities>,
  )

  // Sort dates for the day-by-day view
  const sortedDates = Object.keys(dayByDayActivities).sort()

  // Format date range for display
  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
  }

  // Calculate trip duration
  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${diffDays} days`
  }

  // Format currency
  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{itinerary.title}</h1>
            <p className="text-sm text-muted-foreground">
              {formatDateRange(itinerary.startDate, itinerary.endDate)} •{" "}
              {calculateDuration(itinerary.startDate, itinerary.endDate)}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Favorite</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowShareDialog(true)}>
              <Share2 className="h-5 w-5" />
              <span className="sr-only">Share</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Printer className="h-5 w-5" />
              <span className="sr-only">Print</span>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/itinerary/${params.id}/collaborators`}>
                <Users className="mr-2 h-4 w-4" />
                Collaborators
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/itinerary/${params.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            {/* Overview Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Trip Overview</CardTitle>
                  <div className="flex gap-2">
                    {itinerary.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <CardDescription>{itinerary.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">Duration</span>
                    <span className="text-lg font-medium">
                      {calculateDuration(itinerary.startDate, itinerary.endDate)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">Destinations</span>
                    <span className="text-lg font-medium">{itinerary.destinations.length} cities</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">Travelers</span>
                    <span className="text-lg font-medium">{itinerary.travelers} people</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">Activities</span>
                    <span className="text-lg font-medium">{itinerary.activities.length} planned</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Budget Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Budget</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/itinerary/${params.id}/budget`}>
                    <Wallet className="mr-2 h-4 w-4" />
                    Manage Budget
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="grid gap-1">
                      <span className="text-sm font-medium text-muted-foreground">Total Budget</span>
                      <span className="text-2xl font-medium">{formatCurrency(itinerary.budget.total)}</span>
                    </div>
                    <div className="grid gap-1 text-right">
                      <span className="text-sm font-medium text-muted-foreground">Spent</span>
                      <span className="text-2xl font-medium">{formatCurrency(itinerary.budget.spent)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Spent</span>
                      <span>{Math.round((itinerary.budget.spent / itinerary.budget.total) * 100)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-teal-500"
                        style={{ width: `${(itinerary.budget.spent / itinerary.budget.total) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {formatCurrency(itinerary.budget.total - itinerary.budget.spent)} remaining
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="link" size="sm" asChild>
                      <Link href={`/itinerary/${params.id}/budget`}>View detailed breakdown</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map View */}
            <Card>
              <CardHeader>
                <CardTitle>Destinations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full rounded-md border">
                  <ItineraryMap destinations={itinerary.destinations} />
                </div>
              </CardContent>
            </Card>

            {/* Timeline View */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ItineraryTimeline destinations={itinerary.destinations} transportation={itinerary.transportation} />
              </CardContent>
            </Card>

            {/* Day by Day View */}
            <Card>
              <CardHeader>
                <CardTitle>Day by Day</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue={sortedDates[0]} className="w-full">
                  <TabsList className="h-auto flex-wrap justify-start rounded-none border-b bg-transparent p-0">
                    {sortedDates.map((date) => {
                      const formattedDate = new Date(date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })
                      return (
                        <TabsTrigger
                          key={date}
                          value={date}
                          className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-teal-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                          {formattedDate}
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>
                  {sortedDates.map((date) => (
                    <TabsContent key={date} value={date} className="pt-4">
                      <DayView
                        date={date}
                        activities={dayByDayActivities[date]}
                        destinations={itinerary.destinations}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            {/* Transportation */}
            <Card>
              <CardHeader>
                <CardTitle>Transportation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {itinerary.transportation.map((transport) => (
                    <div key={transport.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-muted p-2">
                            {transport.type === "Flight" ? (
                              <Globe className="h-5 w-5 text-teal-500" />
                            ) : (
                              <Clock className="h-5 w-5 text-teal-500" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{transport.type}</h3>
                            <p className="text-sm text-muted-foreground">{transport.provider}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{transport.confirmationNumber}</p>
                          <p className="text-sm text-muted-foreground">{transport.notes}</p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                        <div>
                          <p className="font-medium">{transport.from}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transport.departureDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                            , {transport.departureTime}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-teal-500" />
                          <div className="h-px w-16 bg-border" />
                          <div className="h-2 w-2 rounded-full bg-teal-500" />
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{transport.to}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transport.arrivalDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                            , {transport.arrivalTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Trip Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Dates</p>
                    <p>{formatDateRange(itinerary.startDate, itinerary.endDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Travelers</p>
                    <p>{itinerary.travelers} people</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Budget</p>
                    <p>
                      {formatCurrency(itinerary.budget.spent)} of {formatCurrency(itinerary.budget.total)}
                    </p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Destinations</p>
                  <div className="space-y-2">
                    {itinerary.destinations.map((destination) => (
                      <div key={destination.id} className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-teal-500" />
                        <div>
                          <p className="font-medium">{destination.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(destination.startDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}{" "}
                            -{" "}
                            {new Date(destination.endDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Weather Forecast</p>
                  <div className="space-y-2">
                    {itinerary.destinations.map((destination) => (
                      <div key={destination.id} className="flex items-center justify-between rounded-md border p-2">
                        <p className="text-sm">{destination.name}</p>
                        <div className="flex items-center gap-1">
                          {destination.weather.icon === "sun" ? (
                            <Sun className="h-4 w-4 text-amber-500" />
                          ) : (
                            <Umbrella className="h-4 w-4 text-blue-500" />
                          )}
                          <span className="text-sm font-medium">{destination.weather.temp}°C</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Collaborators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <Avatar className="h-8 w-8 border-2 border-background">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Jane Smith" />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8 border-2 border-background">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Mike Johnson" />
                      <AvatarFallback>MJ</AvatarFallback>
                    </Avatar>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/itinerary/${params.id}/collaborators`}>Manage</Link>
                  </Button>
                </div>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/itinerary/${params.id}/collaborators`}>
                    <Users className="mr-2 h-4 w-4" />
                    Invite Collaborators
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Accommodation */}
            <Card>
              <CardHeader>
                <CardTitle>Accommodations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {itinerary.destinations.map((destination) => (
                  <div key={destination.id} className="space-y-2">
                    <h3 className="font-medium">{destination.name}</h3>
                    <div className="rounded-md border p-3">
                      <p className="font-medium">{destination.accommodation.name}</p>
                      <p className="text-sm text-muted-foreground">{destination.accommodation.address}</p>
                      <Separator className="my-2" />
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Check-in</p>
                          <p>{destination.accommodation.checkIn}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Check-out</p>
                          <p>{destination.accommodation.checkOut}</p>
                        </div>
                      </div>
                      <p className="mt-2 text-xs">
                        Confirmation:{" "}
                        <span className="font-medium">{destination.accommodation.confirmationNumber}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle>Export & Share</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => setShowShareDialog(true)}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Itinerary
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Add to Calendar
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/itinerary/${params.id}/budget`}>
                    <Wallet className="mr-2 h-4 w-4" />
                    View Budget Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <ShareDialog open={showShareDialog} onOpenChange={setShowShareDialog} itineraryId={params.id} />
    </div>
  )
}
