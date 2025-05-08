'use client';

import Link from 'next/link';
import { MapPin, Calendar, PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function HeroSection() {
    return (
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-orange-50 to-white dark:from-orange-950/20 dark:to-background py-24">
        {/* Content container */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
            {/* Left Side */}
            <div className="flex flex-col space-y-12">
                <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground left-20">
                    Plan your perfect trip,
                    <br />
                    <span className="text-primary">effortlessly</span>
                    <br />
                </h1>
                <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">
                    Create detailed travel itineraries, organize activities, and share your plans with friends and family.
                </p>
                <br />
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 text-sm text-emerald-800 hover:text-amber-500">
                <Button asChild size="lg" className="gap-2 bg-amber-500 hover:bg-emerald-800">
                    <Link href="/new-trip">
                    <PlusCircle className="h-5 w-5" />
                        Create New Itinerary
                    </Link>
                </Button>
                </div>
                <br />

                {/* Input row */}

                <div className="rounded-lg border bg-background p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9" placeholder="Where do you want to go?" />
                    </div>
                    <div className="relative flex-1">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9" placeholder="When are you traveling?" />
                    </div>
                    <Button className="w-auto ">Search</Button>
                </div>
                </div>
            </div>

            {/* Right Side - Map image and overlays */}
            <div className="relative hidden lg:block">
                {/* Label Card */}
                <div className="absolute -right-25 top-1/2 -translate-y-1/2 rotate-12 rounded-2xl bg-white/80 p-4 shadow-lg backdrop-blur-sm dark:bg-black/80">
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
                <div className="absolute -right-0 bottom-16 -rotate-6 rounded-2xl bg-white/80 p-4 shadow-lg backdrop-blur-sm dark:bg-black/80">
                <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">June 10 – June 24, 2024</span>
                </div>
                </div>

                {/* Map image */}
                <div className="relative h-[500px] w-full overflow-hidden rounded-2xl top-10 left-25">
                <img
                    src="https://i.postimg.cc/sgSKy8dp/Adobe-Express-file.png"
                    alt="World Map"
                    width={800}
                    height={700}
                    className="w-full h-full object-cover"
                />
                </div>
            </div>
            </div>
        </div>
        </section>
    );
}
