"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Set default icon
if (typeof window !== 'undefined') {
  L.Marker.prototype.options.icon = DefaultIcon
}

interface Location {
  id: number
  name: string
  coordinates: {
    lat: number
    lng: number
  }
  date: string
  start_date: string
  end_date: string
}

interface ItineraryMapProps {
  locations: Location[]
  className?: string
}

export function ItineraryMap({ locations, className = "" }: ItineraryMapProps) {
  // Calculate the center of the map based on locations
  const center = locations.length > 0
    ? {
        lat: locations.reduce((sum, loc) => sum + loc.coordinates.lat, 0) / locations.length,
        lng: locations.reduce((sum, loc) => sum + loc.coordinates.lng, 0) / locations.length,
      }
    : { lat: 0, lng: 0 }

  // Create an array of coordinates for the polyline
  const polylinePositions = locations.map(loc => [loc.coordinates.lat, loc.coordinates.lng])

  return (
    <div className={`h-full w-full rounded-md overflow-hidden ${className}`}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={locations.length > 0 ? 4 : 2}
        className="h-full w-full"
        scrollWheelZoom={true}
        style={{ background: "#f8fafc" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Draw lines between locations */}
        {locations.length > 1 && (
          <Polyline
            positions={polylinePositions}
            color="#2563eb"
            weight={3}
            opacity={0.7}
            dashArray="5, 10"
          />
        )}

        {/* Add markers for each location */}
        {locations.map((location, index) => (
          <Marker
            key={location.id}
            position={[location.coordinates.lat, location.coordinates.lng]}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-medium text-gray-900">{location.name}</h3>
                <div className="mt-1 space-y-1 text-sm text-gray-600">
                  <p>
                    {new Date(location.start_date).toLocaleDateString()} - {new Date(location.end_date).toLocaleDateString()}
                  </p>
                  {index === 0 && (
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      Starting Point
                    </span>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
} 