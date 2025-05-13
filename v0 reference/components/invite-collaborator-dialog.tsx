"use client"

import { useState } from "react"
import { Mail } from "lucide-react"

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface InviteCollaboratorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itineraryId: string
}

export function InviteCollaboratorDialog({ open, onOpenChange, itineraryId }: InviteCollaboratorDialogProps) {
  const [emails, setEmails] = useState("")
  const [role, setRole] = useState("editor")
  const [message, setMessage] = useState("")
  const [copied, setCopied] = useState(false)

  const shareUrl = `https://travelplan.example.com/invite/${itineraryId}`

  const handleInvite = () => {
    console.log("Inviting:", { emails, role, message })
    // In a real app, this would send invites to the backend
    onOpenChange(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Collaborators</DialogTitle>
          <DialogDescription>Invite friends or colleagues to collaborate on this trip</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="email">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="link">Link</TabsTrigger>
          </TabsList>
          <TabsContent value="email" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emails">Email Addresses</Label>
              <Textarea
                id="emails"
                placeholder="Enter email addresses (one per line)"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">Separate multiple email addresses with a new line</p>
            </div>

            <div className="space-y-2">
              <Label>Permission Level</Label>
              <RadioGroup defaultValue="editor" value={role} onValueChange={setRole}>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="editor" id="editor" />
                  <div className="grid gap-1">
                    <Label htmlFor="editor" className="font-medium">
                      Editor
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Can edit trip details, add activities, and manage expenses
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="viewer" id="viewer" />
                  <div className="grid gap-1">
                    <Label htmlFor="viewer" className="font-medium">
                      Viewer
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Can view trip details and add comments, but cannot make changes
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Personal Message (optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a personal message to your invitation"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </TabsContent>
          <TabsContent value="link" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Share Link</Label>
              <p className="text-sm text-muted-foreground">Anyone with this link can request to join this trip</p>
              <div className="flex items-center space-x-2">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button size="sm" onClick={copyToClipboard}>
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Permission Level for Link Invites</Label>
              <RadioGroup defaultValue="viewer">
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="editor" id="link-editor" />
                  <div className="grid gap-1">
                    <Label htmlFor="link-editor" className="font-medium">
                      Editor
                    </Label>
                    <p className="text-xs text-muted-foreground">Link recipients can edit trip details</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="viewer" id="link-viewer" />
                  <div className="grid gap-1">
                    <Label htmlFor="link-viewer" className="font-medium">
                      Viewer
                    </Label>
                    <p className="text-xs text-muted-foreground">Link recipients can only view trip details</p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" className="ml-auto" onClick={handleInvite}>
            <Mail className="mr-2 h-4 w-4" />
            Send Invites
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
