"use client"

import { Calendar, Clock, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface Activity {
  id: number
  destinationId: number
  name: string
  date: string
  time: string
  notes: string
}

interface ActivityCardProps {
  activity: Activity
  onUpdate: (activity: Partial<Activity>) => void
  onRemove: () => void
}

export function ActivityCard({ activity, onUpdate, onRemove }: ActivityCardProps) {
  return (
    <Card className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 text-muted-foreground hover:text-destructive"
        onClick={onRemove}
      >
        <Trash2 className="h-3 w-3" />
        <span className="sr-only">Remove activity</span>
      </Button>

      <CardContent className="p-4">
        <div className="grid gap-3">
          <Input
            value={activity.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="font-medium"
            placeholder="Activity name"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={activity.date}
                onChange={(e) => onUpdate({ date: e.target.value })}
                className="h-8"
              />
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                value={activity.time}
                onChange={(e) => onUpdate({ time: e.target.value })}
                className="h-8"
              />
            </div>
          </div>

          <Textarea
            value={activity.notes}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            placeholder="Notes (optional)"
            className="h-20 text-sm"
          />
        </div>
      </CardContent>
    </Card>
  )
}
