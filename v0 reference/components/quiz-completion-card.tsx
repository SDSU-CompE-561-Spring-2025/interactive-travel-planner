"use client"

import { Check, MapPin, Calendar, Users, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface QuizCompletionCardProps {
  tripData: any
  onFinish: () => void
}

export function QuizCompletionCard({ tripData, onFinish }: QuizCompletionCardProps) {
  // Format date range for display
  const formatDateRange = (range: { from: Date; to: Date }) => {
    return `${range.from.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${range.to.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`
  }

  // Format budget for display
  const formatBudget = (budget: { min: number; max: number; currency: string }) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: budget.currency,
      maximumFractionDigits: 0,
    })
    return `${formatter.format(budget.min)} - ${formatter.format(budget.max)}`
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
          <Check className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Trip Created Successfully!</CardTitle>
        <CardDescription>Your trip has been created and is ready for you to start planning</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{tripData.title}</h3>
            {tripData.description && <p className="text-sm text-muted-foreground">{tripData.description}</p>}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <Calendar className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Dates</p>
                <p className="text-sm text-muted-foreground">{formatDateRange(tripData.dateRange)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Destinations</p>
                <p className="text-sm text-muted-foreground">
                  {tripData.destinations.map((d: any) => d.name).join(", ")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Users className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Travelers</p>
                <p className="text-sm text-muted-foreground">
                  {tripData.travelers.length} {tripData.travelers.length === 1 ? "person" : "people"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Wallet className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Budget</p>
                <p className="text-sm text-muted-foreground">{formatBudget(tripData.budget)}</p>
              </div>
            </div>
          </div>

          {tripData.tripTypes.length > 0 && (
            <div>
              <p className="text-sm font-medium">Trip Type</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {tripData.tripTypes.map((type: any) => (
                  <Badge key={type.id} variant="secondary" className="flex items-center gap-1">
                    {type.icon}
                    <span>{type.name}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button className="w-full" onClick={onFinish}>
          Start Planning Your Trip
        </Button>
        <Button variant="outline" className="w-full">
          Share Trip with Collaborators
        </Button>
      </CardFooter>
    </Card>
  )
}
