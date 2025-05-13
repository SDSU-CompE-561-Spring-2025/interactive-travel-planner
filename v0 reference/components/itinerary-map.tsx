"use client"

import { useEffect, useRef } from "react"

interface Destination {
  id: number
  name: string
  coordinates: {
    lat: number
    lng: number
  }
}

interface ItineraryMapProps {
  destinations: Destination[]
}

export function ItineraryMap({ destinations }: ItineraryMapProps) {
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
    mapNote.textContent = "Interactive map would be implemented with Mapbox, Google Maps, or Leaflet"

    // Create destination markers
    destinations.forEach((destination, index) => {
      const marker = document.createElement("div")
      marker.className = "absolute flex flex-col items-center"

      // Position markers in a way that they're visible in the placeholder
      const left = 20 + index * 30 + "%"
      const top = 30 + index * 15 + "%"
      marker.style.left = left
      marker.style.top = top

      // Create the pin icon
      const pin = document.createElement("div")
      pin.className =
        "w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-primary border-2 border-primary"
      pin.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`

      // Create the label
      const label = document.createElement("div")
      label.className = "mt-1 px-2 py-1 bg-background/80 text-xs font-medium rounded-md backdrop-blur-sm"
      label.textContent = destination.name.split(",")[0] // Just show the city name

      // Add a line connecting destinations if not the first one
      if (index > 0) {
        const line = document.createElement("div")
        line.className = "absolute bg-primary/50 h-0.5"

        // Calculate line position (simplified for placeholder)
        const prevLeft = 20 + (index - 1) * 30 + "%"
        const prevTop = 30 + (index - 1) * 15 + "%"

        // Position and rotate the line to connect the markers
        line.style.width = "100px"
        line.style.left = prevLeft
        line.style.top = prevTop
        line.style.transform = "rotate(30deg)"
        line.style.transformOrigin = "left center"

        mapElement.appendChild(line)
      }

      marker.appendChild(pin)
      marker.appendChild(label)
      mapElement.appendChild(marker)
    })

    mapElement.appendChild(mapNote)
    mapContainer.appendChild(mapElement)
  }, [destinations])

  return <div ref={mapRef} className="h-full w-full rounded-md overflow-hidden" />
}
