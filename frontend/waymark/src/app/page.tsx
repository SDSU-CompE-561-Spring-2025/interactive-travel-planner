"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Users, Compass, PlaneTakeoff, Briefcase } from "lucide-react"
import { useContext } from "react"
import AuthContext from "./context/AuthContext"

export default function LandingPage() {
  const { isAuthenticated } = useContext(AuthContext)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-pattern py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Plan Your Perfect Journey with Waymark
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Create, organize, and share your travel itineraries with ease. Your all-in-one travel companion for
              memorable adventures.
            </p>
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-primary text-white hover:bg-primary/90 w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-white w-full sm:w-auto"
                  >
                    Log In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need for Travel Planning</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Destination Planning</h3>
              <p className="text-muted-foreground">
                Discover and organize your destinations with detailed information and recommendations.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Itinerary Builder</h3>
              <p className="text-muted-foreground">
                Create detailed day-by-day itineraries with activities, reservations, and notes.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
              <p className="text-muted-foreground">
                Share and collaborate on trip plans with friends and family in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How Waymark Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Compass className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Plan</h3>
              <p className="text-muted-foreground">
                Create your trip and add destinations, dates, and travel companions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <PlaneTakeoff className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Organize</h3>
              <p className="text-muted-foreground">
                Build your itinerary with activities, accommodations, and transportation.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Travel</h3>
              <p className="text-muted-foreground">
                Access your plans on the go and share updates with your travel group.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {isAuthenticated 
              ? "Create your next adventure and start planning your dream trip."
              : "Join thousands of travelers who use Waymark to create unforgettable experiences."
            }
          </p>
          {isAuthenticated ? (
            <Link href="/planner/start">
              <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
                Create New Trip
              </Button>
            </Link>
          ) : (
            <Link href="/signup">
              <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
                Create Your First Trip
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
