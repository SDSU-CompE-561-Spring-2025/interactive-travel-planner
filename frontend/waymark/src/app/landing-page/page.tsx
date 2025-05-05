"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/date-range-picker"
import { ActivityCard } from "@/components/activity-card"

export default function CreateItineraryPage() {
  const [destinations, setDestinations] = useState([
    { id: 1, name: "Paris, France", startDate: "2024-06-10", endDate: "2024-06-15" },
    { id: 2, name: "Rome, Italy", startDate: "2024-06-16", endDate: "2024-06-20" },
  ])

  const [activities, setActivities] = useState([
    {
      id: 1,
      destinationId: 1,
      name: "Eiffel Tower",
      date: "2024-06-11",
      time: "10:00",
      notes: "Book tickets in advance",
    },
    {
      id: 2,
      destinationId: 1,
      name: "Louvre Museum",
      date: "2024-06-12",
      time: "13:00",
      notes: "Plan for at least 3 hours",
    },
    { id: 3, destinationId: 2, name: "Colosseum", date: "2024-06-17", time: "09:00", notes: "Guided tour recommended" },
  ])

  const addDestination = () => {
    const newId = destinations.length > 0 ? Math.max(...destinations.map((d) => d.id)) + 1 : 1
    setDestinations([
      ...destinations,
      {
        id: newId,
        name: "New Destination",
        startDate: "",
        endDate: "",
      },
    ])
  }

  const addActivity = (destinationId: number) => {
    const newId = activities.length > 0 ? Math.max(...activities.map((a) => a.id)) + 1 : 1
    setActivities([
      ...activities,
      {
        id: newId,
        destinationId,
        name: "New Activity",
        date: "",
        time: "",
        notes: "",
      },
    ])
  }

  const removeDestination = (id: number) => {
    setDestinations(destinations.filter((d) => d.id !== id))
    setActivities(activities.filter((a) => a.destinationId !== id))
  }

  const removeActivity = (id: number) => {
    setActivities(activities.filter((a) => a.id !== id))
  }

  return (

    <div className="max-w-screen-xl mx-auto px-15 py-15 justify-center">
      <header className="flex items-center mb-8">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Create New Itinerary</h1>
      </header>


      <div className="justify-center">
        <div className="grid gap-8 md:grid-cols-[1fr_300px] text-sm md:text-base">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Itinerary Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Summer Europe Trip" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="A two-week adventure through Europe's most beautiful cities..."
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <DateRangePicker />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="travelers">Travelers</Label>
                    <Select defaultValue="2">
                      <SelectTrigger id="travelers">
                        <SelectValue placeholder="Select number of travelers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Traveler</SelectItem>
                        <SelectItem value="2">2 Travelers</SelectItem>
                        <SelectItem value="3">3 Travelers</SelectItem>
                        <SelectItem value="4">4 Travelers</SelectItem>
                        <SelectItem value="5+">5+ Travelers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Destinations</h2>
              <Button onClick={addDestination} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Destination
              </Button>
            </div>

            {destinations.map((destination) => (
              <Card key={destination.id} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 text-muted-foreground hover:text-destructive"
                  onClick={() => removeDestination(destination.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove destination</span>
                </Button>

                <CardHeader>
                  <CardTitle className="text-lg">
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-teal-500" />
                      <Input
                        value={destination.name}
                        onChange={(e) => {
                          const updated = destinations.map((d) =>
                            d.id === destination.id ? { ...d, name: e.target.value } : d,
                          )
                          setDestinations(updated)
                        }}
                        className="h-7 px-2 py-1 text-lg font-semibold"
                      />
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`start-date-${destination.id}`}>Arrival Date</Label>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id={`start-date-${destination.id}`}
                          type="date"
                          value={destination.startDate}
                          onChange={(e) => {
                            const updated = destinations.map((d) =>
                              d.id === destination.id ? { ...d, startDate: e.target.value } : d,
                            )
                            setDestinations(updated)
                          }}
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
                          onChange={(e) => {
                            const updated = destinations.map((d) =>
                              d.id === destination.id ? { ...d, endDate: e.target.value } : d,
                            )
                            setDestinations(updated)
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />
                  <Separator />
                  <Separator />
                  <Separator />
                  <Separator />
                  <Separator />


                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Activities</h3>
                      <Button variant="outline" size="sm" onClick={() => addActivity(destination.id)}>
                        <Plus className="mr-2 h-3 w-3" />
                        Add Activity
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {activities
                        .filter((activity) => activity.destinationId === destination.id)
                        .map((activity) => (
                          <ActivityCard
                            key={activity.id}
                            activity={activity}
                            onUpdate={(updatedActivity) => {
                              const updated = activities.map((a) =>
                                a.id === activity.id ? { ...a, ...updatedActivity } : a,
                              )
                              setActivities(updated)
                            }}
                            onRemove={() => removeActivity(activity.id)}
                          />
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-end">
              <Button size="lg">Save Itinerary</Button>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trip Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
                    <p className="text-lg font-medium">10 days</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Destinations</h3>
                    <p className="text-lg font-medium">{destinations.length} cities</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Activities</h3>
                    <p className="text-lg font-medium">{activities.length} planned</p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Timeline</h3>
                    <div className="space-y-2">
                      {destinations.map((destination) => (
                        <div key={destination.id} className="flex items-start gap-2">
                          <div className="mt-1 h-2 w-2 rounded-full bg-teal-500" />
                          <div>
                            <p className="font-medium">{destination.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {destination.startDate} - {destination.endDate}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Travel Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-teal-500" />
                    <span>Book accommodations in advance for better rates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-teal-500" />
                    <span>Check visa requirements for all destinations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-teal-500" />
                    <span>Consider travel insurance for your trip</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-teal-500" />
                    <span>Pack for the weather at each destination</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
