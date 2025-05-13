'use client';

import Link from 'next/link';
import { MapPin, Calendar, PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function HeroSection() {
    return (
        <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#ffedd5] to-[#fff7ed] dark:from-orange-950/20 dark:to-background py-24 px-4">
            {/* Content container */}
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-0 items-center justify-center">
                {/* Left Side */}
                <div className="flex flex-col space-y-2 items-center lg:items-start">
                    <div className="space-y-4">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
                        Plan your perfect{' '}
                        <span className="lg:inline block">trip, effortlessly</span>
                    </h1>
                    <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">
                        Create detailed travel itineraries, organize activities, and share your plans with friends and family.
                    </p>
                    </div>

                    {/* Buttons */}
                    {/* Removed Create New Itinerary button */}

                    {/* Get Started button */}
                    <div className="mt-6">
                        <Button asChild size="lg" className="w-56 h-14 text-lg font-semibold bg-[#377c68] hover:bg-[#f3a034] border-none">
                            <Link href="/login">Get Started</Link>
                        </Button>
                    </div>
                </div>

                {/* Right Side - Map image and overlays */}
                <div className="flex flex-col items-center justify-center w-full relative">
                    {/* Label Card */}
                    <div className="absolute right-8 top-1/4 rotate-12 rounded-2xl bg-white/80 p-4 shadow-lg backdrop-blur-sm dark:bg-black/80 z-10">
                    <div className="space-y-2">
                        {['Paris', 'Rome', 'Barcelona'].map((city) => (
                        <div key={city} className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-primary" />
                            <span className="text-sm font-medium">{city}</span>
                        </div>
                        ))}
                    </div>
                    </div>

                    {/* Date tag */}
                    <div className="absolute right-8 bottom-16 -rotate-6 rounded-2xl bg-white/80 p-4 shadow-lg backdrop-blur-sm dark:bg-black/80 z-10">
                    <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">June 10 – June 24, 2024</span>
                    </div>
                    </div>

                    {/* Map image */}
                    <div className="relative h-[400px] w-full max-w-[600px] mx-auto rounded-2xl z-0 flex items-center justify-center">
                    <img
                        src="https://i.postimg.cc/sgSKy8dp/Adobe-Express-file.png"
                        alt="World Map"
                        width={800}
                        height={400}
                        className="w-full h-full object-contain rounded-2xl"
                    />
                    </div>
                </div>
                </div>
            </div>
        </section>
    );
}
