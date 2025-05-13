"use client"

import { useState } from "react"
import { Check, Copy, Facebook, Link, Mail, Twitter } from "lucide-react"

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

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itineraryId: string
}

export function ShareDialog({ open, onOpenChange, itineraryId }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState("")

  const shareUrl = `https://travelplan.example.com/itinerary/${itineraryId}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Itinerary</DialogTitle>
          <DialogDescription>Share your travel plans with friends and family</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>
          <TabsContent value="link" className="mt-4">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Input value={shareUrl} readOnly className="h-9" />
              </div>
              <Button size="sm" className="px-3" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy</span>
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Anyone with this link will be able to view this itinerary
            </p>
          </TabsContent>
          <TabsContent value="social" className="mt-4">
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                <span className="sr-only">Share on Twitter</span>
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                <Facebook className="h-5 w-5 text-[#1877F2]" />
                <span className="sr-only">Share on Facebook</span>
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span className="sr-only">Share via Email</span>
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                <Link className="h-5 w-5 text-muted-foreground" />
                <span className="sr-only">Copy Link</span>
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="email" className="mt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email address
                </label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="message" className="text-sm font-medium">
                  Message (optional)
                </label>
                <textarea
                  id="message"
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Check out my travel plans!"
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button type="button" className="ml-auto">
            Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
