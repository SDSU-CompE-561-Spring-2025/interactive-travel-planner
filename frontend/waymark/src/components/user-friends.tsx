"use client"

import { useState } from "react"
import { Search, UserPlus } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddFriendDialog } from "@/components/add-friend-dialog"

export function UserFriends() {
    const [searchTerm, setSearchTerm] = useState("")
    const [showAddFriendDialog, setShowAddFriendDialog] = useState(false)

    // Sample friends data - in a real app, this would be fetched from an API
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

    // Filter friends based on search term
    const filteredFriends = friends.filter(
        (friend) =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.location.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search friends..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>
            <Button onClick={() => setShowAddFriendDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Friend
            </Button>
        </div>

        <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Friends</TabsTrigger>
            <TabsTrigger value="requests">
                Friend Requests
                {friendRequests.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                    {friendRequests.length}
                </Badge>
                )}
            </TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
            {filteredFriends.length === 0 ? (
                <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                    <UserPlus className="h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No friends found</h3>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                    {searchTerm
                        ? "Try a different search term"
                        : "Add friends to collaborate on trips and share travel experiences"}
                    </p>
                    <Button className="mt-4" onClick={() => setShowAddFriendDialog(true)}>
                    Add Friend
                    </Button>
                </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredFriends.map((friend) => (
                    <FriendCard key={friend.id} friend={friend} />
                ))}
                </div>
            )}
            </TabsContent>
            <TabsContent value="requests" className="mt-6">
            {friendRequests.length === 0 ? (
                <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                    <UserPlus className="h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No friend requests</h3>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                    You don't have any pending friend requests at the moment
                    </p>
                </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                {friendRequests.map((request) => (
                    <FriendRequestCard key={request.id} request={request} />
                ))}
                </div>
            )}
            </TabsContent>
            <TabsContent value="suggestions" className="mt-6">
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                <UserPlus className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Coming Soon</h3>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                    We're working on smart friend suggestions based on your travel preferences and network
                </p>
                </CardContent>
            </Card>
            </TabsContent>
        </Tabs>

        <AddFriendDialog open={showAddFriendDialog} onOpenChange={setShowAddFriendDialog} />
        </div>
    )
    }

    function FriendCard({ friend }: { friend: any }) {
    return (
        <Card>
        <CardContent className="p-6">
            <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
                <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
                <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <h3 className="font-medium">{friend.name}</h3>
                <p className="text-sm text-muted-foreground">{friend.location}</p>
                {friend.mutualTrips !== undefined && friend.mutualTrips > 0 && (
                <Badge variant="secondary" className="mt-2">
                    {friend.mutualTrips} mutual {friend.mutualTrips === 1 ? "trip" : "trips"}
                </Badge>
                )}
            </div>
            <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm">
                View Profile
                </Button>
                <Button variant="outline" size="sm">
                Message
                </Button>
            </div>
            </div>
        </CardContent>
        </Card>
    )
    }

    function FriendRequestCard({ request }: { request: any }) {
    return (
        <Card>
        <CardContent className="p-6">
            <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
                <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.name} />
                <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <h3 className="font-medium">{request.name}</h3>
                <p className="text-sm text-muted-foreground">{request.location}</p>
                {request.mutualFriends !== undefined && request.mutualFriends > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                    {request.mutualFriends} mutual {request.mutualFriends === 1 ? "friend" : "friends"}
                </p>
                )}
            </div>
            <div className="flex gap-2">
                <Button size="sm">Accept</Button>
                <Button variant="outline" size="sm">Decline</Button>
            </div>
            </div>
        </CardContent>
        </Card>
    )
}
