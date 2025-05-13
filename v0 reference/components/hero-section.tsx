import Link from "next/link"
import Image from "next/image"
import { MapPin, Calendar, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function HeroSection() {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-orange-50 to-white dark:from-orange-950/20 dark:to-background" />
      <div className="container relative py-16 md:py-24 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Plan your perfect trip, <span className="text-primary">effortlessly</span>
              </h1>
              <p className="max-w-[600px] text-lg text-muted-foreground sm:text-xl">
                Create detailed travel itineraries, organize activities, and share your plans with friends and family.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link href="/create">
                  <PlusCircle className="h-5 w-5" />
                  Create New Itinerary
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/explore">Explore Templates</Link>
              </Button>
            </div>
            <div className="rounded-lg border bg-background p-4 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Where do you want to go?" />
                </div>
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="When are you traveling?" />
                </div>
                <Button className="sm:w-auto">Search</Button>
              </div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -right-16 top-1/2 -translate-y-1/2 rotate-12 rounded-2xl bg-white/80 p-4 shadow-lg backdrop-blur-sm dark:bg-black/80">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-sm font-medium">Paris</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-sm font-medium">Rome</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-sm font-medium">Barcelona</span>
                </div>
              </div>
            </div>
            <div className="absolute -left-8 bottom-16 -rotate-6 rounded-2xl bg-white/80 p-4 shadow-lg backdrop-blur-sm dark:bg-black/80">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">June 10 - June 24, 2024</span>
              </div>
            </div>
            <div className="relative h-[500px] w-full overflow-hidden rounded-2xl">
              <Image
                src="/placeholder.svg?height=500&width=500"
                alt="Travel map with pins"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
