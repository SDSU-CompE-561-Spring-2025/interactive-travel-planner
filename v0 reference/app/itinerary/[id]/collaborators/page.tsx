"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Plus, Search, Settings, User, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InviteCollaboratorDialog } from "@/components/invite-collaborator-dialog"

export default function CollaboratorsPage({ params }: { params: { id: string } }) {
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // This would normally be fetched from an API based on the ID
  const itinerary = {
    id: params.id,
    title: "European Capitals Tour",
    owner: {
      id: "user123",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    collaborators: [
      {
        id: "user456",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        avatar: "/placeholder.svg?height=60&width=60",
        role: "editor",
        status: "active",
        lastActive: "2023-09-15T14:30:00Z",
      },
      {
        id: "user789",
        name: "Mike Johnson",
        email: "mike.johnson@example.com",
        avatar: "/placeholder.svg?height=60&width=60",
        role: "viewer",
        status: "active",
        lastActive: "2023-09-10T09:15:00Z",
      },
    ],
    pendingInvites: [
      {
        id: "invite123",
        email: "sarah.williams@example.com",
        role: "editor",
        sentAt: "2023-09-14T10:00:00Z",
      },
      {
        id: "invite456",
        email: "david.chen@example.com",
        role: "viewer",
        sentAt: "2023-09-13T16:45:00Z",
      },
    ],
  }

  // Filter collaborators based on search term
  const filteredCollaborators = itinerary.collaborators.filter(
    (collaborator) =>
      collaborator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collaborator.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-amber-100 text-amber-800"
      case "editor":
        return "bg-blue-100 text-blue-800"
      case "viewer":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href={`/itinerary/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Collaborators</h1>
            <p className="text-sm text-muted-foreground">{itinerary.title}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/itinerary/${params.id}/settings`}>
                <Settings className="mr-2 h-4 w-4" />
                Permissions
              </Link>
            </Button>
            <Button onClick={() => setShowInviteDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Invite
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trip Owner</CardTitle>
              <CardDescription>The owner has full control over this trip</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={itinerary.owner.avatar || "/placeholder.svg"} alt={itinerary.owner.name} />
                  <AvatarFallback>{itinerary.owner.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{itinerary.owner.name}</h3>
                    <Badge className="bg-amber-100 text-amber-800">Owner</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{itinerary.owner.email}</p>
                </div>
                {itinerary.owner.id === "user123" && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Your Profile
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search collaborators..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => setShowInviteDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Invite Collaborator
            </Button>
          </div>

          <Tabs defaultValue="collaborators">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="collaborators">Collaborators ({itinerary.collaborators.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending Invites ({itinerary.pendingInvites.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="collaborators" className="mt-6">
              {filteredCollaborators.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <User className="h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No collaborators found</h3>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                      {searchTerm
                        ? "Try a different search term"
                        : "Invite friends or colleagues to collaborate on this trip"}
                    </p>
                    <Button className="mt-4" onClick={() => setShowInviteDialog(true)}>
                      Invite Collaborator
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="rounded-md border">
                  <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 p-4 font-medium text-sm text-muted-foreground">
                    <div>User</div>
                    <div>Role</div>
                    <div>Last Active</div>
                  </div>
                  <Separator />
                  {filteredCollaborators.map((collaborator, index) => (
                    <div key={collaborator.id}>
                      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                            <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{collaborator.name}</p>
                            <p className="text-xs text-muted-foreground">{collaborator.email}</p>
                          </div>
                        </div>
                        <div>
                          <Select defaultValue={collaborator.role}>
                            <SelectTrigger className="w-[110px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">{formatDate(collaborator.lastActive)}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      </div>
                      {index < filteredCollaborators.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="pending" className="mt-6">
              {itinerary.pendingInvites.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Mail className="h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No pending invites</h3>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                      All invites have been accepted or you haven't sent any yet
                    </p>
                    <Button className="mt-4" onClick={() => setShowInviteDialog(true)}>
                      Invite Collaborator
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="rounded-md border">
                  <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 p-4 font-medium text-sm text-muted-foreground">
                    <div>Email</div>
                    <div>Role</div>
                    <div>Sent</div>
                  </div>
                  <Separator />
                  {itinerary.pendingInvites.map((invite, index) => (
                    <div key={invite.id}>
                      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{invite.email.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{invite.email}</p>
                            <Badge variant="outline" className="mt-1">
                              Pending
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <Badge className={getRoleBadgeColor(invite.role)}>
                            {invite.role.charAt(0).toUpperCase() + invite.role.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">{formatDate(invite.sentAt)}</span>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Mail className="h-4 w-4" />
                              <span className="sr-only">Resend</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <X className="h-4 w-4" />
                              <span className="sr-only">Cancel</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                      {index < itinerary.pendingInvites.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Collaboration Permissions</CardTitle>
              <CardDescription>Manage what collaborators can do with this trip</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">Editor Permissions</h3>
                    <p className="text-sm text-muted-foreground">
                      Editors can modify trip details, add activities, and manage expenses
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="edit-destinations" className="rounded" defaultChecked />
                      <label htmlFor="edit-destinations" className="text-sm">
                        Edit destinations
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="manage-activities" className="rounded" defaultChecked />
                      <label htmlFor="manage-activities" className="text-sm">
                        Manage activities
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="manage-expenses" className="rounded" defaultChecked />
                      <label htmlFor="manage-expenses" className="text-sm">
                        Manage expenses
                      </label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">Viewer Permissions</h3>
                    <p className="text-sm text-muted-foreground">
                      Viewers can see trip details but have limited editing capabilities
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="add-comments" className="rounded" defaultChecked />
                      <label htmlFor="add-comments" className="text-sm">
                        Add comments
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="suggest-activities" className="rounded" defaultChecked />
                      <label htmlFor="suggest-activities" className="text-sm">
                        Suggest activities
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="view-expenses" className="rounded" defaultChecked />
                      <label htmlFor="view-expenses" className="text-sm">
                        View expenses
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <InviteCollaboratorDialog open={showInviteDialog} onOpenChange={setShowInviteDialog} itineraryId={params.id} />
    </div>
  )
}
