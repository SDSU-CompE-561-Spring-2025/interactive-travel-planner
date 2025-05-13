"use client"

import { useState } from "react"
import { Plus, Search, User, UserPlus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Traveler {
  id: string
  name: string
  email?: string
  avatar?: string
  type: "self" | "friend" | "family" | "custom"
}

interface TravelersSelectorProps {
  selectedTravelers: Traveler[]
  onUpdate: (travelers: Traveler[]) => void
}

export function TravelersSelector({ selectedTravelers, onUpdate }: TravelersSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [customName, setCustomName] = useState("")
  const [searchResults, setSearchResults] = useState<Traveler[]>([])

  // Mock friends data
  const friends: Traveler[] = [
    {
      id: "friend1",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      type: "friend",
    },
    {
      id: "friend2",
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      type: "friend",
    },
    {
      id: "friend3",
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      type: "friend",
    },
  ]

  // Mock family members
  const family: Traveler[] = [
    {
      id: "family1",
      name: "Emma Doe",
      email: "emma.doe@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      type: "family",
    },
    {
      id: "family2",
      name: "James Doe",
      email: "james.doe@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      type: "family",
    },
  ]

  // Add yourself if not already in the list
  const addSelf = () => {
    const self: Traveler = {
      id: "self",
      name: "You",
      avatar: "/placeholder.svg?height=40&width=40",
      type: "self",
    }

    if (!selectedTravelers.some((t) => t.id === "self")) {
      onUpdate([...selectedTravelers, self])
    }
  }

  // Handle search
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      return
    }

    // Filter friends and family based on search term
    const results = [...friends, ...family].filter(
      (person) =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (person.email && person.email.toLowerCase().includes(searchTerm.toLowerCase())),
    )

    setSearchResults(results)
  }

  // Add a traveler
  const addTraveler = (traveler: Traveler) => {
    if (!selectedTravelers.some((t) => t.id === traveler.id)) {
      onUpdate([...selectedTravelers, traveler])
    }
    setSearchTerm("")
    setSearchResults([])
  }

  // Add a custom traveler
  const addCustomTraveler = () => {
    if (customName.trim()) {
      const newTraveler: Traveler = {
        id: `custom-${Date.now()}`,
        name: customName.trim(),
        type: "custom",
      }
      onUpdate([...selectedTravelers, newTraveler])
      setCustomName("")
    }
  }

  // Remove a traveler
  const removeTraveler = (travelerId: string) => {
    onUpdate(selectedTravelers.filter((t) => t.id !== travelerId))
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Selected Travelers</label>
        {selectedTravelers.length === 0 ? (
          <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
            No travelers added yet. Add yourself or search for friends.
          </div>
        ) : (
          <div className="space-y-2">
            {selectedTravelers.map((traveler) => (
              <div key={traveler.id} className="flex items-center justify-between rounded-md border p-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={traveler.avatar || "/placeholder.svg"} alt={traveler.name} />
                    <AvatarFallback>{traveler.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{traveler.name}</p>
                    {traveler.email && <p className="text-xs text-muted-foreground">{traveler.email}</p>}
                  </div>
                </div>
                <Badge variant="outline" className="mr-2">
                  {traveler.type === "self" ? "You" : traveler.type.charAt(0).toUpperCase() + traveler.type.slice(1)}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeTraveler(traveler.id)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Tabs defaultValue="quick">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quick">Quick Add</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>
        <TabsContent value="quick" className="mt-4">
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={addSelf}
              disabled={selectedTravelers.some((t) => t.id === "self")}
            >
              <User className="mr-2 h-4 w-4" />
              Add Yourself
            </Button>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Friends</h3>
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {friends.map((friend) => (
                        <Button
                          key={friend.id}
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => addTraveler(friend)}
                          disabled={selectedTravelers.some((t) => t.id === friend.id)}
                        >
                          <Avatar className="mr-2 h-6 w-6">
                            <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
                            <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {friend.name}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Family</h3>
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {family.map((member) => (
                        <Button
                          key={member.id}
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => addTraveler(member)}
                          disabled={selectedTravelers.some((t) => t.id === member.id)}
                        >
                          <Avatar className="mr-2 h-6 w-6">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {member.name}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="search" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for friends or family"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button type="button" onClick={handleSearch}>
                Search
              </Button>
            </div>

            {searchResults.length > 0 ? (
              <ScrollArea className="h-48 rounded-md border p-2">
                <div className="space-y-2">
                  {searchResults.map((person) => (
                    <Button
                      key={person.id}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => addTraveler(person)}
                      disabled={selectedTravelers.some((t) => t.id === person.id)}
                    >
                      <Avatar className="mr-2 h-6 w-6">
                        <AvatarImage src={person.avatar || "/placeholder.svg"} alt={person.name} />
                        <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {person.name}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            ) : searchTerm ? (
              <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                No results found. Try a different search term.
              </div>
            ) : null}

            <Button variant="outline" className="w-full" asChild>
              <div className="flex items-center justify-center">
                <UserPlus className="mr-2 h-4 w-4" />
                Invite a Friend
              </div>
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="custom" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Enter traveler name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomTraveler()}
              />
              <Button type="button" onClick={addCustomTraveler} disabled={!customName.trim()}>
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Add custom travelers who don't have an account yet. You can invite them to join later.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
