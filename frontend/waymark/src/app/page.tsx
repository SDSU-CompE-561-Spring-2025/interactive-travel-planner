import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { HeroSection } from "@/components/hero-section"
import { FeaturedItineraries } from "@/components/featured-itineraries"
import { HowItWorks } from "@/components/how-it-works"
import { Testimonials } from "@/components/testimonials"
import { Separator } from "@/components/ui/separator"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-teal-600">
            <span>TravelPlan</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="#" className="text-sm font-medium hover:text-teal-600 transition-colors">
              Explore
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-teal-600 transition-colors">
              Features
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-teal-600 transition-colors">
              Pricing
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-teal-600 transition-colors">
              Help
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-teal-600 transition-colors">
              Log in
            </Link>
            <Button asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <HeroSection />
        <FeaturedItineraries />
        <HowItWorks />
        <Testimonials />
        <section className="container py-16 md:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Ready to plan your next adventure?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Create your first itinerary today and make your travel dreams a reality.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Itinerary
              </Link>
            </Button>
          </div>
        </section>

      </main>
      <footer className="border-t py-6 md:py-10">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">© 2024 TravelPlan. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
