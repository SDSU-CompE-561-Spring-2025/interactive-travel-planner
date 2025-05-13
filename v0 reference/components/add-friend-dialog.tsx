"use client"

import { useState } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AddFriendDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddFriendDialog({ open, onOpenChange }: AddFriendDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = () => {
    if (!searchTerm.trim()) return

    setIsSearching(true)

    // Simulate API call with timeout
    setTimeout(() => {
      // Mock search results
      const results = [
        {
          id: "user404",
          name: "Alex Thompson",
          avatar: "/placeholder.svg?height=60&width=60",
          location: "Berlin, Germany",
          mutualFriends: 3,
        },
        {
          id: "user505",
          name: "Emma Wilson",
          avatar: "/placeholder.svg?height=60&width=60",
          location: "Paris, France",
          mutualFriends: 1,
        },
        {
          id: "user606",
          name: "Ryan Martinez",
          avatar: "/placeholder.svg?height=60&width=60",
          location: "Chicago, USA",
          mutualFriends: 0,
        },
      ]

      setSearchResults(results)
      setIsSearching(false)
    }, 1000)
  }

  const handleSendRequest = (userId: string) => {
    console.log("Sending friend request to:", userId)
    // In a real app, this would send a request to the backend
    // and update the UI accordingly
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
          <DialogDescription>Find friends to collaborate on trips with</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="invite">Invite</TabsTrigger>
          </TabsList>
          <TabsContent value="search" className="mt-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button type="button" onClick={handleSearch} disabled={isSearching}>
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {searchResults.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    {searchTerm ? "No users found. Try a different search term." : "Search for users to add as friends"}
                  </p>
                </div>
              ) : (
                searchResults.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.location}</p>
                        {user.mutualFriends > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {user.mutualFriends} mutual {user.mutualFriends === 1 ? "friend" : "friends"}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleSendRequest(user.id)}>
                      Add Friend
                    </Button>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          <TabsContent value="invite" className="mt-4 space-y-4">
            <div className="space-y-2">
              <p className="text-sm">Invite friends via email to join you on TravelPlan</p>
              <Input placeholder="friend@example.com" />
              <Input placeholder="another.friend@example.com" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Personal Message (optional)</p>
              <textarea
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Hey! Join me on TravelPlan so we can plan our next adventure together."
              />
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" className="ml-auto">
            {Tabs ? "Send Invites" : "Add Friend"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
