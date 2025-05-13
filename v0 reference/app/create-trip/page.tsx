"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Calendar, Check, Globe, MapPin, Plane, Users, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DateRangePicker } from "@/components/date-range-picker"
import { TripQuizProgress } from "@/components/trip-quiz-progress"
import { DestinationSelector } from "@/components/destination-selector"
import { TravelersSelector } from "@/components/travelers-selector"
import { TripTypeSelector } from "@/components/trip-type-selector"
import { BudgetRangeSelector } from "@/components/budget-range-selector"
import { QuizCompletionCard } from "@/components/quiz-completion-card"

export default function CreateTripQuizPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [tripData, setTripData] = useState({
    title: "",
    description: "",
    dateRange: {
      from: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
      to: new Date(new Date().getTime() + 37 * 24 * 60 * 60 * 1000), // Default to 7 days trip
    },
    destinations: [],
    travelers: [],
    tripTypes: [],
    budget: {
      min: 1000,
      max: 5000,
      currency: "USD",
    },
  })

  const totalSteps = 6

  const updateTripData = (field: string, value: any) => {
    setTripData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = () => {
    // In a real app, this would send the data to the backend
    console.log("Trip data:", tripData)

    // Navigate to the new trip page (this would be the ID returned from the backend)
    router.push("/itinerary/new-trip")
  }

  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return tripData.title.trim().length > 0
      case 2:
        return tripData.dateRange.from && tripData.dateRange.to
      case 3:
        return tripData.destinations.length > 0
      case 4:
        return tripData.travelers.length > 0
      case 5:
        return tripData.tripTypes.length > 0
      case 6:
        return true // Budget always has default values
      default:
        return false
    }
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
            <h1 className="text-xl font-semibold">Create New Trip</h1>
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
          <div className="ml-auto">
            <Button variant="ghost" onClick={() => router.push("/create")}>
              Switch to Advanced Mode
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="mx-auto max-w-3xl">
          <TripQuizProgress currentStep={currentStep} totalSteps={totalSteps} />

          <div className="mt-8">
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plane className="mr-2 h-5 w-5 text-primary" />
                    Let's start planning your trip
                  </CardTitle>
                  <CardDescription>Give your trip a name and brief description to get started</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Trip Name
                    </label>
                    <Input
                      id="title"
                      placeholder="e.g., Summer European Adventure"
                      value={tripData.title}
                      onChange={(e) => updateTripData("title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Trip Description (optional)
                    </label>
                    <Textarea
                      id="description"
                      placeholder="Tell us a bit about your trip..."
                      value={tripData.description}
                      onChange={(e) => updateTripData("description", e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                    Back
                  </Button>
                  <Button onClick={handleNext} disabled={!isStepComplete()}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-primary" />
                    When are you traveling?
                  </CardTitle>
                  <CardDescription>Select the start and end dates for your trip</CardDescription>
                </CardHeader>
                <CardContent>
                  <DateRangePicker
                    initialDateRange={tripData.dateRange}
                    onUpdate={(range) => updateTripData("dateRange", range)}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button onClick={handleNext} disabled={!isStepComplete()}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}

            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-primary" />
                    Where are you going?
                  </CardTitle>
                  <CardDescription>Add the destinations you plan to visit</CardDescription>
                </CardHeader>
                <CardContent>
                  <DestinationSelector
                    selectedDestinations={tripData.destinations}
                    onUpdate={(destinations) => updateTripData("destinations", destinations)}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button onClick={handleNext} disabled={!isStepComplete()}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}

            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-primary" />
                    Who's traveling with you?
                  </CardTitle>
                  <CardDescription>Add travel companions or invite friends to collaborate</CardDescription>
                </CardHeader>
                <CardContent>
                  <TravelersSelector
                    selectedTravelers={tripData.travelers}
                    onUpdate={(travelers) => updateTripData("travelers", travelers)}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button onClick={handleNext} disabled={!isStepComplete()}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}

            {currentStep === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2 h-5 w-5 text-primary" />
                    What type of trip is this?
                  </CardTitle>
                  <CardDescription>Select the categories that best describe your trip</CardDescription>
                </CardHeader>
                <CardContent>
                  <TripTypeSelector
                    selectedTypes={tripData.tripTypes}
                    onUpdate={(types) => updateTripData("tripTypes", types)}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button onClick={handleNext} disabled={!isStepComplete()}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}

            {currentStep === 6 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wallet className="mr-2 h-5 w-5 text-primary" />
                    What's your budget?
                  </CardTitle>
                  <CardDescription>Set a budget range for your trip</CardDescription>
                </CardHeader>
                <CardContent>
                  <BudgetRangeSelector
                    budget={tripData.budget}
                    onUpdate={(budget) => updateTripData("budget", budget)}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button onClick={handleSubmit}>
                    Create Trip
                    <Check className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}

            {currentStep > totalSteps && <QuizCompletionCard tripData={tripData} onFinish={handleSubmit} />}
          </div>
        </div>
      </main>
    </div>
  )
}
