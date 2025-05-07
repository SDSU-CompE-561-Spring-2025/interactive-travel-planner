"use client"

import { useEffect, useRef } from "react"
import { MapPin, Plus } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function TravelMap() {
    const mapRef = useRef<HTMLDivElement>(null)

    // This is a placeholder for a real map implementation
    // In a real application, you would use a library like Mapbox, Google Maps, or Leaflet
    useEffect(() => {
        if (!mapRef.current) return

        const mapContainer = mapRef.current

        // Clear any existing content
        mapContainer.innerHTML = ""

        // Create a simple placeholder map
        const mapElement = document.createElement("div")
        mapElement.className = "w-full h-full bg-muted/30 flex items-center justify-center relative"

        // Add a note about the map being a placeholder
        const mapNote = document.createElement("div")
        mapNote.className = "absolute top-2 left-2 bg-background/80 text-xs p-2 rounded-md backdrop-blur-sm"
        mapNote.textContent = "Interactive world map would be implemented with Mapbox or Google Maps"

        // Sample visited countries
        const visitedCountries = [
        { name: "United States", position: { left: "20%", top: "40%" } },
        { name: "France", position: { left: "48%", top: "35%" } },
        { name: "Japan", position: { left: "80%", top: "40%" } },
        { name: "Australia", position: { left: "80%", top: "70%" } },
        { name: "Brazil", position: { left: "30%", top: "65%" } },
        ]

        // Create country markers
        visitedCountries.forEach((country) => {
        const marker = document.createElement("div")
        marker.className = "absolute flex flex-col items-center"
        marker.style.left = country.position.left
        marker.style.top = country.position.top

        // Create the pin icon
        const pin = document.createElement("div")
        pin.className =
            "w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-primary border-2 border-primary"
        pin.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`

        // Create the label
        const label = document.createElement("div")
        label.className = "mt-1 px-2 py-1 bg-background/80 text-xs font-medium rounded-md backdrop-blur-sm"
        label.textContent = country.name

        marker.appendChild(pin)
        marker.appendChild(label)
        mapElement.appendChild(marker)
        })

        mapElement.appendChild(mapNote)
        mapContainer.appendChild(mapElement)
    }, [])

    return (
        <div>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">My Travel Map</h2>
            <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Visited Place
            </Button>
        </div>

        <Card>
            <CardHeader>
            <CardTitle>Places I've Visited</CardTitle>
            <CardDescription>Track all the countries and cities you've explored</CardDescription>
            </CardHeader>
            <CardContent>
            <div ref={mapRef} className="h-[400px] w-full rounded-md border overflow-hidden" />

            <div className="mt-6 space-y-4">
                <h3 className="font-medium">Recently Visited</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                {["Japan", "France", "United States", "Australia", "Brazil"].map((country) => (
                    <div key={country} className="flex items-center p-2 rounded-md border">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    <span>{country}</span>
                    </div>
                ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                <div>
                    <span className="text-2xl font-bold">5</span>
                    <span className="text-sm text-muted-foreground ml-2">Countries visited</span>
                </div>
                <div>
                    <span className="text-2xl font-bold">12</span>
                    <span className="text-sm text-muted-foreground ml-2">Cities explored</span>
                </div>
                </div>
            </div>
            </CardContent>
        </Card>
        </div>
    )
}
