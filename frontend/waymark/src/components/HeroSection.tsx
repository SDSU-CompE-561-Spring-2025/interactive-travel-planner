import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-amber-50 to-white dark:from-amber-950 dark:to-background w-full">
      <div className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-2 items-center py-16 gap-8">
        <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
          <div className="mt-12 sm:mt-20 lg:mt-0">
            <Link href="/login" className="inline-flex space-x-6">
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-sm font-semibold leading-6 text-amber-600 ring-1 ring-inset ring-amber-500/20 dark:text-amber-400">
                What's new
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600 dark:text-gray-400">
                <span>Just shipped v1.0</span>
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </Link>
          </div>
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Plan Your Perfect Trip with Waymark
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Create personalized itineraries, discover hidden gems, and make your travel dreams a reality. Our AI-powered platform helps you plan the perfect trip, every time.
          </p>
          <div className="mt-10 flex items-center gap-x-6 justify-center lg:justify-start">
            <Link href="/login">
              <Button size="lg" className="gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="flex justify-center items-center w-full">
          <img
            src="/hero-image.jpg"
            alt="App screenshot"
            width={1200}
            height={800}
            className="w-full max-w-2xl rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
          />
        </div>
      </div>
    </div>
  );
}
