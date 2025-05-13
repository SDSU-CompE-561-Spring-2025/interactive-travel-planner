"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Edit, Globe, MapPin, Settings, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProfileForm } from "@/components/profile-form"
import { TripCard } from "@/components/trip-card"
import { FriendsList } from "@/components/friends-list"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)

  // This would normally be fetched from an API
  const user = {
    id: "user123",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    bio: "Travel enthusiast and photographer. Always planning my next adventure!",
    location: "New York, USA",
    joinedDate: "2023-05-15",
    stats: {
      tripsPlanned: 12,
      countriesVisited: 18,
      friends: 24,
    },
    socialLinks: {
      instagram: "traveljohn",
      twitter: "johntravels",
      facebook: "john.doe.travels",
    },
  }

  // Sample trips data
  const trips = [
    {
      id: "trip1",
      title: "European Capitals Tour",
      image: "/placeholder.svg?height=300&width=500",
      destinations: ["Paris", "Berlin", "Rome", "Madrid"],
      startDate: "2024-06-10",
      endDate: "2024-06-24",
      collaborators: [
        { id: "user456", name: "Jane Smith", avatar: "/placeholder.svg?height=40&width=40" },
        { id: "user789", name: "Mike Johnson", avatar: "/placeholder.svg?height=40&width=40" },
      ],
    },
    {
      id: "trip2",
      title: "Southeast Asia Adventure",
      image: "/placeholder.svg?height=300&width=500",
      destinations: ["Bangkok", "Singapore", "Bali", "Ho Chi Minh"],
      startDate: "2024-09-05",
      endDate: "2024-09-26",
      collaborators: [{ id: "user456", name: "Jane Smith", avatar: "/placeholder.svg?height=40&width=40" }],
    },
    {
      id: "trip3",
      title: "Japan Cherry Blossom Tour",
      image: "/placeholder.svg?height=300&width=500",
      destinations: ["Tokyo", "Kyoto", "Osaka", "Hiroshima"],
      startDate: "2025-04-01",
      endDate: "2025-04-10",
      collaborators: [],
    },
  ]

  // Sample friends data
  const friends = [
    {
      id: "user456",
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=60&width=60",
      location: "London, UK",
      mutualTrips: 2,
      status: "accepted",
    },
    {
      id: "user789",
      name: "Mike Johnson",
      avatar: "/placeholder.svg?height=60&width=60",
      location: "Toronto, Canada",
      mutualTrips: 1,
      status: "accepted",
    },
    {
      id: "user101",
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=60&width=60",
      location: "Sydney, Australia",
      mutualTrips: 0,
      status: "accepted",
    },
  ]

  // Sample friend requests
  const friendRequests = [
    {
      id: "user202",
      name: "David Chen",
      avatar: "/placeholder.svg?height=60&width=60",
      location: "San Francisco, USA",
      mutualFriends: 2,
      status: "pending",
    },
    {
      id: "user303",
      name: "Maria Garcia",
      avatar: "/placeholder.svg?height=60&width=60",
      location: "Barcelona, Spain",
      mutualFriends: 1,
      status: "pending",
    },
  ]

  const handleProfileUpdate = (updatedProfile: any) => {
    console.log("Profile updated:", updatedProfile)
    setIsEditing(false)
    // In a real app, this would send data to the backend
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
            <h1 className="text-xl font-semibold">Profile</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="mt-4 text-2xl font-bold">{user.name}</h2>
                  <div className="mt-2 flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-3 w-3" />
                    {user.location}
                  </div>
                  <p className="mt-4 text-sm">{user.bio}</p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsEditing(!isEditing)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{user.stats.tripsPlanned}</div>
                    <div className="text-xs text-muted-foreground">Trips</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{user.stats.countriesVisited}</div>
                    <div className="text-xs text-muted-foreground">Countries</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{user.stats.friends}</div>
                    <div className="text-xs text-muted-foreground">Friends</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {user.socialLinks.instagram && (
                  <div className="flex items-center">
                    <div className="mr-2 h-5 w-5 text-pink-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                    </div>
                    <span className="text-sm">@{user.socialLinks.instagram}</span>
                  </div>
                )}
                {user.socialLinks.twitter && (
                  <div className="flex items-center">
                    <div className="mr-2 h-5 w-5 text-blue-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </svg>
                    </div>
                    <span className="text-sm">@{user.socialLinks.twitter}</span>
                  </div>
                )}
                {user.socialLinks.facebook && (
                  <div className="flex items-center">
                    <div className="mr-2 h-5 w-5 text-blue-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </div>
                    <span className="text-sm">{user.socialLinks.facebook}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {isEditing ? (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm user={user} onSubmit={handleProfileUpdate} onCancel={() => setIsEditing(false)} />
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="trips">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="trips">
                    <Calendar className="mr-2 h-4 w-4" />
                    My Trips
                  </TabsTrigger>
                  <TabsTrigger value="friends">
                    <User className="mr-2 h-4 w-4" />
                    Friends
                  </TabsTrigger>
                  <TabsTrigger value="map">
                    <Globe className="mr-2 h-4 w-4" />
                    Travel Map
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="trips" className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">My Trips</h2>
                    <Button asChild>
                      <Link href="/create">Create New Trip</Link>
                    </Button>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {trips.map((trip) => (
                      <TripCard key={trip.id} trip={trip} />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="friends" className="mt-6">
                  <FriendsList friends={friends} friendRequests={friendRequests} />
                </TabsContent>
                <TabsContent value="map" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Travel Map</CardTitle>
                      <CardDescription>Countries and cities you've visited</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px] w-full rounded-md border bg-muted/30 flex items-center justify-center">
                        <div className="text-center">
                          <Globe className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                          <h3 className="mt-4 text-lg font-medium">Your Travel Map</h3>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Track all the places you've visited around the world
                          </p>
                          <Button className="mt-4" variant="outline">
                            Add Visited Places
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
